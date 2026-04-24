const User = require('../models/User');
const Task = require('../models/Task');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    await Task.deleteMany({ user: req.params.id });
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User and their tasks deleted successfully' });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, pendingTasks, completedTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: 'pending' }),
      Task.countDocuments({ status: 'completed' }),
    ]);
    res.status(200).json({ success: true, data: { totalUsers, totalTasks, pendingTasks, completedTasks } });
  } catch (err) { next(err); }
};