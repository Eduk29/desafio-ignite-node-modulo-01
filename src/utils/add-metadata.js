export const addMetada = (req) => {
  req.body["completed_at"] = null;
  req.body["created_at"] = null;
  req.body["updated_at"] = null;
};
