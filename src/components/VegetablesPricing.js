import React, { Component } from 'react';
import { Input, Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
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

  componentDidUpdate(prevProps) {
    
  }

  onVegtClick = (id, name, price) => {
    this.props.addChoosenVegetable({id: id, name: name, price: price});
  
    };
  
  RemoveVegtClick = name => {
    this.props.deleteChoosenVegetable(name);
  };

  UpdateChoosenVegetable = (id, name, price) => {
      console.log(price);
      this.props.deleteChoosenVegetable(name);
      this.props.addChoosenVegetable({id: id, name: name, price: price});
  };

  render() {
    const { ChoosenVegetables } = this.props.choosenvegetable;

    return (
      <Container>
        <ListGroup horizontal>
          <TransitionGroup className='ChoosenVegetablesList'>
            {ChoosenVegetables.map(({ id, name, price }) => (
              <CSSTransition key={id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <span><img
                  src={require('../Resources/Leaf.png')}
                  className='ChoosenVegetableImage'
                  size='sm'
                  /></span>
                  <span className='ChoosenVegetableName'>{name}</span>
                  <span className='ChoosenVegetabletext'>מחיר לשתיל</span>
                  <span className='ChoosenVegetablePrice'>
                    <Input
                      type='text'
                      id='VegCost'
                      placeholder={price}
                      className='mb-3'
                      onBlur={event => this.UpdateChoosenVegetable(id, name, event.target.value)}
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