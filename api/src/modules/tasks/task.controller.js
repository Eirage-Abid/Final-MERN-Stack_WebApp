import Task from "./task.model.js";

export const createTask = async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.userId });
  res.status(201).json(task);
};

export const getTasks = async (req, res) => {
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
};

export const updateTask = async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteTask = async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.json({ success: true });
};
