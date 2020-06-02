import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { loadUser } from '../actions/authActions';

class GrowerDeactivateMsg extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  static propTypes = {
    language: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    window.location.reload(false);
  }

  render() {
    const { Language } = this.props;
    return (
      <Container>
        <div className="FarmerSubmissionMSGHolder">
          <div className="FarmerSubmissionMSGHeader">{Language.CancelSubscriptionMsg}</div>
          <div className="FarmerSubmissionMSGButtonHolder">
            <Button className="FarmerSubmissionMSGButton" type="button" size="lg" tag={Link} to="/">{Language.SubmutMsgButton}</Button>
         </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { loadUser }
)(GrowerDeactivateMsg);