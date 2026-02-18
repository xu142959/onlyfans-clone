
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Settings, LogOut, CreditCard, Shield, Bell, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: UserIcon, label: '编辑资料', href: '/settings' },
    { icon: CreditCard, label: '支付方式', href: '/wallet' },
    { icon: Bell, label: '通知', href: '/notifications' },
    { icon: Shield, label: '隐私与安全', href: '/settings' },
    { icon: Settings, label: '设置', href: '/settings' }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl mb-1">{user.username}</h2>
              <p className="text-zinc-400 mb-2">{user.email}</p>
              <Badge variant={user.isCreator ? 'default' : 'secondary'}>
                {user.isCreator ? '创作者账户' : '粉丝账户'}
              </Badge>
            </div>
          </div>

          {!user.isCreator && (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              asChild
            >
              <Link to="/become-creator">成为创作者</Link>
            </Button>
          )}
          {user.isCreator && (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/creator-dashboard">前往创作者仪表盘</Link>
            </Button>
          )}
        </Card>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-2 mb-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={item.href}>
              <Card className="bg-zinc-900 border-zinc-800 p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-zinc-400" />
                  <span>{item.label}</span>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Logout */}
      <Button
        onClick={logout}
        variant="ghost"
        className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10"
      >
        <LogOut className="w-5 h-5 mr-2" />
        退出登录
      </Button>

      {/* App Info */}
      <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-500">
        <p>FanVault v1.0</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-zinc-400">条款</a>
          <a href="#" className="hover:text-zinc-400">隐私</a>
          <a href="#" className="hover:text-zinc-400">支持</a>
        </div>
      </div>
    </div>
  );
}