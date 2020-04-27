import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { Link } from "react-router-dom"

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
    if (isAuthenticated) {
      this.toggle();
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.props.history.push('/');
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { password } = this.state;
    const email = this.state.email.toLowerCase();
    
    const user = {
      email,
      password
    };

    // Attempt to login
    this.props.login(user);
  };

  render() {
    return (
      <div>
        <div className='LoginPageHeader' >כניסה למערכת</div>
        <div className='LoginPageContainer' >
          {this.state.msg ? (
              <Alert color='danger'>{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <div className="login-form-group">
                  <Label for='email'>אימייל</Label>
                  <Input
                    type='email'
                    name='email'
                    id='email'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                  />
                </div>
                <div className="login-form-group">
                  <Label for='password'>סיסמה</Label>
                  <Input
                    type='password'
                    name='password'
                    id='password'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                />
                </div>
                <div className="ForgotPasswordLink">
                  <Link onClick={this.toggle} href='#' to="/RecoverPassword" className="ghost-btn">
                    שכחתי סיסמה
                  </Link>
                </div>
                <Button color='success' style={{ marginTop: '2vw' }} block>
                  התחבר
                </Button>
              </FormGroup>
            </Form>
          </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(LoginPage);