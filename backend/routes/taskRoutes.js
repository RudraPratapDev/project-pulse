const express = require('express');
const router = express.Router();
const {
  getTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createNewTask);
router.put('/:id', updateExistingTask);
router.delete('/:id', deleteExistingTask);

module.exports = router;
