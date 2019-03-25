import React from 'react';
import Layout from '../../components/Layout';
import NotFound from './NotFound';

const title = '404. Page Not Found';

function action({ route, params }) {
  return {
    chunks: ['not-found'],
    title,
    component: (
      <Layout route={route} params={params} title="Error 404">
        <NotFound title={title} />
      </Layout>
    ),
    status: 404,
  };
}

export default action;
