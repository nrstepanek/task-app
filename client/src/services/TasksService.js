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

  getTask (params) {
    console.log('getTask id: ' + params.id)
    return Api().get('tasks/' + params.id)
  },

  getTaskComments (params) {
    return Api().get('tasks/comments/' + params.taskId)
  },

  deleteTask (id) {
    return Api().delete('tasks/' + id)
  }
}
