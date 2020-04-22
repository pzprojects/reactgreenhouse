import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Input, Label, CustomInput, Badge, Alert, Button } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { getfarmersbyarea } from '../actions/farmerAction';
import { updatechoosenfarmer, getchoosenfarmer } from '../actions/choosenFarmerAction';
import { addToGrowerVegBag, deleteFromGrowerVegBag, getGrowerVegBag, ResetGrowerVegBag, SetTotalGrowerVegBag, SetPlanGrowerVegBag, SetIsValidatedVegBag } from '../actions/growerVegChoiceAction';
import PropTypes from 'prop-types';

class ChooseFarmer extends Component {
  state = {
    ChoosenFarmerId : '',
    GrowerVeg1 :  '',
    GrowerVeg2 :  '',
    GrowerVeg3 :  '',
    GrowerVeg4 :  '',
    TotalPayment: '0',
    DuplicatesVegInBag: '',
    DuplicaesValidationActive: true
  };

  static propTypes = {
    getfarmersbyarea: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    updatechoosenfarmer: PropTypes.func.isRequired,
    getchoosenfarmer: PropTypes.func.isRequired,
    choosenfarmer: PropTypes.object.isRequired,
    growervegbuyingbag: PropTypes.object.isRequired,
    deleteFromGrowerVegBag: PropTypes.func.isRequired,
    addToGrowerVegBag: PropTypes.func.isRequired,
    getGrowerVegBag: PropTypes.func.isRequired,
    ResetGrowerVegBag: PropTypes.func.isRequired,
    SetTotalGrowerVegBag: PropTypes.func.isRequired,
    SetPlanGrowerVegBag: PropTypes.func.isRequired,
    SetIsValidatedVegBag: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getfarmersbyarea(this.props.SizeAreaParam);
    this.props.getchoosenfarmer();
    this.props.getGrowerVegBag();

    if(this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined && this.props.choosenfarmer.ChoosenFarmerById[0] !== null){
        this.setState({
            ChoosenFarmerId: this.props.choosenfarmer.ChoosenFarmerById[0]._id
          },() => {
            this.UpdateAllSelectedFields();
        });
    }
    else {
      this.props.getfarmersbyarea(this.props.SizeAreaParam, this.props.PlanParam);
    }
  }

  componentDidUpdate(prevProps, prevStates) {
    if (this.props.SizeAreaParam !== prevProps.SizeAreaParam || this.props.PlanParam !== prevProps.PlanParam) {
      this.setState({
        ChoosenFarmerId: ''
      },() => {
        this.props.updatechoosenfarmer();
        this.props.ResetGrowerVegBag();
        this.props.getfarmersbyarea(this.props.SizeAreaParam, this.props.PlanParam);
      });
    };

    if (this.props.growervegbuyingbag !== prevProps.growervegbuyingbag) {
      
      const { VegToBuy } = this.props.growervegbuyingbag;

      try{
        const GrowerBag = VegToBuy;
        this.ValidateDuplicates(GrowerBag);
      }
      catch{

      }
    }

    if(this.state.DuplicaesValidationActive !== prevStates.DuplicaesValidationActive){
      this.props.SetIsValidatedVegBag(this.state.DuplicaesValidationActive);
    }
  }
  
