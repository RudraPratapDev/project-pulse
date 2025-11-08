import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    deadline: '',
    priority: 4
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        deadline: task.deadline || '',
        priority: task.priority || 4
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() === '') {
      alert('Title is required');
      return;
    }

    onSave(formData, task?.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value
    }));
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              aria-label="Close panel"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter task title"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                placeholder="Add more details about this task..."
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value={1}>🔴 Critical - Urgent & Important</option>
                <option value={2}>🟠 High - Important</option>
                <option value={3}>🟡 Medium - Normal Priority</option>
                <option value={4}>🟢 Low - When Time Permits</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Status (only show when editing) */}
            {task && (
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="pending">📋 To Do</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  💡 Tip: You can also drag tasks between columns to change status
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;
