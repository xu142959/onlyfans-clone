import axiosInstance from '../config/axiosInstance';

// 分析相关API服务
export const analyticsService = {
  // 获取创作者仪表盘数据
  getCreatorDashboard: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await axiosInstance.get('/analytics/creator/dashboard', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取内容分析数据
  getContentAnalytics: async (contentId: string, params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await axiosInstance.get(`/analytics/content/${contentId}`, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取收入分析数据
  getRevenueAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }) => {
    try {
      const response = await axiosInstance.get('/analytics/revenue', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户增长分析数据
  getUserGrowthAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }) => {
    try {
      const response = await axiosInstance.get('/analytics/user-growth', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取内容性能排行榜
  getContentPerformance: async (params?: {
    limit?: number;
    period?: 'day' | 'week' | 'month';
    type?: 'views' | 'revenue' | 'engagement';
  }) => {
    try {
      const response = await axiosInstance.get('/analytics/content/performance', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户行为分析数据
  getUserBehavior: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await axiosInstance.get('/analytics/user-behavior', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取系统概览数据（管理员）
  getSystemOverview: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const response = await axiosInstance.get('/analytics/system/overview', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default analyticsService;