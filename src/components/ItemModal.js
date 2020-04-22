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
import { addVegetable } from '../actions/vegetableAction';
import PropTypes from 'prop-types';

class ItemModal extends Component {
  state = {
    modal: false,
    name: '',
    moreinfolink: '',
    numberofveginrow: '',
    amount: '',
    averagecrop: '',
    price: ''
  };

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
    this.props.addVegetable(newItem);

    // Close modal
    this.toggle();
  };

  render() {
    return (
      <div>
        {this.props.isAuthenticated ? (
          <Button
            color='success'
            style={{ marginBottom: '2rem' }}
            onClick={this.toggle}
          >
            הוסף ירק
          </Button>
        ) : (
          <h4 className='mb-3 ml-4'>בבקשה התחבר בכדי לנהל את הירקות</h4>
        )}

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>הוספת ירק</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <div className="Admin-veg-form-group">
                  <Label for='name'>שם הירק</Label>
                  <Input
                    type='text'
                    name='name'
                    id='name'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='price'>מחיר בש"ח</Label>
                  <Input
                    type='text'
                    name='price'
                    id='price'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='averagecrop'>יבול ממוצע לשנה בק"ג</Label>
                  <Input
                    type='text'
                    name='averagecrop'
                    id='averagecrop'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='amount'>כמות שתילים לטור גידול</Label>
                  <Input
                    type='text'
                    name='amount'
                    id='amount'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="Admin-veg-form-group">
                  <Label for='numberofveginrow'>מספר שורות לגידול</Label>
                  <Input
                    type='text'
                    name='numberofveginrow'
                    id='numberofveginrow'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
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
                    required
                  />
                </div>
                <Button color='success' style={{ marginTop: '2rem' }} block>
                  הוסף
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
  vegetable: state.vegetable,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { addVegetable }
)(ItemModal);