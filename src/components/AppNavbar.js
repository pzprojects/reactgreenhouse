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
  UncontrolledTooltip,
  Label,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';
import { getLanguage, ResetLanguage, updateLanguage } from '../actions/switchLanguageAction';
import {Link} from 'react-router-dom';

class AppNavbar extends Component {
  state = {
    isOpen: false,
    LanguagePicker: "",
    LogoClass: "COHeaderRTL",
    ConnectionLinksClass: "ConnectionLinksRTL"
    
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    language: PropTypes.object.isRequired,
    getLanguage: PropTypes.func.isRequired,
    ResetLanguage: PropTypes.func.isRequired,
    updateLanguage: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { language, LanguageActive } = this.props;
    if(!LanguageActive){
      const setlanguage = {
        LangName: "עברית",
        Code: "he",
        dir: "rtl"
      };
      this.props.updateLanguage(setlanguage);
      this.setState({
        LanguagePicker: "עברית"
      });
    }
    else{
      this.setState({
        LanguagePicker: language.LanguageName
      });
    }
  }

  GetActiveLink = (path) => {
    if (window.location.pathname === path) {
      return "active"
    }
    else return ""
  };

  sendData = (data) => {
    this.props.Direction(data);
  }
  
  ChangeLanguage = (ChoosenLang) => {
    var CoHeader = '';
    var ConnectionLinks = '';
    if(ChoosenLang.dir === 'rtl'){
      CoHeader = 'COHeaderRTL';
      ConnectionLinks = "ConnectionLinksRTL";
    }
    else{
      CoHeader = 'COHeaderLTR';
      ConnectionLinks = "ConnectionLinksLTR";
    }
    this.setState({
      LanguagePicker: ChoosenLang.LangName,
      LogoClass: CoHeader,
      ConnectionLinksClass: ConnectionLinks
    });
    const setlanguage = {
      LangName: ChoosenLang.LangName,
      Code: ChoosenLang.Code,
      dir: ChoosenLang.dir
    };
    this.props.updateLanguage(setlanguage);
    this.sendData(ChoosenLang.dir);
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { Language } = this.props;
    const LanguagesList = [{
      LangName: "עברית",
      Img: <img alt="" src={require('../Resources/Hebrew-8.png')} />,
      Code: "he",
      dir: "rtl"
    },
    {
      LangName: "English",
      Img: <img alt="" src={require('../Resources/English-8.png')} />,
      Code: "en",
      dir: "ltr"
    }];

    const authLinks = (
      <Fragment>
        <NavItem>
          <span className='navbarWelcome navbar-text'>
            <strong id="navbarWelcomeTooltip">{Language.NavBarHello} {user ? `${user.name}` : ''}</strong>
            <UncontrolledTooltip placement="bottom" target="navbarWelcomeTooltip">
            {Language.NavBarHello} {user ? `${user.name}` : ''}
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
          <NavLink tag={Link} to='/RegisterUserType'>
           {Language.NavBarSignIn}
          </NavLink>
        </NavItem>
      </Fragment>
    );

    const navitems = (
      <Fragment>
        <NavItem className={this.GetActiveLink('/HomePage')}>
          <NavLink href='https://www.co-greenhouse.com/' target="_blank">
           {Language.NavBarHomePage}
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/')}>
          <NavLink tag={Link} to='/'>
           {Language.NavBarPersonalArea}
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/Shop')}>
          <NavLink href='https://www.co-greenhouse.com/shop' target="_blank">
           {Language.NavBarOurShop}
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/FAQ')}>
          <NavLink href='https://www.co-greenhouse.com/faq' target="_blank">
          {Language.NavBarFaq}
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/ContactUs')}>
          <NavLink href='https://www.co-greenhouse.com/contact' target="_blank">
          {Language.NavBarContactUs}
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
        <NavItem className={this.GetActiveLink('/FieldCropManagment')}>
          <NavLink href='/FieldCropManagment'>
            ניהול גידולי שדה
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/LanguagesManagment')}>
          <NavLink href='/LanguagesManagment'>
            שפות
          </NavLink>
        </NavItem>
        <NavItem className={this.GetActiveLink('/SystemLogs')}>
          <NavLink href='/SystemLogs'>
            לוגים
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
        <div className='ChooseLang'>
          <Label for='LanguagePicker'></Label>
          <UncontrolledDropdown>
            <DropdownToggle outline className='LanguagePickerDropdown' color="primary" caret>
              {this.state.LanguagePicker + " "}
            </DropdownToggle>
            <DropdownMenu right >
              {LanguagesList.map((item,index) =>
                  <DropdownItem className='LanguagePicker' type="button" key={index} onClick={() => this.ChangeLanguage(item)} >
                    <span className="LanguagePickerItemImgContainer">{item.Img}</span>
                    <span className='LanguagePickerItemName'>{item.LangName}</span>
                  </DropdownItem>

              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <Navbar color='faded' light expand='sm' className='mb-5'>
          <Container>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='ml-auto' navbar>
                <div className={this.state.ConnectionLinksClass}>
                  {isAuthenticated ? authLinks : guestLinks}
                </div>
                {isAuthenticated ? user.usertype === 'SysAdmin' && user.usertype !== "null" ? adminnavitems : navitems
                  : navitems}
                <div className={this.state.LogoClass} >
                  <NavbarBrand href="https://www.co-greenhouse.com" target="_blank" rel="noopener noreferrer"><img alt="" src={require('../Resources/logo.png')} /></NavbarBrand>
                </div>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  language: state.language,
  Language: state.language.Language
});

export default connect(
  mapStateToProps,
  { getLanguage, ResetLanguage, updateLanguage }
)(AppNavbar);