
import React from 'react';

interface SidebarProps {
  activeTab: 'bank' | 'generate' | 'preview';
  onTabChange: (tab: 'bank' | 'generate' | 'preview') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 hidden md:flex flex-col no-print">
      <div className="p-6 border-b border-indigo-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-indigo-900 rounded-lg w-8 h-8 flex items-center justify-center">M</span>
          MathGenius
        </h1>
        <p className="text-indigo-300 text-xs mt-1">THCS Grade 6-9</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onTabChange('generate')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'generate' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          Tạo Đề Mới
        </button>
        
        <button
          onClick={() => onTabChange('bank')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'bank' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Ngân hàng Câu hỏi
        </button>

        <button
          onClick={() => onTabChange('preview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Xem & In Đề
        </button>
      </nav>
      
      <div className="p-4 border-t border-indigo-800">
        <div className="bg-indigo-800 rounded-lg p-3 text-xs text-indigo-300">
          <p>Phiên bản 1.0.0</p>
          <p>Hỗ trợ đầy đủ LaTeX & PDF</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
