import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, deleteTask } from "../api/tasks";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getTaskById(id);
      setTask(res.data);
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id);
    navigate("/dashboard");
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>{task.title}</h2>
      <p>{task.description || "No description"}</p>
      <p>Status: {task.status}</p>
      {task.dueDate && <p>Due: {task.dueDate.slice(0, 10)}</p>}

      <button onClick={() => navigate(`/tasks/${id}/edit`)}>Edit</button>
      <button onClick={handleDelete} style={{ marginLeft: 10 }}>
        Delete
      </button>
    </div>
  );
}
