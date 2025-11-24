import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Query params
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5; // Fixed per page

  const [total, setTotal] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await getTasks({
        q,
        status,
        page,
        limit,
      });

      setTasks(res.data.items);
      setTotal(res.data.meta.total);
    } catch (e) {
      console.log(e);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [q, status, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      <h2>Your Tasks</h2>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search..."
          value={q}
          onChange={(e) => {
            setPage(1); // reset page
            setQ(e.target.value);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1); // reset page
            setStatus(e.target.value);
          }}
        >
          <option value="">All</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button onClick={() => navigate("/tasks/new")}>
          + New Task
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY STATE */}
      {!loading && tasks.length === 0 && <p>No tasks found.</p>}

      {/* TASK LIST */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li
            key={t._id}
            style={{
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <strong>{t.title}</strong>
            <p style={{ margin: "4px 0" }}>{t.description}</p>
            <p style={{ fontSize: 13 }}>Status: {t.status}</p>

            <button onClick={() => navigate(`/tasks/${t._id}`)}>
              View
            </button>

            <button
              onClick={() => navigate(`/tasks/${t._id}/edit`)}
              style={{ marginLeft: 10 }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
