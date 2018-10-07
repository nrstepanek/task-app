import Api from '@/services/Api'

export default {
  addComment (params) {
    return Api().post('comments', params)
  }
}
