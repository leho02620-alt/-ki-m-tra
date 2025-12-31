
import React, { useState } from 'react';
import { Question, Grade, Level, QuestionType, AiModel } from '../types';
import { GRADES, LEVELS, TOPICS } from '../constants';
import { generateQuestionWithAI } from '../services/geminiService';

interface BankManagerProps {
  questions: Question[];
  onSave: (questions: Question[]) => void;
  apiKey: string;
  preferredModel: AiModel;
}

const BankManager: React.FC<BankManagerProps> = ({ questions, onSave, apiKey, preferredModel }) => {
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state for new question
  const [newQ, setNewQ] = useState<Partial<Question>>({
    grade: '6',
    level: 'Nhận biết',
    type: 'Trắc nghiệm',
    topic: 'Số học',
    content: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });

  const filteredQuestions = questions.filter(q => {
    const matchGrade = filterGrade === 'all' || q.grade === filterGrade;
    const matchSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSearch;
  });

  const handleAdd = () => {
    if (!newQ.content || !newQ.correctAnswer) return alert('Vui lòng điền đủ nội dung và đáp án!');
    const question: Question = {
      ...newQ as Question,
      id: Math.random().toString(36).substring(2, 11)
    };
    onSave([question, ...questions]);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      onSave(questions.filter(q => q.id !== id));
    }
  };

  const handleAIAction = async () => {
    if (!apiKey) {
      alert('Vui lòng thiết lập API Key trước!');
      return;
    }
    setIsAIGenerating(true);
    setErrorMessage('');
    try {
      const result = await generateQuestionWithAI(
        apiKey,
        preferredModel,
        newQ.grade as Grade,
        newQ.topic || 'Đại số',
        newQ.level as Level,
        newQ.type as QuestionType
      );
      setNewQ({
        ...newQ,
        content: result.content,
        options: result.options || ['', '', '', ''],
        correctAnswer: result.correctAnswer,
        explanation: result.explanation
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Lỗi không xác định');
    } finally {
      setIsAIGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Ngân hàng Câu hỏi ({questions.length})</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Thêm Câu hỏi mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="Tìm kiếm nội dung..." 
            className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="border-gray-300 rounded-lg px-3 py-2"
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
        >
          <option value="all">Tất cả lớp</option>
          {GRADES.map(g => <option key={g} value={g}>Lớp {g}</option>)}
        </select>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-200 relative overflow-hidden">
          {isAIGenerating && (
             <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-indigo-700 font-bold animate-pulse">AI đang soạn câu hỏi...</p>
             </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Soạn câu hỏi mới</h3>
            <button 
              onClick={handleAIAction}
              disabled={isAIGenerating}
              className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              🪄 Tự động tạo bằng AI
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <div>
                <p className="font-bold">Đã dừng do lỗi</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Lớp</label>
              <select className="w-full border-gray-300 rounded-lg py-2" value={newQ.grade} onChange={e => setNewQ({...newQ, grade: e.target.value as Grade})}>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Cấp độ</label>
              <select className="w-full border-gray-300 rounded-lg py-2" value={newQ.level} onChange={e => setNewQ({...newQ, level: e.target.value as Level})}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Chủ đề</label>
              <select className="w-full border-gray-300 rounded-lg py-2" value={newQ.topic} onChange={e => setNewQ({...newQ, topic: e.target.value})}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Dạng</label>
              <select className="w-full border-gray-300 rounded-lg py-2" value={newQ.type} onChange={e => setNewQ({...newQ, type: e.target.value as QuestionType})}>
                <option value="Trắc nghiệm">Trắc nghiệm</option>
                <option value="Tự luận">Tự luận</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <textarea 
              placeholder="Nội dung câu hỏi (có thể dùng Markdown/LaTeX)..." 
              className="w-full border-gray-300 rounded-lg p-3 min-h-[100px]"
              value={newQ.content}
              onChange={e => setNewQ({...newQ, content: e.target.value})}
            />

            {newQ.type === 'Trắc nghiệm' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newQ.options?.map((opt, idx) => (
                  <input 
                    key={idx}
                    placeholder={`Phương án ${String.fromCharCode(65 + idx)}...`}
                    className="border-gray-300 rounded-lg p-2"
                    value={opt}
                    onChange={e => {
                      const opts = [...(newQ.options || [])];
                      opts[idx] = e.target.value;
                      setNewQ({...newQ, options: opts});
                    }}
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Đáp án đúng (ví dụ: A hoặc 15m/s)..."
                className="border-gray-300 rounded-lg p-2"
                value={newQ.correctAnswer}
                onChange={e => setNewQ({...newQ, correctAnswer: e.target.value})}
              />
              <input 
                placeholder="Lời giải ngắn gọn..."
                className="border-gray-300 rounded-lg p-2"
                value={newQ.explanation}
                onChange={e => setNewQ({...newQ, explanation: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600">Hủy</button>
              <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Lưu câu hỏi</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredQuestions.map(q => (
          <div key={q.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 group hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 mb-3">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">Lớp {q.grade}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600">{q.level}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-green-50 text-green-600">{q.type}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">{q.topic}</span>
              </div>
              <button 
                onClick={() => handleDelete(q.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
            <p className="font-medium text-gray-800 mb-2 whitespace-pre-line">{q.content}</p>
            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {q.options.map((opt, i) => (
                  <div key={i} className={`text-sm p-2 rounded border ${q.correctAnswer === String.fromCharCode(65+i) ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                    <span className="font-bold mr-2">{String.fromCharCode(65+i)}.</span> {opt.replace(/^[A-D]\.\s?/, '')}
                  </div>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
              <span className="font-bold text-indigo-700 not-italic block mb-1">Đáp án: {q.correctAnswer}</span>
              <span className="block">{q.explanation}</span>
            </div>
          </div>
        ))}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
            Không tìm thấy câu hỏi nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
};

export default BankManager;
