import axios from "axios";

export const fetchTasks = async (token, setTasks) => {
  try {
    const res = await axios.get("http://localhost:3000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  } catch (err) {
    console.error("Fetch Tasks Error:", err.response?.data?.message || err.message);
  }
};

export const handleCreate = async (token, input, setInput, setLoading, setTasks, tasks) => {
  if (!input.trim()) return;
  setLoading(true);
  try {
    const res = await axios.post(
      "http://localhost:3000/api/tasks",
      { input },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks([res.data, ...tasks]);
    setInput("");
  } catch (err) {
    console.error("Create Task Error:", err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

export const handleUpdateTask = async (token, id, updatedData, setTasks, tasks) => {
  try {
    const { data: updatedTask } = await axios.put(
      `http://localhost:3000/api/tasks/${id}`,
      updatedData,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? updatedTask : task
    );
    setTasks(updatedTasks);
  } catch (error) {
    console.error(
      "Error updating task:",
      error.response?.data?.message || error.message
    );
  }
};

export const handleDelete = async (token, id, setTasks, tasks) => {
  try {
    await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  } catch (err) {
    console.error("Delete Error:", err);
  }
};

export const handleStatusChange = async (token, id, status, setTasks, tasks) => {
  try {
    const res = await axios.patch(
      `http://localhost:3000/api/tasks/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTasks(tasks.map((task) =>
      task._id === id ? { ...task, status: res.data.status } : task
    ));
  } catch (err) {
    console.error("Status Update Error:", err);
  }
};

export const handleStartTimer = async (token, taskId, setTimerState) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/timelogs/start",
      { taskId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const startTime = new Date(res.data.startTime || Date.now());

    const intervalId = setInterval(() => {
      const now = new Date();
      const duration = Math.floor((now - startTime) / 1000);
      setTimerState((prev) => ({
        ...prev,
        [taskId]: { status: "active", duration, intervalId }
      }));
    }, 1000);
  } catch (err) {
    console.error("Start timer failed", err);
  }
};

export const handleStopTimer = async (token, taskId, timerState, setTimerState, fetchTasksFn) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/timelogs/stop",
      { taskId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { duration } = res.data; 

    const timer = timerState[taskId];
    if (timer?.intervalId) clearInterval(timer.intervalId);

    setTimerState((prev) => ({
      ...prev,
      [taskId]: {
        status: "stopped",
        duration: duration || 0,
        intervalId: null,
      },
    }));

    fetchTasksFn();
  } catch (err) {
    console.error("Stop timer failed", err);
  }
};
