import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2 text-gray-800">欢迎回来</h1>
        <p className="text-gray-600">登录您的账户</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">邮箱或用户名</Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入您的邮箱或用户名"
            className="bg-white border-gray-300 text-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">密码</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入您的密码"
              className="bg-white border-gray-300 text-gray-800 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            忘记密码？
          </a>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
          登录
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <Separator className="bg-gray-300" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-100 px-2 text-sm text-gray-500">
            或
          </span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          没有账户？{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:underline"
          >
            注册
          </button>
        </p>
      </div>
    </motion.div>
  );
}
