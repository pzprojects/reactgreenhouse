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
    clearresetgrowerusername: PropTypes.func.isRequired
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
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <Container>
        <div className='SendResetPasswordEmailContainer'>
          {!this.state.UserLoginValidation ? (
              <Alert color='danger'>בכדי לעדכן שם משתמש עלייך להיות מחובר</Alert>
          ) : null}
          <div className='SendResetPasswordEmailHeader'><h3>עדכון שם משתמש / אימייל</h3></div>
          {submitted ? (
            <div className="SendResetPasswordEmailMessage">
              <p>
                שם המשתמש עודכן בהצלחה, אנא התחבר מחדש למערכת
              </p>
              <Link to="/" className="ghost-btn">
              חזור לדף הבית
              </Link>
            </div>
          ) : (
            <div className="reset-password-form-wrapper">
              <form onSubmit={this.ResetUserName}>
                <div className="form-group">
                  <Label for='email'>אימייל</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder=''
                      className='mb-3'
                      onChange={this.handleChange}
                      value={this.state.email}
                      invalid= {!this.state.emailValidation}
                    />
                    <FormFeedback>כתובת האימייל שגויה</FormFeedback>
                </div>
                <div className='SendResetPasswordEmailBtnHolder'>
                  <Button color='success' className="SendResetPasswordEmailBtn">
                    עדכן שם משתמש
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
    growerupdated: state.resetusername.growerupdated
});
  
export default connect(
  mapStateToProps,
  { register, clearErrors, logout, resetgrowerusername, resetusername, clearresetgrowerusername }
)(UpdateGrowerEmail);