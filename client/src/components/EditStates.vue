
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
              <a href="#" @click="deleteState(state.id)">Delete</a>
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
      states: [],
      name: '',
      description: '',
      invalidStateAlert: false
    }
  },
  mounted () {
    this.getStates()
  },
  computed: {
    nameState () {
      return this.name.length > 0
    }
  },
  methods: {
    async getStates () {
      const response = await StateService.fetchStates()
      this.states = response.data
    },
    async deleteState (id) {
      await StateService.deleteState(id)
      this.$router.go(this.$router.currentRoute)
    },
    async addState () {
      // Only add the priority if the title is valid.
      if (this.name.length > 0) {
        await StateService.addState({
          name: this.name,
          description: this.description
        })
        this.$router.go(this.$router.currentRoute)
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
</style>
