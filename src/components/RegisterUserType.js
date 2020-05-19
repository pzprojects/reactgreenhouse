import React, { Component } from 'react';
import {
  Button
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import {Link} from 'react-router-dom';


class RegisterUserType extends Component {
  state = {
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    language: PropTypes.object.isRequired,
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
    const { Language } = this.props;
    return (
      <div className="UserTypesHolder">
        <div className="UserTypesHeader">{Language.RegisterChooseHeader}</div>
        <Button className="UserTypesButton" outline color="secondary" size="lg" tag={Link} to="/GrowerRegisterPage">{Language.RegisterChooseGrowerButton}</Button>
        <Button className="UserTypesButton" outline color="secondary" size="lg" tag={Link} to="/RegisterPage">{Language.RegisterChooseFarmerButton}</Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  language: state.language,
  Language: state.language.Language
});

export default connect(
  mapStateToProps,
  { register, clearErrors }
)(RegisterUserType);