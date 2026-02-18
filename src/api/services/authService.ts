import axiosInstance from '../config/axiosInstance';

// 认证相关API服务
type AuthResponse = {
  token?: string;
  user?: any;
};

export const authService = {
  // 用户登录
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      // 存储token到本地存储
      const data = response as AuthResponse;
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 用户注册
  register: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        username,
      });
      
      // 存储token到本地存储
      const data = response as AuthResponse;
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 用户登出
  logout: async () => {
    try {
      // 调用后端登出接口
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // 即使后端登出失败，也清除本地存储
      console.error('Logout error:', error);
    } finally {
      // 清除本地存储中的token和用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // 刷新token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      
      // 更新本地存储中的token
      const data = response as AuthResponse;
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 密码重置
  resetPassword: async (email: string) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        email,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 验证token
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;