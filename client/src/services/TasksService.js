import Api from '@/services/Api'

export default {
  fetchTasks () {
    return Api().get('tasks')
  },
  addTask (params) {
    return Api().post('tasks', params)
  },
  updateTask (params) {
    return Api().put('tasks/' + params.id, params)
  },
  getTask (id) {
    return Api().get('tasks/' + id)
  },
  getTaskComments (id) {
    return Api().get('tasks/comments/' + id)
  },
  deleteTask (id) {
    return Api().delete('tasks/' + id)
  }
}
