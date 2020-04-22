import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
  FormFeedback,
  UncontrolledCollapse,
  CardBody,
  Card,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { IoIosSearch } from "react-icons/io";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { getgrowers } from '../actions/growerAction';
import { getfarmers } from '../actions/farmerAction';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';

class AdminPersonalArea extends Component {
  state = {
    modal: false,
    msg: null,
    ScreenNumber: "1",
    redirect: null,
    UserActive: false,
    FarmerNameToSearch: '',
    DataToSearch: '',
    IsActiveOrder: true,
    ActiveSort: 'IsActiveOrder',
    NameOrder: true,
    DateOrder: true,
    FarmerIsActiveOrder: true,
    FarmerActiveSort: 'FarmerNameOrder',
    FarmerNameOrder: true
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    getgrowers: PropTypes.func.isRequired,
    grower: PropTypes.object.isRequired,
    getfarmers: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getgrowers();
    this.props.getfarmers();
  }

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    this.setState({
      DataToSearch: this.state.FarmerNameToSearch
    });
  };

  ChangeScreen = (ScreenNum) => {
    this.setState({
      ScreenNumber: ScreenNum
    });
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

  ReturnPlansAsString = (MychoosenPlans) => {
    var PlansAsString = '';
    for(var i=0; i<MychoosenPlans.length ;i++){
      if(MychoosenPlans.length === (i+1)){
        PlansAsString += MychoosenPlans[i].name;
      }
      else PlansAsString += MychoosenPlans[i].name + ", ";   
    }
    return PlansAsString;
  };

  GetDateAsString = (DateToConvert) => {
    var RegisterDate = new Date(DateToConvert);
    var RegisterDateToStringFormat = RegisterDate.getDate() + "/"+ parseInt(RegisterDate.getMonth()+1) +"/"+RegisterDate.getFullYear();
    return RegisterDateToStringFormat;
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    
    const { farmers } = this.props.farmer;

    try{
      switch(this.state.FarmerActiveSort){
        case "FarmerNameOrder":
          if(this.state.FarmerNameOrder){
            const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
            var farmersSorted = farmers.slice().sort(sortByKey('name'));
          }
          else{
            const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
            var farmersSorted = farmers.slice().sort(sortByKey('name'));
          }
          break;
        default:
          var farmersSorted = farmers;
          break;
      }
      
  }
  catch{
    var farmersSorted = farmers;
  }
    
    const { growers } = this.props.grower;
    try{
      if(this.state.DataToSearch === ''){
        var GrowersToSearch = growers;
      }
      else{
        var GrowersToSearch = growers.filter(grower => grower.chossenfarmerfullname.includes(this.state.FarmerNameToSearch));
      }
    }
    catch{}

    try{
      switch(this.state.ActiveSort){
        case "IsActiveOrder":
          if(this.state.IsActiveOrder){
            const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
            GrowersToSearch = GrowersToSearch.slice().sort(sortByKey('isactive'));
          }
          else{
            const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
            GrowersToSearch = GrowersToSearch.slice().sort(sortByKey('isactive'));
          }
          break;
        case "NameOrder":
          if(this.state.NameOrder){
            const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
            GrowersToSearch = GrowersToSearch.slice().sort(sortByKey('name'));
          }
          else{
            const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
            GrowersToSearch = GrowersToSearch.slice().sort(sortByKey('name'));
          }
          break;
        case "DateOrder":
          if(this.state.DateOrder){
            const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1;
            GrowersToSearch = GrowersToSearch.slice().sort(sortByKey('name'));
          }
          else{
            const sortByKey = key => (a, b) => a[key] > b[key] ? 1 : -1;
            GrowersToSearch = GrowersToSearch.slice().sort(sortByKey('name'));
          }
          break;
        default:
      }
      
  }
  catch{
    GrowersToSearch = growers.filter(grower => grower.chossenfarmerfullname.includes(this.state.FarmerNameToSearch));
  }

    return (
      <div>
        {isAuthenticated ? 
          user.usertype === 'SysAdmin' ?
          <Container>
            {this.state.ScreenNumber === "1" ? (
                <div className='GrowerPersonalAreaTabs'>
                  <div className='GrowerPersonalAreaTabsButtons'>
                    <Button color="success" type="button" disabled>
                    חקלאים
                    </Button>
                    <Button outline color="success" onClick={() => this.ChangeScreen("2")} type="button" >
                    מגדלים
                    </Button>
                  </div>
                </div>
            ) : null}
            {this.state.ScreenNumber === "2" ? (
                <div className='GrowerPersonalAreaTabs'>
                  <div className='GrowerPersonalAreaTabsButtons'>
                    <Button outline color="success" onClick={() => this.ChangeScreen("1")} type="button" >
                    חקלאים
                    </Button>
                    <Button color="success" type="button" disabled>
                    מגדלים
                    </Button>
                  </div>
                </div>
            ) : null}
          {this.state.ScreenNumber === "1" ? 
            <div className="AdminFarmersList">
              <ListGroup>
                <ListGroupItem className="FarmerListTitleListItem" >
                  <div className='FarmerListTitle'>
                    <div className='FarmerListTitleText1'>
                      <span>שם מלא</span>
                      <span className='IsActiveArrow' onClick={() => this.setState({ FarmerNameOrder: !this.state.FarmerNameOrder, FarmerActiveSort: "FarmerNameOrder" })} >{this.state.FarmerNameOrder ? <TiArrowSortedDown /> : <TiArrowSortedUp />}</span>
                    </div>
                    <div className='FarmerListTitleText2'>
                      <span>טלפון</span>
                    </div>
                    <div className='FarmerListTitleText3'>
                      <span>כתובת</span>
                    </div>
                    <div className='FarmerListTitleText4'>
                      <span>דואר אלקטרוני</span>
                    </div>
                    <div className='FarmerListTitleText5'>
                      <span>ארבעת הגידולים</span>
                    </div>
                    <div className='FarmerListTitleText6'>
                      <span>אזור גידול</span>
                    </div>
                    <div className='FarmerListTitleText7'>
                      <span>גודל החממה</span>
                    </div>
                    <div className='FarmerListTitleText8'>
                      <span>מספר חממות פנויות</span>
                    </div>
                    <div className='FarmerListTitleText9'>
                      <span>תחילת מסלול</span>
                    </div>
                    <div className='FarmerListTitleText10'>
                      <span>מסלול</span>
                    </div>
                  </div>
              </ListGroupItem>
              </ListGroup>
              <ListGroup>
                {farmersSorted.map(({ _id, name, familyname, phone, email, sizearea, hamamasize, numberofactivefarms, choosenvegetables, plans, address, register_date}) => (
                  <CSSTransition key={_id} timeout={500} classNames='fade'>
                    <ListGroupItem className="FarmerListBodyListItem">
                      <div className='FarmerList'>
                        <div  className='FarmerListName'>
                          <span>{name + " " + familyname}&nbsp;</span>
                        </div>
                      <div  className='FarmerListPhone'>
                        <span>{phone}&nbsp;</span>
                      </div>
                      <div  className='FarmerListAddress'>
                        <span>{address}&nbsp;</span>
                      </div>
                      <div className='FarmerListEmail'>
                        <span><a href={"mailto:" + email}>{email}</a>&nbsp;</span>
                      </div>
                      <div className='FarmerListOfchoosenvegetables2'>
                        <span>{this.ReturnChoosingVegtabilesAsString(choosenvegetables)}&nbsp;</span>
                      </div>
                      <div className='FarmerListSizearea'>
                        <span>{sizearea}&nbsp;</span>
                      </div>
                      <div  className='FarmerListHamamasize'>
                        <span>{hamamasize}&nbsp;</span>
                      </div>
                      <div  className='FarmerListNumberofactivefarms'>
                        <span>{numberofactivefarms}&nbsp;</span>
                      </div>
                      <div className='FarmerListPlanActivation'>
                        <span>{this.GetDateAsString(register_date)}&nbsp;</span>
                      </div>
                      <div className='FarmerListplan'>
                        <span>{this.ReturnPlansAsString(plans)}&nbsp;</span>
                      </div>
                    </div>
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </ListGroup>
            </div>
          : null}
          {this.state.ScreenNumber === "2" ? 
          <div>
            <div className="AdminGrowersSearchInList">
            <Container>
               <Form onSubmit={this.onSubmit}>
                 <FormGroup>
                  <div className='AdminGrowersSearchInListBody'>
                    <div className="AdminGrowersSearch-form-group">
                      <Label for='FarmerNameToSearch'></Label>
                      <Input
                        type='text'
                        name='FarmerNameToSearch'
                        id='FarmerNameToSearch'
                        placeholder='חיפוש מגדל לפי שם חקלאי'
                        className='mb-3'
                        onChange={this.onChange}
                      />
                      <Button outline color="success" className='SearchButton' >
                       <IoIosSearch />
                      </Button>
                    </div>
                  </div>
                </FormGroup>
              </Form>
            </Container>
            </div>
            <div className="AdminGrowersList">
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
                    <div className='GrowerListTitleText8'>
                      <span>חקלאי</span>
                    </div>
                  </div>
              </ListGroupItem>
              </ListGroup>
              <ListGroup>
                {GrowersToSearch.map(({ _id, name, familyname, phone, email, sizearea, choosenvegetables, plan, chossenfarmerfullname, chossenfarmer, isactive, register_date}) => (
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
                        <span><a href={"mailto:" + email}>{email}</a>&nbsp;</span>
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
                      <div className='GrowerListChossenfarmer'>
                        <span>{chossenfarmerfullname}&nbsp;</span>
                        <span>{chossenfarmer}&nbsp;</span>
                      </div>
                    </div>
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </ListGroup>
            </div>
          </div>
          : null}
          {this.state.ScreenNumber === "1" ? <div className="AdminTotalUsers"><span>נמצאו סה"כ {farmersSorted.length} חקלאים</span></div> : <div className="AdminTotalUsers"><span>נמצאו סה"כ {GrowersToSearch.length} מגדלים</span></div>}
          </Container>
          : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >משתמש זה אינו מנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >הירשם כמנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  farmer: state.farmer,
  grower: state.grower
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getfarmers, getgrowers }
)(AdminPersonalArea);