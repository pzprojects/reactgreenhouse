import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
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
    language: PropTypes.object.isRequired,
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
    const { direction, Language } = this.props;
    let TextAlignClass = "Co-Text-Align-Right";
    if (direction === 'rtl') {
      TextAlignClass = "Co-Text-Align-Right";
    }
    else {
      TextAlignClass = "Co-Text-Align-Left";
    }
    return (
      <div>
        <div className='LoginPageHeader' >{Language.LoginTitle}</div>
        <div className='LoginPageContainer' >
          {this.state.msg ? (
              <Alert color='danger'>{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <div className={"login-form-group " + TextAlignClass}>
                  <Label for='email'>{Language.LoginEmail}</Label>
                  <Input
                    type='email'
                    name='email'
                    id='email'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                  />
                </div>
                <div className={"login-form-group " + TextAlignClass}>
                  <Label for='password'>{Language.Password}</Label>
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
                    {Language.LoginForgotPassword}
                  </Link>
                </div>
                <Button color='success' style={{ marginTop: '2vw' }} block>
                  {Language.LoginConnectButton}
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
  error: state.error,
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(LoginPage);