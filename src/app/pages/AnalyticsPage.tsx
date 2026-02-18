import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  DollarSign,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { motion } from 'motion/react';

// Mock analytics data
const revenueData = [
  { date: 'Jan', subscriptions: 2400, ppv: 1200, tips: 800, total: 4400 },
  { date: 'Feb', subscriptions: 2800, ppv: 1398, tips: 920, total: 5118 },
  { date: 'Mar', subscriptions: 3200, ppv: 1800, tips: 1100, total: 6100 },
  { date: 'Apr', subscriptions: 3600, ppv: 2100, tips: 1300, total: 7000 },
  { date: 'May', subscriptions: 4200, ppv: 2400, tips: 1500, total: 8100 },
  { date: 'Jun', subscriptions: 4800, ppv: 2800, tips: 1800, total: 9400 },
];

const subscriberGrowth = [
  { date: 'Week 1', subscribers: 120, churn: 5 },
  { date: 'Week 2', subscribers: 145, churn: 8 },
  { date: 'Week 3', subscribers: 168, churn: 6 },
  { date: 'Week 4', subscribers: 192, churn: 10 },
  { date: 'Week 5', subscribers: 215, churn: 7 },
  { date: 'Week 6', subscribers: 240, churn: 9 },
];

const contentPerformance = [
  { type: 'Photos', views: 15420, engagement: 8.5 },
  { type: 'Videos', views: 12340, engagement: 12.3 },
  { type: 'Text', views: 8760, engagement: 5.2 },
  { type: 'Audio', views: 4560, engagement: 7.8 },
];

const revenueByType = [
  { name: 'Subscriptions', value: 58, amount: 24800 },
  { name: 'PPV Content', value: 28, amount: 12000 },
  { name: 'Tips', value: 10, amount: 4300 },
  { name: 'Messages', value: 4, amount: 1700 },
];

const demographicsData = [
  { age: '18-24', count: 1200 },
  { age: '25-34', count: 2800 },
  { age: '35-44', count: 1600 },
  { age: '45-54', count: 800 },
  { age: '55+', count: 400 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$42,890',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Active Subscribers',
      value: '1,284',
      change: '+8.2%',
      isPositive: true,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Views',
      value: '48,392',
      change: '+15.3%',
      isPositive: true,
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Engagement Rate',
      value: '8.4%',
      change: '-2.1%',
      isPositive: false,
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl mb-2">Analytics Dashboard</h2>
          <p className="text-zinc-400">Track your performance and audience insights</p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-zinc-400">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-6">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="subscriptions"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="ppv"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="tips"
                  stackId="1"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl mb-6">Revenue by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl mb-6">Revenue Breakdown</h3>
              <div className="space-y-4">
                {revenueByType.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.amount.toLocaleString()}</p>
                      <p className="text-sm text-zinc-400">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-6">Subscriber Growth & Churn</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={subscriberGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="subscribers"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="churn"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <p className="text-sm text-zinc-400 mb-2">New Subscribers</p>
              <p className="text-3xl font-bold mb-1">+128</p>
              <p className="text-sm text-green-500">+18.3% from last month</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <p className="text-sm text-zinc-400 mb-2">Churn Rate</p>
              <p className="text-3xl font-bold mb-1">3.2%</p>
              <p className="text-sm text-red-500">+0.5% from last month</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <p className="text-sm text-zinc-400 mb-2">Retention Rate</p>
              <p className="text-3xl font-bold mb-1">96.8%</p>
              <p className="text-sm text-green-500">-0.5% from last month</p>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-6">Content Performance</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={contentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="type" stroke="#71717a" />
                <YAxis yAxisId="left" stroke="#71717a" />
                <YAxis yAxisId="right" orientation="right" stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="engagement" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <Eye className="w-8 h-8 text-blue-500 mb-3" />
              <p className="text-2xl font-bold mb-1">48,392</p>
              <p className="text-sm text-zinc-400">Total Views</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <Heart className="w-8 h-8 text-pink-500 mb-3" />
              <p className="text-2xl font-bold mb-1">12,483</p>
              <p className="text-sm text-zinc-400">Total Likes</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <MessageCircle className="w-8 h-8 text-purple-500 mb-3" />
              <p className="text-2xl font-bold mb-1">3,291</p>
              <p className="text-sm text-zinc-400">Total Comments</p>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <Share2 className="w-8 h-8 text-green-500 mb-3" />
              <p className="text-2xl font-bold mb-1">1,542</p>
              <p className="text-sm text-zinc-400">Total Shares</p>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl mb-6">Age Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demographicsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" stroke="#71717a" />
                  <YAxis dataKey="age" type="category" stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h3 className="text-xl mb-6">Top Locations</h3>
              <div className="space-y-4">
                {[
                  { country: 'United States', count: 3200, percentage: 45 },
                  { country: 'United Kingdom', count: 1400, percentage: 20 },
                  { country: 'Canada', count: 980, percentage: 14 },
                  { country: 'Australia', count: 700, percentage: 10 },
                  { country: 'Germany', count: 520, percentage: 7 },
                  { country: 'Others', count: 284, percentage: 4 },
                ].map((location) => (
                  <div key={location.country}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{location.country}</span>
                      <span className="text-sm text-zinc-400">
                        {location.count} ({location.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-6">Peak Activity Times</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center">
                  <p className="text-sm text-zinc-400 mb-2">{day}</p>
                  <div className="space-y-1">
                    {Array.from({ length: 24 }).map((_, hour) => {
                      const activity = Math.random();
                      return (
                        <div
                          key={hour}
                          className="h-1 rounded"
                          style={{
                            backgroundColor:
                              activity > 0.7
                                ? '#3b82f6'
                                : activity > 0.4
                                ? '#60a5fa'
                                : '#93c5fd',
                            opacity: activity,
                          }}
                          title={`${hour}:00 - ${activity.toFixed(2)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-600" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-400" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300" />
                <span>Low</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
