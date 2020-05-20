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
    language: PropTypes.object.isRequired,
    choosenvegetable: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getChoosenVegetables();
  }

  onVegtClick = (id, name, price, averagecrop, amount, numberofveginrow, moreinfolink) => {
    this.props.addChoosenVegetable({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount, numberofveginrow: numberofveginrow, moreinfolink: moreinfolink});
  
    };
  
  RemoveVegtClick = name => {
    this.props.deleteChoosenVegetable(name);
  };

  UpdateChoosenVegetable = (id, name, price, averagecrop, amount, numberofveginrow, moreinfolink) => {
      this.props.deleteChoosenVegetable(name);
      this.props.addChoosenVegetable({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount, numberofveginrow, moreinfolink: moreinfolink});
  };

  render() {
    const { ChoosenVegetables } = this.props.choosenvegetable;
    const { Language } = this.props;

    return (
      <Container>
        <div className="ChoosenVegetablesPricingHeader">{Language.VegPricingListItemTitle}</div>
        <ListGroup>
          <TransitionGroup className='ChoosenVegetablesList'>
            {ChoosenVegetables.map(({ _id, name, price, averagecrop, amount, numberofveginrow, moreinfolink}) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <span><img
                  alt=""
                  src={require('../Resources/Leaf.png')}
                  className='ChoosenVegetableImage'
                  size='sm'
                  /></span>
                  <span className='ChoosenVegetableName'>{name}</span>
                  <span className='ChoosenVegetabletext'>{Language.VegPricingListItemCost}</span>
                  <span className='ChoosenVegetablePrice'>
                    <Input
                      type='text'
                      placeholder={price}
                      className='mb-3'
                      onBlur={event => this.UpdateChoosenVegetable(_id, name, event.target.value, averagecrop, amount, numberofveginrow, moreinfolink)}
                      />
                  </span>
                  <span className='ChoosenVegetabletext2'>{Language.Shekals}</span>
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
    choosenvegetable: state.choosenvegetable,
    language: state.language,
    Language: state.language.Language
});

export default connect(
  mapStateToProps,
  { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable }
)(VegetablesPricing);