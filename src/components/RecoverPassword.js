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
      const { email } = this.state
      axios.post(`${API_URL}/api/sendresetpasswordmail/${email}`)
      this.setState({ email: "", submitted: true })
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
          <div className='SendResetPasswordEmailHeader'><h3>איפוס סיסמה</h3></div>
          {submitted ? (
            <div className="SendResetPasswordEmailMessage">
              <p>
                במידה וחשבונך קיים במערכת, נשלח לך מייל עם קישור לעדכון סיסמתך
              </p>
              <Link to="/" className="ghost-btn">
              חזור לדף הבית
              </Link>
            </div>
          ) : (
            <div className="reset-password-form-wrapper">
              <form onSubmit={this.sendPasswordResetEmail}>
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
                      required
                    />
                    <FormFeedback>כתובת האימייל שגויה</FormFeedback>
                </div>
                <div className='SendResetPasswordEmailBtnHolder'>
                  <Button color='success' className="SendResetPasswordEmailBtn">
                    שלח אימייל לאיפוס סיסמה
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
});
  
export default connect(
  mapStateToProps,
  { register, clearErrors, logout }
)(RecoverPassword);