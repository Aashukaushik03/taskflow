const express = require('express');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.get('/:id', protect, getTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;