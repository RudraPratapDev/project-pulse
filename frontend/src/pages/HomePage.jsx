import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import { FaPlus, FaChartBar, FaFilter, FaSort } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all'
  });
  const [sortBy, setSortBy] = useState('priority');
  const { loading, get, post, put, del } = useApi();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
    fetchTasks();
  }
  }, [user]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, filters, sortBy]);

  const fetchTasks = async () => {
    const result = await get('/tasks');
    if (result.success) {
      setTasks(result.data);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...tasks];

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => (task.priority || 4) === parseInt(filters.priority));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return (a.priority || 4) - (b.priority || 4);
        case 'deadline-asc':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case 'deadline-desc':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(b.deadline) - new Date(a.deadline);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    const result = await post('/tasks', taskData);
    if (result.success) {
      fetchTasks();
      setIsModalOpen(false);
      toast.success('Task created successfully! 🎉', {
        duration: 3000,
        position: 'top-right',
      });
    } else {
      toast.error('Failed to create task. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const handleUpdateTask = async (taskData, taskId) => {
    const result = await put(`/tasks/${taskId}`, taskData);
    if (result.success) {
      fetchTasks();
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated successfully! ✅', {
        duration: 3000,
        position: 'top-right',
      });
    } else {
      toast.error('Failed to update task. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await del(`/tasks/${id}`);
      if (result.success !== false) {
        fetchTasks();
        toast.success('Task deleted successfully! 🗑️', {
          duration: 3000,
          position: 'top-right',
        });
      } else {
        toast.error('Failed to delete task. Please try again.', {
          duration: 3000,
          position: 'top-right',
        });
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const statusLabels = {
      'pending': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    
    const result = await put(`/tasks/${taskId}`, { status: newStatus });
    if (result.success) {
      fetchTasks();
      toast.success(`Task moved to ${statusLabels[newStatus]}! 🚀`, {
        duration: 2000,
        position: 'top-right',
      });
    } else {
      toast.error('Failed to update task status. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = (taskData, taskId) => {
    if (taskId) {
      handleUpdateTask(taskData, taskId);
    } else {
      handleCreateTask(taskData);
    }
  };

  // Calculate metrics
  const today = new Date().toISOString().split('T')[0];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.deadline && t.deadline < today
  ).length;
  const tasksDueToday = tasks.filter(
    (t) => t.status !== 'completed' && t.deadline && t.deadline === today
  ).length;

  // Chart data
  const statusData = [
    { name: 'To Do', value: pendingTasks, color: '#f97316' },
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Completed', value: completedTasks, color: '#22c55e' }
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: 'Critical', count: tasks.filter(t => t.priority === 1).length, color: '#ef4444' },
    { name: 'High', count: tasks.filter(t => t.priority === 2).length, color: '#f97316' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 3).length, color: '#eab308' },
    { name: 'Low', count: tasks.filter(t => (t.priority === 4 || !t.priority)).length, color: '#22c55e' }
  ];

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg font-medium">Loading your workspace...</div>
        </div>
      </div>
    );
  }

  // Welcome screen for new users
  if (totalTasks === 0) {
    return (
      <>
        <Toaster />
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
            >
              {/* Welcome SVG */}
              <div className="mb-8">
                <svg className="w-48 h-48 md:w-64 md:h-64 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
                  <rect x="60" y="60" width="80" height="100" rx="8" fill="#818CF8" />
                  <rect x="70" y="75" width="60" height="8" rx="4" fill="white" />
                  <rect x="70" y="95" width="45" height="8" rx="4" fill="white" opacity="0.7" />
                  <rect x="70" y="115" width="50" height="8" rx="4" fill="white" opacity="0.7" />
                  <circle cx="160" cy="60" r="20" fill="#34D399" />
                  <path d="M152 60L158 66L168 54" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Welcome to Project Pulse! 🎉
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Your personal task management workspace is ready. Start organizing your work with our intuitive Kanban board.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 text-left">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="font-bold text-gray-800 mb-2">Create Tasks</h3>
                  <p className="text-sm text-gray-600">Add tasks with priorities, deadlines, and descriptions</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold text-gray-800 mb-2">Drag & Drop</h3>
                  <p className="text-sm text-gray-600">Move tasks between columns to update their status</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold text-gray-800 mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-600">Visualize your productivity with charts and metrics</p>
                </div>
              </div>

              <button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg transition duration-200 inline-flex items-center gap-3 text-base md:text-lg transform hover:scale-105"
              >
                <FaPlus className="text-xl" />
                <span>Create Your First Task</span>
              </button>
            </motion.div>

            {isModalOpen && (
              <TaskModal task={editingTask} onClose={closeModal} onSave={handleSave} />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-4 md:py-8 px-3 md:px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Enhanced Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border-l-4 border-blue-500 hover:shadow-xl transition">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{totalTasks}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border-l-4 border-orange-500 hover:shadow-xl transition">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">To Do</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{pendingTasks}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border-l-4 border-blue-600 hover:shadow-xl transition">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">In Progress</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{inProgressTasks}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border-l-4 border-green-500 hover:shadow-xl transition">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Completed</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{completedTasks}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border-l-4 border-red-500 hover:shadow-xl transition">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Overdue</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{overdueTasks}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 md:p-5 border-l-4 border-purple-500 hover:shadow-xl transition">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Due Today</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{tasksDueToday}</p>
            </div>
          </motion.div>

          {/* Charts Section */}
          {totalTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8"
            >
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-blue-600" />
                  Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartBar className="text-purple-600" />
                  Priority Distribution
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Filters and Action Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Task Board</h2>
              
              <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
                {/* Priority Filter */}
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500 text-sm" />
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <option value="all">All Priorities</option>
                    <option value="1">🔴 Critical</option>
                    <option value="2">🟠 High</option>
                    <option value="3">🟡 Medium</option>
                    <option value="4">🟢 Low</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <FaSort className="text-gray-500 text-sm" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <option value="priority">Priority</option>
                    <option value="deadline-asc">Deadline (Earliest)</option>
                    <option value="deadline-desc">Deadline (Latest)</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Add Task Button */}
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 md:px-5 rounded-lg shadow-lg transition duration-200 flex items-center gap-2 transform hover:scale-105"
                >
                  <FaPlus />
                  <span className="hidden sm:inline">Add Task</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Kanban Board */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <KanbanBoard
              tasks={filteredTasks}
              onDelete={handleDeleteTask}
              onEdit={openEditModal}
              onStatusChange={handleStatusChange}
            />
          </motion.div>

          {isModalOpen && (
            <TaskModal task={editingTask} onClose={closeModal} onSave={handleSave} />
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
