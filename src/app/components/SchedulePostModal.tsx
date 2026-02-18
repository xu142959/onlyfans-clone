import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,

  Trash2,
  Edit,
} from 'lucide-react';
import { format, addDays, addHours, isBefore } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: Date;
  status: 'scheduled' | 'published' | 'failed';
  images?: string[];
}

interface SchedulePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postContent?: string;
  postImages?: string[];
  onSchedule?: (date: Date, time: string) => void;
}

export function SchedulePostModal({
  isOpen,
  onClose,
  postContent,
  postImages,
  onSchedule,
}: SchedulePostModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: 'New workout routine video coming soon! 💪',
      scheduledFor: addHours(new Date(), 2),
      status: 'scheduled',
      images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48'],
    },
    {
      id: '2',
      content: 'Behind the scenes from today\'s photoshoot 📸',
      scheduledFor: addDays(new Date(), 1),
      status: 'scheduled',
      images: ['https://images.unsplash.com/photo-1492681290082-e932832941e6'],
    },
  ]);
  const [view, setView] = useState<'schedule' | 'list'>('schedule');

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleSchedule = () => {
    if (!selectedDate) {
      toast.error('请选择日期');
      return;
    }

    // Convert 12-hour format to 24-hour
    let hour = parseInt(selectedHour);
    if (selectedPeriod === 'PM' && hour !== 12) {
      hour += 12;
    } else if (selectedPeriod === 'AM' && hour === 12) {
      hour = 0;
    }

    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hour, parseInt(selectedMinute), 0, 0);

    // Check if date is in the past
    if (isBefore(scheduledDateTime, new Date())) {
      toast.error('不能安排过去的时间');
      return;
    }

    // Add to scheduled posts
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content: postContent || '新安排的内容',
      scheduledFor: scheduledDateTime,
      status: 'scheduled',
      images: postImages,
    };

    setScheduledPosts([...scheduledPosts, newPost]);
    onSchedule?.(selectedDate, `${selectedHour}:${selectedMinute} ${selectedPeriod}`);
    
    toast.success(
      `内容已安排在 ${format(scheduledDateTime, 'yyyy年MM月dd日')} ${format(scheduledDateTime, 'HH:mm')}`
    );
    
    setView('list');
  };

  const deleteScheduledPost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
    toast.success('已删除安排的内容');
  };

  const getQuickScheduleOptions = () => {
    const now = new Date();
    return [
      { label: 'In 1 hour', date: addHours(now, 1) },
      { label: 'In 3 hours', date: addHours(now, 3) },
      { label: 'Tomorrow 9 AM', date: (() => {
        const tomorrow = addDays(now, 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;
      })() },
      { label: 'Tomorrow 6 PM', date: (() => {
        const tomorrow = addDays(now, 1);
        tomorrow.setHours(18, 0, 0, 0);
        return tomorrow;
      })() },
    ];
  };

  const handleQuickSchedule = (date: Date) => {
    setSelectedDate(date);
    const hours = date.getHours();
    const isPM = hours >= 12;
    setSelectedHour(String(hours > 12 ? hours - 12 : hours === 0 ? 12 : hours).padStart(2, '0'));
    setSelectedMinute(String(date.getMinutes()).padStart(2, '0'));
    setSelectedPeriod(isPM ? 'PM' : 'AM');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">安排发布</DialogTitle>
          <DialogDescription>
            选择您希望发布此内容的时间
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={view === 'schedule' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('schedule')}
            className={view === 'schedule' ? 'bg-blue-600' : 'border-zinc-700'}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            新建安排
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-blue-600' : 'border-zinc-700'}
          >
            <Clock className="w-4 h-4 mr-2" />
            已安排内容 ({scheduledPosts.length})
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'schedule' ? (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Quick Schedule Options */}
              <div className="space-y-3">
                <Label>快速安排</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {getQuickScheduleOptions().map((option) => (
                    <Button
                      key={option.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSchedule(option.date)}
                      className="border-zinc-700 hover:border-blue-500"
                    >
                      {option.label === 'In 1 hour' ? '1小时后' : 
                       option.label === 'In 3 hours' ? '3小时后' : 
                       option.label === 'Tomorrow 9 AM' ? '明天 9:00' : 
                       option.label === 'Tomorrow 6 PM' ? '明天 18:00' : 
                       option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Picker */}
                <div className="space-y-3">
                  <Label>选择日期</Label>
                  <Card className="bg-zinc-800 border-zinc-700 p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => isBefore(date, new Date())}
                      className="rounded-md"
                    />
                  </Card>
                </div>

                {/* Time Picker */}
                <div className="space-y-3">
                  <Label>选择时间</Label>
                  <Card className="bg-zinc-800 border-zinc-700 p-4">
                    <div className="space-y-4">
                      <div className="flex gap-2 items-center justify-center">
                        <Select value={selectedHour} onValueChange={setSelectedHour}>
                          <SelectTrigger className="w-20 bg-zinc-900 border-zinc-700 text-center text-2xl font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            {hours.map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-2xl font-bold">:</span>

                        <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                          <SelectTrigger className="w-20 bg-zinc-900 border-zinc-700 text-center text-2xl font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 max-h-60">
                            {minutes.map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedPeriod} onValueChange={(v: 'AM' | 'PM') => setSelectedPeriod(v)}>
                          <SelectTrigger className="w-20 bg-zinc-900 border-zinc-700 text-center text-xl font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="AM">上午</SelectItem>
                            <SelectItem value="PM">下午</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedDate && (
                        <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm text-zinc-400 mb-1">安排时间:</p>
                          <p className="font-semibold">
                            {format(selectedDate, 'yyyy年MM月dd日')}
                          </p>
                          <p className="text-lg font-bold text-blue-400">
                            {selectedHour}:{selectedMinute} {selectedPeriod === 'AM' ? '上午' : '下午'}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Timezone Notice */}
                  <p className="text-xs text-zinc-500 text-center">
                    🌍 时区: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </p>
                </div>
              </div>

              {/* Post Preview */}
              {postContent && (
                <Card className="bg-zinc-800 border-zinc-700 p-4">
                  <Label className="mb-2 block">内容预览</Label>
                  <p className="text-sm text-zinc-300 mb-3">{postContent}</p>
                  {postImages && postImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {postImages.slice(0, 4).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`预览 ${index + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700"
                  onClick={onClose}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSchedule}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  安排发布
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {scheduledPosts.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Clock className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>暂无安排的内容</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-zinc-700"
                    onClick={() => setView('schedule')}
                  >
                    安排您的第一个内容
                  </Button>
                </div>
              ) : (
                scheduledPosts.map((post) => (
                  <Card key={post.id} className="bg-zinc-800 border-zinc-700 p-4">
                    <div className="flex gap-4">
                      {post.images && post.images.length > 0 && (
                        <img
                          src={post.images[0]}
                          alt="内容预览"
                          className="w-20 h-20 rounded object-cover"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm line-clamp-2">{post.content}</p>
                          <Badge
                            className={
                              post.status === 'scheduled'
                                ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                                : post.status === 'published'
                                ? 'bg-green-500/10 text-green-500 border-green-500/30'
                                : 'bg-red-500/10 text-red-500 border-red-500/30'
                            }
                          >
                            {post.status === 'scheduled' ? '已安排' : 
                             post.status === 'published' ? '已发布' : 
                             post.status === 'failed' ? '失败' : 
                             post.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{format(post.scheduledFor, 'yyyy年MM月dd日')}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{format(post.scheduledFor, 'HH:mm')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-500"
                          onClick={() => deleteScheduledPost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
