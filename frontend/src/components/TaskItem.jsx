import React from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TaskItem = ({ task, onDelete, onEdit, onToggleStatus }) => {
  const isCompleted = task.status === 'completed';
  
  // Check if task is overdue
  const isOverdue = task.deadline && task.status === 'pending' && 
    new Date(task.deadline) < new Date(new Date().toISOString().split('T')[0]);

  // Priority configuration
  const priorityConfig = {
    1: { label: 'Critical', color: 'bg-red-100 text-red-800', icon: '🔴' },
    2: { label: 'High', color: 'bg-orange-100 text-orange-800', icon: '🟠' },
    3: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
    4: { label: 'Low', color: 'bg-green-100 text-green-800', icon: '🟢' }
  };

  const priority = task.priority || 4;
  const priorityInfo = priorityConfig[priority];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-xl ${
        isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-orange-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Status Toggle */}
          <button
            onClick={() => onToggleStatus(task)}
            className="mt-1 focus:outline-none transform hover:scale-110 transition"
            aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? (
              <FaCheckCircle className="text-green-500 text-2xl" />
            ) : (
              <FaRegCircle className="text-gray-400 text-2xl hover:text-gray-500" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`text-lg font-semibold ${
                  isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
                }`}
              >
                {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                {priorityInfo.icon} {priorityInfo.label}
              </span>
            </div>
            {task.description && (
              <p className={`mt-2 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {task.status}
              </span>
              {task.deadline && (
                <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </span>
              )}
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            aria-label="Edit task"
          >
            <FaEdit className="text-xl" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            aria-label="Delete task"
          >
            <FaTrash className="text-xl" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
