import Api from '@/services/Api'

export default {
  fetchStates () {
    return Api().get('states')
  },
  deleteState (id) {
    return Api().delete('states/' + id)
  },
  addState (params) {
    return Api().post('states', params)
  }
}
