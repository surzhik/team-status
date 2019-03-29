/* eslint-env jest */
/* eslint-disable padded-blocks, no-unused-expressions */

import React from 'react';
import moment from 'moment';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import TeamDefault, { Team } from './Team';

configure({ adapter: new Adapter() });

describe('Search container', () => {
  const getWorkersList = jest.fn();
  const props = {
    loading: false,
    sending: false,
    deleting: false,
    updating: false,
    data: [],
    skills: [],
    managers: [],
    projects: [],
    pagination: {
      limit: 10,
      page: 1,
    },
    actions: {
      getWorkersList,
    },
    error: {},
  };

  const state = {
    dataLoaded: false,
    showAddNewModal: false,
    dataTable: [],
    workerToEdit: null,
    paginationWithParams: {
      page: 1,
      limit: 10,
    },
    sortedInfo: null,
  };

  const store = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({
      workers: {
        loading: false,
        sending: false,
        deleting: false,
        updating: false,
        data: {
          docs: [],
          limit: null,
          page: null,
          pages: null,
          total: null,
        },
        reference: {
          skills: [],
          managers: [],
          projects: [],
        },
      },
      error: {},
    }),
  };
  const options = {
    context: { store },
  };

  describe('Initial snapshot', () => {
    const teamContainer = shallow(<Team {...props} />, options);
    it('get Snapshot', () => {
      expect(teamContainer).toMatchSnapshot();
    });
  });

  describe('Initial view', () => {
    const teamContainer = mount(<TeamDefault {...props} />, options);
    it('Render buttons', () => {
      expect(teamContainer.find('button')).toHaveLength(2);
    });
    it('Render table', () => {
      expect(teamContainer.find('table')).toHaveLength(1);
    });
  });

  describe('Initial state', () => {
    const teamContainer = mount(<TeamDefault {...props} />, options);
    it('Initial state', () => {
      teamContainer.setState(state);
      expect(teamContainer.state()).toEqual(state);
    });
  });

  describe('Table with data', () => {
    jest.useFakeTimers();
    const teamContainer = mount(<TeamDefault {...props} />, options);
    it('Rows length with data', () => {
      const upState = { ...state };
      const row = {
        _id: 1,
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'Jon Doe',
        key: 1,
        managerId: { fullName: 'Tom York' },
        currentProject: { name: 'Billing' },
        skillsList: [{ name: 'Bootstrap' }],
        onHolidaysTill: moment(),
        freeSince: moment(),
        workingHoursFrom: moment('10:00', 'HH:mm'),
        workingHoursTo: moment('19:00', 'HH:mm'),
        workingHoursTimeZone: 0,
      };
      upState.dataTable = [row, row, row, row];

      teamContainer.setState(upState);
      setTimeout(() => {
        expect(teamContainer.find('tr')).toHaveLength(upState.dataTable.length);
      }, 500);
    });
  });
  jest.runAllTimers();
});
