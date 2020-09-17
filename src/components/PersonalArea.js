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
    isAuthenticated: PropTypes.bool,
    language: PropTypes.object.isRequired
  };

  componentDidMount() {

  }

  onDeleteClick = id => {
 
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { Language } = this.props;

    return (
      <Container>
        {isAuthenticated ? 
         user.usertype === 'חקלאי' ? <FarmerPersonalArea/> : user.usertype === 'מגדל' ? <GrowerPersonalArea/> : user.usertype === 'SysAdmin' ? <AdminPersonalArea/> : null
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >{Language.WelcomeToPage}</span></div>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
  language: state.language,
  Language: state.language.Language
});

export default connect(
  mapStateToProps,
  {  }
)(PersonalArea);