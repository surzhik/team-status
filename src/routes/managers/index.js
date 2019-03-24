import React from 'react';
import ManagersPage from './Managers';
import Layout from '../../components/Layout';

function action({ route, params }) {
  return {
    title: 'Managers',
    chunks: ['managers'],
    component: (
      <Layout route={route} params={params} title="Projects Managers">
        <ManagersPage />
      </Layout>
    ),
  };
}
export default action;
