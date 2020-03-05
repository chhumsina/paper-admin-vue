const routes = [
  {
    path: '',
    component: () => import('@/layouts/common'),
    children: [
      {
        name: 'Home',
        path: '/',
        component: () => import('@/views/home'),
        meta: {
          needLogin: true,
          activeSrc: '/'
        }
      },
      {
        name: 'Articles',
        path: '/articles',
        component: () => import('@/views/articles'),
        meta: {
          needLogin: true,
          activeSrc: '/articles'
        }
      },
      {
        name: 'UserInfo',
        path: '/user-info',
        component: () => import('@/views/user-info'),
        meta: {
          needLogin: true,
          activeSrc: '/user-info'
        }
      },
      {
        name: 'Tag',
        path: '/tags',
        component: () => import('@/views/tags'),
        meta: {
          needLogin: true,
          activeSrc: '/tags'
        }
      },
      {
        name: 'CreateTag',
        path: '/create-tag',
        alias: '/edit-tag',
        component: () => import('@/views/create-tag'),
        meta: {
          needLogin: true,
          activeSrc: '/tags'
        }
      }
    ]
  },
  {
    path: '',
    component: () => import('@/layouts/blank'),
    children: [
      {
        name: 'Login',
        path: '/login',
        component: () => import('@/views/login'),
        meta: {
          needLogin: false
        }
      },
      {
        name: 'Register',
        path: '/register',
        component: () => import('@/views/register'),
        meta: {
          needLogin: false
        }
      },
      {
        name: 'CreateArticle',
        path: '/create-article',
        alias: '/edit-article',
        component: () => import('@/views/create-article'),
        meta: {
          needLogin: true
        }
      },
      {
        name: 'NotFound',
        path: '*',
        component: () => import('@/views/404'),
        meta: {
          needLogin: false
        }
      }
    ]
  }
];

export default routes;
