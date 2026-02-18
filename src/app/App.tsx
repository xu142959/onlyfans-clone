import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AgeGate } from './components/AgeGate';
import { SplashScreen } from './components/SplashScreen';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ChatListPage } from './pages/ChatListPage';
import { ChatRoomPage } from './pages/ChatRoomPage';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { BecomeCreatorPage } from './pages/BecomeCreatorPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ManageContentPage } from './pages/ManageContentPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { Toaster } from './components/ui/sonner';
import { WsProvider } from '../api/ws/WsContext';

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { login, register } = useAuth();

  const handleLogin = (email: string, password: string) => {
    login(email, password);
  };

  const handleRegister = (email: string, password: string, username: string) => {
    register(email, password, username);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-8 items-center">
        {/* Branding Side */}
        <div className="hidden lg:flex flex-1 flex-col justify-center">
          <h1 className="text-6xl mb-4 text-gray-800">粉丝圈</h1>
          <p className="text-xl text-gray-700 mb-8">
            与您喜爱的创作者连接并访问独家内容
          </p>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">✓</div>
              <span>来自顶级创作者的独家内容</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">✓</div>
              <span>直接消息和互动</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">✓</div>
              <span>支持您喜爱的创作者</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-1 flex justify-center">
          {mode === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, ageVerified, verifyAge } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!ageVerified) {
    return <AgeGate onVerify={verifyAge} />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  // Check if current path is admin route
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Only show navigation for non-admin routes */}
      {!isAdminRoute && <Navigation />}
      
      <main className={isAdminRoute ? "p-6" : "lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0"}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:creatorId" element={<ChatRoomPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/creator/:creatorId" element={<CreatorProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/become-creator" element={<BecomeCreatorPage />} />
          
          {/* Creator Routes */}
          {user.isCreator && (
            <>
              <Route path="/creator-dashboard" element={<CreatorDashboardPage />} />
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/manage-content" element={<ManageContentPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </>
          )}

          {/* Admin Routes */}
          {user.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <WsProvider>
            <AppContent />
          </WsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}