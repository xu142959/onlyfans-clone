import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import wsService from './wsService';

interface WsContextType {
  wsService: typeof wsService;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WsContext = createContext<WsContextType | undefined>(undefined);

export function WsProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    // 监听连接状态
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);

    // 检查是否有token，如果有则自动连接
    const token = localStorage.getItem('token');
    if (token) {
      wsService.connect().catch(error => {
        console.error('WebSocket connection failed:', error);
      });
    }

    // 清理函数
    return () => {
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
    };
  }, []);

  const connect = async () => {
    await wsService.connect();
  };

  const disconnect = () => {
    wsService.disconnect();
  };

  const value = {
    wsService,
    isConnected,
    connect,
    disconnect,
  };

  return <WsContext.Provider value={value}>{children}</WsContext.Provider>;
}

export function useWs() {
  const context = useContext(WsContext);
  if (context === undefined) {
    throw new Error('useWs must be used within a WsProvider');
  }
  return context;
}

export default WsContext;