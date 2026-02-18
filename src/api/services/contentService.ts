import axiosInstance from '../config/axiosInstance';

// 内容相关API服务
export const contentService = {
  // 创建内容
  createContent: async (contentData: {
    title: string;
    content: string;
    media: Array<{
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
      caption?: string;
    }>;
    visibility: 'free' | 'subscription' | 'ppv';
    price?: number;
    scheduledAt?: Date | null;
    categories?: string[];
    tags?: string[];
  }) => {
    try {
      const response = await axiosInstance.post('/content', contentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取内容列表
  getContentList: async (params?: {
    category?: string;
    tag?: string;
    visibility?: 'free' | 'subscription' | 'ppv';
  }) => {
    try {
      const response = await axiosInstance.get('/content', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取内容详情
  getContentDetail: async (contentId: string) => {
    try {
      const response = await axiosInstance.get(`/content/${contentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 更新内容
  updateContent: async (contentId: string, contentData: Partial<{
    title: string;
    content: string;
    media: Array<{
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
      caption?: string;
    }>;
    visibility: 'free' | 'subscription' | 'ppv';
    price: number;
    scheduledAt: Date | null;
    categories: string[];
    tags: string[];
    isPublished: boolean;
  }>) => {
    try {
      const response = await axiosInstance.put(`/content/${contentId}`, contentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 删除内容
  deleteContent: async (contentId: string) => {
    try {
      const response = await axiosInstance.delete(`/content/${contentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 发布内容
  publishContent: async (contentId: string) => {
    try {
      const response = await axiosInstance.put(`/content/${contentId}`, {
        isPublished: true
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 下架内容
  unpublishContent: async (contentId: string) => {
    try {
      const response = await axiosInstance.put(`/content/${contentId}`, {
        isPublished: false
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 上传内容文件
  uploadContentFile: async (file: File, type: 'image' | 'video') => {
    try {
      // 这里应该实现文件上传逻辑，暂时返回一个模拟的URL
      // 实际项目中，应该将文件上传到云存储，然后返回文件URL
      const fileName = `${Date.now()}-${file.name}`;
      const fileUrl = `https://example.com/uploads/${fileName}`;
      
      return {
        success: true,
        fileUrl,
        thumbnailUrl: type === 'video' ? `https://example.com/uploads/thumbnails/${fileName}` : undefined
      };
    } catch (error) {
      throw error;
    }
  },

  // 获取创作者内容列表
  getCreatorContentList: async () => {
    try {
      const response = await axiosInstance.get('/content/creator');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 点赞内容
  likeContent: async (contentId: string) => {
    try {
      const response = await axiosInstance.post(`/content/${contentId}/like`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default contentService;