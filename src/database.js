import fs from "node:fs/promises";

const databaseName = "database.json";
const databasePath = new URL(`./../${databaseName}`, import.meta.url);
const loglevel = "DEBUG";

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath)
      .then((data) => {
        this.#displayLog(`Database exists, loading data from ${databaseName}`);
        this.#database = JSON.parse(data);
        this.#displayLog("Database loaded!");
      })
      .catch(() => {
        this.#displayLog(`Database does not exist, creating new database ${databaseName}`);
        this.#persist();
        this.#displayLog(`Database created, you can find it at ${databasePath}`);
      });
  }

  select = (table, search) => {
    if (Object.entries(search).length > 0 && this.#database[table]) {
      return this.#database[table].filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toString().toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    if (!this.#database[table]) {
      console.error(`Table ${table} does not exist`);
      return;
    }

    if (Object.entries(search).length === 0) {
      return this.#database[table];
    }
  };

  insert = (table, data) => {
    if (!this.#database[table]) {
      this.#displayLog(`Table ${table} does not exist, creating new table`);
      this.#database[table] = [];
    }

    const id = this.#database[table].length + 1;
    const newTask = { id, ...data };

    this.#database[table].push(newTask);
    this.#persist();
    return newTask;
  };

  update = (table, id, data) => {
    const taskIndexToUpdate = this.#database[table].findIndex((row) => row.id === Number(id));

    if (taskIndexToUpdate > -1) {
      const taskData = this.#database[table].filter((row) => row.id === Number(id));
      taskData[0].updated_at = new Date().toISOString();
      taskData[0].title = data.title;
      taskData[0].description = data.description;
      this.#database[table][taskIndexToUpdate] = { id, ...taskData[0] };
      this.#persist();
    }
  };

  delete = (table, id) => {
    const taskIndexToDelete = this.#database[table].findIndex((row) => row.id === id);

    if (taskIndexToDelete > -1) {
      this.#database[table].splice(taskIndexToDelete, 1);
      this.#persist();
    }
  };

  patch = (table, id) => {
    const taskIndexToComplete = this.#database[table].findIndex((row) => row.id === id);

    if (taskIndexToComplete > -1) {
      const taskData = this.#database[table].filter((row) => row.id === Number(id));
      taskData[0].completed_at = new Date().toISOString();
      taskData[0].updated_at = new Date().toISOString();
      this.#database[table][taskIndexToComplete] = { id, ...taskData[0] };
      this.#persist();
    }
  };

  #persist = () => {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  };

  #displayLog = (message) => {
    if (loglevel === "DEBUG") {
      console.log(message);
    }
  };
}
