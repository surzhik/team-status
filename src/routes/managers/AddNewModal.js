import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form, Input, Select } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { addManager, updateManager } from '../../actions/managers';
import s from './AddNewModal.css';

const { Option } = Select;

function mapStateToProps({ managers: { sending, updating, data } }) {
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
        addManager,
        updateManager,
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
    managerToEdit: PropTypes.object,
  };

  static defaultProps = {
    managerToEdit: null,
  };

  state = {
    notUniqueName: false,
    firstName: '',
    lastName: '',
    managerStatus: '0',
    modalTitle: 'Add New Manager',
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const { sending, updating, handleCancel, managerToEdit } = this.props;

    if ((!sending && prevProps.sending) || (!updating && prevProps.updating)) {
      handleCancel();
    }

    if (managerToEdit && prevProps.managerToEdit !== managerToEdit) {
      this.setState({
        firstName: managerToEdit.firstName,
        lastName: managerToEdit.lastName,
        managerStatus: managerToEdit.status,
        modalTitle: 'Edit Manager',
      });
    } else if (prevProps.managerToEdit !== managerToEdit) {
      this.setState({ modalTitle: 'Add New Manager' });
    }
  }

  handleAddNewManager = event => {
    if (event) {
      event.preventDefault();
    }

    const { firstName, lastName, managerStatus } = this.state;
    const { actions, managerToEdit } = this.props;
    if (
      firstName.replace(/\s/g, '').length &&
      lastName.replace(/\s/g, '').length
    ) {
      managerToEdit
        ? actions.updateManager({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            id: managerToEdit._id,
            status: managerStatus,
          })
        : actions.addManager({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            status: managerStatus,
          });
    }
  };

  handleChangeName = (value, target) => {
    const { data, managerToEdit } = this.props;

    this.setState(
      {
        [target]: value,
      },
      () => {
        const { firstName, lastName } = this.state;
        this.setState({
          notUniqueName:
            data.findIndex(
              row =>
                row.firstName.toLowerCase() === firstName.toLowerCase() &&
                row.lastName.toLowerCase() === lastName.toLowerCase() &&
                (!managerToEdit || row._id !== managerToEdit._id),
            ) >= 0,
        });
      },
    );
  };

  handleChangeStatus = managerStatus => {
    this.setState({
      managerStatus,
    });
  };

  afterClose = () => {
    const { handleCancel } = this.props;
    this.setState({
      firstName: '',
      lastName: '',
      managerStatus: '0',
      notUniqueName: false,
    });
    handleCancel();
  };

  render() {
    const {
      firstName,
      lastName,
      notUniqueName,
      modalTitle,
      managerStatus,
    } = this.state;
    const { sending, handleCancel, visible } = this.props;

    return (
      <Modal
        visible={visible}
        className={s.addModal}
        title={modalTitle}
        onOk={this.handleAddNewManager}
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
              sending ||
              notUniqueName ||
              !firstName.replace(/\s/g, '').length ||
              !lastName.replace(/\s/g, '').length
            }
            onClick={this.handleAddNewManager}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          onSubmit={this.handleAddNewManager}
          method="get"
        >
          <Form.Item
            label="First Name"
            className={s.requiredField}
            validateStatus={notUniqueName ? 'error' : ''}
            help={notUniqueName && 'This Manager already exists'}
          >
            <Input
              placeholder="Enter manager first name"
              id="firstName"
              onChange={event =>
                this.handleChangeName(event.target.value, 'firstName')
              }
              value={firstName}
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            className={s.requiredField}
            validateStatus={notUniqueName ? 'error' : ''}
            help={notUniqueName && 'This Manager already exists'}
          >
            <Input
              placeholder="Enter manager last name"
              id="lastName"
              onChange={event =>
                this.handleChangeName(event.target.value, 'lastName')
              }
              value={lastName}
            />
          </Form.Item>
          <Form.Item label="Manager status" className={s.requiredField}>
            <Select value={managerStatus} onChange={this.handleChangeStatus}>
              <Option value="0">Working</Option>
              <Option value="1">Sick/Leave</Option>
              <Option value="2">Vacation</Option>
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
