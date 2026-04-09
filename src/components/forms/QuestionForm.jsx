import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function QuestionForm({ onSubmit, onCancel, initialData = null }) {
  const [question, setQuestion] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'radio',
    score: initialData?.score || 1,
    options: initialData?.options || ['', ''],
    correctAnswers: initialData?.correctAnswers || [],
  });
  
  const handleAddOption = () => {
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };
  
  const handleRemoveOption = (index) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion(prev => ({ ...prev, options: newOptions }));
  };
  
  const handleCorrectAnswerChange = (value) => {
    if (question.type === 'radio') {
      setQuestion(prev => ({ ...prev, correctAnswers: [value] }));
    } else {
      const newCorrectAnswers = question.correctAnswers.includes(value)
        ? question.correctAnswers.filter(v => v !== value)
        : [...question.correctAnswers, value];
      setQuestion(prev => ({ ...prev, correctAnswers: newCorrectAnswers }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.title.trim()) {
      onSubmit(question);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Question Title"
        value={question.title}
        onChange={(e) => setQuestion(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Enter your question"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Type
          </label>
          <select
            value={question.type}
            onChange={(e) => setQuestion(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="radio">Radio (Single Select)</option>
            <option value="checkbox">Checkbox (Multi Select)</option>
            <option value="text">Text (Descriptive)</option>
          </select>
        </div>
        
        <Input
          label="Score"
          type="number"
          value={question.score}
          onChange={(e) => setQuestion(prev => ({ ...prev, score: parseInt(e.target.value) }))}
          placeholder="Points"
        />
      </div>
      
      {(question.type === 'radio' || question.type === 'checkbox') && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Options</label>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type={question.type === 'radio' ? 'radio' : 'checkbox'}
                name="correctAnswer"
                checked={question.correctAnswers.includes(option)}
                onChange={() => handleCorrectAnswerChange(option)}
                className="w-4 h-4"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              {question.options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddOption}>
            + Add Option
          </Button>
        </div>
      )}
      
      {question.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Answer (Optional)
          </label>
          <textarea
            value={question.correctAnswers[0] || ''}
            onChange={(e) => setQuestion(prev => ({ ...prev, correctAnswers: [e.target.value] }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Expected answer or guidelines..."
          />
        </div>
      )}
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Update Question' : 'Add Question'}
        </Button>
      </div>
    </form>
  );
}