
<template>
  <b-container class="tasks">
    <b-row>
      <b-col cols="1"></b-col>
      <b-col cols="12">
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
              <td>{{ task.title }}</td>
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
      <b-col cols="1"></b-col>
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
      stateMap: {}
    }
  },
  mounted () {
    this.buildPriorityMap()
    this.buildStateMap()
    this.getTasks()
  },
  methods: {
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
      console.log(this.tasks)
    },
    async deleteTask (id) {
      console.log('Deleting task with id ' + id)
      await TasksService.deleteTask(id)
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
  width: 60%;
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
a {
  color: #4d7ef7;
  text-decoration: none;
}
a.add_task_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>
