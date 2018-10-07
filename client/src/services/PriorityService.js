import Api from '@/services/Api'

export default {
  fetchPriorities () {
    return Api().get('priorities')
  }
}
