<template>
  <div class="tasks">
    <h1>Create Task</h1>
      <div v-if="parentTask != null">
        Subtask of TASK-{{ parentTask.id }} "{{ parentTask.title }}"
      </div>
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
          <label for="due-date">Due Date</label>
          <input type="datetime-local" v-model="dueDate">
        </div>
        <div>
          <button class="app_task_btn" @click="addTask">Add</button>
        </div>
      </div>
  </div>
</template>

<script>
import TasksService from '@/services/TasksService'
import PriorityService from '@/services/PriorityService'

export default {
  name: 'NewTask',
  data () {
    return {
      title: '',
      description: '',
      priorityId: -1,
      priorities: [],
      dueDate: '2018-07-30T15:00',
      parentId: null,
      parentTask: null
    }
  },
  mounted () {
    this.fetchPriorities()
    this.subtaskSetup()
  },
  methods: {
    async fetchPriorities () {
      const response = await PriorityService.fetchPriorities()
      this.priorities = response.data
    },
    async subtaskSetup () {
      if (this.$route.params.parentId != null) {
        const response = await TasksService.getTask({
          id: this.$route.params.parentId
        })
        this.parentTask = response.data
        console.log(this.parentTask)
      }
    },
    async addTask () {
      console.log('Adding with priority ' + this.priority)
      await TasksService.addTask({
        title: this.title,
        description: this.description,
        priority: this.priorityId,
        dueDate: this.dueDate,
        parentId: this.parentId
      })
      this.$router.push({ name: 'Tasks' })
    }
  }
}
</script>

<style type="text/css">
.form input, .form textarea, .form select, .form b-form-textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
#due-date {
  width: 300px;
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
