import moment from "moment/moment.js";
import { TimeLog } from "../models/timelog.js";
import { Task } from "../models/task.js";


export const getSummary = async(req , res) => {
    try {
        const userId = req.user._id;
        const startOfDay =  moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();

        const todayLogs = await TimeLog.find({
            user: userId,
            startTime: { $gte: startOfDay, $lte: endOfDay }
          }).populate('task');
      

        const totalTime = todayLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

        const taskMap = new Map();

        todayLogs.forEach(log => {
           const t = log.task;
           if(t) taskMap.set(t._id.toString(), t);
        })

        const taskWorkedOn = Array.from(taskMap.values());

        const allTasks = await Task.find({ user: userId });


        const statusCount = {
            Pending: 0,
            'In Progress': 0,
            Completed: 0
          };


          allTasks.forEach(task => {
            if (statusCount[task.status] !== undefined) {
              statusCount[task.status]++;
            }
          });

          res.json({
            date: moment().format('YYYY-MM-DD'),
            totalTimeTracked: totalTime, 
            taskWorkedOn: taskWorkedOn.map(t => ({
              _id: t._id,
              title: t.title,
              status: t.status
            })),
            statusBreakdown: statusCount
          });
        
    } catch (error) {
        console.error('Summary Error:', err);
       res.status(500).json({ message: 'Failed to fetch summary' });
    }
}