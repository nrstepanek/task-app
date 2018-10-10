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
          ('High', 'An important task.'),
          ('Urgent', 'There will be overtime.')
  `)

  // Create state table.
  .run(`DROP TABLE IF EXISTS state`)
  .run(`CREATE TABLE state (
  id          INTEGER     PRIMARY KEY AUTOINCREMENT,
  name        CHAR(100)   NOT NULL,
  description TEXT
  )`)
  .run(`INSERT INTO state(name, description) VALUES
          ('Unassigned', 'This task has not been assigned to anyone.'),
          ('Assigned', 'This task has been assigned but not started.'),
          ('In Progress', 'This task is being worked.'),
          ('Peer Review', 'This task in in peer review.'),
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
  FOREIGN KEY(priority_id) REFERENCES priority(id),
  FOREIGN KEY(parent_task_id) REFERENCES task(id)
  )`)
  .run(`INSERT INTO 
    task(title, state_id, priority_id, description, due_date, parent_task_id) VALUES
          ('Create App', 4, 3, 
            'We need to create the application for the customer. This will include designing the application and coding it in its entirety.', 
            '2018-10-05 15:30', NULL),
          ('Test App', 3, 1, 
            'We need to test the application so that the customer does not receive it with bugs. This will involve writing unit tests for every class and end-to-end tests.', 
            '2018-11-07 09:15', NULL),
          ('Deliver App', 2, 2, 
            'We need to deliver the application to the customer. This will involve burning a CD with the application on it and mailing it to their office.',
            '2018-12-24 17:00', NULL),
          ('Market App', 1, 1,
            'We need to market the application to find new customers and generate sales. We need to hire marketers who will help in this effort.',
            '2019-02-01 11:00', NULL)`)

  
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
    comment(author, contents, task_id, create_date) VALUES
    (1, 'I do not understand this task. What exactly are we supposed to do?', 1, '2018-09-11 10:47'),
    (1, 'I think we are supposed to make an app of some sort.', 1, '2018-09-11 12:22')
  `)
})