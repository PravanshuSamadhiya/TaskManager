import React, { useEffect, useState } from 'react';
import axios from 'axios';

 const BASE_URL = "https://task-manager-iota-five-73.vercel.app";

const DailySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const secondsToHMS = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/summary/daily`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error('Error fetching summary', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg text-white">Loading summary...</div>;
  if (!summary) return <div className="text-center mt-10 text-lg text-white">No data available.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-12 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-center drop-shadow-lg">📊 Daily Summary for {summary.date}</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-6 transition hover:scale-[1.02] hover:shadow-blue-300/30">
            <h3 className="text-lg font-semibold mb-2">⏱️ Total Time Tracked</h3>
            <p className="text-2xl font-bold text-white">{secondsToHMS(summary.totalTimeTracked)}</p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-6 transition hover:scale-[1.02] hover:shadow-blue-300/30">
            <h3 className="text-lg font-semibold mb-2">📌 Status Breakdown</h3>
            <ul className="space-y-1 text-white">
              <li>🕒 Pending: {summary.statusBreakdown.Pending}</li>
              <li>🚧 In Progress: {summary.statusBreakdown['In Progress']}</li>
              <li>✅ Completed: {summary.statusBreakdown.Completed}</li>
            </ul>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-6 mt-8 transition hover:scale-[1.02] hover:shadow-blue-300/30">
          <h3 className="text-lg font-semibold mb-4">📝 Tasks Worked On</h3>
          {summary.taskWorkedOn.length === 0 ? (
            <p className="text-white/70">No tasks tracked today.</p>
          ) : (
            <ul className="divide-y divide-white/20">
              {summary.taskWorkedOn.map((task) => (
                <li key={task._id} className="py-3">
                  <span className="font-medium">{task.title}</span> — <span className="italic text-white/70">{task.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
