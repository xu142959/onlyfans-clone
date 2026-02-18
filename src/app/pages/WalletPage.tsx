import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { paymentService } from '../../api/services/paymentService';
import { toast } from 'sonner';

export function WalletPage() {
  const [balance] = useState(250.00);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFunds = () => {
    if (!amount) {
      toast.error('请输入金额');
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('请输入有效的金额');
      return;
    }
    toast.success(`成功添加 $${amountNum} 到您的钱包`);
    setAmount('');
  };

  const handleAddFundsButton = () => {
    toast.info('添加资金功能开发中');
  };

  // 获取交易记录
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getUserPayments();
        setTransactions((response as any).payments);
        setError(null);
      } catch (err) {
        console.error('获取交易记录失败:', err);
        setError('加载交易记录失败');
        toast.error('加载交易记录失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl mb-2">钱包</h2>
        <p className="text-zinc-400">管理您的余额和交易</p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 p-6 mb-6">
          <div className="flex items-center gap-2 mb-2 text-white/80">
            <WalletIcon className="w-5 h-5" />
            <span className="text-sm">可用余额</span>
          </div>
          <p className="text-4xl text-white mb-4">${balance.toFixed(2)}</p>
          
          <div className="flex gap-3">
            <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0 flex-1" onClick={handleAddFundsButton}>
              <Plus className="w-4 h-4 mr-2" />
              添加资金
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Add Funds Section */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mb-6">
        <h3 className="text-lg mb-4">添加资金</h3>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-zinc-800 border-zinc-700"
          />
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddFunds}>
            添加
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[10, 25, 50, 100].map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => setAmount(preset.toString())}
            >
              ${preset}
            </Button>
          ))}
        </div>
      </Card>

      {/* Transaction History */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-zinc-900 mb-4">
          <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex-1">订阅</TabsTrigger>
          <TabsTrigger value="purchases" className="flex-1">购买</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          <h3 className="text-lg mb-3">交易历史</h3>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-4 text-center text-zinc-400">
              未找到交易记录
            </div>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction._id} className="bg-zinc-900 border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10`}>
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    </div>
                    
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'subscription' && '订阅'}
                        {transaction.type === 'ppv' && '内容购买'}
                        {transaction.type === 'tip' && '打赏'}
                        {transaction.type === 'chat' && '解锁聊天'}
                      </p>
                      {transaction.creator && (
                        <p className="text-sm text-zinc-400">{transaction.creator.username}</p>
                      )}
                      <p className="text-xs text-zinc-500">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-red-500">
                      -${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-2">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : transactions.filter(t => t.type === 'subscription').length === 0 ? (
            <div className="p-4 text-center text-zinc-400">
              未找到订阅记录
            </div>
          ) : (
            transactions.filter(t => t.type === 'subscription').map((transaction) => (
              <Card key={transaction._id} className="bg-zinc-900 border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">订阅</p>
                    {transaction.creator && (
                      <p className="text-sm text-zinc-400">{transaction.creator.username}</p>
                    )}
                    <p className="text-xs text-zinc-500">{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-red-500">
                    -${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="purchases" className="space-y-2">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : transactions.filter(t => t.type === 'ppv' || t.type === 'tip').length === 0 ? (
            <div className="p-4 text-center text-zinc-400">
              未找到购买记录
            </div>
          ) : (
            transactions.filter(t => t.type === 'ppv' || t.type === 'tip').map((transaction) => (
              <Card key={transaction._id} className="bg-zinc-900 border-zinc-800 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {transaction.type === 'ppv' ? '内容购买' : '打赏'}
                    </p>
                    {transaction.creator && (
                      <p className="text-sm text-zinc-400">{transaction.creator.username}</p>
                    )}
                    <p className="text-xs text-zinc-500">{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-red-500">
                    -${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
