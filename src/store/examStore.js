import { create } from 'zustand';

const useExamStore = create((set) => ({
  exams: [],
  
  addExam: (exam) => set((state) => ({
    exams: [...state.exams, { ...exam, id: Date.now().toString() }]
  })),
  
  updateExam: (id, updatedExam) => set((state) => ({
    exams: state.exams.map((exam) => 
      exam.id === id ? { ...updatedExam, id } : exam
    )
  })),
  
  deleteExam: (id) => set((state) => ({
    exams: state.exams.filter((exam) => exam.id !== id)
  })),
}));

export default useExamStore;