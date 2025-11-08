const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');
const TASKS_FILE = path.join(__dirname, 'tasks.json');

/**
 * CRITICAL: Data Abstraction Layer
 * This is the ONLY module that knows about JSON file storage.
 * When migrating to DynamoDB, ONLY this file needs to change.
 * All functions return Promises to match DynamoDB SDK patterns.
 */

// ============= FILE HELPERS =============
const readJSON = async (filePath, defaultValue = []) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJSON(filePath, defaultValue);
      return defaultValue;
    }
    throw error;
  }
};

const writeJSON = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ============= USER OPERATIONS =============
const findUserByEmail = async (email) => {
  const users = await readJSON(USERS_FILE);
  return users.find(user => user.email === email);
};

const findUserById = async (id) => {
  const users = await readJSON(USERS_FILE);
  return users.find(user => user.id === id);
};

const createUser = async (userData) => {
  const users = await readJSON(USERS_FILE);
  users.push(userData);
  await writeJSON(USERS_FILE, users);
  return userData;
};

// ============= TASK OPERATIONS =============
const getTasksForUser = async (userId) => {
  const tasks = await readJSON(TASKS_FILE);
  return tasks.filter(task => task.userId === userId);
};

const getAllTasks = async () => {
  return await readJSON(TASKS_FILE);
};

const getTaskById = async (taskId) => {
  const tasks = await readJSON(TASKS_FILE);
  return tasks.find(task => task.id === taskId);
};

const createTask = async (taskData) => {
  const tasks = await readJSON(TASKS_FILE);
  tasks.push(taskData);
  await writeJSON(TASKS_FILE, tasks);
  return taskData;
};

const updateTask = async (taskId, updates) => {
  const tasks = await readJSON(TASKS_FILE);
  const index = tasks.findIndex(task => task.id === taskId);
  
  if (index === -1) {
    return null;
  }
  
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  await writeJSON(TASKS_FILE, tasks);
  return tasks[index];
};

const deleteTask = async (taskId) => {
  const tasks = await readJSON(TASKS_FILE);
  const index = tasks.findIndex(task => task.id === taskId);
  
  if (index === -1) {
    return false;
  }
  
  tasks.splice(index, 1);
  await writeJSON(TASKS_FILE, tasks);
  return true;
};

module.exports = {
  // User operations
  findUserByEmail,
  findUserById,
  createUser,
  
  // Task operations
  getTasksForUser,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
