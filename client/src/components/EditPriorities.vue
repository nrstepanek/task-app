
<template>
  <b-container class="priorities">
    <b-col cols="1"></b-col>
      <b-col cols="12">
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
    <b-col cols="1"></b-col>
  </b-container>
</template>

<script>
import PriorityService from '@/services/PriorityService'

export default {
  name: 'priorities',
  data () {
    return {
      priorities: []
    }
  },
  mounted () {
    this.getPriorities()
  },
  methods: {
    async getPriorities () {
      const response = await PriorityService.fetchPriorities()
      this.priorities = response.data
    },
    async deletePriority (id) {
      await PriorityService.deletePriority(id)
      this.$router.push({ name: 'EditPriorities' })
    }
  }
}
</script>

<style>
.priorities {
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
