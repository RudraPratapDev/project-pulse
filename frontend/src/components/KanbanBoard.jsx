import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const KanbanBoard = ({ tasks, onDelete, onEdit, onStatusChange }) => {
  const columns = {
    pending: {
      id: 'pending',
      title: 'To Do',
      color: 'border-orange-500',
      bgColor: 'bg-orange-50',
      headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
      tasks: tasks.filter(task => task.status === 'pending')
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      color: 'border-green-500',
      bgColor: 'bg-green-50',
      headerBg: 'bg-gradient-to-r from-green-500 to-green-600',
      tasks: tasks.filter(task => task.status === 'completed')
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (destination.droppableId !== source.droppableId) {
      const taskId = draggableId;
      const newStatus = destination.droppableId;
      onStatusChange(taskId, newStatus);
    }
  };

  const priorityConfig = {
    1: { label: 'Critical', color: 'bg-red-500 text-white', icon: '🔴' },
    2: { label: 'High', color: 'bg-orange-500 text-white', icon: '🟠' },
    3: { label: 'Medium', color: 'bg-yellow-500 text-white', icon: '🟡' },
    4: { label: 'Low', color: 'bg-green-500 text-white', icon: '🟢' }
  };

  const isOverdue = (task) => {
    return task.deadline && task.status !== 'completed' && 
      new Date(task.deadline) < new Date(new Date().toISOString().split('T')[0]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {Object.values(columns).map((column) => (
          <div key={column.id} className="flex flex-col min-h-[400px]">
            {/* Column Header */}
            <div className={`${column.headerBg} text-white rounded-t-xl px-4 py-4 shadow-md`}>
              <h3 className="font-bold text-lg flex items-center justify-between">
                <span>{column.title}</span>
                <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-bold">
                  {column.tasks.length}
                </span>
              </h3>
            </div>

            {/* Droppable Column */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 ${column.bgColor} rounded-b-xl p-3 md:p-4 transition-all duration-300 ${
                    snapshot.isDraggingOver ? 'bg-opacity-70 ring-4 ring-blue-400 ring-opacity-50 scale-[1.02]' : ''
                  }`}
                  style={{ minHeight: '300px' }}
                >
                  <AnimatePresence mode="popLayout">
                    {column.tasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-32 text-gray-400 text-sm italic border-2 border-dashed border-gray-300 rounded-lg"
                      >
                        Drop tasks here
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {column.tasks.map((task, index) => {
                          const priority = task.priority || 4;
                          const priorityInfo = priorityConfig[priority];
                          const overdue = isOverdue(task);

                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  layout
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    transition: { 
                                      type: 'spring',
                                      stiffness: 500,
                                      damping: 30
                                    }
                                  }}
                                  exit={{ 
                                    opacity: 0, 
                                    scale: 0.8,
                                    transition: { duration: 0.2 }
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  className={`bg-white rounded-xl shadow-md hover:shadow-2xl transition-all cursor-grab active:cursor-grabbing ${
                                    snapshot.isDragging ? 'ring-4 ring-blue-500 shadow-2xl scale-105 rotate-3' : ''
                                  }`}
                                  onClick={() => onEdit(task)}
                                >
                                  <div className="p-4">
                                    {/* Priority Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${priorityInfo.color}`}>
                                        {priorityInfo.icon} {priorityInfo.label}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onDelete(task.id);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Delete task"
                                      >
                                        <FaTrash className="text-sm" />
                                      </button>
                                    </div>

                                    {/* Task Title */}
                                    <h4 className={`font-bold text-gray-800 mb-2 text-base ${
                                      task.status === 'completed' ? 'line-through text-gray-500' : ''
                                    }`}>
                                      {task.title}
                                    </h4>

                                    {/* Task Description */}
                                    {task.description && (
                                      <p className={`text-sm mb-3 line-clamp-2 ${
                                        task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {task.description}
                                      </p>
                                    )}

                                    {/* Deadline */}
                                    {task.deadline && (
                                      <div className={`text-xs font-semibold flex items-center gap-1 ${
                                        overdue 
                                          ? 'text-red-600 bg-red-100 px-3 py-1.5 rounded-lg' 
                                          : 'text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg'
                                      }`}>
                                        <span>{overdue ? '⚠️' : '📅'}</span>
                                        <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
