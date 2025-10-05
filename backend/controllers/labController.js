import Lab from '../models/Lab.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import UserLabSession from '../models/UserLabSession.js';
import { eventBus } from '../server.js';
import crypto from 'crypto';

function verifyAnswer(answer, answerHash) {
  if (!answerHash) return false;
  const h = crypto.createHash('sha256').update(answer.trim()).digest('hex');
  return h === answerHash;
}

// submit task answer (simple controller)
export async function submitTask(req, res) {
  try {
    const userId = req.body.userId; // in real app use auth middleware
    const { labId, taskId, answer } = req.body;
    const lab = await Lab.findById(labId).populate('tasks');
    if (!lab) return res.status(404).json({error:'lab not found'});
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({error:'task not found'});

    let session = await UserLabSession.findOne({ user: userId, lab: labId });
    if (!session) session = new UserLabSession({ user: userId, lab: labId });

    if (session.tasksCompleted.includes(taskId)) {
      return res.status(400).json({ error: 'Task already solved' });
    }

    const ok = verifyAnswer(answer, task.answerHash);
    if (!ok) return res.status(400).json({ error: 'Wrong answer' });

    session.tasksCompleted.push(task._id);
    session.pointsEarned += task.points;

    // update user points atomically
    const user = await User.findById(userId);
    await User.updateOne({ _id: userId }, { $inc: { totalPoints: task.points } });

    // check completion
    if (session.tasksCompleted.length === lab.tasks.length) {
      session.isComplete = true;
      session.completedAt = new Date();
    }

    await session.save();

    // Update streak: simple day check (not perfect)
    const today = new Date().setHours(0,0,0,0);
    const last = user.lastActionDate ? new Date(user.lastActionDate).setHours(0,0,0,0) : null;
    const oneDay = 1000*60*60*24;
    if (last === today) {
      // nothing
    } else if (last === today - oneDay) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      user.currentStreak = 1;
    }
    user.lastActionDate = new Date();
    if (!user.longestStreak || user.currentStreak > user.longestStreak) user.longestStreak = user.currentStreak;
    await user.save();

    // emit events: notify user and update leaderboard channel
    eventBus.emit('notify:user', { userId, payload: { type: 'task:complete', taskId: task._id.toString(), points: task.points, message: 'Task solved' } });
    eventBus.emit('leaderboard:update', { message: 'update requested' });

    return res.json({ success:true, tasksCompleted: session.tasksCompleted.length, pointsEarned: session.pointsEarned });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}
