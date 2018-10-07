
<template>
  <b-container>
    <b-row>
      <b-col cols="1"></b-col>
      <b-col cols="6">
        <b-alert :show="invalidTitleAlert" dismissible variant="warning">
          The title of a task can not be empty.
        </b-alert>
        <h1>Edit Task</h1>
        <b-form @submit="updateTask">
          <b-form-group label="Title" :invalid-feedback="invalidTitle" :state="titleState">
            <b-form-input id="titleInput" type="text" v-model="title" placeholder="Name your task.">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea id="descriptionInput" :rows="3" :max-rows="10" v-model="description" placeholder="Describe your task.">
            </b-form-textarea>
          </b-form-group>
          <b-form-group label="Priority">
            <b-form-select id="priorityInput" :options="priorityOptions" v-model="priorityId" placeholder="Prioritize your task.">
            </b-form-select>
          </b-form-group>
          <b-form-group label="State">
            <b-form-select id="stateInput" :options="stateOptions" v-model="stateId">
            </b-form-select>
          </b-form-group>
          <b-form-group label="Due Date">
            <b-form-input id="endDateInput" type="datetime-local" v-model="dueDate">
            </b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Update Task</b-button>
        </b-form>
      </b-col>
      <b-col cols="4">
        <h1>Comments</h1>
        <b-card v-for="comment in comments" v-bind:key="comment.id">
          {{ comment.contents }}
        </b-card>
        <b-form @submit="addComment">
          <b-form-group>
            <b-form-textarea id="commentInput" :rows="5" :max-rows="10" v-model="commentToAdd" placeholder="Add a comment to this task.">
            </b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">Add Comment</b-button>
        </b-form>
      </b-col>
      <b-col cols="1"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import TasksService from '@/services/TasksService'
import PriorityService from '@/services/PriorityService'
import StateService from '@/services/StateService'
import CommentService from '@/services/CommentService'

export default {
  name: 'EditTask',
  data () {
    return {
      title: '',
      description: '',
      priorityId: -1,
      stateId: -1,
      dueDate: null,
      priorityOptions: [],
      stateOptions: [],
      comments: [],
      commentToAdd: '',
      // Message given for an empty title.
      invalidTitle: 'Title can not be empty.',
      // Whether the alert for an invalid title should be shown.
      invalidTitleAlert: false
    }
  },
  mounted () {
    this.fetchPriorities()
    this.fetchStates()
    this.getComments()
    this.getTask()
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
    async fetchStates () {
      this.stateOptions = []
      const response = await StateService.fetchStates()
      for (var i = 0; i < response.data.length; i++) {
        let newStateOption = {
          value: response.data[i].id,
          text: response.data[i].name
        }
        this.stateOptions.push(newStateOption)
      }
    },
    async getComments () {
      const response = await TasksService.getTaskComments({
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
      this.priorityId = response.data.priority_id
      this.stateId = response.data.state_id
      this.dueDate = response.data.due_date.replace(' ', 'T')
    },
    async updateTask () {
      await TasksService.updateTask({
        id: this.$route.params.id,
        title: this.title,
        description: this.description,
        priorityId: this.priorityId,
        stateId: this.stateId,
        dueDate: this.dueDate.replace('T', ' ')
      })
      this.$router.push({ name: 'Tasks' })
    },
    async addComment () {
      await CommentService.addComment({
        contents: this.commentToAdd,
        taskId: this.$route.params.id
      })
      this.$router.go(this.$router.currentRoute)
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
