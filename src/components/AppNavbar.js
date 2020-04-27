import React, { Component, Fragment } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  UncontrolledTooltip
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';

class AppNavbar extends Component {
  state = {
    isOpen: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired
  };

  GetActiveLink = (path) => {
    if(window.location.pathname === path){
      return "active"
    }
    else return ""
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <Fragment>
        <NavItem>
          <span className='navbarWelcome navbar-text'>
            <strong id="navbarWelcomeTooltip">שלום {user ? `${user.name}` : ''}</strong>
            <UncontrolledTooltip placement="bottom" target="navbarWelcomeTooltip">
              שלום {user ? `${user.name}` : ''}
            </UncontrolledTooltip>
          </span>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <LoginModal />
        </NavItem>
        <NavItem className='RegisterLink'>
          <NavLink href='/RegisterUserType'>
            הירשם עכשיו
          </NavLink>
        </NavItem>
      </Fragment>
    );

    const navitems = (
      <Fragment>
        <NavItem className={this.GetActiveLink('/')}>
          <NavLink href='/'>
           דף הבית
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/AboutUs')}>
          <NavLink href='/'>
           מי אנחנו
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/OurVision')}>
          <NavLink href='/'>
            החזון
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/CommunityServices')}>
          <NavLink href='/'>
            שירותי הקהילה 
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/Plans')}>
          <NavLink href='/'>
            מסלולים
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/ContactUs')}>
          <NavLink href='/'>
            צור קשר
          </NavLink>
        </NavItem>
      </Fragment>
    );

    const adminnavitems = (
      <Fragment>
        <NavItem className={this.GetActiveLink('/')}>
          <NavLink href='/'>
           ניהול משתמשים
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/VegManagment')}>
          <NavLink href='/VegManagment'>
           ניהול ירקות
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/SystemSettings')}>
          <NavLink href='/SystemSettings'>
           ניהול נתוני מערכת
          </NavLink>
        </NavItem>
      </Fragment>
    );

    return (
      <div>
        <Navbar color='faded' light expand='sm' className='mb-5'>
          <Container>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='ml-auto' navbar>
                <div className="ConnectionLinks">
                  {isAuthenticated ? authLinks : guestLinks}
                </div>
                { isAuthenticated ? user.usertype === 'SysAdmin' && user.usertype !== "null" ?  adminnavitems : navitems 
                : navitems}
              </Nav>
              <div className='COHeader' >
                <NavbarBrand href='/'>CO-Greenhouse</NavbarBrand>
              </div>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(AppNavbar);