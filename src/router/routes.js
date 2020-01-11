
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/leafEdit', component: () => import('pages/LeafEdit.vue') },
      { path: '/branchEdit', component: () => import('pages/BranchEdit.vue') }

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
