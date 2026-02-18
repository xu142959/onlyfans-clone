import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../../api/services/authService';
import { userService } from '../../api/services/userService';
import wsService from '../../api/ws/wsService';

interface AuthContextType {
  user: User | null;
  ageVerified: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyAge: () => void;
  switchToCreator: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem('ageVerified') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储中的用户信息
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // 验证token是否有效
          try {
            await authService.verifyToken();
          } catch (error) {
            // Token无效，清除用户信息
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const verifyAge = () => {
    setAgeVerified(true);
    localStorage.setItem('ageVerified', 'true');
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.user) {
        setUser(response.user);
        // 登录成功后连接WebSocket
        await wsService.connect().catch(error => {
          console.error('WebSocket connection failed after login:', error);
        });
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password, username);
      if (response.user) {
        setUser(response.user);
        // 注册成功后连接WebSocket
        await wsService.connect().catch(error => {
          console.error('WebSocket connection failed after register:', error);
        });
      }
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('登出失败:', error);
    } finally {
      // 登出时断开WebSocket连接
      wsService.disconnect();
      setUser(null);
      setIsLoading(false);
    }
  };

  const switchToCreator = async () => {
    if (user) {
      setIsLoading(true);
      try {
        // 调用API成为创作者
        const response = await userService.becomeCreator({
          displayName: user.username,
          bio: '',
          category: 'other'
        });
        if (response && (response as any).user) {
        setUser((response as any).user);
      }
      } catch (error) {
        console.error('切换为创作者失败:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, ageVerified, isLoading, login, register, logout, verifyAge, switchToCreator }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
