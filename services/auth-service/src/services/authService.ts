import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { pool, JWT_SECRET, JWT_EXPIRES_IN, USER_SERVICE_URL} from '../config/config';
import { User } from '../models/authModel';
import axios from 'axios';

const authService = {
  async registerUser(name: string, email: string, password: string, role: 'user' | 'admin', provider: 'local' | 'google' | 'facebook' = 'local'): Promise<User> {
    let connection;
    try {
      connection = await pool.getConnection();

      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT email FROM auth_credentials WHERE email = ?',
        [email]
      );

      if (rows.length > 0) {
        throw new Error('User already exists');
      }

      const passwordHash = (provider === 'local') ? await bcrypt.hash(password, 10) : null; 

      const id = uuidv4();
      const idBinary = Buffer.from(id.replace(/-/g, ''), 'hex');

      const dbRole = role.toUpperCase();
      const dbProvider = provider.toLowerCase();

      await connection.execute(
        'INSERT INTO auth_credentials (id, name, email, password_hash, provider, role) VALUES (?, ?, ?, ?, ?, ?)',
        [idBinary, name, email, passwordHash, dbProvider, dbRole]
      );

      const newUser: User = {
        id: id,
        name: name,
        email: email,
        passwordHash: passwordHash || '',
        role: role,
        provider: provider
      };
      try {
                console.log(`[AuthService] Attempting to create user profile in User Service at ${USER_SERVICE_URL}/api/users/profiles...`);
                const userProfileResponse = await axios.post(`${USER_SERVICE_URL}/api/users/profiles`, {
                  userId: newUser.id,
                  name: newUser.name,
                  email: newUser.email 
                });
                console.log('[AuthService] User profile created successfully in User Service:', userProfileResponse.data);
            } catch (userServiceClientError: any) {
               console.error('[AuthService] Failed to create user profile in User Service:', 
               userServiceClientError.response?.data || userServiceClientError.message);
                
            }
      console.log(`Registered new user: ${newUser.email} (${newUser.role}).`);
      return newUser;
    } catch (error: any) {
      console.error('Error in registerUser:', error.message);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  async authenticateUser(email: string, password: string): Promise<User | null> {
    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT id, name, email, password_hash, role, provider FROM auth_credentials WHERE email = ? AND provider = "local"',
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      const userRow = rows[0];
      const storedPasswordHash = userRow.password_hash;

      const userId = userRow.id.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

      const isMatch = await bcrypt.compare(password, storedPasswordHash);
      if (!isMatch) {
        return null;
      }

      const authenticatedUser: User = {
        id: userId,
        name: userRow.name,
        email: userRow.email,
        passwordHash: storedPasswordHash,
        role: userRow.role.toLowerCase() as 'user' | 'admin',
        provider: userRow.provider.toLowerCase() as 'local' | 'google' | 'facebook'
      };
      return authenticatedUser;
    } catch (error: any) {
      console.error('Error in authenticateUser:', error.message);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },
  
  async authenticateOAuthUser(email: string, provider: 'google' | 'facebook', oauthToken: string): Promise<User | null> {
    console.log(`[authenticateOAuthUser] Attempting to authenticate email: ${email}, provider: ${provider}`);
    let connection;
    try {
      let name: string = "OAuth User";
      const verifiedEmail = email; 
      console.log(`[authenticateOAuthUser] Verified email (mock): ${verifiedEmail}`);

      if (verifiedEmail !== email) {
        console.warn(`[authenticateOAuthUser] OAuth token email mismatch: expected ${email}, got ${verifiedEmail}`);
        return null;
      }

      connection = await pool.getConnection();
      console.log('[authenticateOAuthUser] Database connection obtained.');

      const query = 'SELECT id, name, email, password_hash, role, provider FROM auth_credentials WHERE email = ? AND provider = ?';
      const params = [email, provider.toLowerCase()];
      console.log(`[authenticateOAuthUser] Executing query: ${query} with params:`, params);

      const [rows] = await connection.execute<RowDataPacket[]>(query, params);
      console.log(`[authenticateOAuthUser] Query returned ${rows.length} row(s).`);

      let user: User;
      if (rows.length === 0) {
        console.log(`[authenticateOAuthUser] User not found for email: ${email} with provider: ${provider}. Attempting to register.`);
        // Nếu user chưa tồn tại với provider này, đăng ký họ
        const id = uuidv4();
        const idBinary = Buffer.from(id.replace(/-/g, ''), 'hex');
        await connection.execute(
          'INSERT INTO auth_credentials (id, name, email, provider, role) VALUES (?, ?, ?, ?, ?)',
          [idBinary, name, email, provider.toLowerCase(), 'user'] // Mặc định role là 'user'
        );
        user = { id, name, email, passwordHash: '', role: 'user', provider: provider };
        console.log(`[authenticateOAuthUser] Registered new ${provider} user: ${email}.`);
      } else {
        // User đã tồn tại, lấy thông tin
        console.log(`[authenticateOAuthUser] User found for email: ${email} with provider: ${provider}.`);
        const userRow = rows[0];
        const userId = userRow.id.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
        user = {
          id: userId,
          name: userRow.name,
          email: userRow.email,
          passwordHash: userRow.password_hash || '',
          role: userRow.role.toLowerCase() as 'user' | 'admin',
          provider: userRow.provider.toLowerCase() as 'local' | 'google' | 'facebook'
        };
        console.log(`[authenticateOAuthUser] Authenticated user details:`, user);
      }
      return user;
    } catch (error: any) {
      console.error(`[authenticateOAuthUser] Critical Error (${provider}):`, error.message, error.stack);
      throw error;
    } finally {
      if (connection) connection.release();
      console.log('[authenticateOAuthUser] Database connection released.');
    }
  },

  async findUserById(id: string): Promise<User | undefined> {
    let connection;
    try {
      connection = await pool.getConnection();
      const idBinary = Buffer.from(id.replace(/-/g, ''), 'hex');

      const [rows] = await connection.execute<mysql.RowDataPacket[]>(
        'SELECT id, name, email, password_hash, role, provider FROM auth_credentials WHERE id = ?',
        [idBinary]
      );

      if (rows.length === 0) {
        return undefined;
      }

      const userRow = rows[0];
      const userId = userRow.id.toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

      const foundUser: User = {
        id: userId,
        name: userRow.name,
        email: userRow.email,
        passwordHash: userRow.password_hash,
        role: userRow.role.toLowerCase() as 'user' | 'admin',
        provider: userRow.provider.toLowerCase() as 'local' | 'google' | 'facebook'
      };
      return foundUser;
    } catch (error: any) {
      console.error('Error in findUserById:', error.message);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
};

export const generateToken = (userId: string, role: string, email: string, name: string): string => {
  const payload = { id: userId, role, email, name };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  const secret: Secret = JWT_SECRET;

  try {
    return jwt.sign(payload, secret, options); 
  } catch (error: any) {
    console.error('Error generating token:', error.message);
    throw new Error('Failed to generate authentication token.');
  }
};

export default authService;