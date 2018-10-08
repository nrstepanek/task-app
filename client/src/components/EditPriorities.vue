
<template>
  <b-container class="priorities">
    <b-row>
      <b-col cols="1"></b-col>
      <b-col cols="5">
        <h1>Priorities</h1>
        <table align="center">
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Description</td>
            <td>Action</td>
          </tr>
          <tr v-for="priority in priorities" v-bind:key="priority.id">
            <td>{{ priority.id }}</td>
            <td>{{ priority.name }}</td>
            <td>{{ priority.description }}</td>
            <td align="center">
              <a href="#" @click="deletePriority(priority.id)">Delete</a>
            </td>
          </tr>
        </table>
      </b-col>
      <b-col cols="5">
        <b-alert :show="invalidPriorityAlert" dismissible variant="warning">
          The name of a priority cannot be empty.
        </b-alert>
        <h1>Add a Priority</h1>
        <b-form @submit="addPriority">
          <b-form-group label="Name" :state="nameState">
            <b-form-input id="nameInput" type="text" v-model="name" placeholder="Name of priority.">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea id="descriptionInput" type="textarea" :rows="3" :max-rows="10" v-model="description" placeholder="Describe this priority.">
            </b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">Add Priority</b-button>
        </b-form>
      </b-col>
      <b-col cols="1"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import PriorityService from '@/services/PriorityService'

export default {
  name: 'priorities',
  data () {
    return {
      priorities: [],
      name: '',
      description: '',
      invalidPriorityAlert: false
    }
  },
  mounted () {
    this.getPriorities()
  },
  computed: {
    nameState () {
      return this.name.length > 0
    }
  },
  methods: {
    async getPriorities () {
      const response = await PriorityService.fetchPriorities()
      this.priorities = response.data
    },
    async deletePriority (id) {
      await PriorityService.deletePriority(id)
      this.$router.go(this.$router.currentRoute)
    },
    async addPriority () {
      // Only add the priority if the title is valid.
      if (this.name.length > 0) {
        await PriorityService.addPriority({
          name: this.name,
          description: this.description
        })
        this.$router.go(this.$router.currentRoute)
      } else {
        this.invalidPriorityAlert = true
      }
    }
  }
}
</script>

<style>
.priorities {
  margin-top: 10px;
}
a {
  color: #4d7ef7;
  text-decoration: none;
}
</style>
