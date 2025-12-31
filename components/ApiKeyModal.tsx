
import React, { useState } from 'react';
import { AiModel } from '../types';

interface ApiKeyModalProps {
  currentKey: string;
  currentModel: AiModel;
  onSave: (key: string, model: AiModel) => void;
  onClose: () => void;
  isOpen: boolean;
  forceInput?: boolean;
}

const MODELS: { id: AiModel; name: string; desc: string }[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Nhanh nhất, phù hợp nhất cho hầu hết các câu hỏi.' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', desc: 'Thông minh hơn, xử lý các bài toán phức tạp tốt hơn.' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Phiên bản ổn định, tốc độ cao.' },
];

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ currentKey, currentModel, onSave, onClose, isOpen, forceInput }) => {
  const [key, setKey] = useState(currentKey);
  const [model, setModel] = useState<AiModel>(currentModel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-indigo-600 text-white">
          <h2 className="text-xl font-bold">Cấu hình API & Model</h2>
          <p className="text-indigo-100 text-sm mt-1">Thiết lập key để kích hoạt tính năng AI</p>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gemini API Key</label>
            <input
              type="password"
              className="w-full border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="Nhập API key của bạn..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <div className="mt-2 text-sm">
              <span className="text-gray-500">Chưa có key? </span>
              <a 
                href="https://aistudio.google.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-600 font-medium hover:underline"
              >
                Lấy key tại Google AI Studio
              </a>
            </div>
            <a 
              href="https://tinyurl.com/hdsdpmTHT" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block mt-2 text-xs text-blue-500 hover:underline italic"
            >
              Click vào đây để xem hướng dẫn chi tiết
            </a>
          </section>

          <section>
            <label className="block text-sm font-bold text-gray-700 mb-3">Lựa chọn Model AI</label>
            <div className="grid grid-cols-1 gap-3">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    model === m.id 
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                      : 'border-gray-100 bg-gray-50 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{m.name}</span>
                    {m.id === 'gemini-3-flash-preview' && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold uppercase">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                </button>
              ))}
            </div>
          </section>
          
          <div className="flex gap-3 pt-2">
            {!forceInput && (
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
            )}
            <button 
              onClick={() => onSave(key, model)}
              disabled={!key}
              className="flex-[2] bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Lưu & Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
