import { Request, Response } from 'express';
import { pool } from '../config/config'; 

export const createUserProfile = async (req: Request, res: Response) => {
    const { userId, email } = req.body; 

    if (!userId || !email) {
        return res.status(400).json({ message: 'User ID and email are required to create a profile.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Chuyển đổi userId từ string UUID sang binary(16)
        const idBinary = Buffer.from(userId.replace(/-/g, ''), 'hex');

        
        const [result] = await connection.execute(
            'INSERT INTO user_profiles (id, name) VALUES (?, ?)',
            [idBinary, email]
        );

        res.status(201).json({
            message: 'User profile created successfully in User Service.',
            profile: { id: userId, name: email }
        });

    } catch (error: any) {
        console.error('Error creating user profile in User Service:', error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'User profile with this ID already exists.' });
        }
        res.status(500).json({ message: 'Failed to create user profile in User Service.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};