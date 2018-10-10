
<template>
  <b-container class="states">
    <b-row>
      <b-col cols="1"></b-col>
      <b-col cols="6">
        <h1>States</h1>
        <table align="center">
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Description</td>
            <td>Action</td>
          </tr>
          <tr v-for="state in states" v-bind:key="state.id">
            <td>{{ state.id }}</td>
            <td>{{ state.name }}</td>
            <td>{{ state.description }}</td>
            <td align="center">
              <a href="#" @click.prevent="deleteState(state.id)">Delete</a>
            </td>
          </tr>
        </table>
      </b-col>
      <b-col cols="4">
        <b-alert :show="invalidStateAlert" dismissible variant="warning">
          The name of a state cannot be empty.
        </b-alert>
        <h1>Add a State</h1>
        <b-form @submit="addState">
          <b-form-group label="Name" :state="nameState">
            <b-form-input id="nameInput" type="text" v-model="name" placeholder="Name of state.">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea id="descriptionInput" type="textarea" :rows="3" :max-rows="10" v-model="description" placeholder="Describe this state.">
            </b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">Add State</b-button>
        </b-form>
      </b-col>
      <b-col cols="1"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import StateService from '@/services/StateService'

export default {
  name: 'states',
  data () {
    return {
      states: [], // All of the states from the database.
      name: '', // The name of the state to add.
      description: '', // The description of the state to add.
      invalidStateAlert: false // Whether the invalid state alert should be shown.
    }
  },
  mounted () {
    this.fetchStates()
  },
  computed: {
    // Whether the name of this state is valid.
    nameState () {
      return this.name.length > 0
    }
  },
  methods: {
    // Fetch all states.
    async fetchStates () {
      const response = await StateService.fetchStates()
      this.states = response.data
    },
    // Delete the state with the given id.
    async deleteState (id) {
      await StateService.deleteState(id)
      this.fetchStates()
    },
    // Add a state if user inputs are valid.
    async addState () {
      // Only add the priority if the title is valid.
      if (this.name.length > 0) {
        await StateService.addState({
          name: this.name,
          description: this.description
        })
        this.$router.push({ name: 'EditStates' })
      } else {
        this.invalidStateAlert = true
      }
    }
  }
}
</script>

<style>
.states {
  margin-top: 10px;
}
</style>
