import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (email: string, password: string, username: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      onRegister(email, password, username);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2 text-gray-800">创建账户</h1>
        <p className="text-gray-600">加入我们的社区</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-700">用户名</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="选择一个用户名"
            className="bg-white border-gray-300 text-gray-800"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">邮箱</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="输入您的邮箱"
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
              placeholder="创建一个密码"
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

        <div className="space-y-2">
          <Label htmlFor="country" className="text-gray-700">国家</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-white border-gray-300 text-gray-800">
              <SelectValue placeholder="选择您的国家" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">美国</SelectItem>
              <SelectItem value="uk">英国</SelectItem>
              <SelectItem value="ca">加拿大</SelectItem>
              <SelectItem value="au">澳大利亚</SelectItem>
              <SelectItem value="de">德国</SelectItem>
              <SelectItem value="fr">法国</SelectItem>
              <SelectItem value="es">西班牙</SelectItem>
              <SelectItem value="it">意大利</SelectItem>
              <SelectItem value="jp">日本</SelectItem>
              <SelectItem value="other">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            我已满18岁，并且同意{' '}
            <a href="#" className="text-blue-600 hover:underline">
              服务条款
            </a>{' '}
            和{' '}
            <a href="#" className="text-blue-600 hover:underline">
              隐私政策
            </a>
          </label>
        </div>

        <Button
          type="submit"
          disabled={!agreed}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          创建账户
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          已有账户？{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline"
          >
            登录
          </button>
        </p>
      </div>
    </motion.div>
  );
}
