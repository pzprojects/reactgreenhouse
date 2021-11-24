import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import ShoppingList from './components/ShoppingList';
import PersonalArea from './components/PersonalArea';
import RegisterPage from './components/RegisterPage';
import RegisterUserType from './components/RegisterUserType';
import ItemModal from './components/ItemModal';
import FarmersubmissionMSG from './components/FarmersubmissionMSG';
import GrowerRegisterPage from './components/GrowerRegisterPage';
import GrowersubmissionMSG from './components/GrowersubmissionMSG';
import DeatilsUpdatedMSG from './components/DeatilsUpdatedMSG';
import VegManagment from './components/VegManagment';
import LanguagesManagment from './components/LanguagesManagment';
import SystemSettings from './components/SystemSettings';
import SystemLogs from './components/SystemLogs';
import LoginPage from './components/auth/LoginPage';
import RecoverPassword from './components/RecoverPassword';
import UpdatePassword from './components/UpdatePassword';
import UpdateGrowerEmail from './components/UpdateGrowerEmail';
import FieldCropManagment from './components/FieldCropManagment';
import GrowerPersonalShop from './components/GrowerPersonalShop';
import PurchaseCompleted from './components/PurchaseCompleted';
import GrowerDeactivateMsg from './components/GrowerDeactivateMsg';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import TimoutMsg from './components/TimoutMsg';
import PaymentFraudMsg from './components/PaymentFraudMsg';

import { Container } from 'reactstrap';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  
  state = { dir: "rtl" }

  componentDidMount() {
    store.dispatch(loadUser());
  }

  CallbackDirection = (NavDirection) => {
    this.setState({dir: NavDirection})
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App' dir={this.state.dir}>
            <AppNavbar Direction = {this.CallbackDirection} />
            <Container>
              <Route exact path="/" component={PersonalArea} />
              <Route path="/ItemModal" component={ItemModal} />
              <Route path="/ShoppingList" component={ShoppingList} />
              <Route path="/RegisterPage" component={RegisterPage} />
              <Route path="/GrowerRegisterPage" component={GrowerRegisterPage} />
              <Route path="/RegisterUserType" component={RegisterUserType} />
              <Route path="/FarmersubmissionMSG" component={FarmersubmissionMSG} />
              <Route path="/GrowersubmissionMSG" component={GrowersubmissionMSG} />
              <Route path="/DeatilsUpdatedMSG" component={DeatilsUpdatedMSG} />
              <Route path="/VegManagment" component={VegManagment} />
              <Route path="/SystemSettings" component={SystemSettings} />
              <Route path="/SystemLogs" component={SystemLogs} />
              <Route path="/GrowerPersonalShop" component={GrowerPersonalShop} />
              <Route path="/LoginPage" component={LoginPage} />
              <Route path="/RecoverPassword" component={RecoverPassword} />
              <Route path="/UpdateGrowerEmail" component={UpdateGrowerEmail} />
              <Route path="/PurchaseCompleted" component={PurchaseCompleted} />
              <Route path="/FieldCropManagment" component={FieldCropManagment} />
              <Route path="/LanguagesManagment" component={LanguagesManagment} />
              <Route path="/GrowerDeactivateMsg" component={GrowerDeactivateMsg} />
              <Route path="/PaymentSuccessPage" component={PaymentSuccessPage} />
              <Route path="/TimoutMsg" component={TimoutMsg} />
              <Route path="/PaymentFraudMsg" component={PaymentFraudMsg} />
              <Route path="/UpdatePassword/:userId/:token" render={({ match }) => (<UpdatePassword userId={match.params.userId} token={match.params.token} /> )} />
            </Container>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
