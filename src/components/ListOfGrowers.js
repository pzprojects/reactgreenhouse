import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { getgrowersbyfarmer } from '../actions/growerAction';
import PropTypes from 'prop-types';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';

class ListOfGrowers extends Component {
  state = {
    IsActiveOrder: true,
    ActiveSort: 'IsActiveOrder',
    NameOrder: true,
    DateOrder: true
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    language: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    grower: PropTypes.object.isRequired,
    getgrowersbyfarmer: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getgrowersbyfarmer(this.props.FarmerEmail);
  }

  componentDidUpdate(prevProps) {
    
  }

  // Return plan name in the choosen language
  ReturnPlanInChoosenLanguage = (PlanName) => {
    var NameToReturn = '';
    const { Language } = this.props;
    switch (PlanName) {
      case "מגדל עצמאי":
        NameToReturn = Language.PlanName1;
        break;
      case "ביניים":
        NameToReturn = Language.PlanName2;
        break;
      case "ליווי שוטף":
        NameToReturn = Language.PlanName3;
        break;
    }

    return NameToReturn;
  };

  ReturnChoosingVegtabilesAsString = (Mychoosenvegetables) => {
    var VegAsString = '';
    for(var i=0; i<Mychoosenvegetables.length ;i++){
      if(Mychoosenvegetables.length === (i+1)){
        VegAsString += Mychoosenvegetables[i].name;
      }
      else VegAsString += Mychoosenvegetables[i].name + ", ";   
    }
    return VegAsString;
  };

  GetDateAsString = (DateToConvert) => {
    var RegisterDate = new Date(DateToConvert);
    var RegisterDateToStringFormat = RegisterDate.getDate() + "/"+ parseInt(RegisterDate.getMonth()+1) +"/"+RegisterDate.getFullYear();
    return RegisterDateToStringFormat;
  };

  render() {
    const { direction, Language } = this.props;
    let FloatClass = "Co-Align-Right";
    if(direction === 'rtl'){
     FloatClass = "Co-Align-Right";
    }
    else{
     FloatClass = "Co-Align-Left";
    }
    try{
        const { growers } = this.props.grower;
        var SortedGrowers = [];

        switch(this.state.ActiveSort){
          case "IsActiveOrder":
            if(this.state.IsActiveOrder){
              const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
              SortedGrowers = growers.slice().sort(sortByKey('isactive'));
            }
            else{
              const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
              SortedGrowers = growers.slice().sort(sortByKey('isactive'));
            }
            break;
          case "NameOrder":
            if(this.state.NameOrder){
              const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
              SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            else{
              const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
              SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            break;
          case "DateOrder":
            if(this.state.DateOrder){
              const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
              SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            else{
              const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
              SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            break;
          default:
        }
        
    }
    catch{
        SortedGrowers = [];
    }

    return (
      <Container>
        <div className="ListOfGrowersByFarmer">
        <ListGroup>
            <ListGroupItem className="GrowerListMainTitleListItem" >
            <div className='GrowerListMainTitle'>
            {Language.GrowerListTitle}
            </div>
            </ListGroupItem>
        </ListGroup>
        <ListGroup>
            <ListGroupItem className="GrowerListTitleListItem" >
            <div className='GrowerListTitle'>
                    <div className={'GrowerListTitleText1 ' + FloatClass}>
                      <span>{Language.GrowerListFullName}</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ NameOrder: !this.state.NameOrder, ActiveSort: "NameOrder" })} >{this.state.NameOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className={'GrowerListTitleText2 ' + FloatClass}>
                      <span>{Language.GrowerListPhone}</span>
                    </div>
                    <div className={'GrowerListTitleText3 ' + FloatClass}>
                      <span>{Language.GrowerListEmail}</span>
                    </div>
                    <div className={'GrowerListTitleText4 ' + FloatClass}>
                      <span>{Language.GrowerListFourCrops}</span>
                    </div>
                    <div className={'GrowerListTitleText5 ' + FloatClass}>
                      <span>{Language.GrowerListClientActive}</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ IsActiveOrder: !this.state.IsActiveOrder, ActiveSort: "IsActiveOrder" })} >{this.state.IsActiveOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className={'GrowerListTitleText6 ' + FloatClass}>
                      <span>{Language.GrowerListPlanActivation}</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ DateOrder: !this.state.DateOrder, ActiveSort: "DateOrder" })} >{this.state.DateOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className={'GrowerListTitleText7 ' + FloatClass}>
                      <span>{Language.GrowerListPlan}</span>
                    </div>
            </div>
            </ListGroupItem>
        </ListGroup>
        <ListGroup>
            {SortedGrowers.map(({ _id, name, familyname, phone, email, sizearea, choosenvegetables, choosenfieldcrops, fieldcropplan, plan, isactive, register_date}) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem className="GrowerListBodyListItem">
                  <div className='GrowerList'>
                    <div  className={'GrowerListName ' + FloatClass}>
                      <span>{name + " " + familyname}&nbsp;</span>
                    </div>
                    <div  className={'GrowerListPhone ' + FloatClass}>
                      <span>{phone}&nbsp;</span>
                    </div>
                    <div className={'GrowerListEmail ' + FloatClass}>
                      <span><a href={"mailto:" + email}>{email}</a>&nbsp;</span>
                    </div>
                    <div className={'GrowerListOfchoosenvegetables2 ' + FloatClass}>
                      <span><strong>{Language.GrowerListVegDetails}</strong>{this.ReturnChoosingVegtabilesAsString(choosenvegetables)}<p>
                      <strong>{fieldcropplan.avaliabile ? Language.GrowerListFieldCropsDetails : null}</strong>{fieldcropplan.avaliabile ? this.ReturnChoosingVegtabilesAsString(choosenfieldcrops) : null}</p>&nbsp;</span>
                    </div>
                    <div className={'GrowerListIsActive ' + FloatClass}>
                      <span>{isactive ? 'כן' : 'לא'}&nbsp;</span>
                    </div>
                    <div className={'GrowerListPlanActivation ' + FloatClass}>
                      <span>{this.GetDateAsString(register_date)}&nbsp;</span>
                    </div>
                    <div className={'GrowerListplan ' + FloatClass}>
                      <span>{this.ReturnPlanInChoosenLanguage(plan.name)}{fieldcropplan.avaliabile ? Language.GrowerListFieldCropsExtra : null}&nbsp;</span>
                    </div>
                  </div>
                </ListGroupItem>
              </CSSTransition>
            ))}
        </ListGroup>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    grower: state.grower,
    language: state.language,
    Language: state.language.Language,
    direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { getgrowersbyfarmer }
)(ListOfGrowers);