
<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">Task App</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="#/tasks">Tasks</b-nav-item>
          <b-nav-item href="#/tasks/new">New Task</b-nav-item>
          <b-nav-item-dropdown text="Admin Tools" right>
            <b-dropdown-item href="#/priorities">Edit Priorities</b-dropdown-item>
            <b-dropdown-item href="#/states">Edit States</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fcffff;
  font-size: 0.85rem;
}
.table-wrap {
  width: 100%;
  margin: 0 auto;
  margin-top: 10px;
  text-align: center;
}
table, td {
  border: 1px solid black;
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
  background: #e2e2e2;
}
table tr:nth-child(even) {
  background: #faffff;
}
table tr:nth-child(1) {
  background: #343a40;
  color: #fff;
}
a {
  color: #4d7ef7;
  text-decoration: none;
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
