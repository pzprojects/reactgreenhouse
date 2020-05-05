import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import GrowerPersonalArea from '../components/GrowerPersonalArea';
import FarmerPersonalArea from '../components/FarmerPersonalArea';
import AdminPersonalArea from '../components/AdminPersonalArea';
import PropTypes from 'prop-types';

class PersonalArea extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {

  }

  onDeleteClick = id => {
 
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <Container>
        {isAuthenticated ? 
         user.usertype === 'חקלאי' ? <FarmerPersonalArea/> : user.usertype === 'מגדל' ? <GrowerPersonalArea/> : user.usertype === 'SysAdmin' ? <AdminPersonalArea/> : null
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >ברוכים הבאים ל</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  {  }
)(PersonalArea);