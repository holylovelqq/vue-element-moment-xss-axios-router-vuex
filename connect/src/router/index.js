// (C) 2018 SEIKO SOLUTIONS INC.

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/layouts/AppHome'
// import Login from '@/pages/Login'
// import Dashboard from '@/pages/Dashboard'
import IncidentDetail from '@/pages/IncidentDetail'
import KnowledgeList from '@/pages/KnowledgeList'
import KnowledgeDetail from '@/pages/KnowledgeDetail'
import KnowledgeEdit from '@/pages/KnowledgeEdit'
import IncidentList from '@/pages/IncidentList'
import NotFount from '@/pages/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login,
    //   meta: {
    //     title: 'login',
    //     isCheck: false
    //   }
    // },
    {
      path: '/',
      redirect: '/incident',
      meta: {
        isCheck: false
      }
    },
    {
      path: '/incident',
      component: Home,
      meta: {
        title: 'home',
        isCheck: true
      },
      children: [
        // {
        //   path: '/',
        //   name: 'dashboard',
        //   component: Dashboard,
        //   meta: {
        //     title: 'dashboard',
        //     isCheck: true
        //   }
        // },
        {
          path: '/',
          name: 'incident',
          component: IncidentList,
          meta: {
            title: 'incident',
            isCheck: true
          }
        },
        {
          path: '/incident/:id',
          name: 'incident_detail',
          component: IncidentDetail,
          meta: {
            title: 'incident_detail',
            isCheck: true
          }
        },
        {
          path: '/knowledge',
          name: 'knowledge',
          component: KnowledgeList,
          meta: {
            title: 'knowledge',
            isCheck: true
          },
          props: (route) => ({ queryObj: route.query })
        },
        {
          path: '/knowledge/:id',
          name: 'knowledge_detail',
          component: KnowledgeDetail,
          meta: {
            title: 'knowledge_detail',
            isCheck: true
          }
        },
        {
          path: '/knowledge-new',
          name: 'knowledge_new',
          component: KnowledgeEdit,
          meta: {
            title: 'knowledge_new',
            isCheck: true
          }
        },
        {
          path: '/knowledge/:id/edit',
          name: 'knowledge_edit',
          component: KnowledgeEdit,
          meta: {
            title: 'knowledge_edit',
            isCheck: true
          }
        }
      ]
    },
    {
    // notfound
      path: '/notfound',
      component: NotFount,
      name: 'notfound',
      meta: {
        title: 'notfound',
        isCheck: false
      }
    },
    {
      path: '*',
      redirect: '/notfound',
      meta: {
        isCheck: false
      }
    }
  ]
})
