import axiosInstance from '../config/axiosInstance';

// 聊天相关API服务
export const chatService = {
  // 获取聊天列表
  getChatList: async () => {
    try {
      const response = await axiosInstance.get('/chat');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取与特定用户的聊天记录
  getChatMessages: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/chat/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 发送消息
  sendMessage: async (receiverId: string, content: string, type: string = 'text') => {
    try {
      const response = await axiosInstance.post('/chat', {
        receiverId,
        content,
        type,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 标记消息为已读
  markAsRead: async (userId: string) => {
    try {
      const response = await axiosInstance.post(`/chat/${userId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default chatService;