export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  provider: 'local' | 'google' | 'facebook';
  createdAt?: Date;
  updatedAt?: Date;
}
