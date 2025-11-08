const { v4: uuidv4 } = require('uuid');
const {
  getTasksForUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../data/dataService');

/**
 * Get all tasks for logged-in user
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await getTasksForUser(req.user.id);
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new task
 */
const createNewTask = async (req, res, next) => {
  try {
    const { title, description, deadline, priority } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    // Validate priority
    const taskPriority = priority || 4;
    if (![1, 2, 3, 4].includes(taskPriority)) {
      return res.status(400).json({
        success: false,
        error: 'Priority must be 1 (Critical), 2 (High), 3 (Medium), or 4 (Low)'
      });
    }
    
    const newTask = {
      id: uuidv4(),
      userId: req.user.id,
      title: title.trim(),
      description: description || '',
      status: 'pending',
      priority: taskPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add deadline if provided
    if (deadline) {
      newTask.deadline = deadline;
    }
    
    await createTask(newTask);
    
    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 */
const updateExistingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, deadline, priority } = req.body;
    
    // Get task
    const task = await getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Verify ownership
    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this task'
      });
    }
    
    // Validate status
    if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be "pending", "in-progress", or "completed"'
      });
    }
    
    // Validate priority
    if (priority !== undefined && ![1, 2, 3, 4].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Priority must be 1 (Critical), 2 (High), 3 (Medium), or 4 (Low)'
      });
    }
    
    // Prepare updates
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = deadline;
    if (priority !== undefined) updates.priority = priority;
    
    const updatedTask = await updateTask(id, updates);
    
    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 */
const deleteExistingTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get task
    const task = await getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Verify ownership
    if (task.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to delete this task'
      });
    }
    
    await deleteTask(id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask
};
