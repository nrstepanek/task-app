<template>
  <b-container class="new-task">
    <b-row>
      <b-col></b-col>
      <b-col cols="10">
        <b-alert :show="invalidTitleAlert" dismissible variant="warning">
          The title of a task cannot be empty.
        </b-alert>
        <h1>Create Task</h1>
        <p v-if="parentTask != null" class="parent-task-text">
          Subtask of TASK-{{ parentTask.id }} "{{ parentTask.title }}"
        </p>
        <b-form @submit="addTask">
          <b-form-group label="Title" :invalid-feedback="invalidTitle" :state="titleState">
            <b-form-input id="titleInput" type="text" v-model="title" placeholder="Name your task.">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea id="descriptionInput" type="textarea" :rows="3" :max-rows="10" v-model="description" placeholder="Describe your task.">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Priority">
            <b-form-select id="priorityInput" :options="priorityOptions" v-model="priorityId" placeholder="Prioritize your task.">
            </b-form-select>
          </b-form-group>
          <b-form-group label="Due Date">
            <b-form-input id="endDateInput" type="datetime-local" v-model="dueDate">
            </b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Create Task</b-button>
        </b-form>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import TasksService from '@/services/TasksService'
import PriorityService from '@/services/PriorityService'

export default {
  name: 'NewTask',
  data () {
    return {
      title: '', // The title of the task to add.
      description: '', // The description of the task to add.
      priorityId: -1, // The priority of the task to add.
      priorityOptions: [], // All available priorities.
      dueDate: '2018-07-30T15:00', // The due-date of the task to add.
      parentId: null, // The parent id if this task is supposed to be a subtask.
      parentTask: null, // The parent task's fields, if this task is supposed to be a subtask.
      invalidTitle: 'Title can not be empty.', // Message given for an empty title.
      invalidTitleAlert: false // Whether the alert for an invalid title should be shown.
    }
  },
  mounted () {
    this.fetchPriorities()
    this.subtaskSetup()
  },
  computed: {
    // Whether the title for this task is valid.
    titleState () {
      return this.title.length > 0
    }
  },
  methods: {
    // Fetch all priorities.
    async fetchPriorities () {
      this.priorityOptions = []
      const response = await PriorityService.fetchPriorities()
      for (var i = 0; i < response.data.length; i++) {
        let newPriorityOption = {
          value: response.data[i].id,
          text: response.data[i].name
        }
        this.priorityOptions.push(newPriorityOption)
      }
    },
    // If this new task is suppossed to be a subtask, get the parent task's fields.
    async subtaskSetup () {
      if (this.$route.params.parentId != null) {
        const response = await TasksService.getTask({
          id: this.$route.params.parentId
        })
        this.parentTask = response.data
      }
    },
    // Add the new task if it is valid.
    async addTask () {
      // Only add the task if the title is valid.
      if (this.title.length > 0) {
        await TasksService.addTask({
          title: this.title,
          description: this.description,
          priority: this.priorityId,
          dueDate: this.dueDate,
          parentId: this.$route.params.parentId
        })
        this.$router.push({ name: 'Tasks' })
      } else {
        this.invalidTitleAlert = true
      }
    }
  }
}
</script>

<style type="text/css">
.new-task {
  margin-top: 10px;
}
.form input, .form textarea, .form select, .form b-form-textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.parent-task-text {
  color: #499;
}
</style>
