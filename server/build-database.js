const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/tasks.db');


db.serialize(() => {
  // Create priority table.
  db.run(`DROP TABLE IF EXISTS priority`)
  .run(`CREATE TABLE priority (
  id          INTEGER     PRIMARY KEY AUTOINCREMENT,
  name        CHAR(100)   NOT NULL,
  description TEXT
  )`)
  .run(`INSERT INTO priority(name, description) VALUES
          ('Low', 'Not an important task.'),
          ('Medium', 'A moderatly important task.'),
          ('High', 'An important task.')
  `)

  // Create state table.
  .run(`DROP TABLE IF EXISTS state`)
  .run(`CREATE TABLE state (
  id          INTEGER     PRIMARY KEY AUTOINCREMENT,
  name        CHAR(100)   NOT NULL,
  description TEXT
  )`)
  .run(`INSERT INTO state(name, description) VALUES
          ('Unassigned', 'This task has not bees assigned to anyone.'),
          ('Assigned', 'This task has been assigned but not started.'),
          ('In Progress', 'This task is being worked.'),
          ('Complete', 'This task has been completed.')
  `)

  // Create task table.
  .run(`DROP TABLE IF EXISTS task`)
  .run(`CREATE TABLE task (
  id              INTEGER     PRIMARY KEY AUTOINCREMENT,
  title           CHAR(100)   NOT NULL,
  create_date     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  state_id        INTEGER     NOT NULL,
  priority_id     INTEGER,
  description     TEXT,
  due_date        DATETIME,
  parent_task_id  INTEGER,
  FOREIGN KEY(state_id) REFERENCES state(id),
  FOREIGN KEY(priority_id) REFERENCES priority(id)
  );`)
  .run(`INSERT INTO 
    task(title, state_id, priority_id, description, due_date, parent_task_id) VALUES
          ('Create App', 1, 1, 'We need to create the app.', CURRENT_TIMESTAMP, NULL),
          ('Test App', 1, 1, 'We need to test the app.', CURRENT_TIMESTAMP, NULL)`)

  
  // Create comment table.
  .run(`DROP TABLE IF EXISTS comment`)
  .run(`CREATE TABLE comment (
  id          INTEGER     PRIMARY KEY AUTOINCREMENT,
  author      INTEGER     NOT NULL,
  contents    TEXT        NOT NULL,
  task_id     INTEGER     NOT NULL,
  create_date DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(task_id) REFERENCES task(id)
  )`)
  .run(`INSERT INTO
    comment(author, contents, task_id) VALUES
    (1, 'I do not understand this task.', 1)
  `)
})