import axios from 'axios';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从本地存储获取token
    const token = localStorage.getItem('token');
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求时间戳
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // 添加API版本
    config.headers['X-API-Version'] = 'v1';
    
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 处理成功响应
    const { data } = response;
    
    // 检查响应格式是否符合预期
    if (data && typeof data === 'object') {
      // 如果响应包含code和message字段，按业务逻辑处理
      if (data.code !== undefined) {
        if (data.code === 0 || data.code === 200) {
          // 成功响应
          return data.data || data;
        } else {
          // 业务错误
          return Promise.reject(new Error(data.message || '请求失败'));
        }
      }
    }
    
    // 默认返回响应数据
    return data;
  },
  (error) => {
    // 处理错误响应
    let errorMessage = '网络请求失败，请稍后重试';
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          // 可以在这里添加跳转到登录页的逻辑
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        case 502:
          errorMessage = '网关错误';
          break;
        case 503:
          errorMessage = '服务暂时不可用';
          break;
        case 504:
          errorMessage = '网关超时';
          break;
        default:
          errorMessage = `请求失败，状态码: ${status}`;
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = '服务器无响应，请检查网络连接';
    } else {
      // 请求配置出错
      errorMessage = error.message || '请求配置错误';
    }
    
    // 打印错误信息
    console.error('API Error:', errorMessage);
    
    // 返回错误对象
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;