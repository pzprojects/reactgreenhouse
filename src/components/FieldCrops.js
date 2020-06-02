import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getFieldcrops } from '../actions/fieldcropAction';
import { getChoosenfieldCrops, addChoosenfieldCrop, deleteChoosenfieldCrop } from '../actions/choosenFieldCropsAction';
import { getvegetablelanguages } from '../actions/vegLanguageConvertorAction';
import PropTypes from 'prop-types';

class FieldCrops extends Component {
  state = {
  };

  static propTypes = {
    getFieldcrops: PropTypes.func.isRequired,
    fieldcrop: PropTypes.object.isRequired,
    getChoosenfieldCrops: PropTypes.func.isRequired,
    addChoosenfieldCrop: PropTypes.func.isRequired,
    deleteChoosenfieldCrop: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired,
    choosenfieldcrop: PropTypes.object.isRequired,
    languagedbconversion: PropTypes.object.isRequired,
    getvegetablelanguages: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getFieldcrops();
    this.props.getChoosenfieldCrops();
    this.props.getvegetablelanguages();
  }

  componentDidUpdate(prevProps) {
    
  }

  onVegtClick = (id, name, price, averagecrop, amount, numberofveginrow, moreinfolink) => {
  this.props.addChoosenfieldCrop({_id: id, name: name, price: price, averagecrop: averagecrop, amount: amount, numberofveginrow: numberofveginrow, moreinfolink: moreinfolink});

  };

  RemoveVegtClick = name => {
    this.props.deleteChoosenfieldCrop(name);
   };

   ImgToPresent = name => {
     const index = this.props.choosenfieldcrop.ChoosenFieldCrops.findIndex(x => x.name === name);
     if(index < 0){
       return true
     }
     else return false
    
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
    const { fieldcrops } = this.props.fieldcrop;
    const { Language, direction } = this.props;

    let FloatClass = "Co-Align-Right";
    if(direction === 'rtl'){
      FloatClass = "Co-Align-Right";
    }
    else{
      FloatClass = "Co-Align-Left";
    }

    return (
      <Container>
        <ListGroup horizontal>
          <TransitionGroup className='vegetablesList'>
            {fieldcrops.map(({ _id, name, price, averagecrop, amount, numberofveginrow, moreinfolink }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem className={FloatClass}>
                  { this.ImgToPresent(name) ? 
                  <span className={FloatClass}><img
                  alt=""
                  src={require('../Resources/EmptyLeaf.png')}
                  className='vegetableImage'
                  color='danger'
                  size='sm'
                  id={_id}
                  onClick={this.onVegtClick.bind(this, _id, name, price, averagecrop, amount, numberofveginrow, moreinfolink)}
                  /></span>
                   :
                   <span className={FloatClass}><img
                  alt=""
                  src={require('../Resources/Leaf.png')}
                  className='vegetableImage'
                  color='danger'
                  size='sm'
                  id={_id}
                  onClick={this.RemoveVegtClick.bind(this, name)}
                  /></span> }
                  <span className={'vegetablesItemName ' + FloatClass}>{this.Translate(name)}</span>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ListGroup>
        <Button className='vegetablesApproveButton' color="info" onClick={this.props.OpenListOffieldcrops}>{Language.Approve}</Button>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
    fieldcrop: state.fieldcrop,
    choosenfieldcrop: state.choosenfieldcrop,
    language: state.language,
    Language: state.language.Language,
    direction: state.language.direction,
    LanguageCode: state.language.LanguageCode,
    languagedbconversion: state.languagedbconversion,
    vegetablelsanguages: state.languagedbconversion.vegetablelsanguages
});

export default connect(
  mapStateToProps,
  { getFieldcrops, getChoosenfieldCrops, addChoosenfieldCrop, deleteChoosenfieldCrop, getvegetablelanguages }
)(FieldCrops);