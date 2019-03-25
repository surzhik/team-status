import React from 'react';
import HomePage from './Home';
import Layout from '../../components/Layout';

function action({ route, params }) {
  return {
    title: 'Overview',
    chunks: ['home'],
    component: (
      <Layout route={route} params={params} title="Project Overview">
        <HomePage />
      </Layout>
    ),
  };
}
export default action;
