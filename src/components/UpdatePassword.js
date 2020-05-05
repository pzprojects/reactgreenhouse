import React, { Component } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import {
    Button,
    Label,
    Input,
    Container,
    FormFeedback
  } from 'reactstrap';
import { API_URL } from '../config/keys'
import { connect } from 'react-redux';
import { register } from '../actions/authActions';
import { logout } from '../actions/authActions';
import { Redirect } from "react-router-dom";

class UpdatePassword extends Component {
  state = {
    password: "",
    confirmPassword: "",
    submitted: false,
    PasswordValidation: true,
    PasswordStrengthValidation: true
  }

  componentDidUpdate() {
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

  ValidateForm = () => {
    let Validated = true;
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;

    // Passwords
    if(this.state.password !== this.state.confirmPassword){
      this.setState({
        PasswordValidation: false
      });
      Validated = false;
    }

    if(this.state.password.length < 8 || !this.state.password.match(numbers) || !this.state.password.match(upperCaseLetters ) || !this.state.password.match(lowerCaseLetters )){
      this.setState({
        PasswordStrengthValidation: false
      });
      Validated = false;
    }

    return Validated;
  };

  handleChange = e => {
    switch(e.target.name) {
        case "password":
          // password strength validation
          this.ValidatePassword(e.target.value);
          break;
        case "confirmPassword":
          if(this.state.PasswordValidation === false){
            this.setState({
              PasswordValidation: true
            });
          }
          break;
        default:
    }

    this.setState({ [e.target.name]: e.target.value });
  }

  ValidatePassword = (password) => {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if(password.length < 8 || !password.match(numbers) || !password.match(upperCaseLetters ) || !password.match(lowerCaseLetters )){
      if(password.length !== 0){
        if(this.state.PasswordStrengthValidation){
          this.setState({
            PasswordStrengthValidation: false
          });
        }
      }
      else{
        if(!this.state.PasswordStrengthValidation){
          this.setState({
            PasswordStrengthValidation: true
          });
        }
      }
    }
    else{
      if(!this.state.PasswordStrengthValidation){
        this.setState({
          PasswordStrengthValidation: true
        });
      }
    }
  };

  updatePassword = e => {
    e.preventDefault()

    if(this.ValidateForm()){
      const { userId, token } = this.props
      const { password } = this.state
      axios
        .post(
          `${API_URL}/api/receiveNewPassword/${userId}/${token}`,
          { password }
        )
        .then(res => console.log("RESPONSE FROM SERVER TO CLIENT:", res))
        .catch(err => console.log("SERVER ERROR TO CLIENT:", err))
      this.setState({ submitted: !this.state.submitted })
    }
  }

  render() {
    const { submitted } = this.state
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <Container>
        <div className='ResetPasswordContainer'>
          <div className='ResetPasswordHeader'><h3>עדכון סיסמה</h3></div>
          {submitted ? (
            <div className="ResetPasswordMessage">
              <p>סיסמתך נשמרה בהצלחה.</p>
              <Link to="/" className="ghost-btn">
                חזור לדף הבית
              </Link>
            </div>
          ) : (
            <div className="reset-password-form-sent-wrapper">
              <form onSubmit={this.updatePassword}>
                <div className="form-group">
                  <Label for='password'>סיסמה</Label>
                  <Input
                    type='password'
                    name='password'
                    id='password'
                    placeholder=''
                    className='mb-3'
                    invalid= {!this.state.PasswordStrengthValidation}
                    onChange={this.handleChange}
                    value={this.state.password}
                    required
                  />
                  <FormFeedback>הסיסמה חייבת להכיל 8 תווים, אות גדולה, אות קטנה ומספר</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='confirmPassword'>אימות סיסמה</Label>
                  <Input
                    type='password'
                    name='confirmPassword'
                    id='confirmPassword'
                    placeholder=''
                    className='mb-3'
                    onChange={this.handleChange}
                    value={this.state.confirmPassword}
                    invalid= {!this.state.PasswordValidation}
                    required
                  />
                  <FormFeedback>הסיסמאות לא זהות!</FormFeedback>
                </div>
                <div className='ResetPasswordBtnHolder'>
                  <Button color='success' className="ResetPasswordBtnHolderBtn">
                    עדכן סיסמה
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
UpdatePassword.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool,
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});
  
export default connect(
  mapStateToProps,
  { register, logout }
)(UpdatePassword);