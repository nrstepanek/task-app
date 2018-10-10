const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const sqlite3 = require('sqlite3').verbose()

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

let db = new sqlite3.Database('./db/tasks.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Connected to the database.')
});

// 'priorities' endpoint

// Get all priorities.
app.get('/priorities', (req, res) => {
  let sql = `SELECT * FROM priority`

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    res.send(rows)
  })
})

// Add a priority.
app.post('/priorities', (req, res) => {
  let name = req.body.name
  let description = req.body.description

  let sql = `INSERT INTO priority (name, description)
              VALUES (?, ?)`

  db.run(sql, [name, description], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      message: 'Priority saved succesfully.'
    })
  })
})

// Delete the priority with the given id.
app.delete('/priorities/:id', (req, res) => {
  let sql = `DELETE FROM priority WHERE id = ?`
  db.run(sql, [req.params.id], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true
    })
  })
})

// 'states' endpoint

// Get all states.
app.get('/states', (req, res) => {
  let sql = `SELECT * FROM state`

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    res.send(rows)
  })
})

// Add a state.
app.post('/states', (req, res) => {
  let name = req.body.name
  let description = req.body.description

  let sql = `INSERT INTO state (name, description)
              VALUES (?, ?)`

  db.run(sql, [name, description], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      message: 'State saved succesfully.'
    })
  })
})

// Delete the state with the given id.
app.delete('/states/:id', (req, res) => {
  let sql = `DELETE FROM state WHERE id = ?`
  db.run(sql, [req.params.id], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true
    })
  })
})

// 'comments' endpoint

// Add a comment.
app.post('/comments', (req, res) => {
  let author = 1
  let contents = req.body.contents
  let taskId = req.body.taskId

  let sql = `INSERT INTO comment (author, contents, task_id)
              VALUES (?, ?, ?)`
  db.run(sql, [author, contents, taskId], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      message: 'Comment saved succesfully.'
    })
  })
})

// 'tasks' endpoint

// Get all tasks.
app.get('/tasks', (req, res) => {
  let sql = `SELECT * FROM task`

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    res.send(rows)
  })
})

// Add a task.
app.post('/tasks', (req, res) => {
  let title = req.body.title;
  let description = req.body.description
  let priority = req.body.priority
  let dueDate = req.body.dueDate
  let parentId = req.body.parentId

  let sql = `INSERT INTO task (title, description, state_id, priority_id, due_date, parent_task_id)
              VALUES (?, ?, ?, ?, ?, ?)`
  db.run(sql, [title, description, 1, priority, dueDate, parentId], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true,
      message: 'Task saved succesfully.'
    })
  })
})

// Get a single task with the given id.
app.get('/tasks/:id', (req, res) => {
  let sql = `SELECT * FROM task WHERE id = ?`

  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      throw err
    }
    res.send(row)
  })
})

// Update the task with the given id.
app.put('/tasks/:id', (req, res) => {
  let sql = `UPDATE task SET title = ?, description = ?, state_id = ?, 
      priority_id = ?, due_date = ? WHERE id = ?`
  db.run(sql, 
    [req.body.title, req.body.description, req.body.stateId, 
      req.body.priorityId, req.body.dueDate, req.body.id],
    (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true
    })
  })
})

// Get comments for the given task.
app.get('/tasks/comments/:taskid', (req, res) => {
  let sql = `SELECT * FROM comment WHERE task_id = ? ORDER BY create_date`

  db.all(sql, [req.params.taskid], (err, rows) => {
    if (err) {
      throw err
    }
    res.send(rows)
  })
})

// Delete the task with the given id.
app.delete('/tasks/:id', (req, res) => {
  console.log("Deleting task with id " + req.params.id)
  let sql = `DELETE FROM task WHERE id = ?`
  db.run(sql, [req.params.id], (err) => {
    if (err) {
      throw err
    }
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 8081)
