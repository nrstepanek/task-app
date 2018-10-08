
<template>
  <b-container class="tasks">
    <b-row>
      <b-col cols="6">
        <h1>All Tasks</h1>
        <div v-if="tasks.length > 0" class="table-wrap">
          <table>
            <tr>
              <td>Title</td>
              <td>Priority</td>
              <td>State</td>
              <td>Due Date</td>
              <td>Actions</td>
            </tr>
            <tr v-for="task in topLevelTasks" v-bind:key="task.id">
              <td><a href="#/tasks" @click.prevent="selectTask(task.id)">{{ task.title }}</a></td>
              <td>{{ priorityMap[task.priority_id] }}</td>
              <td>{{ stateMap[task.state_id] }}</td>
              <td>{{ task.due_date }}</td>
              <td align="center">
                <router-link v-bind:to="{ name: 'NewTask', params: { parentId: task.id } }">Create Subtask</router-link> |
                <router-link v-bind:to="{ name: 'EditTask', params: { id: task.id } }">Edit</router-link> |
                <a href="#" @click="deleteTask(task.id)">Delete</a>
              </td>
            </tr>
          </table>
        </div>
        <div v-else>
          There are no tasks, add one! <br><br>
          <router-link v-bind:to="{ name: 'NewTask' }" class="add_task_link">Add Task</router-link>
        </div>
      </b-col>
      <b-col cols="6">
        <div v-if="selectedTask > 0">
          <h2>TASK-{{ selectedTask }} {{ tasks[selectedTaskI].title }}</h2>
          <div class="description">
            <h3>Description:</h3>
            {{ tasks[selectedTaskI].description }}
          </div>
          <div class="subtasks">
            <h3>Subtasks:</h3>
            <div v-if="subtaskIndices.length > 0">
              <table>
                <tr>
                  <td>Title</td>
                  <td>Priority</td>
                  <td>State</td>
                  <td>Due Date</td>
                  <td>Actions</td>
                </tr>
                <tr v-for="taskIndex in subtaskIndices" v-bind:key="taskIndex">
                  <td>{{ tasks[taskIndex].title }}</td>
                  <td>{{ priorityMap[tasks[taskIndex].priority_id] }}</td>
                  <td>{{ stateMap[tasks[taskIndex].state_id] }}</td>
                  <td>{{ tasks[taskIndex].due_date }}</td>
                  <td align="center">
                    <router-link v-bind:to="{ name: 'EditTask', params: { id: taskIndex } }">Edit</router-link> |
                    <a href="#" @click="deleteTask(taskIndex)">Delete</a>
                  </td>
                </tr>
              </table>
            </div>
            <div v-else>
              This task has no subtasks.
            </div>
          </div>
          <h3>Comments:</h3>
          <div v-for="comment in comments" v-bind:key="comment.id" class="comment-div">
            <b-card v-bind:footer="'someuser - ' + comment.create_date">
              <p class="card-text">{{ comment.contents }}</p>
            </b-card>
          </div>
          <b-form @submit="addComment">
            <b-form-group>
              <b-form-textarea id="commentInput" :rows="5" :max-rows="10" v-model="commentToAdd" placeholder="Add a comment to this task.">
              </b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="primary">Add Comment</b-button>
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import TasksService from '@/services/TasksService'
import PriorityService from '@/services/PriorityService'
import StateService from '@/services/StateService'
import CommentService from '@/services/CommentService'

export default {
  name: 'tasks',
  data () {
    return {
      tasks: [],
      priorityMap: {},
      stateMap: {},
      selectedTask: -1,
      selectedTaskI: -1,
      subtaskIndices: [],
      comments: [],
      commentToAdd: ''
    }
  },
  mounted () {
    this.buildPriorityMap()
    this.buildStateMap()
    this.getTasks()
  },
  computed: {
    topLevelTasks () {
      return this.tasks.filter((task) => {
        return task.parent_task_id == null
      })
    }
  },
  methods: {
    selectTask (id) {
      this.selectedTask = id
      // Get this task's index in the tasks array.
      this.selectedTaskI = this.tasks.findIndex((task) => {
        return task.id === id
      })
      // Get all subtask indices for the selected task.
      for (var i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].parent_task_id === id) {
          this.subtaskIndices.push(i)
        }
      }
      // Get all comments for the selected task.
      this.getComments()
    },
    async buildPriorityMap () {
      const response = await PriorityService.fetchPriorities()
      for (var i = 0; i < response.data.length; i++) {
        this.priorityMap[response.data[i].id] = response.data[i].name
      }
    },
    async buildStateMap () {
      const response = await StateService.fetchStates()
      for (var i = 0; i < response.data.length; i++) {
        console.log(response.data[i].name)
        this.stateMap[response.data[i].id] = response.data[i].name
      }
    },
    async getTasks () {
      const response = await TasksService.fetchTasks()
      // Fix dates.
      for (var i = 0; i < response.data.length; i++) {
        response.data[i].due_date = response.data[i].due_date.replace('T', ' ')
      }
      this.tasks = response.data
    },
    async deleteTask (id) {
      console.log('Deleting task with id ' + id)
      await TasksService.deleteTask(id)
      if (this.selectedTask === id) {
        this.selectedTask = -1
      }
      this.$router.push({ name: 'Tasks' })
    },
    async getComments () {
      const response = await TasksService.getTaskComments({
        taskId: this.selectedTask
      })
      this.comments = response.data
    },
    async addComment () {
      await CommentService.addComment({
        contents: this.commentToAdd,
        taskId: this.selectedTask
      })
      this.getComments()
    }
  }
}
</script>

<style type="text/css">
div {
  font-size: 0.9rem;
}
.tasks {
  margin-top: 10px;
}
.table-wrap {
  width: 100%;
  margin: 0 auto;
  margin-top: 10px;
  text-align: center;
}
table th, table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}
.edit-container {
  margin-top: 1rem;
}
.comment-column {
  margin-bottom: 1rem;
}
.comment-div {
  padding: 10px;
}
.card-footer {
  padding: 0px;
  font-size: 0.8rem;
}
.card-body {
  padding: 0.5rem;
}
.description {
  background-color: #eee;
}
.subtasks {
  margin-top: 10px;
}
</style>
