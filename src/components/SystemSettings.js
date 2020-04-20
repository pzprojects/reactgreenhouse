import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
  FormFeedback,
  UncontrolledCollapse,
  CardBody,
  Card,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { getVegetables, deleteVegetable } from '../actions/vegetableAction';
import { FiEdit } from "react-icons/fi";

class SystemSettings extends Component {
  state = {
    modal: false,
    msg: null,
    ActivateLoader: false,
    redirect: null,
    UserActive: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getVegetables: PropTypes.func.isRequired,
    deleteVegetable: PropTypes.func.isRequired,
    vegetable: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getVegetables();
  }

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

 

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDeleteClick = id => {
    this.props.deleteVegetable(id);
  };

  render() {
    const { vegetables } = this.props.vegetable;
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div>
        {this.state.msg ? (
          <Alert color='danger'>{this.state.msg}</Alert>
        ) : null}
        {isAuthenticated ? 
          user.usertype === 'SysAdmin' ?
          <Container>
          <Form onSubmit={this.onSubmit}>
              <FormGroup>
              <div className='PersonalDetails'>
                <div className="form-group">
                  <Label for='name'>שם פרטי</Label>
                  <Input
                    type='text'
                    name='name'
                    id='name'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.name}
                    invalid= {!this.state.nameValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
              </div>
              </FormGroup>
              <Button className='RegisterButton' >
                הירשם
              </Button>
            </Form>
          </Container>
          : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >משתמש זה אינו מנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >הירשם כמנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  vegetable: state.vegetable
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getVegetables, deleteVegetable }
)(SystemSettings);