import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class DeatilsUpdatedMSG extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  render() {
    return (
      <Container>
        <div className="FarmerSubmissionMSGHolder">
          <div className="FarmerSubmissionMSGHeader">פרטיך עודכנו בהצלחה!</div>
          <div className="FarmerSubmissionMSGButtonHolder">
            <Button className="FarmerSubmissionMSGButton" type="button" size="lg" tag={Link} to="/">חזרה לדף הבית</Button>
         </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(
  mapStateToProps,
  { }
)(DeatilsUpdatedMSG);