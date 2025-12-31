
import React, { useState } from 'react';
import { GeneratedExam } from '../types';

interface ExamPaperProps {
  exam: GeneratedExam;
}

const ExamPaper: React.FC<ExamPaperProps> = ({ exam }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const mcQuestions = exam.questions.filter(q => q.type === 'Trắc nghiệm');
  const essayQuestions = exam.questions.filter(q => q.type === 'Tự luận');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold">Bản xem trước Đề thi</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${showAnswers ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-white text-gray-700 border border-gray-300'}`}
          >
            {showAnswers ? 'Ẩn đáp án' : 'Hiện đáp án & lời giải'}
          </button>
          <button 
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-bold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Tải PDF / In Đề
          </button>
        </div>
      </div>

      {/* Main Exam Paper UI */}
      <div className="bg-white p-12 shadow-xl border border-gray-200 min-h-[1100px] text-[14pt] leading-relaxed max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-8">
          <div className="text-center space-y-1">
            <p className="font-bold text-sm uppercase">{exam.config.schoolName}</p>
            <p className="text-xs">LỚP: {exam.config.className}</p>
          </div>
          <div className="text-center space-y-1">
            <h1 className="font-bold text-lg uppercase">{exam.config.title}</h1>
            <p className="text-sm">Năm học: 2024 - 2025</p>
            <p className="text-sm">Môn: Toán - Khối {exam.config.grade}</p>
            <p className="text-sm">Thời gian: {exam.config.timeMinutes} phút</p>
          </div>
        </div>

        <div className="mb-8 p-4 border border-black grid grid-cols-2 gap-4 text-sm">
          <div>Họ và tên: ................................................................</div>
          <div>Số báo danh: .................................</div>
        </div>

        {/* Part 1: MC */}
        {mcQuestions.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold mb-4 uppercase">PHẦN I. TRẮC NGHIỆM ({mcQuestions.length} câu)</h3>
            <div className="space-y-6">
              {mcQuestions.map((q, idx) => (
                <div key={q.id}>
                  <p className="font-medium mb-2">Câu {idx + 1}. {q.content}</p>
                  <div className="grid grid-cols-2 gap-y-2">
                    {q.options?.map((opt, i) => (
                      <div key={i} className="pl-4">
                        {opt}
                      </div>
                    ))}
                  </div>
                  {(showAnswers || window.matchMedia('print').matches === false) && showAnswers && (
                    <div className="mt-2 text-blue-600 text-sm font-bold bg-blue-50 p-2 rounded no-print">
                      Đáp án: {q.correctAnswer} — {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Part 2: Essay */}
        {essayQuestions.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold mb-4 uppercase">PHẦN II. TỰ LUẬN ({essayQuestions.length} câu)</h3>
            <div className="space-y-12">
              {essayQuestions.map((q, idx) => (
                <div key={q.id}>
                  <p className="font-medium mb-4">Câu {mcQuestions.length + idx + 1}. {q.content}</p>
                  <div className="h-24 border-b border-gray-100 border-dashed no-print"></div>
                  {(showAnswers || window.matchMedia('print').matches === false) && showAnswers && (
                    <div className="mt-2 text-green-600 text-sm font-bold bg-green-50 p-2 rounded no-print">
                      Kết quả: {q.correctAnswer} — {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-sm font-bold italic">
          --- HẾT ---
          <p className="mt-2 font-normal">(Giám thị không giải thích gì thêm)</p>
        </div>

        {/* Answer Key Page (Optional on Print) */}
        {showAnswers && (
          <div className="page-break mt-20 pt-10 border-t-2 border-black border-dashed">
            <h2 className="text-center font-bold text-xl uppercase mb-8">ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM</h2>
            <div className="space-y-6">
              <h3 className="font-bold underline">1. Phần Trắc nghiệm:</h3>
              <table className="w-full border-collapse border border-black text-center mb-8">
                <thead>
                  <tr>
                    {mcQuestions.map((_, i) => (
                      <th key={i} className="border border-black p-2">Câu {i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {mcQuestions.map((q, i) => (
                      <td key={i} className="border border-black p-2 font-bold">{q.correctAnswer}</td>
                    ))}
                  </tr>
                </tbody>
              </table>

              <h3 className="font-bold underline">2. Phần Tự luận:</h3>
              <div className="space-y-4">
                {essayQuestions.map((q, i) => (
                  <div key={q.id} className="border-b border-gray-200 pb-4">
                    <p className="font-bold">Câu {mcQuestions.length + i + 1}:</p>
                    <p className="whitespace-pre-line">{q.explanation}</p>
                    <p className="font-bold mt-2">Đáp số: {q.correctAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPaper;
