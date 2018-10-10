
<template>
  <b-container class="tasks">
    <b-row>
      <b-col cols="6">
        <div v-if="prioritiesLoaded && statesLoaded">
          <h1>All Tasks</h1>
          <div v-if="tasks.length > 0" class="table-wrap">
            <table>
              <tr>
                <td style="text-align: center">Title</td>
                <td style="text-align: center">Priority</td>
                <td style="text-align: center">State</td>
                <td style="text-align: center">Due Date</td>
                <td style="text-align: center">Actions</td>
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
        </div>
      </b-col>
      <b-col cols="6">
        <div v-if="selectedTask > 0">
          <h1>TASK-{{ selectedTask }} {{ tasks[selectedTaskIndex].title }}</h1>
          <div class="description">
            <b>Description:</b><br>
            {{ tasks[selectedTaskIndex].description }}
          </div>
          <div class="subtasks">
            <h3>Subtasks:</h3>
            <div v-if="subtaskIndices.length > 0">
              <table class="table-wrap">
                <tr>
                  <td style="text-align: center">Title</td>
                  <td style="text-align: center">Priority</td>
                  <td style="text-align: center">State</td>
                  <td style="text-align: center">Due Date</td>
                  <td style="text-align: center">Actions</td>
                </tr>
                <tr v-for="taskIndex in subtaskIndices" v-bind:key="taskIndex">
                  <td>{{ tasks[taskIndex].title }}</td>
                  <td>{{ priorityMap[tasks[taskIndex].priority_id] }}</td>
                  <td>{{ stateMap[tasks[taskIndex].state_id] }}</td>
                  <td>{{ tasks[taskIndex].due_date }}</td>
                  <td align="center">
                    <router-link v-bind:to="{ name: 'EditTask', params: { id: tasks[taskIndex].id } }">Edit</router-link> |
                    <a href="#" @click.prevent="deleteTask(tasks[taskIndex].id)">Delete</a>
                  </td>
                </tr>
              </table>
            </div>
            <div v-else>
              This task has no subtasks.
            </div>
          </div>
          <div class="comments">
            <h3>Comments:</h3>
            <div v-for="comment in comments" v-bind:key="comment.id" class="comment-div">
              <b-card v-bind:footer="'someuser - ' + comment.create_date">
                <p class="card-text">{{ comment.contents }}</p>
              </b-card>
            </div>
            <b-form @submit.prevent="addComment">
              <b-form-group>
                <b-form-textarea id="commentInput" :rows="5" :max-rows="10" v-model="commentToAdd" placeholder="Add a comment to this task.">
                </b-form-textarea>
              </b-form-group>
              <b-button type="submit" variant="primary">Add Comment</b-button>
            </b-form>
          </div>
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
      tasks: [], // All of the tasks.
      priorityMap: {}, // A map of priority id to priority name.
      stateMap: {}, // A map of state id to state name.
      selectedTask: -1, // The currently selected task id.
      selectedTaskIndex: -1, // The index of the currently selected task in the tasks array.
      subtaskIndices: [], // The indeces of all subtasks in the currently selected task in the tasks array.
      comments: [], // The comments for the currently selected task.
      commentToAdd: '', // The comment to add to the currently selected task.
      prioritiesLoaded: false, // Whether the priorities have been loaded yet.
      statesLoaded: false // Whether the states have been loaded yet.
    }
  },
  mounted () {
    this.buildPriorityMap()
    this.buildStateMap()
    this.fetchTasks()
  },
  computed: {
    // All of the tasks that do not have a parent task.
    topLevelTasks () {
      return this.tasks.filter((task) => {
        return task.parent_task_id == null
      })
    }
  },
  methods: {
    // Get all of the needed information when the user selects a task.
    selectTask (id) {
      if (id !== -1) {
        this.selectedTask = id
        // Get this task's index in the tasks array.
        this.selectedTaskIndex = this.tasks.findIndex((task) => {
          return task.id === id
        })
        // Get all subtask indices for the selected task.
        this.getSubtaskIndices()
        // Get all comments for the selected task.
        this.fetchComments()
      }
    },
    // Get all of the subtask indices for the selected task.
    getSubtaskIndices () {
      this.subtaskIndices = []
      for (var i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].parent_task_id === this.selectedTask) {
          this.subtaskIndices.push(i)
        }
      }
    },
    // Build a map of priority id to priority name.
    async buildPriorityMap () {
      const response = await PriorityService.fetchPriorities()
      for (var i = 0; i < response.data.length; i++) {
        this.priorityMap[response.data[i].id] = response.data[i].name
      }
      this.prioritiesLoaded = true
    },
    // Build a map of state id to state name.
    async buildStateMap () {
      const response = await StateService.fetchStates()
      for (var i = 0; i < response.data.length; i++) {
        this.stateMap[response.data[i].id] = response.data[i].name
      }
      this.statesLoaded = true
    },
    // Fetch all tasks.
    async fetchTasks () {
      const response = await TasksService.fetchTasks()
      // Fix dates.
      for (var i = 0; i < response.data.length; i++) {
        response.data[i].due_date = response.data[i].due_date.replace('T', ' ')
      }
      this.tasks = response.data
    },
    // Delete the task with the given id.
    async deleteTask (id) {
      await TasksService.deleteTask(id)
      this.selectedTask = -1
      this.fetchTasks()
    },
    // Fetch all comments.
    async fetchComments () {
      const response = await TasksService.getTaskComments(this.selectedTask)
      this.comments = response.data
    },
    // Add a comment to the selected task.
    async addComment () {
      await CommentService.addComment({
        contents: this.commentToAdd,
        taskId: this.selectedTask
      })
      this.fetchComments()
      this.commentToAdd = ''
    }
  }
}
</script>

<style type="text/css">
.tasks {
  margin-top: 10px;
}
.edit-container {
  margin-top: 1rem;
}
.description {
  background-color: #eee;
  text-align: center;
}
.subtasks {
  margin-top: 10px;
}
.comments {
  margin-top: 10px;
}
</style>
