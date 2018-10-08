
<template>
  <b-container class="tasks">
    <b-row>
      <b-col cols="6">
        <h1>All Tasks</h1>
        <div v-if="tasks.length > 0" class="table-wrap">
          <table>
            <tr>
              <td>ID</td>
              <td>Title</td>
              <td>Priority</td>
              <td>State</td>
              <td>Due Date</td>
              <td>Actions</td>
            </tr>
            <tr v-for="task in tasks" v-bind:key="task.title">
              <td>{{ task.id }}</td>
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
          TASK-{{ selectedTask }} {{ tasks[selectedTaskI].title }}
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import TasksService from '@/services/TasksService'
import PriorityService from '@/services/PriorityService'
import StateService from '@/services/StateService'

export default {
  name: 'tasks',
  data () {
    return {
      tasks: [],
      priorityMap: {},
      stateMap: {},
      selectedTask: -1,
      selectedTaskI: -1
    }
  },
  mounted () {
    this.buildPriorityMap()
    this.buildStateMap()
    this.getTasks()
  },
  methods: {
    selectTask (id) {
      console.log('Selecting ' + id)
      this.selectedTask = id
      this.selectedTaskI = this.tasks.findIndex((task) => {
        return task.id === id
      })
      console.log(this.selectedTaskI)
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
    }
  }
}
</script>

<style type="text/css">
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
/*a {
  color: #4d7ef7;
  text-decoration: none;
}*/
</style>
