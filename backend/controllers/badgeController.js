import Badge from '../models/Badge.js';
export async function getBadges(req,res){ const b = await Badge.find(); res.json(b); }
export default { getBadges };
