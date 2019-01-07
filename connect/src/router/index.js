// (C) 2018 SEIKO SOLUTIONS INC.

import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/TimeHome'
import Login from '../components/pages/Login'
import Dashboard from '../components/pages/Dashboard'
import IncidentsDetail from '../components/pages/IncidentsDetail'
import KnowledgeList from '../components/pages/KnowledgeList'
import KnowledgeDetail from '../components/pages/KnowledgeDetail'
import KnowledgeEdit from '../components/pages/KnowledgeEdit'
import OtherIncidents from '../components/pages/OtherIncidents'
import SelfIncidents from '../components/pages/SelfIncidents'
import NotFount from '../components/pages/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'login',
      isCheck: false
    }
  },
  {
    path: '/',
    redirect: '/login',
    meta: {
      isCheck: false
    }
  },
  {
    path: '/dashboard',
    component: Home,
    meta: {
      title: 'dashboard',
      isCheck: true
    },
    children: [{
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        title: 'dashboard',
        isCheck: true
      }
    },
    {
      path: '/incdetail/:id',
      name: 'incident_detail',
      component: IncidentsDetail,
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
      }
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
      path: '/knowledge/new',
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
    },
    {
      path: '/otherinc',
      name: 'other_incidents',
      component: OtherIncidents,
      meta: {
        title: 'other_incidents',
        isCheck: true
      }
    },
    {
      path: '/selfinc',
      name: 'self_incidents',
      component: SelfIncidents,
      meta: {
        title: 'self_incidents',
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
