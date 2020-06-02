import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';

export class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired
  };

  render() {
    const { Language } = this.props;
    return (
      <Fragment>
        <NavLink onClick={this.props.logout} href='#'>
          {Language.LogOut}
        </NavLink>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  language: state.language,
  Language: state.language.Language,
});

export default connect(
  mapStateToProps,
  { logout }
)(Logout);