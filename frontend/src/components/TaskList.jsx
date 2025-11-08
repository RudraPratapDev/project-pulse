import React from 'react';
import TaskItem from './TaskItem';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = ({ tasks, onDelete, onEdit, onToggleStatus }) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <p className="text-gray-500 text-lg">
          No tasks yet. Create your first task to get started!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;
