import React, { Component } from 'react';
import {
  Button
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';


class RegisterUserType extends Component {
  state = {
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  Register = (UserType) => {
    if(UserType === "1"){
      this.props.history.push('/RegisterPage');
    }
    else this.props.history.push('/RegisterPage');
  };

  render() {
    return (
      <div className="UserTypesHolder">
        <div className="UserTypesHeader">אנא בחר/י מה ברצונך להיות</div>
        <Button className="UserTypesButton" outline color="secondary" size="lg" href="/">מגדל</Button>
        <Button className="UserTypesButton" outline color="secondary" size="lg" href="/RegisterPage">חקלאי</Button>
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
  { register, clearErrors }
)(RegisterUserType);