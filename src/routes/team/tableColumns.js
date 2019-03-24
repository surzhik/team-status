import React from 'react';
import { Button, Divider, Tag } from 'antd';
import moment from 'moment';
/* eslint-disable css-modules/no-unused-class */
/* eslint-disable no-underscore-dangle */
import s from './Team.css';



const columns = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: (a, b) => a.firstName.localeCompare(b.firstName),
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: 'Skills',
    dataIndex: 'skillsList',
    key: 'skills',
    render: (skills, row) =>
      skills.map(skill => (
        <Tag key={skill._id} onClick={() => row.handleTag(skill._id)}>
          {skill.name}
        </Tag>
      )),
  },
  {
    title: 'Working Hours',
    dataIndex: 'workingHoursFrom',
    key: 'workingHours',
    render: (cell, row) => {
      const timeFrom = row.workingHoursFrom
        ? row.workingHoursFrom.format('HH:mm')
        : 'n/a';
      const timeTo = row.workingHoursTo
        ? row.workingHoursTo.format('HH:mm')
        : 'n/a';
      const tZone = row.workingHoursTimeZone
        ? timeZone[Number(row.workingHoursTimeZone)]
        : '';
      return `${timeFrom} - ${timeTo} ${tZone}`;
    },
  },
  {
    title: 'On Holidays Till',
    dataIndex: 'onHolidaysTill',
    key: 'onHolidaysTill',
    sorter: (a, b) => {
      const aDate = a.onHolidaysTill
        ? a.onHolidaysTill.format('YYYY-MM-DD')
        : '';
      const bDate = b.onHolidaysTill
        ? b.onHolidaysTill.format('YYYY-MM-DD')
        : '';
      return aDate.localeCompare(bDate);
    },
    render: date =>
      date ? (
        <span className={date.isAfter(moment()) ? s.dateAfter : ''}>
          {date.format('YYYY-MM-DD')}
        </span>
      ) : (
        'n/a'
      ),
  },
  {
    title: 'Free Since',
    dataIndex: 'freeSince',
    key: 'freeSince',
    sorter: (a, b) => {
      const aDate = a.freeSince ? a.freeSince.format('YYYY-MM-DD') : '';
      const bDate = b.freeSince ? b.freeSince.format('YYYY-MM-DD') : '';
      return aDate.localeCompare(bDate);
    },
    render: date =>
      date ? (
        <span className={moment().isAfter(date) ? s.dateBefore : ''}>
          {date.format('YYYY-MM-DD')}
        </span>
      ) : (
        'n/a'
      ),
  },
  {
    title: 'Project',
    dataIndex: 'currentProject',
    key: 'project',
    sorter: (a, b) => {
      const aProject = a.currentProject ? a.currentProject.name : '';
      const bProject = b.currentProject ? b.currentProject.name : '';
      return aProject.localeCompare(bProject);
    },
    render: project =>
      project ? <div key={project._id}>{project.name}</div> : 'n/a',
  },
  {
    title: 'Manager',
    dataIndex: 'managerId',
    key: 'manager',
    sorter: (a, b) => {
      const aManager = a.managerId
        ? `${a.managerId.firstName} ${a.managerId.lastName}`
        : '';
      const bManager = b.currentProject
        ? `${b.managerId.firstName} ${b.managerId.lastName}`
        : '';
      return aManager.localeCompare(bManager);
    },
    render: managerId =>
      managerId ? (
        <div key={managerId._id}>
          {managerId.firstName} {managerId.lastName}
        </div>
      ) : (
        'n/a'
      ),
  },
  {
    title: 'Actions',
    key: 'action',
    width: 120,
    render: (text, record) => (
      <span>
        <Button
          className={s.buttonLink}
          shape="circle"
          icon="edit"
          onClick={() => record.handleEdit(record)}
        />
        <Divider type="vertical" />
        <Button
          className={s.buttonLink}
          shape="circle"
          icon="delete"
          onClick={() => record.handleDelete(record)}
        />
      </span>
    ),
  },
];

export default columns;
