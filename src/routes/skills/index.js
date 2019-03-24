import React from 'react';
import SkillsPage from './Skills';
import Layout from '../../components/Layout';

function action({ route, params }) {
  return {
    title: 'Skills',
    chunks: ['skills'],
    component: (
      <Layout route={route} params={params} title="List of team members Skills">
        <SkillsPage />
      </Layout>
    ),
  };
}
export default action;
