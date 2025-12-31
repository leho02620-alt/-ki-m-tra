
import { Question, Grade, Level, QuestionType } from './types';

export const GRADES: Grade[] = ['6', '7', '8', '9'];
export const LEVELS: Level[] = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];
export const TOPICS = [
  'Số học', 'Đại số', 'Hình học', 'Thống kê', 'Xác suất', 'Phương trình'
];

// Helper to generate IDs
const uid = () => Math.random().toString(36).substring(2, 11);

export const INITIAL_QUESTIONS: Question[] = [];

// Logic to generate 120 sample questions (mocked for brevity in code, but structured for real use)
const grades: Grade[] = ['6', '7', '8', '9'];
const levels: Level[] = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];

grades.forEach(grade => {
  levels.forEach(level => {
    // Add 2 MC and 2 Essay per level per grade = 4 * 4 * 4 = 64 questions at least
    // In a real app, these would be rich content. Here we seed patterns.
    
    // MC 1
    INITIAL_QUESTIONS.push({
      id: uid(),
      grade,
      level,
      topic: grade === '6' || grade === '7' ? 'Số học' : 'Đại số',
      type: 'Trắc nghiệm',
      content: `Câu hỏi trắc nghiệm Toán lớp ${grade} - Mức độ ${level}: Tính giá trị biểu thức cơ bản.`,
      options: ['A. 10', 'B. 15', 'C. 20', 'D. 25'],
      correctAnswer: 'A',
      explanation: 'Lời giải chi tiết: Áp dụng quy tắc cộng trừ nhân chia.'
    });

    // MC 2
    INITIAL_QUESTIONS.push({
      id: uid(),
      grade,
      level,
      topic: 'Hình học',
      type: 'Trắc nghiệm',
      content: `Câu hỏi trắc nghiệm Hình học lớp ${grade} - Mức độ ${level}: Nhận biết các hình cơ bản.`,
      options: ['A. Hình vuông', 'B. Hình chữ nhật', 'C. Hình thoi', 'D. Hình tròn'],
      correctAnswer: 'B',
      explanation: 'Lời giải: Dựa vào định nghĩa các hình học phẳng.'
    });

    // Essay 1
    INITIAL_QUESTIONS.push({
      id: uid(),
      grade,
      level,
      topic: 'Đại số',
      type: 'Tự luận',
      content: `Bài toán tự luận lớp ${grade} - Mức độ ${level}: Tìm x trong biểu thức chứa biến.`,
      correctAnswer: 'x = 5',
      explanation: 'Lời giải chi tiết: Chuyển vế đổi dấu và rút gọn biểu thức.'
    });

    // Essay 2
    INITIAL_QUESTIONS.push({
      id: uid(),
      grade,
      level,
      topic: 'Thống kê',
      type: 'Tự luận',
      content: `Bài tập thống kê lớp ${grade} - Mức độ ${level}: Tính số trung bình cộng của bảng số liệu.`,
      correctAnswer: '12.5',
      explanation: 'Lời giải: Tổng các giá trị chia cho số lượng các giá trị.'
    });
  });
});

// Fill up to 120 with variations
while (INITIAL_QUESTIONS.length < 120) {
    const base = INITIAL_QUESTIONS[Math.floor(Math.random() * INITIAL_QUESTIONS.length)];
    INITIAL_QUESTIONS.push({
        ...base,
        id: uid(),
        content: base.content + " (Biến thể " + INITIAL_QUESTIONS.length + ")"
    });
}
