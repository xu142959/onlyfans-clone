import axiosInstance from '../config/axiosInstance';

// 用户相关API服务
type UserResponse = {
  user?: any;
};

export const userService = {
  // 获取用户信息
  getUserInfo: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 更新用户信息
  updateUserInfo: async (userData: Partial<any>): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.put('/users/profile', userData);
      
      // 更新本地存储中的用户信息
      const data = response as UserResponse;
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户列表
  getUserList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    try {
      const response = await axiosInstance.get('/users', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户内容
  getUserContent: async (userId: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/content`, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户支付记录
  getUserPayments: async (userId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/payments`, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取创作者收益
  getCreatorEarnings: async (_creatorId: string, params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) => {
    try {
      const response = await axiosInstance.get('/earnings', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 成为创作者
  becomeCreator: async (creatorData: {
    displayName: string;
    bio: string;
    category: string;
  }): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.post('/become-creator', creatorData);
      
      // 更新本地存储中的用户信息
      const data = response as UserResponse;
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;