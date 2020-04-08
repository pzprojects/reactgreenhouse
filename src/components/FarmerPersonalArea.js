import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../actions/itemActions';
import LoginModal from './auth/LoginModal';
import PropTypes from 'prop-types';

class FarmerPersonalArea extends Component {
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
        <div>hi22</div>
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
)(FarmerPersonalArea);