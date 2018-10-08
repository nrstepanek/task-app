import Vue from 'vue'
import Router from 'vue-router'
import Tasks from '@/components/Tasks'
import NewTask from '@/components/NewTask'
import EditTask from '@/components/EditTask'
import EditPriorities from '@/components/EditPriorities'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/tasks/new',
      name: 'NewTask',
      component: NewTask
    },
    {
      path: '/tasks/:id',
      name: 'EditTask',
      component: EditTask
    },
    {
      path: '/priorities',
      name: 'EditPriorities',
      component: EditPriorities
    }
  ]
})
