import React, { Component } from 'react';
import { Input, Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable } from '../actions/choosenVegetablesAction';
import { getvegetablelanguages } from '../actions/vegLanguageConvertorAction';
import PropTypes from 'prop-types';

class VegetablesPricing extends Component {
  state = {
  };

  static propTypes = {
    getChoosenVegetables: PropTypes.func.isRequired,
    addChoosenVegetable: PropTypes.func.isRequired,
    deleteChoosenVegetable: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired,
    choosenvegetable: PropTypes.object.isRequired,
    languagedbconversion: PropTypes.object.isRequired,
    getvegetablelanguages: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getChoosenVegetables();
    this.props.getvegetablelanguages();
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

  Translate = name => {
    try {
      const { vegetablelsanguages, LanguageCode } = this.props;
      var VegToFind = vegetablelsanguages.find(vegetablelanguage => vegetablelanguage.vegname === name);
      var NameToReturn = VegToFind.langconvert.find(vegetablelanguage => vegetablelanguage.langname === LanguageCode);
      return(NameToReturn.langvalue);
    }
    catch{return name;}

    return name;
  };

  render() {
    const { ChoosenVegetables } = this.props.choosenvegetable;
    const { Language, direction } = this.props;

    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    if(direction === 'rtl'){
      FloatClass = "Co-Align-Right";
      TextAlignClass = "Co-Text-Align-Right";
    }
    else{
      FloatClass = "Co-Align-Left";
      TextAlignClass = "Co-Text-Align-Left";
    }

    return (
      <Container>
        <div className="ChoosenVegetablesPricingHeader">{Language.VegPricingListItemTitle}</div>
        <ListGroup>
          <TransitionGroup className='ChoosenVegetablesList'>
            {ChoosenVegetables.map(({ _id, name, price, averagecrop, amount, numberofveginrow, moreinfolink}) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <span className={FloatClass}><img
                  alt=""
                  src={require('../Resources/Leaf.png')}
                  className='ChoosenVegetableImage'
                  size='sm'
                  /></span>
                  <span className={'ChoosenVegetableName ' + FloatClass + " " + TextAlignClass} >{this.Translate(name)}</span>
                  <span className={'ChoosenVegetabletext ' + FloatClass}>{Language.VegPricingListItemCost}</span>
                  <span className={'ChoosenVegetablePrice ' + FloatClass}>
                    <Input
                      type='text'
                      placeholder={price}
                      className='mb-3'
                      onBlur={event => this.UpdateChoosenVegetable(_id, name, event.target.value, averagecrop, amount, numberofveginrow, moreinfolink)}
                      />
                  </span>
                  <span className={'ChoosenVegetabletext2 ' + FloatClass}>{Language.Shekals}</span>
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
    Language: state.language.Language,
    direction: state.language.direction,
    LanguageCode: state.language.LanguageCode,
    languagedbconversion: state.languagedbconversion,
    vegetablelsanguages: state.languagedbconversion.vegetablelsanguages
});

export default connect(
  mapStateToProps,
  { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable, getvegetablelanguages }
)(VegetablesPricing);