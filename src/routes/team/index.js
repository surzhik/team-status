import React from 'react';
import TeamPage from './Team';
import Layout from '../../components/Layout';

function action({ route, params }) {
  return {
    title: 'Team',
    chunks: ['team'],
    component: (
      <Layout route={route} params={params} title="Development Team">
        <TeamPage />
      </Layout>
    ),
  };
}
export default action;
