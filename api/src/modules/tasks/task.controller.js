import Task from "./task.model.js";

export const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.userId });
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, q, page = 1, limit = 5 } = req.query;

    const filter = { userId: req.user.userId };

    if (status) filter.status = status;

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    const data = await Task.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filter);

    res.json({
      items: data,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
