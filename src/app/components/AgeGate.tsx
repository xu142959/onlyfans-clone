import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { AlertTriangle } from 'lucide-react';

interface AgeGateProps {
  onVerify: () => void;
}

export function AgeGate({ onVerify }: AgeGateProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 border border-zinc-800"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl mb-2">18+ 内容警告</h1>
          <p className="text-zinc-400 text-sm">
            本网站包含成人内容
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-800/50 rounded-lg p-4 text-sm text-zinc-300">
            <p className="mb-2">
              进入本网站，您确认：
            </p>
            <ul className="space-y-1 list-disc list-inside text-zinc-400">
              <li>您年满18周岁</li>
              <li>您同意查看成人内容</li>
              <li>本内容在您所在地区是合法的</li>
              <li>您不会与未成年人分享内容</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="age-confirm"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <label
              htmlFor="age-confirm"
              className="text-sm text-zinc-300 leading-tight cursor-pointer"
            >
              我已满18周岁，并且同意{' '}
              <a href="#" className="text-blue-500 hover:underline">
                服务条款
              </a>{' '}
              和{' '}
              <a href="#" className="text-blue-500 hover:underline">
                隐私政策
              </a>
            </label>
          </div>

          <Button
            onClick={onVerify}
            disabled={!agreed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            进入网站
          </Button>

          <div className="text-center">
            <a
              href="https://www.google.com"
              className="text-sm text-zinc-500 hover:text-zinc-400"
            >
              我未满18岁 - 退出
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 text-center">
            本网站使用cookie来增强您的体验。继续访问即表示您同意我们的cookie政策。
          </p>
        </div>
      </motion.div>
    </div>
  );
}
