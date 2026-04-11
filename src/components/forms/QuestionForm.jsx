import { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function QuestionForm({ onSubmit, onCancel, initialData = null }) {
  const titleRef = useRef(null);
  const activeEditable = useRef(null);

  const createOption = (content = '') => ({ id: `opt-${Math.random().toString(36).slice(2,9)}`, content });

  const [question, setQuestion] = useState(() => {
    const rawOptions = initialData?.options || ['', ''];
    const options = rawOptions.map((opt, i) => (typeof opt === 'string' ? createOption(opt) : opt));
    // normalize correct answers to option ids when possible
    let correctIds = [];
    if (initialData?.correctAnswers) {
      if (initialData.correctAnswers.length && typeof initialData.correctAnswers[0] === 'string') {
        // match by content
        correctIds = options.map(o => initialData.correctAnswers.includes(o.content) ? o.id : null).filter(Boolean);
      } else {
        correctIds = initialData.correctAnswers;
      }
    }
    return {
      title: initialData?.title || '',
      type: initialData?.type || 'radio',
      score: initialData?.score || 1,
      options,
      correctAnswers: correctIds,
    };
  });

  useEffect(() => {
    if (titleRef.current && question.title) {
      titleRef.current.innerHTML = question.title;
    }
  }, []);
  
  const handleAddOption = () => {
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, createOption('')]
    }));
  };
  
  const handleRemoveOption = (index) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correctAnswers: prev.correctAnswers.filter(id => prev.options[index]?.id !== id)
    }));
  };
  
  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], content: value };
    setQuestion(prev => ({ ...prev, options: newOptions }));
  };
  
  const handleCorrectAnswerChange = (optionId) => {
    if (question.type === 'radio') {
      setQuestion(prev => ({ ...prev, correctAnswers: [optionId] }));
    } else {
      const newCorrectAnswers = question.correctAnswers.includes(optionId)
        ? question.correctAnswers.filter(v => v !== optionId)
        : [...question.correctAnswers, optionId];
      setQuestion(prev => ({ ...prev, correctAnswers: newCorrectAnswers }));
    }
  };

  const execCommand = (cmd, value = null) => {
    try {
      document.execCommand(cmd, false, value);
      // keep focus on active editable
      activeEditable.current?.focus();
    } catch (e) {
      // noop
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // ensure title is synced
    const titleHtml = titleRef.current?.innerHTML || question.title || '';
    if (titleHtml.replace(/<[^>]*>/g, '').trim()) {
      onSubmit({ ...question, title: titleHtml }, false);
    }
  };

  const handleSaveAddMore = () => {
    if (question.title.trim()) {
      onSubmit(question, true);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <button type="button" className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => execCommand('formatBlock', '<p>')}>Normal</button>
            <button type="button" className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold" onClick={() => execCommand('bold')}>B</button>
            <button type="button" className="px-2 py-1 bg-gray-100 rounded text-xs italic" onClick={() => execCommand('italic')}>I</button>
          </div>
          <div
            ref={titleRef}
            contentEditable
            onInput={() => setQuestion(prev => ({ ...prev, title: titleRef.current?.innerHTML || '' }))}
            onFocus={(e) => (activeEditable.current = e.currentTarget)}
            className="min-h-[80px] p-2 outline-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: question.title }}
          />
        </div>
      </div>
      
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
            <div key={option.id} className="border rounded-md p-3 bg-white">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-sm font-semibold text-gray-700">{String.fromCharCode(65 + index)}</div>
                <div className="flex-1">
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <button type="button" className="px-2 py-1 bg-gray-100 rounded" onClick={() => { activeEditable.current = document.getElementById(option.id); execCommand('formatBlock','<p>'); }}>Normal text</button>
                      <button type="button" className="px-2 py-1 bg-gray-100 rounded font-semibold" onClick={() => { activeEditable.current = document.getElementById(option.id); execCommand('bold'); }}>B</button>
                      <button type="button" className="px-2 py-1 bg-gray-100 rounded italic" onClick={() => { activeEditable.current = document.getElementById(option.id); execCommand('italic'); }}>I</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type={question.type === 'radio' ? 'radio' : 'checkbox'}
                      name={`correctAnswer`}
                      checked={question.correctAnswers.includes(option.id)}
                      onChange={() => handleCorrectAnswerChange(option.id)}
                      className="w-4 h-4 mt-1"
                    />
                    <div
                      id={option.id}
                      contentEditable
                      onInput={() => handleOptionChange(index, document.getElementById(option.id)?.innerHTML || '')}
                      onFocus={(e) => (activeEditable.current = e.currentTarget)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg min-h-[44px]"
                      dangerouslySetInnerHTML={{ __html: option.content }}
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Set as correct answer</div>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddOption}>
            + Another options
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
        <Button type="submit" variant="outline">
          Save
        </Button>
        <Button type="button" variant="primary" onClick={handleSaveAddMore}>
          Save & Add More
        </Button>
      </div>
    </form>
  );
}