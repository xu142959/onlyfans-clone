// WebSocket服务模块
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  private url: string;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private eventListeners: Map<string, Array<(data: any) => void>> = new Map();
  private isConnecting: boolean = false;

  constructor(url: string = import.meta.env.VITE_WS_URL || import.meta.env.VITE_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:5000') {
    // 移除/api后缀，因为Socket.io直接连接到根路径
    this.url = url.replace('/api', '');
  }

  // 连接WebSocket
  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        // 等待连接完成
        const checkConnection = setInterval(() => {
          if (this.socket?.connected) {
            clearInterval(checkConnection);
            resolve(this.socket!);
          } else if (!this.isConnecting) {
            clearInterval(checkConnection);
            reject(new Error('WebSocket connection failed'));
          }
        }, 100);
        return;
      }

      this.isConnecting = true;

      try {
        // 添加token到连接参数
        const token = localStorage.getItem('token');
        
        this.socket = io(this.url, {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          reconnectionDelayMax: 5000,
          timeout: 20000
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.emit('connected');
          resolve(this.socket!);
        });

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.emit('disconnected');
        });

        this.socket.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        });

        // 处理自定义事件
        this.socket.onAny((event, data) => {
          // 忽略Socket.io内部事件
          if (!event.startsWith('$')) {
            this.emit(event, data);
          }
        });

      } catch (error) {
        console.error('Error creating WebSocket:', error);
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // 断开WebSocket连接
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  // 发送消息
  send(type: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(type, data);
    } else {
      // 尝试重连后发送
      this.connect().then(() => {
        if (this.socket?.connected) {
          this.socket.emit(type, data);
        }
      });
    }
  }

  // 注册事件监听器
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  // 移除事件监听器
  off(event: string, callback: (data: any) => void): void {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event)?.filter(listener => listener !== callback);
      if (listeners) {
        this.eventListeners.set(event, listeners);
      }
    }
  }

  // 触发事件
  private emit(event: string, data: any = {}): void {
    this.eventListeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // 获取连接状态
  getReadyState(): number {
    if (!this.socket) return 3; // CLOSED
    return this.socket.connected ? 1 : 0; // OPEN : CONNECTING
  }

  // 检查是否连接
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// 导出单例实例
const wsService = new WebSocketService();
export default wsService;
export { WebSocketService };