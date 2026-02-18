import axiosInstance from '../config/axiosInstance';

// 支付相关API服务
export const paymentService = {
  // 创建支付意向
  createPaymentIntent: async (amount: number, currency: string = 'USD', type: string, contentId?: string) => {
    try {
      const response = await axiosInstance.post('/payments/intent', {
        amount,
        currency,
        type,
        contentId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 处理支付成功
  handlePaymentSuccess: async (paymentIntentId: string, type: string, contentId?: string, creatorId?: string) => {
    try {
      const response = await axiosInstance.post('/payments/success', {
        paymentIntentId,
        type,
        contentId,
        creatorId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取用户支付记录
  getUserPayments: async () => {
    try {
      const response = await axiosInstance.get('/payments');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取创作者收益
  getCreatorEarnings: async () => {
    try {
      const response = await axiosInstance.get('/earnings');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;