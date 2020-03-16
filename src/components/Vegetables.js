import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getVegetables } from '../actions/vegetableAction';
import PropTypes from 'prop-types';

class Vegetables extends Component {
  state = {
    list: []
  };

  static propTypes = {
    getVegetables: PropTypes.func.isRequired,
    vegetable: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.getVegetables();
  }

  onVegtClick = id => {
   console.log(id);
  };

  render() {
    const { vegetables } = this.props.vegetable;
    return (
      <Container>
        <ListGroup horizontal>
          <TransitionGroup className='vegetablesList'>
            {vegetables.map(({ _id, name }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <span>{name}</span>
                  <span><img
                      src={require('../Resources/EmptyLeaf.png')}
                      className='vegetableImage'
                      color='danger'
                      size='sm'
                      id={_id}
                      onClick={this.onVegtClick.bind(this, _id)}
                      /></span>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
        <Button color="info" onClick={this.props.OpenListOfvegetables}>אישור</Button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
    vegetable: state.vegetable,
});

export default connect(
  mapStateToProps,
  { getVegetables }
)(Vegetables);