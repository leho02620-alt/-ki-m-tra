
import React, { useState } from 'react';
import { Question, ExamConfig, GeneratedExam, Grade } from '../types';
import { GRADES, TOPICS } from '../constants';

interface ExamGeneratorProps {
  questions: Question[];
  onGenerate: (exam: GeneratedExam) => void;
}

const ExamGenerator: React.FC<ExamGeneratorProps> = ({ questions, onGenerate }) => {
  const [config, setConfig] = useState<ExamConfig>({
    title: 'ĐỀ KIỂM TRA ĐỊNH KỲ',
    schoolName: 'TRƯỜNG THCS GIÁO DỤC HIỆN ĐẠI',
    className: '6A1',
    timeMinutes: 45,
    grade: '6',
    topic: 'Số học',
    numQuestions: 10,
    mcRatio: 70 // 70% MC, 30% Essay
  });

  const generate = () => {
    // 1. Filter relevant questions
    let pool = questions.filter(q => q.grade === config.grade);
    
    // Attempt to match topic if selected
    if (config.topic !== 'Tất cả') {
        const topicPool = pool.filter(q => q.topic === config.topic);
        if (topicPool.length > 0) pool = topicPool;
    }

    if (pool.length < config.numQuestions) {
      alert(`Ngân hàng chỉ có ${pool.length} câu hỏi phù hợp. Hãy thêm câu hỏi hoặc giảm số lượng yêu cầu.`);
      return;
    }

    // 2. Determine counts
    const mcTarget = Math.round((config.numQuestions * config.mcRatio) / 100);
    const essayTarget = config.numQuestions - mcTarget;

    const mcPool = pool.filter(q => q.type === 'Trắc nghiệm');
    const essayPool = pool.filter(q => q.type === 'Tự luận');

    if (mcPool.length < mcTarget || essayPool.length < essayTarget) {
      alert('Không đủ câu hỏi theo tỉ lệ Trắc nghiệm/Tự luận đã chọn.');
      return;
    }

    // 3. Random Shuffle & Selection
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
    
    const selectedMC = shuffle(mcPool).slice(0, mcTarget);
    const selectedEssay = shuffle(essayPool).slice(0, essayTarget);

    const finalQuestions = [...selectedMC, ...selectedEssay];

    onGenerate({
      config,
      questions: finalQuestions,
      date: new Date().toLocaleDateString('vi-VN')
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold">Trình tạo đề thi thông minh</h2>
        <p className="text-indigo-100">Thiết lập tham số để hệ thống tự động bốc thăm câu hỏi</p>
      </div>
      
      <div className="p-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Thông tin chung</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề đề thi</label>
              <input 
                type="text" 
                className="w-full border-gray-300 rounded-lg"
                value={config.title}
                onChange={e => setConfig({...config, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên trường</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-lg"
                  value={config.schoolName}
                  onChange={e => setConfig({...config, schoolName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-lg"
                  value={config.className}
                  onChange={e => setConfig({...config, className: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Cấu trúc đề</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dành cho khối</label>
                <select 
                  className="w-full border-gray-300 rounded-lg"
                  value={config.grade}
                  onChange={e => setConfig({...config, grade: e.target.value as Grade})}
                >
                  {GRADES.map(g => <option key={g} value={g}>Lớp {g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề chính</label>
                <select 
                  className="w-full border-gray-300 rounded-lg"
                  value={config.topic}
                  onChange={e => setConfig({...config, topic: e.target.value})}
                >
                  <option value="Tất cả">Tất cả</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
                <input 
                  type="number" 
                  className="w-full border-gray-300 rounded-lg"
                  value={config.timeMinutes}
                  onChange={e => setConfig({...config, timeMinutes: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số câu tổng cộng</label>
                <input 
                  type="number" 
                  className="w-full border-gray-300 rounded-lg"
                  value={config.numQuestions}
                  onChange={e => setConfig({...config, numQuestions: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold text-gray-700">Tỉ lệ Trắc nghiệm / Tự luận</h3>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold">
              {config.mcRatio}% - {100 - config.mcRatio}%
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="10"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={config.mcRatio}
            onChange={e => setConfig({...config, mcRatio: parseInt(e.target.value)})}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Hoàn toàn Tự luận</span>
            <span>Cân bằng</span>
            <span>Hoàn toàn Trắc nghiệm</span>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <button 
            onClick={generate}
            className="bg-indigo-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
          >
            Sinh Đề Kiểm Tra Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamGenerator;
