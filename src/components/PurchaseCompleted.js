import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PurchaseCompleted extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  render() {
    return (
        <Container>
        <div className="FarmerSubmissionMSGHolder">
          <div className="FarmerSubmissionMSGHeader">הרכישה בוצעה בהצלחה!</div>
          <div className="FarmerSubmissionMSGHeader">אימייל עם פרטי העסקה ישלח אליך בהקדם.</div>
          <div className="FarmerSubmissionMSGHeader">תודה CO-Greenhouse</div>
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
)(PurchaseCompleted);