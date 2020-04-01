import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getVegetables } from '../actions/vegetableAction';
import { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable } from '../actions/choosenVegetablesAction';
import PropTypes from 'prop-types';

class Vegetables extends Component {
  state = {
  };

  static propTypes = {
    getVegetables: PropTypes.func.isRequired,
    vegetable: PropTypes.object.isRequired,
    getChoosenVegetables: PropTypes.func.isRequired,
    addChoosenVegetable: PropTypes.func.isRequired,
    deleteChoosenVegetable: PropTypes.func.isRequired,
    choosenvegetable: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getVegetables();
    this.props.getChoosenVegetables();
  }

  componentDidUpdate(prevProps) {
    
  }

  onVegtClick = (id, name, price, averagecrop, amount) => {
  this.props.addChoosenVegetable({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount});

  };

  RemoveVegtClick = name => {
    this.props.deleteChoosenVegetable(name);
   };

   ImgToPresent = name => {
     const index = this.props.choosenvegetable.ChoosenVegetables.findIndex(x => x.name === name);
     if(index < 0){
       return true
     }
     else return false
    
   };

  render() {
    const { vegetables } = this.props.vegetable;

    return (
      <Container>
        <ListGroup horizontal>
          <TransitionGroup className='vegetablesList'>
            {vegetables.map(({ _id, name, price, averagecrop, amount }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  { this.ImgToPresent(name) ? 
                  <span><img
                  alt=""
                  src={require('../Resources/EmptyLeaf.png')}
                  className='vegetableImage'
                  color='danger'
                  size='sm'
                  id={_id}
                  onClick={this.onVegtClick.bind(this, _id, name, price, averagecrop, amount)}
                  /></span>
                   :
                   <span><img
                  alt=""
                  src={require('../Resources/Leaf.png')}
                  className='vegetableImage'
                  color='danger'
                  size='sm'
                  id={_id}
                  onClick={this.RemoveVegtClick.bind(this, name)}
                  /></span> }
                  <span className='vegetablesItemName'>{name}</span>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
        <Button className='vegetablesApproveButton' color="info" onClick={this.props.OpenListOfvegetables}>אישור</Button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
    vegetable: state.vegetable,
    choosenvegetable: state.choosenvegetable
});

export default connect(
  mapStateToProps,
  { getVegetables, getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable }
)(Vegetables);