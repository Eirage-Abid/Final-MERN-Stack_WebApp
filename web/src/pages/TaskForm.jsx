import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../schemas/task.schema";
import { createTask, updateTask, getTaskById } from "../api/tasks";
import { useNavigate, useParams } from "react-router-dom";

export default function TaskForm() {
  const { id } = useParams(); // if exists = edit mode
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(taskSchema) });

  // Prefill the form in edit mode
  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data } = await getTaskById(id);
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("status", data.status);
      if (data.dueDate) setValue("dueDate", data.dueDate.slice(0, 10));
    })();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await updateTask(id, data);
        alert("Task updated!");
      } else {
        await createTask(data);
        alert("Task created!");
      }
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving task");
      console.log(err);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "30px auto" }}>
      <h2>{id ? "Edit Task" : "Create Task"}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input {...register("title")} />
        {errors.title && <p>{errors.title.message}</p>}

        <label>Description</label>
        <textarea {...register("description")} />

        <label>Status</label>
        <select {...register("status")}>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <label>Due Date</label>
        <input type="date" {...register("dueDate")} />

        <button disabled={isSubmitting} style={{ marginTop: 20 }}>
          {isSubmitting ? "Saving..." : "Save Task"}
        </button>
      </form>
    </div>
  );
}
