import { Database } from "./database.js";
import { addMetada } from "./utils/add-metadata.js";
import { constructRouteParameters } from "./utils/construct-route-parameters.js";
import { validateTaskInDatabase } from "./utils/validate-task-in-database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: constructRouteParameters("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks", req.query);
      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: constructRouteParameters("/tasks"),
    handler: (req, res) => {
      if (!req.body.title || !req.body.description) {
        return res.writeHead(400).end("Title and description are required");
      }
      addMetada(req);
      req.body.created_at = new Date().toISOString();
      const taskAdded = database.insert("tasks", req.body);
      return res.writeHead(201).end(JSON.stringify(taskAdded));
    },
  },
  {
    method: "PUT",
    path: constructRouteParameters("/tasks/:id"),
    handler: (req, res) => {
      if (!req.body.title || !req.body.description) {
        return res.writeHead(400).end("Title and description are required");
      }
      const { id } = req.params;
      validateTaskInDatabase(database, id, res);
      const task = database.update("tasks", id, req.body);
      return res.writeHead(200).end(JSON.stringify(task));
    },
  },
  {
    method: "DELETE",
    path: constructRouteParameters("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      validateTaskInDatabase(database, id, res);
      database.delete("tasks", Number(id));
      return res.writeHead(200).end();
    },
  },
  {
    method: "PATCH",
    path: constructRouteParameters("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      validateTaskInDatabase(database, id, res);
      database.patch("tasks", Number(id));
      return res.writeHead(200).end();
    },
  },
];
