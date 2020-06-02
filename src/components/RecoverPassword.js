import React, { Component } from "react"
import { Link } from "react-router-dom"
import {
    Button,
    Label,
    Input,
    Container,
    FormFeedback
  } from 'reactstrap';
import axios from "axios"
import { API_URL } from '../config/keys'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { logout } from '../actions/authActions';
import { Redirect } from "react-router-dom";

class RecoverPassword extends Component {
  state = {
    email: "",
    submitted: false,
    emailValidation: true
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    language: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
        if(this.state.submitted){
          this.setState({
            redirect: '/'
          });
        }
        else{
          this.props.logout();
        }
    }
  }

  ValidateEmail = (mail) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  ValidateForm = () => {
    let Validated = true;

    if(this.state.email === '' || !this.ValidateEmail(this.state.email)){
      this.setState({
        emailValidation: false
      });
      Validated = false;
    }

    return Validated;
  };

  handleChange = e => {
      // validations
    switch(e.target.name) {
        case "email":
          if(this.state.emailValidation === false){
            this.setState({
                emailValidation: true
            });
          }
          break;
        default:
    }

    this.setState({ [e.target.name]: e.target.value });
  }

  sendPasswordResetEmail = e => {
    e.preventDefault();

    if(this.ValidateForm()){
      const email = this.state.email.toLowerCase();
      axios.post(`${API_URL}/api/sendresetpasswordmail/${email}`)
      this.setState({ email: "", submitted: true })
    }
  }

  render() {
    const { submitted } = this.state
    const { Language, direction } = this.props;
    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    let ReverseTextAlignClass = "Co-Text-Align-Left";
    if (direction === 'rtl') {
      FloatClass = "Co-Align-Right";
      TextAlignClass = "Co-Text-Align-Right";
      ReverseTextAlignClass = "Co-Text-Align-Left";
    }
    else {
      FloatClass = "Co-Align-Left";
      TextAlignClass = "Co-Text-Align-Left";
      ReverseTextAlignClass = "Co-Text-Align-Right";
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <Container>
        <div className='SendResetPasswordEmailContainer'>
          <div className='SendResetPasswordEmailHeader'><h3>{Language.ForgotPasswordTitle}</h3></div>
          {submitted ? (
            <div className="SendResetPasswordEmailMessage">
              <p>
                {Language.ForgotPasswordSuccessText}
              </p>
              <Link to="/" className="ghost-btn">
                {Language.SubmutMsgButton}
              </Link>
            </div>
          ) : (
            <div className="reset-password-form-wrapper">
              <form onSubmit={this.sendPasswordResetEmail}>
                <div className="form-group">
                  <Label className={FloatClass + " " + TextAlignClass} for='email'>{Language.LoginEmail}</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder=''
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.handleChange}
                      value={this.state.email}
                      invalid= {!this.state.emailValidation}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmailValidationError}</FormFeedback>
                </div>
                <div className='SendResetPasswordEmailBtnHolder'>
                  <Button color='success' className="SendResetPasswordEmailBtn">
                    {Language.ForgotPasswordSendButton}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Container>
    )
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
  { register, clearErrors, logout }
)(RecoverPassword);