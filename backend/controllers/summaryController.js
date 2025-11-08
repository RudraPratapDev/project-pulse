const { getAllTasks } = require('../data/dataService');

/**
 * Get daily summary for ALL users
 * This endpoint is for Lambda/internal use only
 * Protected by API key middleware
 */
const getDailySummary = async (req, res, next) => {
  try {
    const allTasks = await getAllTasks();
    const today = new Date().toISOString().split('T')[0];
    
    const completed = allTasks.filter(task => task.status === 'completed').length;
    const pending = allTasks.filter(task => task.status === 'pending').length;
    const inProgress = allTasks.filter(task => task.status === 'in-progress').length;
    
    // Find overdue tasks grouped by priority
    const overdueTasksByPriority = {};
    allTasks
      .filter(task => task.status === 'pending' && task.deadline && task.deadline < today)
      .forEach(task => {
        const priority = task.priority || 4;
        if (!overdueTasksByPriority[priority]) {
          overdueTasksByPriority[priority] = [];
        }
        overdueTasksByPriority[priority].push({
          id: task.id,
          title: task.title,
          deadline: task.deadline,
          priority: priority
        });
      });
    
    // Find tasks due today grouped by priority
    const tasksDueTodayByPriority = {};
    allTasks
      .filter(task => task.status === 'pending' && task.deadline && task.deadline === today)
      .forEach(task => {
        const priority = task.priority || 4;
        if (!tasksDueTodayByPriority[priority]) {
          tasksDueTodayByPriority[priority] = [];
        }
        tasksDueTodayByPriority[priority].push({
          id: task.id,
          title: task.title,
          deadline: task.deadline,
          priority: priority
        });
      });
    
    // Status distribution
    const tasksStatusDistribution = {
      pending,
      'in-progress': inProgress,
      completed
    };
    
    // Priority distribution
    const tasksPriorityDistribution = {
      1: allTasks.filter(task => task.priority === 1).length,
      2: allTasks.filter(task => task.priority === 2).length,
      3: allTasks.filter(task => task.priority === 3).length,
      4: allTasks.filter(task => task.priority === 4 || !task.priority).length
    };
    
    const summary = {
      summaryDate: today,
      totalTasks: allTasks.length,
      completed,
      pending,
      inProgress,
      overdueTasksByPriority,
      tasksDueTodayByPriority,
      tasksStatusDistribution,
      tasksPriorityDistribution,
      tasks: allTasks.map(task => ({
        id: task.id,
        userId: task.userId,
        title: task.title,
        status: task.status,
        priority: task.priority || 4
      }))
    };
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailySummary
};
