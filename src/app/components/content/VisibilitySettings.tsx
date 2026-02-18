
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DollarSign } from 'lucide-react';

interface VisibilitySettingsProps {
  visibility: 'free' | 'subscription' | 'ppv';
  price: string;
  onVisibilityChange: (visibility: 'free' | 'subscription' | 'ppv') => void;
  onPriceChange: (price: string) => void;
}

export function VisibilitySettings({ 
  visibility, 
  price, 
  onVisibilityChange, 
  onPriceChange 
}: VisibilitySettingsProps) {
  return (
    <div className="space-y-4">
      <Label>内容可见性</Label>
      <RadioGroup value={visibility} onValueChange={(value: any) => onVisibilityChange(value)}>
        <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
          <RadioGroupItem value="free" id="free" />
          <div className="flex-1">
            <Label htmlFor="free" className="cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span>免费内容</span>
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full">
                  公开
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                任何人都可以查看，包括非订阅者
              </p>
            </Label>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
          <RadioGroupItem value="subscription" id="subscription" />
          <div className="flex-1">
            <Label htmlFor="subscription" className="cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span>仅限订阅者</span>
                <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">
                  独家
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                只有您的订阅者可以查看此内容
              </p>
            </Label>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
          <RadioGroupItem value="ppv" id="ppv" />
          <div className="flex-1">
            <Label htmlFor="ppv" className="cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <span>按次付费</span>
                <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-500 rounded-full">
                  高级
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                用户必须付费才能解锁此特定内容
              </p>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {visibility === 'ppv' && (
        <div className="ml-11 space-y-2">
          <Label htmlFor="price">解锁价格</Label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <DollarSign className="w-4 h-4" />
            </span>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="9.99"
              className="bg-zinc-800 border-zinc-700 pl-10"
            />
          </div>
          <p className="text-xs text-zinc-500">
            为此内容设置一次性解锁价格
          </p>
        </div>
      )}
    </div>
  );
}

export default VisibilitySettings;