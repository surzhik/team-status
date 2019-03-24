/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '',
      load: () => import(/* webpackChunkName: 'team' */ './team'),
    },
    {
      path: '/managers',
      load: () => import(/* webpackChunkName: 'managers' */ './managers'),
    },
    {
      path: '/skills',
      load: () => import(/* webpackChunkName: 'skills' */ './skills'),
    },
    {
      path: '/projects',
      load: () => import(/* webpackChunkName: 'projects' */ './projects'),
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Table Sortable'} - test task`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
