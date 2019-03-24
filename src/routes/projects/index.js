import React from 'react';
import ProjectsPage from './Projects';
import Layout from '../../components/Layout';

function action({ route, params }) {
  return {
    title: 'Projects',
    chunks: ['projects'],
    component: (
      <Layout route={route} params={params} title="Our Projects List">
        <ProjectsPage />
      </Layout>
    ),
  };
}
export default action;
