
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Auth.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/leafEdit', component: () => import('pages/LeafEdit.vue') },
      { path: '/branchEdit', component: () => import('pages/BranchEdit.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
