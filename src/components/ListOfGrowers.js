import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Input, Label, CustomInput, Badge } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { getgrowersbyfarmer } from '../actions/growerAction';
import PropTypes from 'prop-types';

class ListOfGrowers extends Component {
  state = {
    
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
    var VegAsString = '';
    var RegisterDate = new Date(DateToConvert);
    var RegisterDateToStringFormat = RegisterDate.getDate() + "/"+ parseInt(RegisterDate.getMonth()+1) +"/"+RegisterDate.getFullYear();
    return RegisterDateToStringFormat;
  };

  render() {
    const { growers } = this.props.grower;

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
                    </div>
                    <div className='GrowerListTitleText6'>
                      <span>תחילת מסלול</span>
                    </div>
                    <div className='GrowerListTitleText7'>
                      <span>מסלול</span>
                    </div>
            </div>
            </ListGroupItem>
        </ListGroup>
        <ListGroup>
            {growers.map(({ _id, name, familyname, phone, email, sizearea, choosenvegetables, plan, isactive, register_date}) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem className="GrowerListBodyListItem">
                  <div className='GrowerList'>
                    <div  className='GrowerListName'>
                      <span>{name + " " + familyname}</span>
                    </div>
                    <div  className='GrowerListPhone'>
                      <span>{phone}</span>
                    </div>
                    <div className='GrowerListEmail'>
                      <span>{email}</span>
                    </div>
                    <div className='GrowerListOfchoosenvegetables2'>
                      <span>{this.ReturnChoosingVegtabilesAsString(choosenvegetables)}</span>
                    </div>
                    <div className='GrowerListIsActive'>
                      <span>{isactive ? 'לא' : 'כן'}</span>
                    </div>
                    <div className='GrowerListPlanActivation'>
                      <span>{this.GetDateAsString(register_date)}</span>
                    </div>
                    <div className='GrowerListplan'>
                      <span>{plan.name}</span>
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