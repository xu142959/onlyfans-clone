import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Users, DollarSign, AlertTriangle, CheckCircle, XCircle,
  Search, Filter, BarChart3, Shield, Flag
} from 'lucide-react';
import { mockCreators } from '../data/mockData';

export function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle filter button click
  const handleFilterClick = () => {
    console.log('Filter button clicked');
    alert('过滤器功能将在后续版本中实现');
  };

  // Handle view profile button click
  const handleViewProfile = (username: string) => {
    console.log('View profile clicked for:', username);
    alert(`查看用户 ${username} 的资料`);
  };

  // Handle ban user button click
  const handleBanUser = (username: string) => {
    console.log('Ban user clicked for:', username);
    if (window.confirm(`确定要封禁用户 ${username} 吗？`)) {
      alert(`用户 ${username} 已被封禁`);
    }
  };

  // Handle KYC document review
  const handleReviewDocuments = (username: string) => {
    console.log('Review documents clicked for:', username);
    alert(`审核用户 ${username} 的身份验证文档`);
  };

  // Handle KYC approve
  const handleApproveKYC = (username: string) => {
    console.log('Approve KYC clicked for:', username);
    alert(`用户 ${username} 的身份验证已批准`);
  };

  // Handle KYC reject
  const handleRejectKYC = (username: string) => {
    console.log('Reject KYC clicked for:', username);
    if (window.confirm(`确定要拒绝用户 ${username} 的身份验证申请吗？`)) {
      alert(`用户 ${username} 的身份验证已拒绝`);
    }
  };

  // Handle report view details
  const handleViewReportDetails = (id: string) => {
    console.log('View report details clicked for:', id);
    alert(`查看举报 ID: ${id} 的详细信息`);
  };

  // Handle report resolve
  const handleResolveReport = (id: string) => {
    console.log('Resolve report clicked for:', id);
    alert(`举报 ID: ${id} 已解决`);
  };

  // Handle report take action
  const handleTakeAction = (id: string) => {
    console.log('Take action clicked for:', id);
    alert(`对举报 ID: ${id} 采取行动`);
  };

  // Handle withdrawal approve
  const handleApproveWithdrawal = (id: string, amount: number) => {
    console.log('Approve withdrawal clicked for:', id);
    alert(`提现请求 ID: ${id} (金额: $${amount.toFixed(2)}) 已批准`);
  };

  // Handle withdrawal reject
  const handleRejectWithdrawal = (id: string, amount: number) => {
    console.log('Reject withdrawal clicked for:', id);
    if (window.confirm(`确定要拒绝提现请求 ID: ${id} (金额: $${amount.toFixed(2)}) 吗？`)) {
      alert(`提现请求 ID: ${id} 已拒绝`);
    }
  };

  // Mock admin stats
  const stats = [
    {
      title: '总用户数',
      value: '45,231',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: '总收入',
      value: '$892,450',
      change: '+8.2%',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: '活跃创作者',
      value: '3,456',
      change: '+15.3%',
      icon: BarChart3,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: '待处理举报',
      value: '23',
      change: '-5.2%',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  // Mock KYC applications
  const kycApplications = [
    {
      id: '1',
      username: 'new_creator_1',
      email: 'creator1@example.com',
      submittedAt: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      username: 'new_creator_2',
      email: 'creator2@example.com',
      submittedAt: '5 hours ago',
      status: 'pending'
    },
    {
      id: '3',
      username: 'verified_user',
      email: 'verified@example.com',
      submittedAt: '1 day ago',
      status: 'approved'
    }
  ];

  // Mock reports
  const reports = [
    {
      id: '1',
      type: 'content',
      reporter: 'user_123',
      reported: 'creator_456',
      reason: 'Inappropriate content',
      timestamp: '1 hour ago',
      status: 'pending'
    },
    {
      id: '2',
      type: 'user',
      reporter: 'user_789',
      reported: 'user_012',
      reason: 'Harassment',
      timestamp: '3 hours ago',
      status: 'reviewing'
    }
  ];

  // Mock withdrawals
  const withdrawals = [
    {
      id: '1',
      creator: mockCreators[0],
      amount: 1250.00,
      method: 'Bank Transfer',
      timestamp: '30 min ago',
      status: 'pending'
    },
    {
      id: '2',
      creator: mockCreators[1],
      amount: 850.50,
      method: 'PayPal',
      timestamp: '2 hours ago',
      status: 'pending'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-3xl mb-2">管理后台</h2>
        <p className="text-zinc-400">平台管理和内容审核</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl mb-1">{stat.value}</p>
            <p className="text-sm text-zinc-400">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="kyc">
            身份验证审核
            <Badge className="ml-2 bg-orange-500">
              {kycApplications.filter(k => k.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="content">内容审核</TabsTrigger>
          <TabsTrigger value="reports">
            举报管理
            <Badge className="ml-2 bg-red-500">
              {reports.filter(r => r.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="payments">支付管理</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="按用户名或邮箱搜索用户..."
                  className="bg-zinc-800 border-zinc-700 pl-10"
                />
              </div>
              <Button variant="outline" className="border-zinc-700" onClick={handleFilterClick}>
                <Filter className="w-4 h-4 mr-2" />
                过滤器
              </Button>
            </div>

            <div className="space-y-3">
              {mockCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={creator.avatar} alt={creator.username} />
                      <AvatarFallback>{creator.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{creator.displayName}</p>
                      <p className="text-sm text-zinc-400">@{creator.username}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">创作者</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewProfile(creator.username)}>
                      查看资料
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400" onClick={() => handleBanUser(creator.username)}>
                      封禁用户
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* KYC Review Tab */}
        <TabsContent value="kyc" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-4">身份验证申请</h3>
            
            <div className="space-y-3">
              {kycApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">@{application.username}</p>
                    <p className="text-sm text-zinc-400">{application.email}</p>
                    <p className="text-xs text-zinc-500 mt-1">提交于 {application.submittedAt}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {application.status === 'pending' ? (
                      <>
                        <Button size="sm" variant="outline" className="border-zinc-700" onClick={() => handleReviewDocuments(application.username)}>
                          审核文档
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveKYC(application.username)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          批准
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-900 text-red-500" onClick={() => handleRejectKYC(application.username)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          拒绝
                        </Button>
                      </>
                    ) : (
                      <Badge className="bg-green-500/10 text-green-500">
                        已批准
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-4">标记内容</h3>
            
            <div className="text-center py-12 text-zinc-500">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>目前没有标记内容</p>
            </div>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-4">用户举报</h3>
            
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-orange-500" />
                      <span className="font-medium capitalize">{report.type === 'content' ? '内容' : '用户'}举报</span>
                      <Badge variant="outline" className={
                        report.status === 'pending' ? 'border-orange-500 text-orange-500' : 'border-blue-500 text-blue-500'
                      }>
                        {report.status === 'pending' ? '待处理' : '处理中'}
                      </Badge>
                    </div>
                    <span className="text-xs text-zinc-500">{report.timestamp}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <p>
                      <span className="text-zinc-400">举报人:</span>{' '}
                      <span className="text-blue-500">@{report.reporter}</span>
                    </p>
                    <p>
                      <span className="text-zinc-400">被举报人:</span>{' '}
                      <span className="text-red-500">@{report.reported}</span>
                    </p>
                    <p>
                      <span className="text-zinc-400">原因:</span> {report.reason}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-zinc-700" onClick={() => handleViewReportDetails(report.id)}>
                      查看详情
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleResolveReport(report.id)}>
                      解决
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-900 text-red-500" onClick={() => handleTakeAction(report.id)}>
                      采取行动
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-4">提现请求</h3>
            
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={withdrawal.creator.avatar} alt={withdrawal.creator.username} />
                      <AvatarFallback>{withdrawal.creator.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">@{withdrawal.creator.username}</p>
                      <p className="text-sm text-zinc-400">{withdrawal.method === 'Bank Transfer' ? '银行转账' : 'PayPal'}</p>
                      <p className="text-xs text-zinc-500">{withdrawal.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-medium">${withdrawal.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="border-orange-500 text-orange-500">
                        待处理
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveWithdrawal(withdrawal.id, withdrawal.amount)}>
                        批准
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-900 text-red-500" onClick={() => handleRejectWithdrawal(withdrawal.id, withdrawal.amount)}>
                        拒绝
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Stats */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-xl mb-4">收入概览</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-1">平台收入 (20%)</p>
                <p className="text-2xl">$178,490</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-1">创作者分成 (80%)</p>
                <p className="text-2xl">$713,960</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-sm text-zinc-400 mb-1">待处理提现</p>
                <p className="text-2xl">$12,450</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
