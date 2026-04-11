"use client";

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Dynamically import ReactQuill on the client to avoid server-side `document` errors
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function QuestionForm({ onSubmit, onCancel, initialData = null }) {
  // Using ReactQuill editors for title and options for reliable RTL + formatting

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

  const quillModules = { toolbar: [['bold','italic'], [{ 'align': [] }]] };
  const quillFormats = ['bold','italic','align','direction'];

  const titleQuillRef = useRef(null);
  const optionQuillRefs = useRef({});

  // Ensure Quill editor roots are set to RTL and right-aligned so caret behaves correctly
  useEffect(() => {
    const setRtlOnQuill = (quillRef) => {
      try {
        let root = null;
        if (quillRef && typeof quillRef.getEditor === 'function') {
          root = quillRef.getEditor().root;
        } else if (quillRef && quillRef.editor && quillRef.editor.root) {
          root = quillRef.editor.root;
        }
        if (root) {
          root.setAttribute('dir', 'rtl');
          root.style.direction = 'rtl';
          root.style.textAlign = 'right';
          root.style.unicodeBidi = 'isolate-override';
        }
      } catch (e) {
        // noop
      }
    };

    setRtlOnQuill(titleQuillRef.current);
    Object.values(optionQuillRefs.current || {}).forEach(setRtlOnQuill);
  }, [question.options.length]);

  // Normalize punctuation so sentence-ending marks stay on the RTL side.
  // Appends a Right-to-Left Mark (U+200F) after common punctuation if not present.
  const normalizePunctuation = (html) => {
    if (!html) return html;
    try {
      return html.replace(/([?!:;,\.])(?!(\u200F))/g, '$1\u200F');
    } catch (e) {
      return html;
    }
  };

  // Walk text nodes inside a root DOM node and append RLM after punctuation.
  const addRLMToTextNodes = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((textNode) => {
      try {
        // replace only if punctuation not already followed by RLM
        textNode.nodeValue = textNode.nodeValue.replace(/([?!:;,\.])(?!(\u200F))/g, '$1\u200F');
      } catch (e) {
        // ignore
      }
    });
  };

  // Ensure Quill editor's DOM contains RLM marks where needed
  const ensureRLMInQuill = (quillRef) => {
    try {
      if (!quillRef) return;
      const editor = typeof quillRef.getEditor === 'function' ? quillRef.getEditor() : (quillRef.editor || null);
      const root = editor && editor.root ? editor.root : null;
      if (root) addRLMToTextNodes(root);
    } catch (e) {
      // noop
    }
  };

  useEffect(() => {
    // load Quill styles on client only
    import('react-quill/dist/quill.snow.css').catch(() => {});
  }, []);
  
  const handleAddOption = () => {
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, createOption('')]
    }));
  };
  
  const handleRemoveOption = (index) => {
    setQuestion(prev => {
      const removedId = prev.options[index]?.id;
      const newOptions = prev.options.filter((_, i) => i !== index);
      const newCorrect = prev.correctAnswers.filter(id => removedId !== id);
      // cleanup quill ref
      if (removedId && optionQuillRefs.current) delete optionQuillRefs.current[removedId];
      return { ...prev, options: newOptions, correctAnswers: newCorrect };
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // ensure title has non-empty text
    const strip = (html) => (html || '').replace(/<[^>]*>/g, '').trim();
    const titleHtml = question.title || '';
    if (strip(titleHtml)) {
      // first, make sure editor DOMs have RLM inserted so punctuation lands correctly
      ensureRLMInQuill(titleQuillRef.current);
      Object.values(optionQuillRefs.current || {}).forEach(ensureRLMInQuill);

      const payload = {
        ...question,
        title: normalizePunctuation(titleQuillRef.current ? (titleQuillRef.current.getEditor ? titleQuillRef.current.getEditor().root.innerHTML : question.title) : titleHtml),
        options: question.options.map(o => ({ ...o, content: normalizePunctuation((optionQuillRefs.current[o.id] && optionQuillRefs.current[o.id].getEditor) ? optionQuillRefs.current[o.id].getEditor().root.innerHTML : o.content) }))
      };
      onSubmit(payload, false);
    }
  };

  const handleSaveAddMore = () => {
    const strip = (html) => (html || '').replace(/<[^>]*>/g, '').trim();
    if (strip(question.title)) {
      ensureRLMInQuill(titleQuillRef.current);
      Object.values(optionQuillRefs.current || {}).forEach(ensureRLMInQuill);

      const payload = {
        ...question,
        title: normalizePunctuation(titleQuillRef.current ? (titleQuillRef.current.getEditor ? titleQuillRef.current.getEditor().root.innerHTML : question.title) : question.title),
        options: question.options.map(o => ({ ...o, content: normalizePunctuation((optionQuillRefs.current[o.id] && optionQuillRefs.current[o.id].getEditor) ? optionQuillRefs.current[o.id].getEditor().root.innerHTML : o.content) }))
      };
      onSubmit(payload, true);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <div dir="rtl" className="rtl-isolate">
            <ReactQuill
              ref={(el) => { titleQuillRef.current = el; }}
              value={question.title}
              onChange={(val) => setQuestion(prev => ({ ...prev, title: val }))}
              theme="snow"
              modules={quillModules}
              formats={quillFormats}
              placeholder="Enter your question"
            />
          </div>
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
                      {/* toolbar provided inside each editor */}
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
                    <div className="flex-1 border border-gray-300 rounded-lg min-h-[44px]">
                      <div dir="rtl" className="rtl-isolate">
                        <ReactQuill
                          ref={(el) => { optionQuillRefs.current[option.id] = el; }}
                          value={option.content}
                          onChange={(val) => handleOptionChange(index, val)}
                          theme="snow"
                          modules={quillModules}
                          formats={quillFormats}
                        />
                      </div>
                    </div>
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