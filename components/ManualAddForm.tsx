import React, { useState } from 'react';
import { CountdownEvent } from '../types.ts';

interface ManualAddFormProps {
  onAdd: (event: CountdownEvent) => void;
  onClose: () => void;
}

const ManualAddForm: React.FC<ManualAddFormProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.title) return;

    // Combine date and time into a single ISO string
    const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

    const newEvent: CountdownEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      time: combinedDateTime,
      description: formData.description
    };

    onAdd(newEvent);
    onClose();
  };

  const inputClasses = "w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-black placeholder-black focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">নতুন ইভেন্ট যোগ করুন</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ইভেন্ট শিরোনাম (Title)</label>
            <input
              required
              type="text"
              placeholder="যেমন: পরীক্ষার শেষ তারিখ"
              className={inputClasses}
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">তারিখ (Date)</label>
              <input
                required
                type="date"
                className={inputClasses}
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">সময় (Time)</label>
              <input
                required
                type="time"
                className={inputClasses}
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">বিবরণ (Description)</label>
            <textarea
              placeholder="সংক্ষিপ্ত বর্ণনা..."
              className={`${inputClasses} h-24 resize-none`}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            ইভেন্ট সেভ করুন
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualAddForm;
