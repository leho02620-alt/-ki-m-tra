
import React, { useState, useEffect } from 'react';
import { Question, ExamConfig, GeneratedExam, AiModel } from './types';
import { INITIAL_QUESTIONS } from './constants';
import Sidebar from './components/Sidebar';
import BankManager from './components/BankManager';
import ExamGenerator from './components/ExamGenerator';
import ExamPaper from './components/ExamPaper';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bank' | 'generate' | 'preview'>('generate');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentExam, setCurrentExam] = useState<GeneratedExam | null>(null);
  
  // API Key & Model State
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [preferredModel, setPreferredModel] = useState<AiModel>(
    (localStorage.getItem('gemini_preferred_model') as AiModel) || 'gemini-3-flash-preview'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem('math_questions');
    if (saved) {
      setQuestions(JSON.parse(saved));
    } else {
      setQuestions(INITIAL_QUESTIONS);
      localStorage.setItem('math_questions', JSON.stringify(INITIAL_QUESTIONS));
    }
  }, []);

  const saveQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem('math_questions', JSON.stringify(newQuestions));
  };

  const handleGenerate = (exam: GeneratedExam) => {
    setCurrentExam(exam);
    setActiveTab('preview');
  };

  const saveSettings = (key: string, model: AiModel) => {
    setApiKey(key);
    setPreferredModel(model);
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('gemini_preferred_model', model);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center no-print shrink-0">
          <div>
             <h2 className="text-xl font-bold text-gray-900 hidden md:block">
               {activeTab === 'bank' && "Ngân hàng Câu hỏi"}
               {activeTab === 'generate' && "Tạo Đề Kiểm Tra"}
               {activeTab === 'preview' && "Xem trước Đề thi"}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            {!apiKey && (
              <div className="hidden lg:flex items-center gap-2 text-red-500 animate-pulse text-sm font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Lấy API key để sử dụng app
              </div>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium border border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Cài đặt AI
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto pb-12">
            {activeTab === 'bank' && (
              <BankManager 
                questions={questions} 
                onSave={saveQuestions}
                apiKey={apiKey}
                preferredModel={preferredModel}
              />
            )}
            
            {activeTab === 'generate' && (
              <ExamGenerator 
                questions={questions} 
                onGenerate={handleGenerate} 
              />
            )}
            
            {activeTab === 'preview' && currentExam && (
              <ExamPaper exam={currentExam} />
            )}

            {activeTab === 'preview' && !currentExam && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <p className="text-gray-500 font-medium">Chưa có đề thi nào được sinh ra.</p>
                <button 
                  onClick={() => setActiveTab('generate')}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Tạo đề ngay
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <ApiKeyModal 
        isOpen={isModalOpen || (!apiKey && activeTab === 'bank')}
        forceInput={!apiKey && activeTab === 'bank'}
        currentKey={apiKey}
        currentModel={preferredModel}
        onSave={saveSettings}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;
