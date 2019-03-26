import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message, Button, Icon, Table, Divider, Modal } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getProjectsList, deleteProject } from '../../actions/projects';
import AddNewModal from './AddNewModal';
/* eslint-disable css-modules/no-unused-class */
import s from './Projects.css';

function mapStateToProps({
  projects: { loading, sending, deleting, updating, data },
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
        getProjectsList,
        deleteProject,
      },
      dispatch,
    ),
  };
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
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
      <span style={{ whiteSpace: 'nowrap' }}>
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

class Projects extends React.Component {
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
    projectToEdit: null,
  };

  componentDidMount() {
    const { actions } = this.props;
    actions.getProjectsList();
  }

  componentDidUpdate(prevProps) {
    const { error, loading, sending, deleting, updating, data } = this.props;
    if (error.error && prevProps.error !== error && error.message) {
      message.error(error.message, 10);
    }
    if (!error.error && prevProps.sending && !sending) {
      message.success('Project successfully added');
    }
    if (!error.error && prevProps.deleting && !deleting) {
      message.success('Project successfully deleted');
    }
    if (!error.error && prevProps.updating && !updating) {
      message.success('Project successfully updated');
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
    const statusNames = ['Upcoming', 'In Progress', 'Suspended', 'Closed'];
    const dataTable = data.map((row, index) => ({
      _id: row._id,
      id: row.id,
      name: row.name,
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
    this.setState({ showAddNewModal: false, projectToEdit: null });
  };

  handleEdit = projectToEdit => {
    this.setState({ projectToEdit, showAddNewModal: true });
  };

  handleDelete = project => {
    const { actions } = this.props;
    Modal.confirm({
      title: `Delete Project ${project.name}`,
      content: <span>Are you sure you want to delete this project?</span>,
      okText: 'Yes, delete',
      cancelText: 'Oh, No!',
      onOk() {
        return actions.deleteProject({ id: project._id });
      },
    });
  };

  render() {
    const {
      dataLoaded,
      showAddNewModal,
      dataTable,
      projectToEdit,
    } = this.state;
    const { loading } = this.props;
    return (
      <div className={s.overHolder}>
        <AddNewModal
          visible={showAddNewModal}
          handleCancel={this.handleCancelModal}
          projectToEdit={projectToEdit}
        />
        <div className={s.buttonsHolder}>
          <Button disabled={loading} onClick={this.showAddNewModal}>
            <Icon type="plus" /> Add new Project
          </Button>
        </div>
        <div className={s.dataHolder}>
          <Table
            columns={columns}
            dataSource={dataTable}
            pagination={{ pageSize: 10 }}
            loading={loading || !dataLoaded}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(s)(Projects));
