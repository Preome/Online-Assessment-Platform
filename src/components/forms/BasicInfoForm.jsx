import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function BasicInfoForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    totalCandidates: initialData.totalCandidates || '',
    totalSlots: initialData.totalSlots || '',
    questionSets: initialData.questionSets || '',
    questionType: initialData.questionType || 'MCQ',
    startTime: initialData.startTime || '',
    endTime: initialData.endTime || '',
    duration: initialData.duration || '',
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.totalCandidates) newErrors.totalCandidates = 'Total candidates is required';
    if (!formData.totalSlots) newErrors.totalSlots = 'Total slots is required';
    if (!formData.questionSets) newErrors.questionSets = 'Question sets is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Online Test Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter online test title"
        required
        error={errors.title}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Total Candidates"
          name="totalCandidates"
          type="number"
          value={formData.totalCandidates}
          onChange={handleChange}
          placeholder="Total candidates"
          required
          error={errors.totalCandidates}
        />
        
        <Input
          label="Total Slots"
          name="totalSlots"
          type="number"
          value={formData.totalSlots}
          onChange={handleChange}
          placeholder="Total slots"
          required
          error={errors.totalSlots}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Question Sets"
          name="questionSets"
          type="number"
          value={formData.questionSets}
          onChange={handleChange}
          placeholder="Question sets"
          required
          error={errors.questionSets}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Type
          </label>
          <select
            name="questionType"
            value={formData.questionType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MCQ">MCQ</option>
            <option value="Mixed">Mixed</option>
            <option value="Descriptive">Descriptive</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={handleChange}
          required
          error={errors.startTime}
        />
        
        <Input
          label="End Time"
          name="endTime"
          type="datetime-local"
          value={formData.endTime}
          onChange={handleChange}
          required
          error={errors.endTime}
        />
      </div>
      
      <Input
        label="Duration (Minutes)"
        name="duration"
        type="number"
        value={formData.duration}
        onChange={handleChange}
        placeholder="Duration"
        required
        error={errors.duration}
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" variant="primary">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}