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
      title: '',
      description: '',
      priorityId: -1,
      priorityOptions: [],
      dueDate: '2018-07-30T15:00',
      parentId: null,
      parentTask: null,
      // Message given for an empty title.
      invalidTitle: 'Title can not be empty.',
      // Whether the alert for an invalid title should be shown.
      invalidTitleAlert: false
    }
  },
  mounted () {
    this.fetchPriorities()
    this.subtaskSetup()
  },
  computed: {
    titleState () {
      return this.title.length > 0
    }
  },
  methods: {
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
      // Only add the task if the title is valid.
      if (this.title.length > 0) {
        await TasksService.addTask({
          title: this.title,
          description: this.description,
          priority: this.priorityId,
          dueDate: this.dueDate,
          parentId: this.parentId
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
.parent-task-text {
  color: #499;
}
</style>
