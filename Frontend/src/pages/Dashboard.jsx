import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  handleCreate,
  handleDelete,
  handleStatusChange,
  handleStartTimer,
  handleStopTimer,
  handleUpdateTask,
} from "../utils/taskhandler.js";
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timerState, setTimerState] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  const loadTasks = () => {
    fetchTasks(token, setTasks);
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m ` : ""}${s}s`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };


  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-12 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold shadow-md transition"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 text-transparent bg-clip-text animate-gradient">
            ✨ Your Task Dashboard
          </h1>
          <Link
            to="/summary"
            className="bg-white/20 backdrop-blur-lg text-white px-5 py-2 rounded-xl shadow-md hover:bg-white/30 hover:scale-105 transition font-semibold"
          >
            📈 View Daily Summary
          </Link>
        </div>



        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-500">

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Follow up with designer"
              className="p-4 flex-1 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition backdrop-blur-sm"
            />
            <button
              onClick={() => handleCreate(token, input, setInput, setLoading, setTasks, tasks)}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-blue-500 hover:to-indigo-600 transition px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/50 active:scale-95 duration-300"
            >
              {loading ? "Creating..." : "Add Task"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm md:text-base text-left border-collapse">
              <thead className="bg-white/10 text-white uppercase tracking-wide text-[13px]">
                <tr>
                  <th className="py-4 px-5">Title</th>
                  <th className="py-4 px-5">Description</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                  <th className="py-4 px-5 text-center">Time Control</th>
                  <th className="py-4 px-5 text-center">Time Logged</th>
                </tr>
              </thead>
              <tbody className="bg-white/5 text-white">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-white/60">
                      No tasks yet.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="border-t border-white/10 hover:bg-white/10 transition-all duration-300">
                      <td className="py-4 px-5">
                        {editMode[task._id] ? (
                          <input
                            value={editData[task._id]?.title || ""}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                [task._id]: { ...prev[task._id], title: e.target.value },
                              }))
                            }
                            className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white w-full"
                          />
                        ) : (
                          task.title
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {editMode[task._id] ? (
                          <textarea
                            value={editData[task._id]?.description || ""}
                            onChange={(e) =>
                              setEditData((prev) => ({
                                ...prev,
                                [task._id]: { ...prev[task._id], description: e.target.value },
                              }))
                            }
                            className="bg-white/10 border border-white/20 rounded-md px-2 py-1 text-white w-full"
                          />
                        ) : (
                          task.description
                        )}
                      </td>

                      <td className="py-4 px-5 text-center align-middle">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(token, task._id, e.target.value, setTasks, tasks)
                          }
                          className="bg-white/10 text-white border border-white/20 rounded-md px-2 py-1 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td className="py-4 px-5 text-center align-middle">
                        {editMode[task._id] ? (
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              onClick={async () => {
                                await handleUpdateTask(token, task._id, editData[task._id], setTasks, tasks);
                                setEditMode((prev) => ({ ...prev, [task._id]: false }));
                                setEditData((prev) => {
                                  const updated = { ...prev };
                                  delete updated[task._id];
                                  return updated;
                                });
                              }}
                              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditMode((prev) => ({ ...prev, [task._id]: false }));
                                setEditData((prev) => {
                                  const updated = { ...prev };
                                  delete updated[task._id];
                                  return updated;
                                });
                              }}
                              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              onClick={() => {
                                setEditMode((prev) => ({ ...prev, [task._id]: true }));
                                setEditData((prev) => ({
                                  ...prev,
                                  [task._id]: {
                                    title: task.title,
                                    description: task.description,
                                  },
                                }));
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold shadow-md"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(token, task._id, setTasks, tasks)}
                              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold shadow-md"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {timerState[task._id]?.status === "active" ? (
                          <button
                            onClick={() =>
                              handleStopTimer(token, task._id, timerState, setTimerState, loadTasks)
                            }
                            className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-semibold shadow-md"
                          >
                            Stop Timer
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartTimer(token, task._id, setTimerState)}
                            className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold shadow-md"
                          >
                            Start Timer
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {timerState[task._id]?.duration
                          ? formatDuration(timerState[task._id].duration)
                          : "0s"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
