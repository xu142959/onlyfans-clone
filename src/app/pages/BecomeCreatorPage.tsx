import { useState, useRef } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { Camera, CheckCircle, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

type Step = 'intro' | 'agreement' | 'kyc' | 'profile' | 'verification';

export function BecomeCreatorPage() {
  const [step, setStep] = useState<Step>('intro');
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const { switchToCreator } = useAuth();
  const navigate = useNavigate();
  
  // File input refs
  const idFrontInputRef = useRef<HTMLInputElement>(null);
  const idBackInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
    photo: null as File | null,
    cover: null as File | null
  });
  
  // File previews state
  const [filePreviews, setFilePreviews] = useState({
    idFront: '',
    idBack: '',
    selfie: '',
    photo: '',
    cover: ''
  });

  const handleStartApplication = () => {
    setStep('agreement');
  };

  const handleAcceptTerms = () => {
    setStep('kyc');
  };

  const handleKYCSubmit = () => {
    setStep('verification');
    // Simulate verification process
    setTimeout(() => {
      setKycStatus('approved');
      toast.success('KYC verification approved!');
      setTimeout(() => {
        setStep('profile');
      }, 2000);
    }, 3000);
  };

  const handleProfileSubmit = () => {
    switchToCreator();
    toast.success('欢迎加入创作者计划！');
    navigate('/creator-dashboard');
  };

  // Trigger file input click
  const handleUploadPhoto = () => {
    photoInputRef.current?.click();
  };

  const handleUploadCover = () => {
    coverInputRef.current?.click();
  };

  const handleUploadIDFront = () => {
    idFrontInputRef.current?.click();
  };

  const handleUploadIDBack = () => {
    idBackInputRef.current?.click();
  };

  const handleUploadSelfie = () => {
    selfieInputRef.current?.click();
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof uploadedFiles) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast.error('不支持的文件类型，请上传 JPG、PNG 或 PDF 文件');
        return;
      }

      if (file.size > maxSize) {
        toast.error('文件大小超过限制，请上传小于 10MB 的文件');
        return;
      }

      // Update uploaded files state
      setUploadedFiles(prev => ({
        ...prev,
        [type]: file
      }));

      // Create file preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreviews(prev => ({
            ...prev,
            [type]: event.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }

      toast.success('文件上传成功');
    }
  };

  const getProgress = () => {
    switch (step) {
      case 'intro': return 0;
      case 'agreement': return 25;
      case 'kyc': return 50;
      case 'verification': return 75;
      case 'profile': return 90;
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {step !== 'intro' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl">成为创作者</h2>
            <span className="text-sm text-zinc-400">{getProgress()}% 完成</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      )}

      {/* Intro Step */}
      {step === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10" />
            </div>
            
            <h1 className="text-4xl mb-4">开始创作</h1>
            <p className="text-xl text-zinc-400 mb-8">
              加入成千上万的创作者行列，通过你的内容赚钱
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg mb-2">赚取收入</h3>
                <p className="text-sm text-zinc-400">
                  设置自己的订阅价格，通过独家内容赚钱
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg mb-2">与粉丝连接</h3>
                <p className="text-sm text-zinc-400">
                  建立忠实的粉丝群体，直接与支持者互动
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg mb-2">完全控制</h3>
                <p className="text-sm text-zinc-400">
                  你决定分享什么内容以及如何定价
                </p>
              </div>
            </div>

            <Button
              onClick={handleStartApplication}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              开始申请
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Agreement Step */}
      {step === 'agreement' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-2xl mb-4">创作者协议</h3>
            
            <div className="bg-zinc-800 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
              <h4 className="text-lg mb-4">条款和条件</h4>
              
              <div className="space-y-4 text-sm text-zinc-300">
                <p>
                  通过成为FanVault的创作者，您同意以下条款：
                </p>

                <div>
                  <h5 className="font-semibold mb-2">1. 年龄要求</h5>
                  <p className="text-zinc-400">
                    您必须年满18岁才能在本平台创建内容。
                    您需要通过我们的KYC流程验证您的身份。
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">2. 内容指南</h5>
                  <p className="text-zinc-400">
                    所有内容必须符合我们的社区准则和当地法律。
                    禁止的内容包括非法材料、非自愿内容和涉及未成年人的内容。
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">3. 收入分成</h5>
                  <p className="text-zinc-400">
                    FanVault从所有收入中收取20%的平台费用。您将获得所有订阅和内容购买收入的80%。
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">4. 支付条款</h5>
                  <p className="text-zinc-400">
                    收入按月支付，最低门槛为50美元。
                    支付处理可能需要5-7个工作日。
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold mb-2">5. 账户终止</h5>
                  <p className="text-zinc-400">
                    我们保留终止违反服务条款或社区准则的账户的权利。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">
                Please read the entire agreement carefully. You must verify your identity
                and comply with all terms to become a creator.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('intro')}
                variant="outline"
                className="border-zinc-700"
              >
                返回
              </Button>
              <Button
                onClick={handleAcceptTerms}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                我接受条款
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* KYC Step */}
      {step === 'kyc' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-2xl mb-4">身份验证 (KYC)</h3>
            <p className="text-zinc-400 mb-6">
              为了遵守法律要求，我们需要验证您的身份。
              所有信息均经过加密并安全存储。
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">法定全名</Label>
                <Input
                  id="fullName"
                  placeholder="输入身份证上显示的全名"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">出生日期</Label>
                <Input
                  id="dob"
                  type="date"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idType">证件类型</Label>
                <select
                  id="idType"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md"
                >
                  <option>护照</option>
                  <option>驾照</option>
                  <option>身份证</option>
                </select>
              </div>

                <div className="space-y-2">
                <Label>上传证件（正面）</Label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer" onClick={handleUploadIDFront}>
                  {filePreviews.idFront ? (
                    <div className="relative inline-block">
                      <img src={filePreviews.idFront} alt="证件正面预览" className="w-full max-w-xs h-auto rounded" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">点击更换</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                      <p className="text-sm text-zinc-400 mb-1">点击上传或拖放文件</p>
                      <p className="text-xs text-zinc-500">PNG, JPG 或 PDF (最大 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  ref={idFrontInputRef}
                  onChange={(e) => handleFileSelect(e, 'idFront')}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label>上传证件（背面）</Label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer" onClick={handleUploadIDBack}>
                  {filePreviews.idBack ? (
                    <div className="relative inline-block">
                      <img src={filePreviews.idBack} alt="证件背面预览" className="w-full max-w-xs h-auto rounded" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">点击更换</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                      <p className="text-sm text-zinc-400 mb-1">点击上传或拖放文件</p>
                      <p className="text-xs text-zinc-500">PNG, JPG 或 PDF (最大 10MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  ref={idBackInputRef}
                  onChange={(e) => handleFileSelect(e, 'idBack')}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label>手持证件自拍</Label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer" onClick={handleUploadSelfie}>
                  {filePreviews.selfie ? (
                    <div className="relative inline-block">
                      <img src={filePreviews.selfie} alt="手持证件自拍预览" className="w-full max-w-xs h-auto rounded" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">点击更换</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                      <p className="text-sm text-zinc-400 mb-1">拍摄或上传手持证件的自拍照</p>
                      <p className="text-xs text-zinc-500">确保您的面部和证件清晰可见</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={selfieInputRef}
                  onChange={(e) => handleFileSelect(e, 'selfie')}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setStep('agreement')}
                variant="outline"
                className="border-zinc-700"
              >
                返回
              </Button>
              <Button
                onClick={handleKYCSubmit}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                提交验证
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Verification Step */}
      {step === 'verification' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 p-8 text-center">
            {kycStatus === 'pending' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-6 text-blue-500 animate-spin" />
                <h3 className="text-2xl mb-2">正在验证您的身份</h3>
                <p className="text-zinc-400">
                  请稍候，我们正在验证您的文档。这通常需要几分钟时间。
                </p>
              </>
            )}

            {kycStatus === 'approved' && (
              <>
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl mb-2">验证通过！</h3>
                <p className="text-zinc-400">
                  您的身份已验证。让我们设置您的创作者资料。
                </p>
              </>
            )}

            {kycStatus === 'rejected' && (
              <>
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl mb-2">验证失败</h3>
                <p className="text-zinc-400 mb-6">
                  我们无法验证您的身份。请检查您的文档并重试。
                </p>
                <Button onClick={() => setStep('kyc')} className="bg-blue-600 hover:bg-blue-700">
                  重试
                </Button>
              </>
            )}
          </Card>
        </motion.div>
      )}

      {/* Profile Setup Step */}
      {step === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h3 className="text-2xl mb-4">设置您的创作者资料</h3>
            <p className="text-zinc-400 mb-6">
              自定义您的资料以吸引订阅者
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>头像</Label>
                <div className="flex items-center gap-4">
                  {filePreviews.photo ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer" onClick={handleUploadPhoto}>
                      <img src={filePreviews.photo} alt="头像预览" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center cursor-pointer" onClick={handleUploadPhoto}>
                      <Camera className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}
                  <Button variant="outline" className="border-zinc-700" onClick={handleUploadPhoto}>
                    上传照片
                  </Button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={photoInputRef}
                  onChange={(e) => handleFileSelect(e, 'photo')}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label>封面照片</Label>
                <div className="h-32 bg-zinc-800 rounded-lg overflow-hidden cursor-pointer" onClick={handleUploadCover}>
                  {filePreviews.cover ? (
                    <div className="relative w-full h-full">
                      <img src={filePreviews.cover} alt="封面预览" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">点击更换</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                        <p className="text-sm text-zinc-500">上传封面图片</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  onChange={(e) => handleFileSelect(e, 'cover')}
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">显示名称</Label>
                <Input
                  id="displayName"
                  placeholder="您的公开显示名称"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  placeholder="告诉您的粉丝关于您自己的信息..."
                  className="bg-zinc-800 border-zinc-700 min-h-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPrice">月度订阅价格</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                    <Input
                      id="monthlyPrice"
                      type="number"
                      placeholder="9.99"
                      className="bg-zinc-800 border-zinc-700 pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearlyPrice">年度订阅价格</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                    <Input
                      id="yearlyPrice"
                      type="number"
                      placeholder="99.99"
                      className="bg-zinc-800 border-zinc-700 pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">标签（逗号分隔）</Label>
                <Input
                  id="tags"
                  placeholder="例如：健身, 生活方式, 时尚"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleProfileSubmit}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                完成设置并开始创作
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
