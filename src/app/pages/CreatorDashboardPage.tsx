
import { Card } from '../components/ui/card';
import { mockCreatorStats } from '../data/mockData';
import { DollarSign, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export function CreatorDashboardPage() {
  const stats = mockCreatorStats;

  const statCards = [
    {
      title: '今日收入',
      value: `$${stats.todayEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: '订阅者',
      value: stats.subscribers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: '消息',
      value: stats.messages.toString(),
      icon: MessageCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: '总收入',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">创作者仪表盘</h2>
        <p className="text-zinc-400">跟踪您的表现和收入</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl mb-1">{stat.value}</p>
              <p className="text-sm text-zinc-400">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-6">
          <h3 className="text-xl mb-6">收入概览</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/create-post">
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <h4 className="text-lg mb-2">创建内容</h4>
            <p className="text-sm text-zinc-400">与您的订阅者分享新内容</p>
          </Card>
        </Link>
        
        <Link to="/manage-content">
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <h4 className="text-lg mb-2">管理内容</h4>
            <p className="text-sm text-zinc-400">编辑或删除您的内容</p>
          </Card>
        </Link>
        
        <Link to="/wallet">
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <h4 className="text-lg mb-2">提现</h4>
            <p className="text-sm text-zinc-400">将收入转移到您的账户</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
