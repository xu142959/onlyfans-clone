import { Link, useLocation } from 'react-router';
import { Home, Search, MessageCircle, User, Wallet, BarChart3, Settings, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { TestButton } from './TestButton';

export function Navigation() {
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { path: '/home', icon: Home, label: '首页' },
    { path: '/search', icon: Search, label: '搜索' },
    { path: '/chat', icon: MessageCircle, label: '消息', badge: 2 },
  ];

  const creatorLinks = [
    { path: '/creator-dashboard', icon: BarChart3, label: '仪表盘' },
    { path: '/manage-content', icon: Settings, label: '管理' },
    { path: '/analytics', icon: BarChart3, label: '分析' },
  ];

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/home') return '首页';
    if (path === '/search') return '搜索';
    if (path === '/notifications') return '通知';
    if (path === '/chat') return '消息';
    if (path === '/profile') return '个人资料';
    if (path === '/wallet') return '钱包';
    if (path === '/creator-dashboard') return '创作者仪表盘';
    if (path === '/analytics') return '分析';
    if (path === '/manage-content') return '管理内容';
    if (path === '/settings') return '设置';
    return '粉丝圈';
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{getTitle()}</h1>
          <div className="flex items-center gap-2">
            <TestButton />
            <Link to="/profile">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar || ''} alt={user?.username || 'User'} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-black border-r border-zinc-800 p-4">
        <Link to="/home" className="text-2xl font-bold mb-8 px-2">
          FanVault
        </Link>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <link.icon className="w-6 h-6" />
                <span className="font-medium">{link.label}</span>
                {link.badge && link.badge > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          {/* Notification Center in Sidebar */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 text-zinc-400">
              <TestButton />
              <span className="font-medium">通知</span>
            </div>
          </div>

          <Link
            to="/wallet"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === '/wallet'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`}
          >
            <Wallet className="w-6 h-6" />
            <span className="font-medium">钱包</span>
          </Link>

          {user?.isCreator && (
            <>
              <div className="h-px bg-zinc-800 my-4" />
            <div className="px-2 mb-2">
              <p className="text-xs font-semibold text-zinc-500 uppercase">创作者工具</p>
            </div>
              {creatorLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <link.icon className="w-6 h-6" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="border-t border-zinc-800 pt-4">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar || ''} alt={user?.username || 'User'} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-zinc-400 truncate">@{user?.username || 'user'}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-800">
        <div className="flex items-center justify-around py-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 relative ${
                  isActive ? 'text-white' : 'text-zinc-400'
                }`}
              >
                <link.icon className="w-6 h-6" />
                <span className="text-xs">{link.label}</span>
                {link.badge && link.badge > 0 && (
                  <Badge className="absolute top-0 right-0 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          <Link
            to="/wallet"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              location.pathname === '/wallet' ? 'text-white' : 'text-zinc-400'
            }`}
          >
            <Wallet className="w-6 h-6" />
            <span className="text-xs">钱包</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              location.pathname === '/profile' ? 'text-white' : 'text-zinc-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">个人资料</span>
          </Link>
        </div>
      </nav>

      {/* Floating Action Button (Creator) */}
      {user?.isCreator && (
        <Link
          to="/create-post"
          className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        >
          <Plus className="w-6 h-6 text-white" />
        </Link>
      )}
    </>
  );
}
