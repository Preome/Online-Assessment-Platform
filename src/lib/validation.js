export const validateBasicInfo = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  if (!data.totalCandidates || data.totalCandidates < 1) {
    errors.totalCandidates = 'Total candidates must be at least 1';
  }
  
  if (!data.totalSlots || data.totalSlots < 1) {
    errors.totalSlots = 'Total slots must be at least 1';
  }
  
  if (!data.questionSets || data.questionSets < 1) {
    errors.questionSets = 'Question sets must be at least 1';
  }
  
  if (!data.duration || data.duration < 1) {
    errors.duration = 'Duration must be at least 1 minute';
  }
  
  if (!data.startTime) {
    errors.startTime = 'Start time is required';
  }
  
  if (!data.endTime) {
    errors.endTime = 'End time is required';
  }
  
  return errors;
};

export const validateQuestion = (question) => {
  const errors = {};
  
  if (!question.title || question.title.trim() === '') {
    errors.title = 'Question title is required';
  }
  
  if (!question.score || question.score < 1) {
    errors.score = 'Score must be at least 1';
  }
  
  if ((question.type === 'radio' || question.type === 'checkbox') && 
      (!question.options || question.options.length < 2)) {
    errors.options = 'At least 2 options are required';
  }
  
  return errors;
};