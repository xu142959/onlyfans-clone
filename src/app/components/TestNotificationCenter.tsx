import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Bell } from 'lucide-react';

export function TestNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
            3
          </Badge>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0 bg-zinc-900 border-zinc-800" align="end">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-semibold">通知</h3>
        </div>
        <div className="p-4">
          <p>测试通知内容</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
