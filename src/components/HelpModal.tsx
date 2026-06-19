import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Modal } from './Modal';

export const HelpModal: React.FC = () => {
  const { showHelp, setShowHelp } = useGameStore();

  return (
    <Modal
      isOpen={showHelp}
      onClose={() => setShowHelp(false)}
      title="游戏规则"
    >
      <div className="space-y-4 text-gray-300">
        <p>
          猜一个5个字母的单词，你有6次机会。
        </p>

        <p>
          每次猜测后，字母的颜色会发生变化，提示你的猜测与正确答案的接近程度。
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-correct border-2 border-correct flex items-center justify-center font-bold text-white text-xl rounded">
              W
            </div>
            <p>
              <span className="font-bold text-correct">绿色</span>：字母在单词中，且位置正确。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-present border-2 border-present flex items-center justify-center font-bold text-white text-xl rounded">
              I
            </div>
            <p>
              <span className="font-bold text-present">黄色</span>：字母在单词中，但位置错误。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-absent border-2 border-absent flex items-center justify-center font-bold text-white text-xl rounded">
              V
            </div>
            <p>
              <span className="font-bold text-gray-500">灰色</span>：字母不在单词中。
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h3 className="font-bold text-white mb-2">游戏特性</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>每日更新一词，每天都有新挑战</li>
            <li>支持英语、西班牙语、中文拼音三种语言</li>
            <li>键盘会显示已猜测字母的状态</li>
            <li>追踪你的游戏统计数据</li>
            <li>可以分享你的成绩给朋友</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <h3 className="font-bold text-white mb-2">操作方式</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>使用物理键盘或点击屏幕上的虚拟键盘</li>
            <li>按 Enter 提交猜测</li>
            <li>按 Backspace 删除字母</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
