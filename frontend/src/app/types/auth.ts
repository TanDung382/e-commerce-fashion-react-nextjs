export interface User {
  id: string;
  name: string,
  email: string;
  role: 'user' | 'admin';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User; 
}

// Kiểu dữ liệu cho phản hồi đăng ký
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Kiểu dữ liệu cho phản hồi xác minh token
export interface VerifyTokenResponse {
  isValid: boolean;
  message: string;
  userId: string;
  name: string;
  email: string;
  role: string;
}