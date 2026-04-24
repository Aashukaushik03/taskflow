const Task = require('../models/Task');

exports.getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const tasks = await Task.find(filter).populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) { next(err); }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) { next(err); }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = await Task.create({ title, description, status, priority, user: req.user._id });
    res.status(201).json({ success: true, message: 'Task created successfully', data: task });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }
    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) { next(err); }
};