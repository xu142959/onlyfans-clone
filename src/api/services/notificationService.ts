import axiosInstance from '../config/axiosInstance';

// 通知相关API服务
export const notificationService = {
  // 获取通知列表
  getNotifications: async (params?: {
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await axiosInstance.get('/notifications', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 标记通知为已读
  markAsRead: async (notificationId: string) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 标记所有通知为已读
  markAllAsRead: async () => {
    try {
      const response = await axiosInstance.patch('/notifications/read-all');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 删除通知
  deleteNotification: async (notificationId: string) => {
    try {
      const response = await axiosInstance.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationService;