
<template>
  <b-container class="edit-container">
    <b-row>
      <b-col cols="1"></b-col>
      <b-col cols="5" class="edit-column">
        <b-alert :show="invalidTitleAlert" dismissible variant="warning">
          The title of a task cannot be empty.
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
      <b-col cols="5" class="comment-column">
        <h1>Comments</h1>
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
      title: '', // The title of this task.
      description: '', // The description of this task.
      priorityId: -1, // The priority of this task.
      stateId: -1, // The state of this task.
      dueDate: null, // The due-date of this task.
      priorityOptions: [], // All of the available priorities.
      stateOptions: [], // All of the available states.
      comments: [], // The comments on this task.
      commentToAdd: '', // The comment to add to this task.
      invalidTitle: 'Title can not be empty.', // Message given for an empty title.
      invalidTitleAlert: false // Whether the alert for an invalid title should be shown.
    }
  },
  mounted () {
    this.fetchPriorities()
    this.fetchStates()
    this.fetchComments()
    this.getTask()
  },
  computed: {
    // Whether the title of this task is valid or not.
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
    // Fetch all states.
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
    // Fetch all comments.
    async fetchComments () {
      const response = await TasksService.getTaskComments(this.$route.params.id)
      this.comments = response.data
    },
    // Get the task with the given task id.
    async getTask () {
      const response = await TasksService.getTask(this.$route.params.id)
      this.title = response.data.title
      this.description = response.data.description
      this.priorityId = response.data.priority_id
      this.stateId = response.data.state_id
      this.dueDate = response.data.due_date.replace(' ', 'T')
    },
    // Update the task with the given task id from user's inputs.
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
    // Add a comment to this task.
    async addComment () {
      await CommentService.addComment({
        contents: this.commentToAdd,
        taskId: this.$route.params.id
      })
      // Refresh the comments after adding.
      this.fetchComments()
      this.commentToAdd = ''
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
</style>
