import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Input, Label, CustomInput, Badge } from 'reactstrap';
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
    isAuthenticated: PropTypes.bool,
    grower: PropTypes.object.isRequired,
    getgrowersbyfarmer: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getgrowersbyfarmer(this.props.FarmerEmail);
  }

  componentDidUpdate(prevProps) {
    
  }

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
    try{
        const { growers } = this.props.grower;

        switch(this.state.ActiveSort){
          case "IsActiveOrder":
            if(this.state.IsActiveOrder){
              const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
              var SortedGrowers = growers.slice().sort(sortByKey('isactive'));
            }
            else{
              const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
              var SortedGrowers = growers.slice().sort(sortByKey('isactive'));
            }
            break;
          case "NameOrder":
            if(this.state.NameOrder){
              const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
              var SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            else{
              const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
              var SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            break;
          case "DateOrder":
            if(this.state.DateOrder){
              const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
              var SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            else{
              const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
              var SortedGrowers = growers.slice().sort(sortByKey('name'));
            }
            break;
          default:
        }
        
    }
    catch{
        var SortedGrowers = [];
    }

    return (
      <Container>
        <div className="ListOfGrowersByFarmer">
        <ListGroup>
            <ListGroupItem className="GrowerListMainTitleListItem" >
            <div className='GrowerListMainTitle'>
            לקוחות
            </div>
            </ListGroupItem>
        </ListGroup>
        <ListGroup>
            <ListGroupItem className="GrowerListTitleListItem" >
            <div className='GrowerListTitle'>
                    <div className='GrowerListTitleText1'>
                      <span>שם מלא</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ NameOrder: !this.state.NameOrder, ActiveSort: "NameOrder" })} >{this.state.NameOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className='GrowerListTitleText2'>
                      <span>טלפון</span>
                    </div>
                    <div className='GrowerListTitleText3'>
                      <span>דואר אלקטרוני</span>
                    </div>
                    <div className='GrowerListTitleText4'>
                      <span>ארבעת הגידולים</span>
                    </div>
                    <div className='GrowerListTitleText5'>
                      <span>לקוח פעיל</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ IsActiveOrder: !this.state.IsActiveOrder, ActiveSort: "IsActiveOrder" })} >{this.state.IsActiveOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className='GrowerListTitleText6'>
                      <span>תחילת מסלול</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ DateOrder: !this.state.DateOrder, ActiveSort: "DateOrder" })} >{this.state.DateOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className='GrowerListTitleText7'>
                      <span>מסלול</span>
                    </div>
            </div>
            </ListGroupItem>
        </ListGroup>
        <ListGroup>
            {SortedGrowers.map(({ _id, name, familyname, phone, email, sizearea, choosenvegetables, plan, isactive, register_date}) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem className="GrowerListBodyListItem">
                  <div className='GrowerList'>
                    <div  className='GrowerListName'>
                      <span>{name + " " + familyname}&nbsp;</span>
                    </div>
                    <div  className='GrowerListPhone'>
                      <span>{phone}&nbsp;</span>
                    </div>
                    <div className='GrowerListEmail'>
                      <span>{email}&nbsp;</span>
                    </div>
                    <div className='GrowerListOfchoosenvegetables2'>
                      <span>{this.ReturnChoosingVegtabilesAsString(choosenvegetables)}&nbsp;</span>
                    </div>
                    <div className='GrowerListIsActive'>
                      <span>{isactive ? 'כן' : 'לא'}&nbsp;</span>
                    </div>
                    <div className='GrowerListPlanActivation'>
                      <span>{this.GetDateAsString(register_date)}&nbsp;</span>
                    </div>
                    <div className='GrowerListplan'>
                      <span>{plan.name}&nbsp;</span>
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
    grower: state.grower
});

export default connect(
  mapStateToProps,
  { getgrowersbyfarmer }
)(ListOfGrowers);