const express = require('express');
const { getAllUsers, deleteUser, getStats } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;