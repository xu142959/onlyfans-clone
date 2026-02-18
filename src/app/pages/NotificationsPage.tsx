import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Bell, MessageCircle, CreditCard, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { notificationService } from '../../api/services/notificationService';
import { toast } from 'sonner';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取通知列表
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getNotifications();
        setNotifications((response as any).notifications);
        setError(null);
      } catch (err) {
        console.error('获取通知列表失败:', err);
        setError('Failed to load notifications');
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return <Bell className="w-5 h-5 text-blue-500" />;
      case 'new_message':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'subscription':
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-zinc-500" />;
    }
  };

  // 标记通知为已读
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(notification => 
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      console.error('标记通知为已读失败:', err);
      toast.error('Failed to mark notification as read');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Notifications</h2>
        <p className="text-zinc-400">Stay updated with your activity</p>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-zinc-400">
            No notifications found
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card
                className={`p-4 border-zinc-800 ${
                  notification.isRead ? 'bg-zinc-900' : 'bg-zinc-800'
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">{getIcon(notification.type || 'default')}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.isRead && (
                        <Badge className="bg-blue-600 text-xs">New</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-zinc-300 mb-2">{notification.message}</p>
                    
                    {notification.relatedId && (
                      <Link
                        to={`/creator/${notification.relatedId}`}
                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-500"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="" />
                          <AvatarFallback>{notification.title[0]}</AvatarFallback>
                        </Avatar>
                        {notification.title}
                      </Link>
                    )}
                    
                    <p className="text-xs text-zinc-500 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
