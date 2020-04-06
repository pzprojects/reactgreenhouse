import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class GrowersubmissionMSG extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  render() {
    return (
      <Container>
        <div className="FarmerSubmissionMSGHolder">
          <div className="FarmerSubmissionMSGHeader">מגדל יקר</div>
          <div className="FarmerSubmissionMSGHeader">פרטיך נקלטו בהצלחה ונבדקים כעת ע"י Co-GreenHouse</div>
          <div className="FarmerSubmissionMSGHeader">נציג ייצור איתך קשר בהקדם</div>
          <div className="FarmerSubmissionMSGButtonHolder">
            <Button className="FarmerSubmissionMSGButton" type="button" size="lg" href="/">חזרה לדף הבית</Button>
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
)(GrowersubmissionMSG);