import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
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
    actions.getWorkersList();
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

  prepareDataTable = () => {
    const { data } = this.props;
    const dataTable = data.map((row, index) => ({
      _id: row._id,
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
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
    const { actions, paginationWithParams } = this.props;
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

  onTableChange = (pagination, filters, sorter, extra) => {
    const { page } = this.state;
    const { actions } = this.props;

    const paginationWithParams = Object.assign(
      {},
      this.state.paginationWithParams,
    );
    paginationWithParams.page = 1;
    if (sorter.columnKey && sorter.order) {
      paginationWithParams.sortColumn = sorter.columnKey;
      paginationWithParams.sortOrder = sorter.order;
    } else {
      delete paginationWithParams.sortColumn;
      delete paginationWithParams.sortOrder;
    }

    this.setState({
      paginationWithParams,
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    actions.getWorkersList(paginationWithParams);
  };

  handleTag = skillName => {
    const { page, perPage } = this.state;
    const { actions, pagination } = this.props;
    const paginationWithParams = Object.assign(
      {},
      this.state.paginationWithParams,
    );
    paginationWithParams.page = 1;
    paginationWithParams.matchColumn = 'skillsList';
    paginationWithParams.matchIn = skillName;
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

  getColumns = () => {
    const { sortedInfo } = this.state;
    return [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        sortOrder:
          sortedInfo &&
          sortedInfo.columnKey === 'firstName' &&
          sortedInfo.order,
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        sortOrder:
          sortedInfo && sortedInfo.columnKey === 'lastName' && sortedInfo.order,
      },
      {
        title: 'Skills',
        dataIndex: 'skillsList',
        key: 'skills',
        render: (skills, row) =>
          skills.map(skill => (
            <Tag key={skill._id} onClick={() => this.handleTag(skill.name)}>
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
    const { loading } = this.props;

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
            <Button disabled={loading} onClick={this.showAddNewModal}>
              <Icon type="plus" /> Add new Team Member
            </Button>
          </span>
          <span>
            {(Object.keys(paginationWithParams).length > 2 ||
              sortedInfo ||
              filteredInfo) && (
              <Button onClick={this.handleClearFilters}>
                <Icon type="clear" /> Clear All Filters
              </Button>
            )}
          </span>
        </div>
        <div className={s.dataHolder}>
          <Table
            loading={loading}
            columns={this.getColumns()}
            dataSource={dataTable}
            pagination={{ pageSize: 10 }}
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
