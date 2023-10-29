import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/visitor/Login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('../views/visitor/Forgot.vue'),
      meta: {
        title: '忘记密码'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/visitor/Register.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/',
      name: 'controller',
      redirect: '/index',
      component: () => import('../views/controller/ControllerApp.vue'),
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('../views/controller/Index.vue'),
          meta: {
            title: '控制面板'
          }
        },
        {
          path: '/signList',
          name: 'signList',
          component: () => import('../views/controller/sign/List.vue'),
          meta: {
            title: '签名列表'
          }
        },
        {
          path: '/signDetail/:sid',
          name: 'signDetail',
          component: () => import('../views/controller/sign/Detail.vue'),
          meta: {
            title: '模板报备'
          }
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('../views/controller/setting/Setting.vue'),
          meta: {
            title: '设置'
          }
        },
        {
          path: '/log',
          name: 'log',
          component: () => import('../views/controller/log/Log.vue'),
          meta: {
            title: '发信日志'
          }
        },
        {
          path: '/sent',
          name: 'sent',
          component: () => import('../views/controller/sent/Sent.vue'),
          meta: {
            title: '发信测试'
          }
        },
        {
          path: '/exchange',
          name: 'exchange',
          component: () => import('../views/controller/exchange/exchange.vue'),
          meta: {
            title: '兑换'
          }
        },
        {
          path: '/admin',
          children: [
            {
              path: '/admin/userManage',
              name: 'adminUser',
              component: () => import('../views/controller/admin/user/User.vue'),
              meta: {
                title: '管理用户'
              }
            },
            {
              path: '/admin/userDetail/:uid',
              name: 'userDetail',
              component: () => import('../views/controller/admin/user/Detail.vue'),
              meta: {
                title: '用户详情'
              }
            },
            {
              path: '/admin/log',
              name: 'SendLog',
              component: () => import('../views/controller/admin/log/Log.vue'),
              meta: {
                title: '发信日志'
              }
            },
            {
              path: '/admin/system',
              name: 'SystemSetting',
              component: () => import('../views/controller/admin/system/System.vue'),
              meta: {
                title: '系统设置'
              }
            },
            {
              path: '/admin/exchange',
              name: 'AdminExchange',
              component: () => import('../views/controller/admin/exchange/Exchange.vue'),
              meta: {
                title: '兑换'
              }
            },
          ]
        }
      ]
    }
  ]
})

export default router
