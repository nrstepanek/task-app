
<template>
  <div class="tasks">
    <h1>Edit Task</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="title">
        </div>
        <div>
          <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <div>
          <select v-model="priorityId">
            <option disabled value="">Select a task priority</option>
            <option v-for="priority in priorities" v-bind:value="priority.id" v-bind:key="priority.id" id="due-date">
              {{ priority.name }}
            </option>
          </select>
        </div>
        <div>
          <select v-model="stateId">
            <option disabled value="">Select a task state</option>
            <option v-for="state in states" v-bind:value="state.id" v-bind:key="state.id" id="due-date">
              {{ state.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="due-date">Due Date</label>
          <input type="datetime-local" v-model="dueDate">
        </div>
        <div>
          <button class="app_task_btn" @click="updateTask">Update</button>
        </div>
      </div>
  </div>
</template>

<script>
import TasksService from '@/services/TasksService'
import PriorityService from '@/services/PriorityService'
import StateService from '@/services/StateService'

export default {
  name: 'EditTask',
  data () {
    return {
      title: '',
      description: '',
      priorityId: -1,
      stateId: -1,
      dueDate: null,
      priorities: [],
      states: [],
      comments: []
    }
  },
  mounted () {
    this.fetchPriorities()
    this.fetchStates()
    this.getComments()
    this.getTask()
  },
  methods: {
    async fetchPriorities () {
      const response = await PriorityService.fetchPriorities()
      this.priorities = response.data
    },
    async fetchStates () {
      const response = await StateService.fetchStates()
      this.states = response.data
    },
    async getComments () {
      const response = await TasksService.getComments({
        taskId: this.$route.params.id
      })
      this.comments = response.data
    },
    async getTask () {
      const response = await TasksService.getTask({
        id: this.$route.params.id
      })
      this.title = response.data.title
      this.description = response.data.description
      this.priorityId = response.data.priorityId
      this.stateId = response.data.stateId
      this.dueDate = response.data.dueDate
    },
    async updateTask () {
      await TasksService.updateTask({
        id: this.$route.params.id,
        title: this.title,
        description: this.description,
        priorityId: this.priorityId,
        stateId: this.stateId,
        dueDate: this.dueDate
      })
      this.$router.push({ name: 'Tasks' })
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_task_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
