import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
} from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { addWorker, updateWorker, checkWorker } from '../../actions/workers';
import debounce from '../../debounce';
import s from './AddNewModal.css';

const { Option } = Select;

function mapStateToProps({
  workers: {
    sending,
    updating,
    data: { docs },
    reference: { skills, managers, projects },
  },
}) {
  return {
    sending,
    updating,
    data: docs,
    skills,
    managers,
    projects,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        addWorker,
        updateWorker,
        checkWorker,
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

const initialFormValues = {
  firstName: '',
  lastName: '',
  managerId: null,
  managerIdFiltered: [],
  currentProject: null,
  currentProjectFiltered: [],
  skillsList: [],
  skillsListFiltered: [],
  onHolidaysTill: null,
  freeSince: null,
  workingHoursFrom: null,
  workingHoursTo: null,
  workingHoursTimeZone: null,
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
    skills: PropTypes.array.isRequired,
    managers: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    workerToEdit: PropTypes.object,
    paginationWithParams: PropTypes.object.isRequired,
  };

  static defaultProps = {
    workerToEdit: null,
  };

  state = {
    notUniqueName: false,
    modalTitle: 'Add New Team Member',
    checkingName: false,
    ...initialFormValues,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const {
      sending,
      updating,
      handleCancel,
      workerToEdit,
      managers,
      projects,
    } = this.props;

    if ((!sending && prevProps.sending) || (!updating && prevProps.updating)) {
      handleCancel();
    }

    if (workerToEdit && prevProps.workerToEdit !== workerToEdit) {
      // console.log(workerToEdit);
      this.setState({
        firstName: workerToEdit.firstName,
        lastName: workerToEdit.lastName,
        managerId: workerToEdit.managerId ? workerToEdit.managerId._id : null,
        managerIdFiltered: workerToEdit.managerId
          ? managers.filter(
              manager => manager._id === workerToEdit.managerId._id,
            )
          : [],
        currentProject: workerToEdit.currentProject
          ? workerToEdit.currentProject._id
          : null,
        currentProjectFiltered: workerToEdit.currentProject
          ? projects.filter(
              project => project._id === workerToEdit.currentProject._id,
            )
          : [],
        skillsList: workerToEdit.skillsList
          ? workerToEdit.skillsList.map(skill => ({
              key: skill._id,
              label: skill.name,
            }))
          : [],
        skillsListFiltered: [],
        onHolidaysTill: workerToEdit.onHolidaysTill,
        freeSince: workerToEdit.freeSince,
        workingHoursFrom: workerToEdit.workingHoursFrom,
        workingHoursTo: workerToEdit.workingHoursTo,
        workingHoursTimeZone: workerToEdit.workingHoursTimeZone,
        modalTitle: 'Edit Team Member',
      });
    } else if (prevProps.workerToEdit !== workerToEdit) {
      this.setState({ modalTitle: 'Add New Team Member' });
    }
  }

  onDateChange = (date, field) => {
    this.setState({
      [field]: date,
    });
  };

  handleSearch = (value, field, source) => {
    const dataToFilter = this.props[source];
    this.setState({
      [`${field}Filtered`]: dataToFilter.filter(row =>
        row.firstName
          ? value &&
            (row.firstName.toLowerCase().includes(value.toLowerCase()) ||
              row.lastName.toLowerCase().includes(value.toLowerCase()))
          : value && row.name.toLowerCase().includes(value.toLowerCase()),
      ),
    });
  };

  checkWorkerName = debounce(() => {
    const { firstName, lastName } = this.state;
    const { actions, workerToEdit } = this.props;

    actions
      .checkWorker({
        firstName,
        lastName,
        id: workerToEdit ? workerToEdit._id : null,
      })
      .then(res => {
        this.setState({
          checkingName: false,
          notUniqueName: res,
        });
      });
  }, 500);

  handleChangeName = (value, target) => {
    this.setState(
      {
        [target]: value,
        checkingName: true,
        notUniqueName: false,
      },
      () => {
        this.checkWorkerName();
      },
    );
  };

  handleChangeSelect = (value, target) => {
    this.setState({
      [target]: value,
    });
  };

  afterClose = () => {
    const { handleCancel } = this.props;
    this.setState({
      notUniqueName: false,
      ...initialFormValues,
    });
    handleCancel();
  };

  prepareFormData = () => {
    const {
      firstName,
      lastName,
      managerId,
      currentProject,
      skillsList,
      onHolidaysTill,
      freeSince,
      workingHoursFrom,
      workingHoursTo,
      workingHoursTimeZone,
    } = this.state;
    const { workerToEdit, paginationWithParams } = this.props;
    const formData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      managerId: managerId || null,
      currentProject: currentProject || null,
      skillsList: skillsList.map(skill => skill.key),
      onHolidaysTill: onHolidaysTill
        ? onHolidaysTill
            .utcOffset(0)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .toISOString()
        : null,
      freeSince: freeSince
        ? freeSince
            .utcOffset(0)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .toISOString()
        : null,
      workingHours: {
        timezone: workingHoursTimeZone || '',
        start: workingHoursFrom ? workingHoursFrom.format('HH:mm') : '',
        end: workingHoursTo ? workingHoursTo.format('HH:mm') : '',
      },
    };
    if (workerToEdit) {
      formData.id = workerToEdit._id;
    }
    formData.pagination = paginationWithParams;
    return formData;
  };

  handleAddNewWorker = event => {
    if (event) {
      event.preventDefault();
    }

    const { firstName, lastName } = this.state;
    const { actions, workerToEdit } = this.props;
    const formData = this.prepareFormData();
    if (
      firstName.replace(/\s/g, '').length &&
      lastName.replace(/\s/g, '').length
    ) {
      workerToEdit
        ? actions.updateWorker(formData)
        : actions.addWorker(formData);
    }
  };

  render() {
    const {
      firstName,
      lastName,
      notUniqueName,
      modalTitle,
      managerId,
      managerIdFiltered,
      currentProject,
      currentProjectFiltered,
      skillsList,
      skillsListFiltered,
      onHolidaysTill,
      freeSince,
      workingHoursFrom,
      workingHoursTo,
      workingHoursTimeZone,
      checkingName,
    } = this.state;
    const { sending, handleCancel, visible } = this.props;

    console.log(this.state);
    return (
      <Modal
        visible={visible}
        className={s.addModal}
        title={modalTitle}
        onOk={this.handleAddNewWorker}
        onCancel={handleCancel}
        afterClose={this.afterClose}
        confirmLoading={sending}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={sending}
            disabled={
              checkingName ||
              sending ||
              notUniqueName ||
              !firstName.replace(/\s/g, '').length ||
              !lastName.replace(/\s/g, '').length
            }
            onClick={this.handleAddNewWorker}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          onSubmit={this.handleAddNewWorker}
          method="get"
        >
          <Form.Item
            label="First Name"
            className={s.requiredField}
            validateStatus={notUniqueName ? 'error' : ''}
            help={notUniqueName && 'This Worker already exists'}
          >
            <Input
              placeholder="Enter worker first name"
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
            help={notUniqueName && 'This Worker already exists'}
          >
            <Input
              placeholder="Enter worker last name"
              id="lastName"
              onChange={event =>
                this.handleChangeName(event.target.value, 'lastName')
              }
              value={lastName}
            />
          </Form.Item>
          <Form.Item label="Available Skills ">
            <Select
              mode="multiple"
              labelInValue
              value={skillsList || undefined}
              placeholder="Click and Type to assign Skills"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={value =>
                this.handleSearch(value, 'skillsList', 'skills')
              }
              onChange={value => this.handleChangeSelect(value, 'skillsList')}
              notFoundContent={null}
            >
              {skillsListFiltered.map(skill => (
                <Option key={skill._id}>{skill.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Manager">
            <Select
              showSearch
              allowClear
              value={managerId || undefined}
              placeholder="Click and Type to assign Manager"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={value =>
                this.handleSearch(value, 'managerId', 'managers')
              }
              onChange={value => this.handleChangeSelect(value, 'managerId')}
              notFoundContent={null}
            >
              {managerIdFiltered.map(manager => (
                <Option key={manager._id}>
                  {manager.firstName} {manager.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Current Project">
            <Select
              showSearch
              allowClear
              value={currentProject || undefined}
              placeholder="Click and Type to assign Project"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={value =>
                this.handleSearch(value, 'currentProject', 'projects')
              }
              onChange={value =>
                this.handleChangeSelect(value, 'currentProject')
              }
              notFoundContent={null}
            >
              {currentProjectFiltered.map(project => (
                <Option key={project._id}>{project.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Working Hours">
            <TimePicker
              value={workingHoursFrom}
              format="HH:mm"
              placeholder="From"
              onChange={date => this.onDateChange(date, 'workingHoursFrom')}
            />
            <TimePicker
              value={workingHoursTo}
              format="HH:mm"
              placeholder="To"
              onChange={date => this.onDateChange(date, 'workingHoursTo')}
            />
            <Select
              value={workingHoursTimeZone || undefined}
              allowClear
              placeholder="Time Zone"
              style={{ width: '126px' }}
              onChange={value =>
                this.handleChangeSelect(value, 'workingHoursTimeZone')
              }
            >
              <Option value="0">UTC</Option>
              <Option value="1">GMT</Option>
              <Option value="2">AST</Option>
              <Option value="3">EST</Option>
              <Option value="4">PST</Option>
            </Select>
          </Form.Item>

          <Form.Item label="On Holidays Till">
            <DatePicker
              value={onHolidaysTill}
              onChange={date => this.onDateChange(date, 'onHolidaysTill')}
            />
          </Form.Item>
          <Form.Item label="Free Since">
            <DatePicker
              value={freeSince}
              onChange={date => this.onDateChange(date, 'freeSince')}
            />
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
