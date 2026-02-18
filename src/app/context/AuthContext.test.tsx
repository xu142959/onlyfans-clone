
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'
import { authService } from '../../api/services/authService'
import { userService } from '../../api/services/userService'
import wsService from '../../api/ws/wsService'

// 模拟服务
vi.mock('../../api/services/authService')
vi.mock('../../api/services/userService')
vi.mock('../../api/ws/wsService')

const mockAuthService = authService as any
const mockUserService = userService as any
const mockWsService = wsService as any

// 测试组件
function TestComponent() {
  const auth = useAuth()
  
  const handleLogin = async () => {
    try {
      await auth.login('test@example.com', 'password')
    } catch (error) {
      // 捕获错误，避免未处理的Promise拒绝
    }
  }
  
  const handleRegister = async () => {
    try {
      await auth.register('test@example.com', 'password', 'testuser')
    } catch (error) {
      // 捕获错误，避免未处理的Promise拒绝
    }
  }
  
  const handleSwitchToCreator = async () => {
    try {
      await auth.switchToCreator()
    } catch (error) {
      // 捕获错误，避免未处理的Promise拒绝
    }
  }
  
  return (
    <div>
      <div data-testid="user">{auth.user ? auth.user.username : 'No user'}</div>
      <div data-testid="loading">{auth.isLoading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="age-verified">{auth.ageVerified ? 'Verified' : 'Not verified'}</div>
      <button 
        data-testid="login" 
        onClick={handleLogin}
      >
        Login
      </button>
      <button 
        data-testid="register" 
        onClick={handleRegister}
      >
        Register
      </button>
      <button 
        data-testid="logout" 
        onClick={() => auth.logout()}
      >
        Logout
      </button>
      <button 
        data-testid="verify-age" 
        onClick={() => auth.verifyAge()}
      >
        Verify Age
      </button>
      <button 
        data-testid="switch-to-creator" 
        onClick={handleSwitchToCreator}
      >
        Switch to Creator
      </button>
    </div>
  )
}

// 测试套件
describe('AuthContext', () => {
  beforeEach(() => {
    // 重置所有模拟
    vi.clearAllMocks()
    // 清除localStorage
    localStorage.clear()
    // 模拟wsService方法
    mockWsService.connect = vi.fn().mockResolvedValue(undefined)
    mockWsService.disconnect = vi.fn()
  })

  test('renders with initial state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 等待初始加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('No user')
    expect(screen.getByTestId('age-verified')).toHaveTextContent('Not verified')
  })

  test('logs in successfully', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', isCreator: false }
    mockAuthService.login = vi.fn().mockResolvedValue({ user: mockUser })
    mockAuthService.verifyToken = vi.fn().mockResolvedValue({})  

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 等待初始加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })

    // 点击登录按钮
    fireEvent.click(screen.getByTestId('login'))

    // 等待登录完成
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser')
    })

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password')
    expect(mockWsService.connect).toHaveBeenCalled()
  })

  test('registers successfully', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', isCreator: false }
    mockAuthService.register = vi.fn().mockResolvedValue({ user: mockUser })
    mockAuthService.verifyToken = vi.fn().mockResolvedValue({})  

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 等待初始加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })

    // 点击注册按钮
    fireEvent.click(screen.getByTestId('register'))

    // 等待注册完成
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser')
    })

    expect(mockAuthService.register).toHaveBeenCalledWith('test@example.com', 'password', 'testuser')
    expect(mockWsService.connect).toHaveBeenCalled()
  })

  test('logs out successfully', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', isCreator: false }
    mockAuthService.login = vi.fn().mockResolvedValue({ user: mockUser })
    mockAuthService.logout = vi.fn().mockResolvedValue({})
    mockAuthService.verifyToken = vi.fn().mockResolvedValue({})  

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 等待初始加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })

    // 先登录
    fireEvent.click(screen.getByTestId('login'))
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser')
    })

    // 然后登出
    fireEvent.click(screen.getByTestId('logout'))
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user')
    })

    expect(mockAuthService.logout).toHaveBeenCalled()
    expect(mockWsService.disconnect).toHaveBeenCalled()
  })

  test('verifies age', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 点击验证年龄按钮
    fireEvent.click(screen.getByTestId('verify-age'))

    expect(screen.getByTestId('age-verified')).toHaveTextContent('Verified')
    expect(localStorage.getItem('ageVerified')).toBe('true')
  })

  test('switches to creator', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', isCreator: false }
    const mockCreatorUser = { id: '1', username: 'testuser', email: 'test@example.com', isCreator: true, role: 'creator' }
    mockAuthService.login = vi.fn().mockResolvedValue({ user: mockUser })
    mockUserService.becomeCreator = vi.fn().mockResolvedValue({ user: mockCreatorUser })
    mockAuthService.verifyToken = vi.fn().mockResolvedValue({})  

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 等待初始加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })

    // 先登录
    fireEvent.click(screen.getByTestId('login'))
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser')
    })

    // 然后切换到创作者
    fireEvent.click(screen.getByTestId('switch-to-creator'))
    await waitFor(() => {
      expect(mockUserService.becomeCreator).toHaveBeenCalled()
    })

    expect(mockUserService.becomeCreator).toHaveBeenCalledWith({
      displayName: 'testuser',
      bio: '',
      category: 'other'
    })
  })

  test('handles login error', async () => {
    const errorMessage = 'Invalid credentials'
    mockAuthService.login = vi.fn().mockRejectedValue(new Error(errorMessage))
    mockAuthService.verifyToken = vi.fn().mockResolvedValue({})  

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // 等待初始加载完成
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading')
    })

    // 点击登录按钮
    fireEvent.click(screen.getByTestId('login'))

    // 等待登录失败
    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password')
    })

    // 用户应该仍然是No user
    expect(screen.getByTestId('user')).toHaveTextContent('No user')
  })
})
