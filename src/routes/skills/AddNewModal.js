import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form, Input } from 'antd';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { addSkill, updateSkill } from '../../actions/skills';
import s from './AddNewModal.css';

function mapStateToProps({ skills: { sending, updating, data } }) {
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
        addSkill,
        updateSkill,
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
    skillToEdit: PropTypes.object,
  };

  static defaultProps = {
    skillToEdit: null,
  };

  state = {
    notUniqueName: false,
    skillName: '',
    modalTitle: 'Add New Skill',
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const { sending, updating, handleCancel, skillToEdit } = this.props;

    if ((!sending && prevProps.sending) || (!updating && prevProps.updating)) {
      handleCancel();
    }

    if (skillToEdit && prevProps.skillToEdit !== skillToEdit) {
      this.setState({ skillName: skillToEdit.name, modalTitle: 'Edit Skill' });
    } else if (prevProps.skillToEdit !== skillToEdit) {
      this.setState({ modalTitle: 'Add New Skill' });
    }
  }

  handleAddNewSkill = event => {
    if (event) {
      event.preventDefault();
    }
    const { skillName } = this.state;
    const { actions, skillToEdit } = this.props;
    if (skillName.replace(/\s/g, '').length) {
      skillToEdit
        ? actions.updateSkill({
            name: skillName.trim(),
            id: skillToEdit._id,
          })
        : actions.addSkill({
            name: skillName.trim(),
          });
    }
  };

  handleChangeName = event => {
    const { data, skillToEdit } = this.props;

    this.setState({
      skillName: event.target.value,
      notUniqueName:
        data.findIndex(
          row =>
            row.name.toLowerCase() === event.target.value.toLowerCase() &&
            (!skillToEdit || row._id !== skillToEdit._id),
        ) >= 0,
    });
  };

  afterClose = () => {
    const { handleCancel } = this.props;
    this.setState({
      skillName: '',
      notUniqueName: false,
    });
    handleCancel();
  };

  render() {
    const { skillName, notUniqueName, modalTitle } = this.state;
    const { sending, handleCancel, visible } = this.props;
    return (
      <Modal
        visible={visible}
        className={s.addModal}
        title={modalTitle}
        onOk={this.handleAddNewSkill}
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
              sending || notUniqueName || !skillName.replace(/\s/g, '').length
            }
            onClick={this.handleAddNewSkill}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          {...formItemLayout}
          onSubmit={this.handleAddNewSkill}
          method="get"
        >
          <Form.Item
            label="Name"
            className={s.requiredField}
            validateStatus={notUniqueName ? 'error' : ''}
            help={notUniqueName && 'This Skill already exists'}
          >
            <Input
              placeholder="Enter skill name"
              id="skillName"
              onChange={this.handleChangeName}
              value={skillName}
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
