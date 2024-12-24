export const validateTaskInDatabase = (database, id, res) => {

  if (!database.select("tasks", { id: id }).length) {
    return res.writeHead(404).end("Task not found");
  }
};
