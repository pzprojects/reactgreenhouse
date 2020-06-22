import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class GrowersubmissionMSG extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  static propTypes = {
    language: PropTypes.object.isRequired
  };

  render() {
    const { Language } = this.props;
    return (
      <Container>
        <div className="FarmerSubmissionMSGHolder">
          <div className="FarmerSubmissionMSGHeader">{Language.GrowerSubmitMsgText}</div>
          <div className="FarmerSubmissionMSGHeader">{Language.SubmitMsgText2}</div>
          <div className="FarmerSubmissionMSGButtonHolder">
            <Button className="FarmerSubmissionMSGButton" type="button" size="lg" tag={Link} to="/">{Language.SubmutMsgButton}</Button>
         </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { }
)(GrowersubmissionMSG);