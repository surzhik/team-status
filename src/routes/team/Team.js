import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { orderBy } from 'lodash';
import { message, Button, Icon, Table, Modal, Tag, Divider } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getWorkersList, deleteWorker } from '../../actions/workers';
import AddNewModal from './AddNewModal';
/* eslint-disable css-modules/no-unused-class */
/* eslint-disable no-underscore-dangle */
import s from './Team.css';

function mapStateToProps({
  workers: {
    loading,
    sending,
    deleting,
    updating,
    data: { docs, ...rest },
    reference: { skills, managers, projects },
  },
  error,
}) {
  return {
    loading,
    sending,
    deleting,
    updating,
    data: docs,
    pagination: { ...rest },
    skills,
    managers,
    projects,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getWorkersList,
        deleteWorker,
      },
      dispatch,
    ),
  };
}

const timeZone = ['UTC', 'GMT', 'AST', 'EST', 'PST'];
const limit = 10;

class Team extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  /* eslint-disable no-nested-ternary */
  /* eslint-disable react/no-did-update-set-state */
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    sending: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    pagination: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    skills: PropTypes.array.isRequired,
    managers: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
  };

  static defaultProps = {};

  state = {
    dataLoaded: false,
    showAddNewModal: false,
    dataTable: [],
    workerToEdit: null,
    paginationWithParams: {
      page: 1,
      limit,
    },
    filteredInfo: null,
    sortedInfo: null,
  };

  componentDidMount() {
    const { actions } = this.props;
    const { paginationWithParams } = this.state;
    actions.getWorkersList({ initial: true, ...paginationWithParams });
  }

  componentDidUpdate(prevProps) {
    const { error, loading, sending, deleting, updating, data } = this.props;
    if (error.error && prevProps.error !== error && error.message) {
      message.error(error.message, 10);
    }
    if (!error.error && prevProps.sending && !sending) {
      message.success('Team Member successfully added');
    }
    if (!error.error && prevProps.deleting && !deleting) {
      message.success('Team Member successfully deleted');
    }
    if (!error.error && prevProps.updating && !updating) {
      message.success('Team Member successfully updated');
    }
    if (!loading && prevProps.loading) {
      this.setState({ dataLoaded: true });
    }

    if (data !== prevProps.data) {
      this.prepareDataTable();
    }
  }

  getColumns = () => {
    const { sortedInfo } = this.state;
    const { skills, projects, managers } = this.props;

    return [
      {
        title: 'Name',
        dataIndex: 'fullName',
        key: 'fullName',
        width: '15%',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        sortOrder:
          sortedInfo && sortedInfo.columnKey === 'fullName' && sortedInfo.order,
      },
      {
        title: 'Skills',
        dataIndex: 'skillsList',
        key: 'skillsList',
        width: '25%',
        render: row =>
          orderBy(row, [skill => skill.name.toLowerCase()]).map(skill => (
            <Tag
              key={skill._id}
              color={
                this.getMatchIn('skillsList').indexOf(skill.name) >= 0 &&
                'green'
              }
              onClick={() => this.handleTag(skill.name)}
            >
              {skill.name}
            </Tag>
          )),
        filters: skills.map(skill => ({
          text: skill.name,
          value: skill.name,
        })),
        filteredValue: this.getMatchIn('skillsList'),
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
          return (
            <span
              className={s.timeRange}
            >{`${timeFrom}-${timeTo} ${tZone}`}</span>
          );
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
        sortOrder:
          sortedInfo &&
          sortedInfo.columnKey === 'onHolidaysTill' &&
          sortedInfo.order,
        render: date =>
          date ? (
            <span className={date.isAfter(moment()) ? s.dateAfter : ''}>
              {date.format('YYYY-MM-DD')}
            </span>
          ) : (
            'n/a'
          ),
        filters: [
          {
            text: 'On Holidays',
            value: 'after',
          },
        ],
        filteredValue: this.getMatchIn('onHolidaysTill'),
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
        sortOrder:
          sortedInfo &&
          sortedInfo.columnKey === 'freeSince' &&
          sortedInfo.order,
        render: date =>
          date ? (
            <span className={moment().isAfter(date) ? s.dateBefore : ''}>
              {date.format('YYYY-MM-DD')}
            </span>
          ) : (
            'n/a'
          ),
        filters: [
          {
            text: 'Free Now',
            value: 'before',
          },
        ],
        filteredValue: this.getMatchIn('freeSince'),
      },
      {
        title: 'Project',
        dataIndex: 'currentProject',
        key: 'currentProject',
        sorter: (a, b) => {
          const aProject = a.currentProject ? a.currentProject.name : '';
          const bProject = b.currentProject ? b.currentProject.name : '';
          return aProject.localeCompare(bProject);
        },
        sortOrder:
          sortedInfo &&
          sortedInfo.columnKey === 'currentProject' &&
          sortedInfo.order,
        render: project =>
          project ? <div key={project._id}>{project.name}</div> : 'n/a',
        filters: projects.map(project => ({
          text: project.name,
          value: project.name,
        })),
        filteredValue: this.getMatchIn('currentProject'),
      },
      {
        title: 'Manager',
        dataIndex: 'managerId',
        key: 'managerId',
        sorter: (a, b) => {
          const aManager = a.managerId
            ? `${a.managerId.firstName} ${a.managerId.lastName}`
            : '';
          const bManager = b.currentProject
            ? `${b.managerId.firstName} ${b.managerId.lastName}`
            : '';
          return aManager.localeCompare(bManager);
        },
        sortOrder:
          sortedInfo &&
          sortedInfo.columnKey === 'managerId' &&
          sortedInfo.order,
        render: managerId =>
          managerId ? (
            <div key={managerId._id}>
              {managerId.firstName} {managerId.lastName}
            </div>
          ) : (
            'n/a'
          ),
        filters: managers.map(manager => ({
          text: `${manager.firstName} ${manager.lastName}`,
          value: `${manager.firstName} ${manager.lastName}`,
        })),
        filteredValue: this.getMatchIn('managerId'),
      },
      {
        title: 'Actions',
        key: 'action',
        width: 120,
        render: (text, record) => (
          <span className={s.actionsHolder}>
            <Button
              className={s.buttonLink}
              shape="circle"
              icon="edit"
              onClick={() => this.handleEdit(record)}
            />
            <Divider type="vertical" />
            <Button
              className={s.buttonLink}
              shape="circle"
              icon="delete"
              onClick={() => this.handleDelete(record)}
            />
          </span>
        ),
      },
    ];
  };

  prepareDataTable = () => {
    const { data } = this.props;
    const dataTable = data.map((row, index) => ({
      _id: row._id,
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      fullName: row.fullName,
      key: index,
      managerId: row.managerId,
      currentProject: row.currentProject,
      skillsList: row.skillsList,
      onHolidaysTill: row.onHolidaysTill ? moment(row.onHolidaysTill) : null,
      freeSince: row.freeSince ? moment(row.freeSince) : null,
      workingHoursFrom: row.workingHours.start
        ? moment(row.workingHours.start, 'HH:mm')
        : null,
      workingHoursTo: row.workingHours.end
        ? moment(row.workingHours.end, 'HH:mm')
        : null,
      workingHoursTimeZone: row.workingHours.timezone,
    }));
    this.setState({ dataTable });
  };

  showAddNewModal = () => {
    this.setState({ showAddNewModal: true });
  };

  handleCancelModal = () => {
    this.setState({ showAddNewModal: false, workerToEdit: null });
  };

  handleEdit = workerToEdit => {
    this.setState({ workerToEdit, showAddNewModal: true });
  };

  handleDelete = worker => {
    const { paginationWithParams } = this.state;
    const { actions } = this.props;
    Modal.confirm({
      title: `Delete Team Member ${worker.firstName} ${worker.lastName}`,
      content: <span>Are you sure you want to delete this worker?</span>,
      okText: 'Yes, delete',
      cancelText: 'Oh, No!',
      onOk() {
        return actions.deleteWorker({
          id: worker._id,
          pagination: paginationWithParams,
        });
      },
    });
  };

  getMatchIn = column => {
    const {
      paginationWithParams: { matchColumn, matchIn },
    } = this.state;
    const columnIndex = matchColumn ? matchColumn.indexOf(column) : -1;
    return columnIndex >= 0 && matchIn ? matchIn[columnIndex] : [];
  };

  prepareMatch = (
    paginationWithParams,
    column,
    values,
    addColumnWantTo = true,
  ) => {
    const paginationWithParamsNew = paginationWithParams || {};
    const { matchColumn, matchIn } = paginationWithParamsNew;
    const matchColumnNew = matchColumn ? [...matchColumn] : [];
    const matchInNew = matchIn ? [...matchIn] : [];
    const columnIndex = matchColumn ? matchColumn.indexOf(column) : -1;
    const addColumn = addColumnWantTo && values && values.length > 0;
    if (addColumn && columnIndex >= 0) {
      matchInNew[columnIndex] = values;
    } else if (addColumn) {
      matchColumnNew.push(column);
      matchInNew.push(values);
    } else if (columnIndex >= 0) {
      matchColumnNew.splice(columnIndex, 1);
      matchInNew.splice(columnIndex, 1);
    }

    if (matchColumnNew.length > 0) {
      paginationWithParamsNew.matchColumn = matchColumnNew;
      paginationWithParamsNew.matchIn = matchInNew;
    } else {
      delete paginationWithParamsNew.matchColumn;
      delete paginationWithParamsNew.matchIn;
    }

    return paginationWithParamsNew;
  };

  prepareMatchIn = (
    column,
    value,
    addValue = 1, // 1 - add, 0 - toggle, -1 remove
  ) => {
    const matchIn = this.getMatchIn(column);
    const valueIndex = matchIn.indexOf(value);
    if ((addValue === 1 || addValue === 0) && valueIndex < 0 && value) {
      matchIn.push(value);
    } else if (
      (addValue === -1 || addValue === 0) &&
      valueIndex >= 0 &&
      value
    ) {
      matchIn.splice(matchIn.indexOf(value), 1);
    }
    return matchIn;
  };

  onTableChange = (tablePagination, filters, sorter, extra) => {
    const { filteredInfo } = this.state;
    const { actions, pagination } = this.props;

    let paginationWithParams = Object.assign(
      {},
      this.state.paginationWithParams,
    );
    if (tablePagination.current !== pagination.page) {
      paginationWithParams.page = tablePagination.current;
      this.setState({
        paginationWithParams,
      });
    } else {
      paginationWithParams.page =
        JSON.stringify(filteredInfo) === JSON.stringify(filters)
          ? pagination.page
          : 1;
      if (sorter.columnKey && sorter.order) {
        paginationWithParams.sortColumn = sorter.columnKey;
        paginationWithParams.sortOrder = sorter.order;
      } else {
        delete paginationWithParams.sortColumn;
        delete paginationWithParams.sortOrder;
      }

      Object.keys(filters).forEach(filterMatch => {
        paginationWithParams = this.prepareMatch(
          paginationWithParams,
          filterMatch,
          filters[filterMatch],
        );
      });

      this.setState({
        paginationWithParams,
        filteredInfo: filters,
        sortedInfo: sorter,
      });
    }
    actions.getWorkersList(paginationWithParams);
  };

  handleTag = skillName => {
    const { actions } = this.props;
    let paginationWithParams = Object.assign(
      {},
      this.state.paginationWithParams,
    );
    paginationWithParams.page = 1;

    paginationWithParams = this.prepareMatch(
      paginationWithParams,
      'skillsList',
      this.prepareMatchIn('skillsList', skillName, 0),
    );

    console.log('paginationWithParams', paginationWithParams);
    this.setState({ paginationWithParams });
    actions.getWorkersList(paginationWithParams);
  };

  handleClearFilters = () => {
    const { actions } = this.props;
    const paginationWithParams = {
      page: 1,
      limit,
    };
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
      paginationWithParams,
    });
    actions.getWorkersList(paginationWithParams);
  };

  handleChangePage = () => {};

  render() {
    const {
      dataLoaded,
      showAddNewModal,
      dataTable,
      workerToEdit,
      paginationWithParams,
      sortedInfo,
      filteredInfo,
    } = this.state;
    const { loading, pagination } = this.props;

    return (
      <div className={s.overHolder}>
        <AddNewModal
          visible={showAddNewModal}
          handleCancel={this.handleCancelModal}
          workerToEdit={workerToEdit}
          paginationWithParams={paginationWithParams}
        />

        <div className={s.buttonsHolder}>
          <span>
            <Button
              htmlType="button"
              disabled={loading || !dataLoaded}
              onClick={this.showAddNewModal}
            >
              <Icon type="plus" /> Add new Team Member
            </Button>
          </span>
          <span>
            {(Object.keys(paginationWithParams).length > 2 ||
              sortedInfo ||
              filteredInfo) && (
              <Button htmlType="button" onClick={this.handleClearFilters}>
                <Icon type="clear" /> Clear All Filters
              </Button>
            )}
          </span>
        </div>
        <div className={s.dataHolder}>
          <Table
            loading={loading || !dataLoaded}
            columns={this.getColumns()}
            dataSource={dataTable}
            pagination={{
              pageSize: pagination.limit,
              current: pagination.page,
              total: pagination.totalDocs,
            }}
            onChange={this.onTableChange}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(s)(Team));
