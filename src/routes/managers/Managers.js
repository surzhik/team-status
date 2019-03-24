import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message, Button, Icon, Table, Divider, Modal } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getManagersList, deleteManager } from '../../actions/managers';
import Loader from '../../components/Loader';
import AddNewModal from './AddNewModal';
/* eslint-disable css-modules/no-unused-class */
import s from './Managers.css';

function mapStateToProps({
  managers: { loading, sending, deleting, updating, data },
  error,
}) {
  return {
    loading,
    sending,
    deleting,
    updating,
    data,
    error,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        getManagersList,
        deleteManager,
      },
      dispatch,
    ),
  };
}

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
    title: 'Status',
    dataIndex: 'statusName',
    key: 'status',
    sorter: (a, b) => a.statusName.localeCompare(b.statusName),
    render: (text, record) => (
      <div className={s[`tag_${record.status}`]} key={text}>
        {text}
      </div>
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

class Managers extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  /* eslint-disable no-nested-ternary */
  /* eslint-disable react/no-did-update-set-state */
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    sending: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    error: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  state = {
    dataLoaded: false,
    showAddNewModal: false,
    dataTable: [],
    managerToEdit: null,
  };

  componentDidMount() {
    const { actions } = this.props;
    actions.getManagersList();
  }

  componentDidUpdate(prevProps) {
    const { error, loading, sending, deleting, updating, data } = this.props;
    if (error.error && prevProps.error !== error && error.message) {
      message.error(error.message, 10);
    }
    if (!error.error && prevProps.sending && !sending) {
      message.success('Manager successfully added');
    }
    if (!error.error && prevProps.deleting && !deleting) {
      message.success('Manager successfully deleted');
    }
    if (!error.error && prevProps.updating && !updating) {
      message.success('Manager successfully updated');
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
    /* eslint-disable no-underscore-dangle */
    const statusNames = ['Working', 'Sick/Leave', 'Vacation'];
    const dataTable = data.map((row, index) => ({
      _id: row._id,
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      status: row.status,
      statusName: statusNames[Number(row.status)],
      key: index,
      handleEdit: this.handleEdit,
      handleDelete: this.handleDelete,
    }));

    this.setState({ dataTable });
  };

  showAddNewModal = () => {
    this.setState({ showAddNewModal: true });
  };

  handleCancelModal = () => {
    this.setState({ showAddNewModal: false, managerToEdit: null });
  };

  handleEdit = managerToEdit => {
    this.setState({ managerToEdit, showAddNewModal: true });
  };

  handleDelete = manager => {
    const { actions } = this.props;
    Modal.confirm({
      title: `Delete Manager ${manager.firstName} ${manager.lastName}`,
      content: <span>Are you sure you want to delete this manager?</span>,
      okText: 'Yes, delete',
      cancelText: 'Oh, No!',
      onOk() {
        return actions.deleteManager({ id: manager._id });
      },
    });
  };

  render() {
    const {
      dataLoaded,
      showAddNewModal,
      dataTable,
      managerToEdit,
    } = this.state;
    const { loading } = this.props;
    return (
      <div className={s.overHolder}>
        <AddNewModal
          visible={showAddNewModal}
          handleCancel={this.handleCancelModal}
          managerToEdit={managerToEdit}
        />
        <div className={s.buttonsHolder}>
          <Button disabled={loading} onClick={this.showAddNewModal}>
            <Icon type="plus" /> Add new Manager
          </Button>
        </div>
        {loading && (
          <div className={s.loaderHolder}>
            <Loader />
          </div>
        )}
        {!loading && (
          <div className={s.dataHolder}>
            {dataTable.length ? (
              <Table
                columns={columns}
                dataSource={dataTable}
                pagination={{ pageSize: 10 }}
              />
            ) : dataLoaded ? (
              <h5>No Managers to display</h5>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(s)(Managers));
