import React, { Component } from 'react';
import { Input, Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable } from '../actions/choosenVegetablesAction';
import PropTypes from 'prop-types';

class VegetablesPricing extends Component {
  state = {
  };

  static propTypes = {
    getChoosenVegetables: PropTypes.func.isRequired,
    addChoosenVegetable: PropTypes.func.isRequired,
    deleteChoosenVegetable: PropTypes.func.isRequired,
    choosenvegetable: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getChoosenVegetables();
  }

  onVegtClick = (id, name, price, averagecrop, amount) => {
    this.props.addChoosenVegetable({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount});
  
    };
  
  RemoveVegtClick = name => {
    this.props.deleteChoosenVegetable(name);
  };

  UpdateChoosenVegetable = (id, name, price, averagecrop, amount) => {
      this.props.deleteChoosenVegetable(name);
      this.props.addChoosenVegetable({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount});
  };

  render() {
    const { ChoosenVegetables } = this.props.choosenvegetable;

    return (
      <Container>
        <ListGroup>
          <TransitionGroup className='ChoosenVegetablesList'>
            {ChoosenVegetables.map(({ _id, name, price, averagecrop, amount }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <span><img
                  alt=""
                  src={require('../Resources/Leaf.png')}
                  className='ChoosenVegetableImage'
                  size='sm'
                  /></span>
                  <span className='ChoosenVegetableName'>{name}</span>
                  <span className='ChoosenVegetabletext'>מחיר לשתיל</span>
                  <span className='ChoosenVegetablePrice'>
                    <Input
                      type='text'
                      placeholder={price}
                      className='mb-3'
                      onBlur={event => this.UpdateChoosenVegetable(_id, name, event.target.value, averagecrop, amount)}
                      />
                  </span>
                  <span className='ChoosenVegetabletext2'>ש"ח</span>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
    choosenvegetable: state.choosenvegetable
});

export default connect(
  mapStateToProps,
  { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable }
)(VegetablesPricing);