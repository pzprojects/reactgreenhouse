import React, { Component } from 'react';
import { Input, Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getChoosenfieldCrops, addChoosenfieldCrop, deleteChoosenfieldCrop } from '../actions/choosenFieldCropsAction';
import PropTypes from 'prop-types';

class FarmCropsPricing extends Component {
  state = {
  };

  static propTypes = {
    getChoosenfieldCrops: PropTypes.func.isRequired,
    addChoosenfieldCrop: PropTypes.func.isRequired,
    deleteChoosenfieldCrop: PropTypes.func.isRequired,
    choosenfieldcrop: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getChoosenfieldCrops();
  }

  onVegtClick = (id, name, price, averagecrop, amount, numberofveginrow, moreinfolink) => {
    this.props.addChoosenfieldCrop({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount, numberofveginrow: numberofveginrow, moreinfolink: moreinfolink});
  
    };
  
  RemoveVegtClick = name => {
    this.props.deleteChoosenfieldCrop(name);
  };

  UpdateChoosenVegetable = (id, name, price, averagecrop, amount, numberofveginrow, moreinfolink) => {
      this.props.deleteChoosenfieldCrop(name);
      this.props.addChoosenfieldCrop({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount, numberofveginrow, moreinfolink: moreinfolink});
  };

  render() {
    const { ChoosenFieldCrops } = this.props.choosenfieldcrop;

    return (
      <Container>
        <div className="ChoosenVegetablesPricingHeader">מחירי גידולי שדה</div>
        <ListGroup>
          <TransitionGroup className='ChoosenVegetablesList'>
            {ChoosenFieldCrops.map(({ _id, name, price, averagecrop, amount, numberofveginrow, moreinfolink}) => (
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
                      onBlur={event => this.UpdateChoosenVegetable(_id, name, event.target.value, averagecrop, amount, numberofveginrow, moreinfolink)}
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
    choosenfieldcrop: state.choosenfieldcrop
});

export default connect(
  mapStateToProps,
  { getChoosenfieldCrops, addChoosenfieldCrop, deleteChoosenfieldCrop }
)(FarmCropsPricing);