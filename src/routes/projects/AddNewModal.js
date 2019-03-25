import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form, Input, Select } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { addProject, updateProject } from '../../actions/projects';
import s from './AddNewModal.css';

const { Option } = Select;

function mapStateToProps({ projects: { sending, updating, data } }) {
  return {
    sending,
    updating,
    data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        addProject,
        updateProject,
      },
      dispatch,
    ),
  };
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
};

class AddNewModal extends React.Component {
  /* eslint-disable react/forbid-prop-types */
  /* eslint-disable no-nested-ternary */
  /* eslint-disable react/no-did-update-set-state */
  /* eslint-disable no-underscore-dangle */
  /* eslint-disable no-unused-expressions */
  static propTypes = {
    sending: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    projectToEdit: PropTypes.object,
  };

  static defaultProps = {
    projectToEdit: null,
  };

  state = {
    notUniqueName: false,
    projectName: '',
    projectStatus: '0',
    modalTitle: 'Add New Project',
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const { sending, updating, handleCancel, projectToEdit } = this.props;

    if ((!sending && prevProps.sending) || (!updating && prevProps.updating)) {
      handleCancel();
    }

    if (projectToEdit && prevProps.projectToEdit !== projectToEdit) {
      this.setState({
        projectName: projectToEdit.name,
        projectStatus: projectToEdit.status,
        modalTitle: 'Edit Project',
      });
    } else if (prevProps.projectToEdit !== projectToEdit) {
      this.setState({ modalTitle: 'Add New Project' });
    }
  }

  handleAddNewProject = event => {
    if (event) {
      event.preventDefault();
    }
    const { projectName, projectStatus } = this.state;
    const { actions, projectToEdit } = this.props;
    if (projectName.replace(/\s/g, '').length) {
      projectToEdit
        ? actions.updateProject({
            name: projectName.trim(),
            id: projectToEdit._id,
            status: projectStatus,
          })
        : actions.addProject({
            name: projectName.trim(),
            status: projectStatus,
          });
    }
  };

  handleChangeName = event => {
    const { data, projectToEdit } = this.props;

    this.setState({
      projectName: event.target.value,
      notUniqueName:
        data.findIndex(
          row =>
            row.name.toLowerCase() === event.target.value.toLowerCase() &&
            (!projectToEdit || row._id !== projectToEdit._id),
        ) >= 0,
    });
  };

  handleChangeStatus = projectStatus => {
    this.setState({
      projectStatus,
    });
  };

  afterClose = () => {
    const { handleCancel } = this.props;
    this.setState({
      projectName: '',
      projectStatus: '0',
      notUniqueName: false,
    });
    handleCancel();
  };

  render() {
    const {
      projectName,
      notUniqueName,
      modalTitle,
      projectStatus,
    } = this.state;
    const { sending, handleCancel, visible } = this.props;
    return (
      <Modal
        visible={visible}
        className={s.addModal}
        title={modalTitle}
        onOk={this.handleAddNewProject}
        onCancel={handleCancel}
        afterClose={this.afterClose}
        confirmLoading={sending}
        footer={[
          <Button htmlType="button" key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            htmlType="button"
            key="submit"
            type="primary"
            loading={sending}
            disabled={
              sending || notUniqueName || !projectName.replace(/\s/g, '').length
            }
            onClick={this.handleAddNewProject}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          onSubmit={this.handleAddNewProject}
          method="get"
        >
          <Form.Item
            label="Name"
            className={s.requiredField}
            validateStatus={notUniqueName ? 'error' : ''}
            help={notUniqueName && 'This Project already exists'}
          >
            <Input
              placeholder="Enter project name"
              id="projectName"
              onChange={this.handleChangeName}
              value={projectName}
            />
          </Form.Item>
          <Form.Item label="Project status" className={s.requiredField}>
            <Select value={projectStatus} onChange={this.handleChangeStatus}>
              <Option value="0">Upcoming</Option>
              <Option value="1">In Progress</Option>
              <Option value="2">Suspended</Option>
              <Option value="3">Closed</Option>
            </Select>
          </Form.Item>
        </Form>
        <div className={s.required}>- required fields</div>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(s)(AddNewModal));
