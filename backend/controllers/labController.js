import Lab from '../models/Lab.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import UserLabSession from '../models/UserLabSession.js';
import Notification from '../models/Notification.js';
import { eventBus } from '../utils/socket.js';

export async function getLabs(req, res) {
  const labs = await Lab.find().populate('tasks');
  res.json(labs);
}

export async function getLab(req, res) {
  const lab = await Lab.findById(req.params.id).populate('tasks');
  if (!lab) return res.status(404).json({ error: 'lab not found' });
  res.json(lab);
}

export async function startLab(req, res) {
  const { userId } = req.body;
  const labId = req.params.id;
  let session = await UserLabSession.findOne({ user: userId, lab: labId });
  if (!session) {
    session = new UserLabSession({ user: userId, lab: labId });
    await session.save();
  }
  // include lab id to session for frontend convenience
  return res.json({ ...session.toObject(), lab: labId });
}

export async function submitTask(req, res) {
  try {
    const { userId, taskId, answer } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'task not found' });

    const lab = await Lab.findOne({ tasks: task._id });
    if (!lab) return res.status(404).json({ error: 'lab not found' });

    let session = await UserLabSession.findOne({ user: userId, lab: lab._id });
    if (!session) session = new UserLabSession({ user: userId, lab: lab._id });

    if (session.tasksCompleted.map(String).includes(String(task._id))) {
      return res.status(400).json({ error: 'already solved' });
    }

    const isCorrect = answer && (answer.trim() === (task.answerKey || '').trim());
    if (!isCorrect) return res.status(400).json({ error: 'wrong' });

    session.tasksCompleted.push(task._id);
    session.xpEarned += task.xp;

    await User.updateOne({ _id: userId }, { $inc: { xp: task.xp } });
    const user = await User.findById(userId);

    if (session.tasksCompleted.length === lab.tasks.length) {
      session.isComplete = true;
      session.completedAt = new Date();
    }

    await session.save();

    const notif = await Notification.create({ user: user._id, message: `Solved task: ${task.title} (+${task.xp} XP)`, type: 'success' });

    eventBus.emit('notify:user', { userId: user._id.toString(), payload: notif });
    eventBus.emit('leaderboard:update', { message: 'leaderboard changed' });

    return res.json({ success: true, session, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}
