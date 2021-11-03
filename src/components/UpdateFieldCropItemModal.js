import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { updateFieldcrop } from '../actions/fieldcropAction';
import PropTypes from 'prop-types';
import { FiEdit } from "react-icons/fi";

class UpdateFieldCropItemModal extends Component {
  state = {
    modal: false,
    name: '',
    moreinfolink: '',
    numberofveginrow: '',
    amount: '',
    averagecrop: '',
    price: '',
    ItemId: ''
  };

  componentDidMount() {
    this.setState({
      name: this.props.ItemName,
      moreinfolink: this.props.ItemLink,
      numberofveginrow: this.props.ItemNumberofveginrow,
      amount: this.props.ItemAmont,
      averagecrop: this.props.ItemAveragecrop,
      price: this.props.ItemPrice,
      ItemId: this.props.ItemId
    });
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, price, averagecrop, amount, numberofveginrow, moreinfolink } = this.state;

    const newItem = {
      name,
      price,
      averagecrop,
      amount,
      numberofveginrow,
      moreinfolink
    };

    // Add item via addItem action
    this.props.updateFieldcrop(this.state.ItemId, newItem);

    // Close modal
    this.toggle();
  };

  render() {
    return (
      <div className='AdminVegUpdateButtonHolder' >
        {this.props.isAuthenticated ? (
          <Button
            className='AdminVegUpdateBtn'
            color='info'
            size='sm'
            onClick={this.toggle}
          >
            <FiEdit size={20} />
          </Button>
        ) : (
          null
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>עדכון נתוני גידולי שדה</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <div className="Admin-veg-form-group">
                  <Label for='name'>שם הגידול שדה</Label>
                  <Input
                    type='text'
                    name='name'
                    id='name'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.name}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='price'>מחיר בש"ח</Label>
                  <Input
                    type='number'
                    name='price'
                    id='price'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.price}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='averagecrop'>יבול ממוצע לשנה בק"ג</Label>
                  <Input
                    type='number'
                    name='averagecrop'
                    id='averagecrop'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.averagecrop}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='amount'>כמות שתילים לטור גידול</Label>
                  <Input
                    type='number'
                    name='amount'
                    id='amount'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.amount}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='numberofveginrow'>מספר שורות לגידול</Label>
                  <Input
                    type='number'
                    name='numberofveginrow'
                    id='numberofveginrow'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.numberofveginrow}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='moreinfolink'>קישור לדף מידע למוצר</Label>
                  <Input
                    type='text'
                    name='moreinfolink'
                    id='moreinfolink'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.moreinfolink}
                    required
                  />
                </div>
                <Button color='success' style={{ marginTop: '2rem' }} block>
                  עדכן
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    fieldcrop: state.fieldcrop,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { updateFieldcrop }
)(UpdateFieldCropItemModal);