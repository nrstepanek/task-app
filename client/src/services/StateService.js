import Api from '@/services/Api'

export default {
  fetchStates () {
    return Api().get('states')
  }
}
