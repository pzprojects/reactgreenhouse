
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import ShoppingList from './components/ShoppingList';
import RegisterPage from './components/RegisterPage';
import RegisterUserType from './components/RegisterUserType';
import ItemModal from './components/ItemModal';
import { Container } from 'reactstrap';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App' dir="rtl">
            <AppNavbar />
            <Container>
              <Route exact path="/" component={ShoppingList} />
              <Route path="/ItemModal" component={ItemModal} />
              <Route path="/ShoppingList" component={ShoppingList} />
              <Route path="/RegisterPage" component={RegisterPage} />
              <Route path="/RegisterUserType" component={RegisterUserType} />
            </Container>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
