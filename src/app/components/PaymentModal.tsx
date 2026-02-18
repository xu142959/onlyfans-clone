import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  type: 'subscription' | 'ppv' | 'wallet' | 'tip';
  creatorName?: string;
  onSuccess?: () => void;
}

type PaymentMethod = 'card' | 'paypal';

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  type,
  creatorName,
  onSuccess
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\//g, '').length <= 4) {
      setExpiry(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (paymentMethod === 'card') {
      // Simulate Stripe payment
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('无效的卡号');
        setProcessing(false);
        return;
      }

      if (!expiry || expiry.length !== 5) {
        toast.error('无效的有效期');
        setProcessing(false);
        return;
      }

      if (!cvv || cvv.length < 3) {
        toast.error('无效的安全码');
        setProcessing(false);
        return;
      }

      toast.success('支付成功！');
    } else {
      // Simulate PayPal payment
      toast.success('PayPal 支付成功！');
    }

    setProcessing(false);
    onSuccess?.();
    onClose();
  };

  const handlePayPalClick = () => {
    setProcessing(true);
    
    // Simulate PayPal redirect
    setTimeout(() => {
      toast.success('PayPal payment successful!');
      setProcessing(false);
      onSuccess?.();
      onClose();
    }, 2000);
  };

  const getTitle = () => {
    switch (type) {
      case 'subscription':
        return `订阅 ${creatorName}`;
      case 'ppv':
        return '解锁内容';
      case 'wallet':
        return '添加余额';
      case 'tip':
        return `给 ${creatorName} 打赏`;
      default:
        return '支付';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{getTitle()}</DialogTitle>
          <DialogDescription>
            完成您的付款 ${amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Amount Display */}
          <div className="bg-zinc-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-zinc-400 mb-1">总金额</p>
            <p className="text-3xl font-bold">${amount.toFixed(2)}</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>支付方式</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="flex items-center space-x-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 cursor-pointer hover:border-blue-500 transition-colors">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="w-5 h-5" />
                  <span>信用卡 / 借记卡</span>
                </Label>
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 cursor-pointer hover:border-blue-500 transition-colors">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                  <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">P</div>
                  <span>PayPal</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">卡号</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">有效期</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">安全码</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="saveCard" className="text-sm text-zinc-400 cursor-pointer">
                  保存卡片以便未来支付
                </Label>
              </div>
            </div>
          )}

          {/* PayPal Info */}
          {paymentMethod === 'paypal' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
              <p>您将被重定向到 PayPal 安全完成付款。</p>
            </div>
          )}

          <Separator className="bg-zinc-800" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-zinc-700"
              disabled={processing}
            >
              取消
            </Button>
            <Button
              onClick={paymentMethod === 'card' ? handlePayment : handlePayPalClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>支付 ${amount.toFixed(2)}</>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-center text-zinc-500">
            <p>🔒 您的支付信息是安全加密的</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