  UpdateAllSelectedFields = () => {
     try{
      var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
      var GrowerBag = this.props.growervegbuyingbag.VegToBuy;
  
      if(this.state.GrowerVeg1 === ''){
        if(GrowerBag[0] !== undefined){
            this.setState({
              GrowerVeg1: GrowerBag[0].name
            })
        }
        else {
          this.setState({
              GrowerVeg1: ChoosenVegArray[0].name
          })
        }
      }
  
      if(this.state.GrowerVeg2 === ''){
        if(GrowerBag[1] !== undefined){
            this.setState({
              GrowerVeg2: GrowerBag[1].name
            })
        }
        else {
          this.setState({
              GrowerVeg2: ChoosenVegArray[1].name
          })
        }
      }
  
      if(this.state.GrowerVeg3 === ''){
        if(GrowerBag[2] !== undefined){
            this.setState({
              GrowerVeg3: GrowerBag[2].name
            })
        }
        else {
          this.setState({
              GrowerVeg3: ChoosenVegArray[2].name
          })
        }
      }
  
      if(this.state.GrowerVeg1 === ''){
        if(GrowerBag[3] !== undefined){
            this.setState({
              GrowerVeg4: GrowerBag[3].name
            })
        }
        else {
          this.setState({
              GrowerVeg4: ChoosenVegArray[3].name
          })
        }
      }
    }catch(e){
     
    }
    
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

  GetVegAmount = (ItemId) => {
    var Amount = '';
    try{ 
    if(this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined){
      var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        switch(ItemId) {
          case "1":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg1){
                  Amount = ChoosenVegArray[i].averagecrop;
                }
            }
            break;
          case "2":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg2){
                  Amount = ChoosenVegArray[i].averagecrop;
                }
            }
            break;
          case "3":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg3){
                  Amount = ChoosenVegArray[i].averagecrop;
                }
            }
            break;
          case "4":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg4){
                  Amount = ChoosenVegArray[i].averagecrop;
                }
            }
            break;
          default:
            Amount = "0";
        }
      }
      else Amount = "0";
  
      Amount += ' ק"ג';
    }catch(e){
      return Amount;       
    }

    return Amount;
  };

  GetVegLink = (ItemId) => {
    var Link = '';
    try{ 
    if(this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined){
      var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        switch(ItemId) {
          case "1":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg1){
                  Link = ChoosenVegArray[i].moreinfolink;
                }
            }
            break;
          case "2":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg2){
                  Link = ChoosenVegArray[i].moreinfolink;
                }
            }
            break;
          case "3":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg3){
                  Link = ChoosenVegArray[i].moreinfolink;
                }
            }
            break;
          case "4":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg4){
                  Link = ChoosenVegArray[i].moreinfolink;
                }
            }
            break;
          default:
          Link = "";
        }
      }
      else Link = "";

    }catch(e){
      return Link;       
    }

    return Link;
  };

  GetPlanData = (DataType) => {
    var PlanDataToReturn = '';
    try{
      if(this.props.PlanParam !== '' && this.props.PlanParam !== null && this.props.PlanParam !== undefined ){
        if( this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined ){
          const planprice = this.props.choosenfarmer.ChoosenFarmerById[0].plans.find(item => item.name === this.props.PlanParam);
          if(DataType === "name"){
            PlanDataToReturn = this.props.PlanParam + ' ש"ח';
          }
          else PlanDataToReturn = planprice.cost + ' ש"ח';
        }
      }
      else PlanDataToReturn = '';
    }catch(e){
      return PlanDataToReturn;       
    }

    return PlanDataToReturn;
  }

  GetVegData = (ItemId, DataType) => {
    var DataToRetrive = '';
    try{
      if( this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined){
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        switch(ItemId) {
          case "1":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg1){
                  if(DataType === "amount"){
                    DataToRetrive = ChoosenVegArray[i].amount;
                  }
                  else {
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                  }
                }
            }
            break;
          case "2":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
              if(ChoosenVegArray[i].name === this.state.GrowerVeg2){
                  if(DataType === "amount"){
                    DataToRetrive = ChoosenVegArray[i].amount;
                  }
                  else {
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                  }
              }
            }
            break;
          case "3":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
              if(ChoosenVegArray[i].name === this.state.GrowerVeg3){
                  if(DataType === "amount"){
                    DataToRetrive = ChoosenVegArray[i].amount;
                  }
                  else {
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                  }
              }
            }
            break;
          case "4":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
              if(ChoosenVegArray[i].name === this.state.GrowerVeg4){
                  if(DataType === "amount"){
                    DataToRetrive = ChoosenVegArray[i].amount;
                  }
                  else {
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                  }
              }
            }
            break;
          default:
          DataToRetrive = "0";
      }
  
        if(DataType === "amount"){
          DataToRetrive += ' שתילים';
        }
        else DataToRetrive += ' ש"ח';
      }
    }catch(e){
      return DataToRetrive;      
    }
    
    return DataToRetrive;
  };

  GetTotalPayment = () => {
    var DataToRetrive = 0;
    try{
      if(this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined){
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
  
        for( var i=0;  i < ChoosenVegArray.length; i++ ){
          if(ChoosenVegArray[i].name === this.state.GrowerVeg1 ){
            DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
            break;
          }
        }
    
        for( var i=0;  i < ChoosenVegArray.length; i++ ){
          if(ChoosenVegArray[i].name === this.state.GrowerVeg2 ){
            DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
            break;
          }
        }
    
        for( var i=0;  i < ChoosenVegArray.length; i++ ){
          if(ChoosenVegArray[i].name === this.state.GrowerVeg3 ){
            DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
            break;
          }
        }
    
        for( var i=0;  i < ChoosenVegArray.length; i++ ){
          if(ChoosenVegArray[i].name === this.state.GrowerVeg4 ){
            DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
            break;
          }
        }
    
        if(this.props.PlanParam !== '' && this.props.PlanParam !== null && this.props.PlanParam !== undefined){
          const planprice = this.props.choosenfarmer.ChoosenFarmerById[0].plans.find(item => item.name === this.props.PlanParam);
          if(planprice !== undefined){
            DataToRetrive +=  parseFloat(planprice.cost);
          }
        }
      }
      //this.props.SetTotalGrowerVegBag(this.GetTotalPayment());
      DataToRetrive = DataToRetrive.toString() + ' ש"ח';
    }catch(e){
      return DataToRetrive;        
    } 

    return DataToRetrive;
  
  }

  GetVegTotalBilling = (ItemId, DataType) => {
    var DataToRetrive = '';
    try{
      if(this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined){
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        switch(ItemId) {
          case "1":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
                if(ChoosenVegArray[i].name === this.state.GrowerVeg1){
                  switch(DataType) {
                    case "averagecrop":
                      DataToRetrive = ChoosenVegArray[i].amount;
                      break;
                    case "price":
                      DataToRetrive = ChoosenVegArray[i].price;
                      break;
                    case "Total":
                      var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                      DataToRetrive = CaculatedData.toString();
                      break;
                    default:
                  }
                }
            }
            break;
          case "2":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
              if(ChoosenVegArray[i].name === this.state.GrowerVeg2){
                switch(DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenVegArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenVegArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                    break;
                  default:
                }
              }
            }
            break;
          case "3":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
              if(ChoosenVegArray[i].name === this.state.GrowerVeg3){
                switch(DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenVegArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenVegArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                    break;
                  default:
                }
              }
            }
            break;
          case "4":
            for( var i=0;  i < ChoosenVegArray.length; i++ ){
              if(ChoosenVegArray[i].name === this.state.GrowerVeg4){
                switch(DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenVegArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenVegArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                    break;
                  default:
                }
              }
            }
            break;
          default:
          DataToRetrive = "0";
        }
  
        if(DataType !== "averagecrop"){
          DataToRetrive += ' ש"ח';
        }
      }
    }catch(e){
      return DataToRetrive;      
    }

    return DataToRetrive;
  };

  AddVegToGrowerBag = (VegValue, ValueToDelete) => {
    try{
      var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
      var ObjectToAdd = {};
      for( var i=0;  i < ChoosenVegArray.length; i++ ){
        if(ChoosenVegArray[i].name === VegValue){
          ObjectToAdd = ChoosenVegArray[i];
        }
      }

      if(ValueToDelete !== ''){
        this.props.deleteFromGrowerVegBag(ValueToDelete);
      }
      this.props.addToGrowerVegBag(ObjectToAdd);
    }catch(e){
      console.log('error', e);        
    }
  };

  ValidateDuplicates = (GrowerBag) => {
    try{
      var GrowerBagSpecialVeg = '';
      var DuplicateCounter = 0;
      var DuplicateList = [];
      for( var k=0;  k < 4; k++ ){
        if(GrowerBag[k].numberofveginrow === "2"){
          DuplicateList.push(GrowerBag[k].name);
          DuplicateCounter++;
        }
      }

      switch(DuplicateCounter){
        case 1:
          GrowerBagSpecialVeg = DuplicateList[0];
          break;
        case 2:
          if(DuplicateList[0] !== DuplicateList[1]){
            GrowerBagSpecialVeg = DuplicateList[0] + " וגם " + DuplicateList[1];
          }
          break;
        case 3:
          if(DuplicateList[0] !== DuplicateList[1] && DuplicateList[0] !== DuplicateList[2]){
            GrowerBagSpecialVeg = DuplicateList[0];
            if(DuplicateList[2] !== DuplicateList[1]){
              GrowerBagSpecialVeg = GrowerBagSpecialVeg + ", " + DuplicateList[1] + " וגם " + DuplicateList[2];
            }
          }
          else{
            if(DuplicateList[0] === DuplicateList[1]){
              GrowerBagSpecialVeg = DuplicateList[2];
            }
            else GrowerBagSpecialVeg = DuplicateList[1];
          }
          break;
        case 4:
            if(DuplicateList[0] !== DuplicateList[1] && DuplicateList[0] !== DuplicateList[2] && DuplicateList[0] !== DuplicateList[3]){
              GrowerBagSpecialVeg = DuplicateList[0];
              if(DuplicateList[1] !== DuplicateList[2] && DuplicateList[1] !== DuplicateList[3]){
                if(DuplicateList[2] === DuplicateList[3]){
                  GrowerBagSpecialVeg = GrowerBagSpecialVeg + " וגם " + DuplicateList[1];
                }
                else{
                  GrowerBagSpecialVeg = GrowerBagSpecialVeg + ", " + DuplicateList[1] + ", " + DuplicateList[2]+ " וגם " + DuplicateList[3];
                }
              }
            }
            else{
              if(DuplicateList[0] === DuplicateList[1]){
                if(DuplicateList[2] !== DuplicateList[3]){
                  GrowerBagSpecialVeg = DuplicateList[2]+ " וגם " + DuplicateList[3];
                }
              }
              else{
                if(DuplicateList[0] === DuplicateList[2]){
                  if(DuplicateList[1] !== DuplicateList[3]){
                    GrowerBagSpecialVeg = DuplicateList[1]+ " וגם " + DuplicateList[3];
                  }
                }
                else {
                  if(DuplicateList[1] !== DuplicateList[2]){
                    GrowerBagSpecialVeg = DuplicateList[1]+ " וגם " + DuplicateList[2];
                  }
                }
              }
            }
            break;
        default:
      }

      if(GrowerBagSpecialVeg === ''){
        this.setState({
          DuplicatesVegInBag: '',
          DuplicaesValidationActive: true
        });
      }
      else{
        this.setState({
          DuplicatesVegInBag: GrowerBagSpecialVeg,
          DuplicaesValidationActive: false
        });
      }
    }
    catch{
      console.log();
    }
  };

  onChange = e => {

    switch(e.target.getAttribute('name')) {
        case "FarmerChoice":
          var FilteredChoosenFarmer = this.props.farmer.farmers.filter(farmer => farmer._id === e.target.value);
          this.props.updatechoosenfarmer(FilteredChoosenFarmer);
          this.props.ResetGrowerVegBag();
          var ChoosenVegArrayToPlace = FilteredChoosenFarmer[0].choosenvegetables;
          this.setState({
            ChoosenFarmerId : e.target.value,
            GrowerVeg1: ChoosenVegArrayToPlace[0].name,
            GrowerVeg2: ChoosenVegArrayToPlace[0].name,
            GrowerVeg3: ChoosenVegArrayToPlace[0].name,
            GrowerVeg4: ChoosenVegArrayToPlace[0].name
          },() => {
            var DefaultTotalCalc = parseFloat(ChoosenVegArrayToPlace[0].price)*parseFloat(ChoosenVegArrayToPlace[0].amount)*4 + parseFloat(FilteredChoosenFarmer[0].plans.find(element => element.name === this.props.PlanParam).cost);
            this.props.SetTotalGrowerVegBag(DefaultTotalCalc.toString() + ' ש"ח');
          });

          this.props.SetPlanGrowerVegBag(FilteredChoosenFarmer[0].plans.find(element => element.name === this.props.PlanParam));

          for( var j=0;  j < 4; j++ ){
            this.props.addToGrowerVegBag(ChoosenVegArrayToPlace[0], '');
          }
          break;
        case "GrowerVeg1":
          this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg1);
          this.setState({ [e.target.name]: e.target.value },() => {
            this.props.SetTotalGrowerVegBag(this.GetTotalPayment());
          });
          break;
        case "GrowerVeg2":
          this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg2);
          this.setState({ [e.target.name]: e.target.value },() => {
            this.props.SetTotalGrowerVegBag(this.GetTotalPayment());
          });
          break;
        case "GrowerVeg3":
          this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg3);
          this.setState({ [e.target.name]: e.target.value },() => {
            this.props.SetTotalGrowerVegBag(this.GetTotalPayment());
          });
          break;
        case "GrowerVeg4":
          this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg4);
          this.setState({ [e.target.name]: e.target.value },() => {
            this.props.SetTotalGrowerVegBag(this.GetTotalPayment());
          });
          break;
        default:
    }
    
  }

  render() {
    const { farmers } = this.props.farmer;
    if(this.state.ChoosenFarmerId !== ''){
      var ExtractFarmer = this.props.farmer.farmers.filter(farmer => farmer._id === this.state.ChoosenFarmerId);
      var ChoosenFarmerContainer = ExtractFarmer[0].choosenvegetables;
    }
    else var ChoosenFarmerContainer = [];

    return (
      <Container>
        <div className="ListOfFarmersByArea">
        <ListGroup>
            <ListGroupItem className="FarmerListTitleListItem" >
            <div className='FarmerListTitle'>
                    <div className='FarmerListTitleText1'>
                      <span>שם החקלאי</span>
                    </div>
                    <div className='FarmerListTitleText2'>
                      <span>דבר החקלאי</span>
                    </div>
                    <div className='FarmerListTitleText3'>
                      <span>מגדל</span>
                    </div>
                    <div className='FarmerListTitleText4'>
                      <span>מסלולים</span>
                    </div>
            </div>
            </ListGroupItem>
        </ListGroup>
        <ListGroup>
            {farmers.map(({ _id, name, familyname, phone, email, sizearea, hamamasize, numberofactivefarms, aboutme, imageurl, choosenvegetables, plans}) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <div className='FarmerList'>
                    <div  className='FarmerListRadioBtn'>
                      <Label check for={_id}>
                        <CustomInput 
                          type="radio"
                          name='FarmerChoice'
                          id={_id}
                          value={_id}
                          className='mb-3'
                          checked={this.state.ChoosenFarmerId === _id}
                          disabled={parseFloat(numberofactivefarms)>0 ? false : true}
                          onChange={this.onChange} />
                      </Label> 
                    </div>
                    <div  className='FarmerListImage'>
                      <img
                        alt=""
                        src={imageurl}
                        className='FarmerThemeImage'
                      />
                    </div>
                    <div  className='FarmerListName'>
                      <span>{name + " " + familyname}</span>
                      <Badge color="secondary">{numberofactivefarms}</Badge>
                    </div>
                    <div  className='FarmerListAboutme'>
                      <span>{aboutme}&nbsp;</span>
                    </div>
                    <div  className='FarmerListchoosenvegetables'>
                      <span>{this.ReturnChoosingVegtabilesAsString(choosenvegetables)}&nbsp;</span>
                    </div>
                    <div className='FarmerListplans'>
                    {plans.map(function(item, secondkey) {
                         return (
                            <span className='PlanItem' key={secondkey}>
                              {item.name + '- ' + item.cost + ' ש"ח לחודש'}
                              <br/>
                            </span>
                          )
                     })}
                    </div>
                    <div  className='FarmerListReadMore'>
                      <span>קרא עוד</span>
                    </div>
                  </div>
                </ListGroupItem>
              </CSSTransition>
            ))}
        </ListGroup>
        </div>
        {this.state.ChoosenFarmerId !== '' && this.state.ChoosenFarmerId !== undefined ?
        <div className="GrowerMainPicking">
          <div className="GrowerVegContainer2">
            <div className="GrowerVegContainer2Example" >אנא בחר\י את הירקות שברצונך לגדל</div>
            <ListGroup>
              <ListGroupItem>
                <div className="GrowerMainPickingTitle">
                 צפי יבול ממוצע לשנה לפי טור גידול
                </div>
              </ListGroupItem>
            </ListGroup>
            <ListGroup>
              <ListGroupItem>
                <div className="GrowerVegHolder">
                  <Label for='GrowerVeg1'></Label>
                  <Input type="select" name="GrowerVeg1" id="GrowerVeg1" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg1}>
                    {ChoosenFarmerContainer.map(function(item, thirdkey) {
                      return (
                        <option className='GrowerVegItem' key={thirdkey}>
                          {item.name}
                        </option>
                      )
                    })}
                  </Input>
                </div>
                <div className="GrowerChoosenVegAVGPrice">
                  <span>{ this.GetVegAmount("1") }</span>
                </div>
                <div className="GrowerChoosenVegMoreInfo">
                  <span className="GrowerChoosenVegMoreInfoIMG"><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                  <span className="GrowerChoosenVegMoreInfoText"><a href= {this.GetVegLink("1")} target="_blank">מידע נוסף</a></span>
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <div className="GrowerVegHolder">
                  <Label for='GrowerVeg2'></Label>
                  <Input type="select" name="GrowerVeg2" id="GrowerVeg2" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg2}>
                    {ChoosenFarmerContainer.map(function(item, thirdkey) {
                      return (
                        <option className='GrowerVegItem' key={thirdkey}>
                          {item.name}
                        </option>
                      )
                    })}
                  </Input>
                </div>
                <div className="GrowerChoosenVegAVGPrice">
                  <span>{ this.GetVegAmount("2") }</span>
                </div>
                <div className="GrowerChoosenVegMoreInfo">
                  <span className="GrowerChoosenVegMoreInfoIMG"><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                  <span className="GrowerChoosenVegMoreInfoText"><a href= {this.GetVegLink("2")} target="_blank">מידע נוסף</a></span>
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <div className="GrowerVegHolder">
                  <Label for='GrowerVeg3'></Label>
                  <Input type="select" name="GrowerVeg3" id="GrowerVeg3" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg3}>
                    {ChoosenFarmerContainer.map(function(item, thirdkey) {
                      return (
                        <option className='GrowerVegItem' key={thirdkey}>
                          {item.name}
                        </option>
                      )
                    })}
                  </Input>
                </div>
                <div className="GrowerChoosenVegAVGPrice">
                  <span>{ this.GetVegAmount("3") }</span>
                </div>
                <div className="GrowerChoosenVegMoreInfo">
                  <span className="GrowerChoosenVegMoreInfoIMG"><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                  <span className="GrowerChoosenVegMoreInfoText"><a href= {this.GetVegLink("3")} target="_blank">מידע נוסף</a></span>
                </div>
              </ListGroupItem>
              <ListGroupItem>
                <div className="GrowerVegHolder">
                  <Label for='GrowerVeg4'></Label>
                  <Input type="select" name="GrowerVeg4" id="GrowerVeg4" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg4}>
                    {ChoosenFarmerContainer.map(function(item, thirdkey) {
                      return (
                        <option className='GrowerVegItem' key={thirdkey}>
                          {item.name}
                        </option>
                      )
                    })}
                  </Input>
                </div>
                <div className="GrowerChoosenVegAVGPrice">
                  <span>{ this.GetVegAmount("4") }</span>
                </div>
                <div className="GrowerChoosenVegMoreInfo">
                  <span className="GrowerChoosenVegMoreInfoIMG"><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                  <span className="GrowerChoosenVegMoreInfoText"><a href= {this.GetVegLink("4")} target="_blank">מידע נוסף</a></span>
                </div>
              </ListGroupItem>
           </ListGroup>
          </div>
          <div className="GrowerFieldsGroupsContainer" >
            <div className="GrowerFieldsGroupsContainerExample" >הרכב החלקה (לפי טור גידול)</div>
            <div className="GrowerFieldsGroupsSection" >
              <div className="GrowerHelka1" >
                <span className="GrowerHelkaName" >{this.state.GrowerVeg1}</span>
                <span className="GrowerHelkaAmount" >{this.GetVegData("1", "amount")}</span>
                <span className="GrowerHelkaTotal" >עלות כוללת:</span>
                <span className="GrowerHelkaTotalPrice" >{this.GetVegData("1", "totalcost")}</span>
              </div>
              <div className="GrowerHelka2" >
                <span className="GrowerHelkaName" >{this.state.GrowerVeg2}</span>
                <span className="GrowerHelkaAmount" >{this.GetVegData("2", "amount")}</span>
                <span className="GrowerHelkaTotal" >עלות כוללת:</span>
                <span className="GrowerHelkaTotalPrice" >{this.GetVegData("2", "totalcost")}</span>
              </div>
              <div className="GrowerHelka3" >
                <span className="GrowerHelkaName" >{this.state.GrowerVeg3}</span>
                <span className="GrowerHelkaAmount" >{this.GetVegData("3", "amount")}</span>
                <span className="GrowerHelkaTotal" >עלות כוללת:</span>
                <span className="GrowerHelkaTotalPrice" >{this.GetVegData("3", "totalcost")}</span>
              </div>
              <div className="GrowerHelka4" >
                <span className="GrowerHelkaName" >{this.state.GrowerVeg4}</span>
                <span className="GrowerHelkaAmount" >{this.GetVegData("4", "amount")}</span>
                <span className="GrowerHelkaTotal" >עלות כוללת:</span>
                <span className="GrowerHelkaTotalPrice" >{this.GetVegData("4", "totalcost")}</span>
              </div>
            </div>
          </div>
          {!this.state.DuplicaesValidationActive ? <div className="DuplicatesAlert" ><Alert className='DuplicatesAlertContent' color="danger">לגידול הירקות הבאים: {this.state.DuplicatesVegInBag}, יש צורך בשני טורי גידול</Alert></div> : null}
          <div className="GrowerFinalBilling" >
            <div className="GrowerFinalBillingContainer" >
            <div className="GrowerFinalBillingExample" >פירוט חשבון</div>
            <ul className="GrowerFinalBillingSection" >
              <li className="GrowerFinalBillingMainHeader1" >
                <span className="GrowerFinalBillingItemName" >פריט</span>
                <span className="GrowerFinalBillingItemPrice" >מחיר פריט</span>
                <span className="GrowerFinalBillingItemAmount" >כמות</span>
                <span className="GrowerFinalBillingItemTotal" >סה"כ</span>
                <span className="GrowerFinalBillingItemBullingType" >סוג התשלום</span>
              </li>
              <li>
                <span className="GrowerFinalBillingItemName" >{this.GetPlanData("name")}</span>
                <span className="GrowerFinalBillingItemPrice" >{this.GetPlanData("price")}</span>
                <span className="GrowerFinalBillingItemAmount" >1</span>
                <span className="GrowerFinalBillingItemTotal" >{this.GetPlanData("price")}</span>
                <span className="GrowerFinalBillingItemBullingType" >חודשי</span>
              </li>
              <li>
                <span className="GrowerFinalBillingItemName" >שתילי {this.state.GrowerVeg1}</span>
                <span className="GrowerFinalBillingItemPrice" >{this.GetVegTotalBilling("1", "price")}</span>
                <span className="GrowerFinalBillingItemAmount" >{this.GetVegTotalBilling("1", "averagecrop")}</span>
                <span className="GrowerFinalBillingItemTotal" >{this.GetVegTotalBilling("1", "Total")}</span>
                <span className="GrowerFinalBillingItemBullingType" >חד פעמי</span>
              </li>
              <li>
                <span className="GrowerFinalBillingItemName" >שתילי {this.state.GrowerVeg2}</span>
                <span className="GrowerFinalBillingItemPrice" >{this.GetVegTotalBilling("2", "price")}</span>
                <span className="GrowerFinalBillingItemAmount" >{this.GetVegTotalBilling("2", "averagecrop")}</span>
                <span className="GrowerFinalBillingItemTotal" >{this.GetVegTotalBilling("2", "Total")}</span>
                <span className="GrowerFinalBillingItemBullingType" >חד פעמי</span>
              </li>
              <li>
                <span className="GrowerFinalBillingItemName" >שתילי {this.state.GrowerVeg3}</span>
                <span className="GrowerFinalBillingItemPrice" >{this.GetVegTotalBilling("3", "price")}</span>
                <span className="GrowerFinalBillingItemAmount" >{this.GetVegTotalBilling("3", "averagecrop")}</span>
                <span className="GrowerFinalBillingItemTotal" >{this.GetVegTotalBilling("3", "Total")}</span>
                <span className="GrowerFinalBillingItemBullingType" >חד פעמי</span>
              </li>
              <li>
                <span className="GrowerFinalBillingItemName" >שתילי {this.state.GrowerVeg4}</span>
                <span className="GrowerFinalBillingItemPrice" >{this.GetVegTotalBilling("4", "price")}</span>
                <span className="GrowerFinalBillingItemAmount" >{this.GetVegTotalBilling("4", "averagecrop")}</span>
                <span className="GrowerFinalBillingItemTotal" >{this.GetVegTotalBilling("4", "Total")}</span>
                <span className="GrowerFinalBillingItemBullingType" >חד פעמי</span>
              </li>
              <li className="GrowerFinalBillingMainHeader2" >
                <span className="GrowerFinalBillingItemName" >סה"כ לתשלום</span>
                <span className="GrowerFinalBillingItemPrice" ></span>
                <span className="GrowerFinalBillingItemAmount" ></span>
                <span className="GrowerFinalBillingItemTotal" >{this.GetTotalPayment()}</span>
                <span className="GrowerFinalBillingItemBullingType" ></span>
              </li>
            </ul>
          </div>
          </div>
        </div>
        : null}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
    farmer: state.farmer,
    choosenfarmer: state.choosenfarmer,
    growervegbuyingbag: state.growervegbuyingbag
});

export default connect(
  mapStateToProps,
  { getfarmersbyarea, updatechoosenfarmer, getchoosenfarmer, addToGrowerVegBag,
     deleteFromGrowerVegBag, getGrowerVegBag, ResetGrowerVegBag, SetTotalGrowerVegBag, SetPlanGrowerVegBag, SetIsValidatedVegBag }
)(ChooseFarmer);