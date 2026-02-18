import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { Camera, LogOut, Shield, Bell, Lock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    newPosts: true,
    newMessages: true,
    subscriptions: true,
    marketing: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    toast.success('退出登录成功');
  };

  const handleSaveProfile = () => {
    toast.success('个人资料更新成功');
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        toast.error('文件大小不能超过 5MB');
        return;
      }
      
      // 检查文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('只支持 JPG、PNG 或 GIF 格式的图片');
        return;
      }
      
      setSelectedFile(file);
      toast.success('头像已选择，点击保存更改以更新');
    }
  };

  const handleChangePassword = () => {
    toast.info('修改密码功能开发中');
  };

  const handleEnableTwoFactor = () => {
    toast.info('双因素认证功能开发中');
  };

  const handleDeletePaymentMethod = () => {
    if (window.confirm('确定要删除此支付方式吗？')) {
      toast.success('支付方式已删除');
    }
  };

  const handleAddPaymentMethod = () => {
    toast.info('添加支付方式功能开发中');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('确定要永久删除您的账户吗？此操作不可撤销。')) {
      toast.info('删除账户功能开发中');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">设置</h2>
        <p className="text-zinc-400">管理您的账户和偏好设置</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mb-4">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          个人资料设置
        </h3>
        
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : user?.avatar} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" className="border-zinc-700" onClick={handleFileClick}>
              更换头像
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
            <p className="text-xs text-zinc-500 mt-2">JPG, PNG 或 GIF。最大 5MB</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                defaultValue={user?.username}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
            保存更改
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mb-4">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          通知设置
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>新帖子</p>
              <p className="text-sm text-zinc-400">当创作者发布新内容时通知您</p>
            </div>
            <Switch
              checked={notifications.newPosts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newPosts: checked })}
            />
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div>
              <p>新消息</p>
              <p className="text-sm text-zinc-400">当您收到新消息时通知您</p>
            </div>
            <Switch
              checked={notifications.newMessages}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newMessages: checked })}
            />
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div>
              <p>订阅更新</p>
              <p className="text-sm text-zinc-400">关于您订阅的更新</p>
            </div>
            <Switch
              checked={notifications.subscriptions}
              onCheckedChange={(checked) => setNotifications({ ...notifications, subscriptions: checked })}
            />
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div>
              <p>营销邮件</p>
              <p className="text-sm text-zinc-400">接收促销邮件和更新</p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mb-4">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          安全设置
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>修改密码</p>
              <p className="text-sm text-zinc-400">定期更新您的密码</p>
            </div>
            <Button variant="outline" className="border-zinc-700" onClick={handleChangePassword}>
              <Lock className="w-4 h-4 mr-2" />
              修改
            </Button>
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div>
              <p>双因素认证</p>
              <p className="text-sm text-zinc-400">添加额外的安全层</p>
            </div>
            <Button variant="outline" className="border-zinc-700" onClick={handleEnableTwoFactor}>
              启用
            </Button>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mb-4">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          支付方式
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-xs">
                VISA
              </div>
              <div>
                <p>•••• •••• •••• 4242</p>
                <p className="text-sm text-zinc-400">过期日期 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-zinc-700" onClick={handleDeletePaymentMethod}>
              删除
            </Button>
          </div>

          <Button variant="outline" className="w-full border-zinc-700" onClick={handleAddPaymentMethod}>
            添加支付方式
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-zinc-900 border-red-900/30 p-6 mb-4">
        <h3 className="text-xl mb-4 text-red-500">危险区域</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p>删除账户</p>
              <p className="text-sm text-zinc-400">永久删除您的账户和所有数据</p>
            </div>
            <Button variant="outline" className="border-red-900 text-red-500 hover:bg-red-900/20" onClick={handleDeleteAccount}>
              删除
            </Button>
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div>
              <p>退出登录</p>
              <p className="text-sm text-zinc-400">退出您的账户</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-zinc-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
