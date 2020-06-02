import React, { Component } from "react"
import { Link } from "react-router-dom"
import {
    Button,
    Label,
    Input,
    Container,
    FormFeedback,
    Alert
  } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register, logout } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { resetgrowerusername, resetusername, clearresetgrowerusername } from '../actions/resetUserNameAction';
import { Redirect } from "react-router-dom";
import Loader from '../components/Loader';

class UpdateGrowerEmail extends Component {
  state = {
    email: "",
    UserEmail:"",
    submitted: false,
    emailValidation: true,
    UserLoginValidation: true,
    ActivateLoader: false
  }

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    resetusername: PropTypes.object.isRequired,
    userupdated: PropTypes.bool,
    growerupdated: PropTypes.bool,
    resetgrowerusername: PropTypes.func.isRequired,
    resetusername: PropTypes.func.isRequired,
    clearresetgrowerusername: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired
  };

  componentDidMount() {
    try{
      const { user } = this.props.auth;

      this.setState({
        UserEmail: user.email,
      });
    }
    catch{}
    
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated, userupdated, growerupdated } = this.props;
    const { user } = this.props.auth;

    // Deal with login in page
    try{
        if (isAuthenticated !== prevProps.isAuthenticated) {
          if(isAuthenticated){
            this.setState({
              UserEmail: user.email,
              UserLoginValidation: true
            });
          }
          else{
            this.setState({
              UserLoginValidation: false
            });
          }
        }

    }
    catch{}

    if(isAuthenticated && userupdated && growerupdated){
        this.props.logout();
        this.props.clearresetgrowerusername();
        this.setState({
          ActivateLoader: false,
          submitted: !this.state.submitted,
          redirect: '/'
        });
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

  ResetUserName = e => {
    e.preventDefault();

    const { isAuthenticated } = this.props;

    if(isAuthenticated){
        if(this.ValidateForm()){
          const { email } = this.state
      
          // Create user object
          const newUser = {
            email
          };

          this.setState({
            ActivateLoader: true
          });
      
          // Attempt to register
          this.props.resetgrowerusername(this.state.UserEmail, newUser);
          this.props.resetusername(this.state.UserEmail, newUser);
        }
    }
    else{
        this.setState({
            UserLoginValidation: false
        });
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
          {!this.state.UserLoginValidation ? (
              <Alert color='danger'>{Language.UpdateUserNameAlert}</Alert>
          ) : null}
          <div className='SendResetPasswordEmailHeader'><h3>{Language.UpdateUserNameTitle}</h3></div>
          {submitted ? (
            <div className="SendResetPasswordEmailMessage">
              <p>
                {Language.UpdateUserNameSuccessText}
              </p>
              <Link to="/" className="ghost-btn">
                {Language.SubmutMsgButton}
              </Link>
            </div>
          ) : (
            <div className="reset-password-form-wrapper">
              <form onSubmit={this.ResetUserName}>
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
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmailValidationError}</FormFeedback>
                </div>
                <div className='SendResetPasswordEmailBtnHolder'>
                  <Button color='success' className="SendResetPasswordEmailBtn">
                    {Language.UpdateUserNameButton}
                  </Button>
                </div>
              </form>
            </div>
          )}
          { this.state.ActivateLoader ? <Loader /> : null }
        </div>
      </Container>
    )
  }
}
const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    resetusername: state.resetusername,
    userupdated: state.resetusername.userupdated,
    growerupdated: state.resetusername.growerupdated,
    language: state.language,
    Language: state.language.Language,
    direction: state.language.direction
});
  
export default connect(
  mapStateToProps,
  { register, clearErrors, logout, resetgrowerusername, resetusername, clearresetgrowerusername }
)(UpdateGrowerEmail);