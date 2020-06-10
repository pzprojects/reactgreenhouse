import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Input, Label, CustomInput, Alert } from 'reactstrap';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { getfarmersbyarea, resetFarmersList } from '../actions/farmerAction';
import { updatechoosenfarmer, getchoosenfarmer, resetchoosenfarmer } from '../actions/choosenFarmerAction';
import { addToGrowerVegBag, deleteFromGrowerVegBag, getGrowerVegBag, ResetGrowerVegBag, SetTotalGrowerVegBag, SetPlanGrowerVegBag, SetIsValidatedVegBag } from '../actions/growerVegChoiceAction';
import { getGrowerFieldCropBag, addToGrowerFieldCropBag, deleteFromGrowerFieldCropBag, ResetGrowerFieldCropBag, SetTotalGrowerFieldCropBag, SetPlanGrowerFieldCropBag, SetIsValidatedFieldCropBag } from '../actions/growerFieldCropsChoiceAction';
import { getvegetablelanguages } from '../actions/vegLanguageConvertorAction';
import PropTypes from 'prop-types';
import ReadMoreModal from './ReadMoreModal';

class ChooseFarmer extends Component {
  state = {
    ChoosenFarmerId: '',
    GrowerVeg1: '',
    GrowerVeg2: '',
    GrowerVeg3: '',
    GrowerVeg4: '',
    TotalPayment: '0',
    GrowerFieldCrop1: '',
    GrowerFieldCrop2: '',
    GrowerFieldCrop3: '',
    GrowerFieldCrop4: '',
    DuplicatesVegInBag: '',
    DuplicaesValidationActive: true,
    CheckFieldCropsPlan: '',
    FieldCropStatus: false,
    FieldCropPlanActive: false,
    FieldCropPlanCost: '',
    DuplicatesFieldCropInBag: '',
    DuplicaesFieldCropValidationActive: true
  };

  static propTypes = {
    getfarmersbyarea: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    resetFarmersList: PropTypes.func.isRequired,
    updatechoosenfarmer: PropTypes.func.isRequired,
    getchoosenfarmer: PropTypes.func.isRequired,
    resetchoosenfarmer: PropTypes.func.isRequired,
    choosenfarmer: PropTypes.object.isRequired,
    growervegbuyingbag: PropTypes.object.isRequired,
    deleteFromGrowerVegBag: PropTypes.func.isRequired,
    addToGrowerVegBag: PropTypes.func.isRequired,
    getGrowerVegBag: PropTypes.func.isRequired,
    ResetGrowerVegBag: PropTypes.func.isRequired,
    SetTotalGrowerVegBag: PropTypes.func.isRequired,
    SetPlanGrowerVegBag: PropTypes.func.isRequired,
    SetIsValidatedVegBag: PropTypes.func.isRequired,
    growerfieldcropsbuyingbag: PropTypes.object.isRequired,
    getGrowerFieldCropBag: PropTypes.func.isRequired,
    addToGrowerFieldCropBag: PropTypes.func.isRequired,
    deleteFromGrowerFieldCropBag: PropTypes.func.isRequired,
    ResetGrowerFieldCropBag: PropTypes.func.isRequired,
    SetTotalGrowerFieldCropBag: PropTypes.func.isRequired,
    SetPlanGrowerFieldCropBag: PropTypes.func.isRequired,
    SetIsValidatedFieldCropBag: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired,
    languagedbconversion: PropTypes.object.isRequired,
    getvegetablelanguages: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getfarmersbyarea(this.props.SizeAreaParam);
    this.props.getchoosenfarmer();
    this.props.getGrowerVegBag();
    this.props.getGrowerFieldCropBag();
    this.props.getvegetablelanguages();

    if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined && this.props.choosenfarmer.ChoosenFarmerById[0] !== null) {
      const { FieldCropsToBuy } = this.props.growerfieldcropsbuyingbag;
      let ChexkboxActive = false;
      if (FieldCropsToBuy.FieldCropsTotal !== "0") {
        ChexkboxActive = true;
      }
      this.setState({
        ChoosenFarmerId: this.props.choosenfarmer.ChoosenFarmerById[0]._id,
        FieldCropPlanCost: this.props.choosenfarmer.ChoosenFarmerById[0].fieldcropplan.cost,
        FieldCropPlanActive: this.props.choosenfarmer.ChoosenFarmerById[0].fieldcropplan.avaliabile,
        FieldCropStatus: ChexkboxActive
      }, () => {
        this.UpdateAllSelectedFields();
      });
    }
    else {
      this.props.getfarmersbyarea(this.props.SizeAreaParam, this.props.PlanParam);
    }
  }

  componentDidUpdate(prevProps, prevStates) {
    const { ChoosenFarmerById } = this.props;
    if (this.props.SizeAreaParam !== prevProps.SizeAreaParam || this.props.PlanParam !== prevProps.PlanParam) {
      this.setState({
        ChoosenFarmerId: ''
      }, () => {
        this.props.updatechoosenfarmer();
        this.props.ResetGrowerVegBag();
        this.props.ResetGrowerFieldCropBag();
        this.props.getfarmersbyarea(this.props.SizeAreaParam, this.props.PlanParam);
      });
    };

    if (this.props.growerfieldcropsbuyingbag !== prevProps.growerfieldcropsbuyingbag) {

      const { FieldCropsToBuy } = this.props.growerfieldcropsbuyingbag;

      try {
        const GrowerFieldCropBag = FieldCropsToBuy;
        this.ValidateFieldCropsDuplicates(GrowerFieldCropBag);
      }
      catch{ }
    }

    if (this.props.growervegbuyingbag !== prevProps.growervegbuyingbag) {

      const { VegToBuy } = this.props.growervegbuyingbag;

      try {
        const GrowerBag = VegToBuy;
        this.ValidateDuplicates(GrowerBag);
      }
      catch{ }
    }

    if (this.state.DuplicaesValidationActive !== prevStates.DuplicaesValidationActive) {
      this.props.SetIsValidatedVegBag(this.state.DuplicaesValidationActive);
    }

    if (this.state.DuplicaesFieldCropValidationActive !== prevStates.DuplicaesFieldCropValidationActive) {
      this.props.SetIsValidatedFieldCropBag(this.state.DuplicaesFieldCropValidationActive);
    }

    if (ChoosenFarmerById !== prevProps.ChoosenFarmerById) {
      try {
        this.setState({
          FieldCropPlanCost: ChoosenFarmerById[0].fieldcropplan.cost,
          FieldCropPlanActive: ChoosenFarmerById[0].fieldcropplan.avaliabile
        });
      }
      catch{ }
    }
  }

  // Update all fields when component mount in last screen
  UpdateAllSelectedFields = () => {
    try {
      var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
      var GrowerBag = this.props.growervegbuyingbag.VegToBuy;
      var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
      var GrowerFieldCropBag = this.props.growerfieldcropsbuyingbag.FieldCropsToBuy;

      if (this.state.GrowerVeg1 === '') {
        if (GrowerBag[0] !== undefined) {
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

      if (this.state.GrowerVeg2 === '') {
        if (GrowerBag[1] !== undefined) {
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

      if (this.state.GrowerVeg3 === '') {
        if (GrowerBag[2] !== undefined) {
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

      if (this.state.GrowerVeg4 === '') {
        if (GrowerBag[3] !== undefined) {
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

      if (this.state.GrowerFieldCrop1 === '') {
        if (GrowerFieldCropBag[0] !== undefined) {
          this.setState({
            GrowerFieldCrop1: GrowerFieldCropBag[0].name
          })
        }
        else {
          this.setState({
            GrowerFieldCrop1: ChoosenFieldcropsArray[0].name
          })
        }
      }

      if (this.state.GrowerFieldCrop2 === '') {
        if (GrowerFieldCropBag[1] !== undefined) {
          this.setState({
            GrowerFieldCrop2: GrowerFieldCropBag[1].name
          })
        }
        else {
          this.setState({
            GrowerFieldCrop2: ChoosenFieldcropsArray[1].name
          })
        }
      }

      if (this.state.GrowerFieldCrop3 === '') {
        if (GrowerFieldCropBag[2] !== undefined) {
          this.setState({
            GrowerFieldCrop3: GrowerFieldCropBag[2].name
          })
        }
        else {
          this.setState({
            GrowerFieldCrop3: ChoosenFieldcropsArray[2].name
          })
        }
      }

      if (this.state.GrowerFieldCrop4 === '') {
        if (GrowerFieldCropBag[3] !== undefined) {
          this.setState({
            GrowerFieldCrop4: GrowerFieldCropBag[3].name
          })
        }
        else {
          this.setState({
            GrowerFieldCrop4: ChoosenFieldcropsArray[3].name
          })
        }
      }

    } catch (e) {

    }

  };

  Translate = name => {
    try {
      const { vegetablelsanguages, LanguageCode } = this.props;
      var VegToFind = vegetablelsanguages.find(vegetablelanguage => vegetablelanguage.vegname === name);
      var NameToReturn = VegToFind.langconvert.find(vegetablelanguage => vegetablelanguage.langname === LanguageCode);
      return (NameToReturn.langvalue);
    }
    catch{ return name; }

    return name;
  };

  // Return a connected string of vegetabiles
  ReturnChoosingVegtabilesAsString = (Mychoosenvegetables) => {
    var VegAsString = '';
    for (var i = 0; i < Mychoosenvegetables.length; i++) {
      if (Mychoosenvegetables.length === (i + 1)) {
        VegAsString += this.Translate(Mychoosenvegetables[i].name);
      }
      else VegAsString += this.Translate(Mychoosenvegetables[i].name) + ", ";
    }
    return VegAsString;
  };

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

  // Get veg amount by index
  GetVegAmount = (ItemId) => {
    var Amount = '';
    const { Language } = this.props;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg1) {
                Amount = ChoosenVegArray[i].averagecrop;
              }
            }
            break;
          case "2":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg2) {
                Amount = ChoosenVegArray[i].averagecrop;
              }
            }
            break;
          case "3":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg3) {
                Amount = ChoosenVegArray[i].averagecrop;
              }
            }
            break;
          case "4":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg4) {
                Amount = ChoosenVegArray[i].averagecrop;
              }
            }
            break;
          default:
            Amount = "0";
        }
      }
      else Amount = "0";

      Amount += ' ' + Language.GrowerChooseVegWeight;
    } catch (e) {
      return Amount;
    }

    return Amount;
  };

  // Get field crop amount by index
  GetFieldCropAmount = (ItemId) => {
    var Amount = '';
    const { Language } = this.props;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop1) {
                Amount = ChoosenFieldcropsArray[i].averagecrop;
              }
            }
            break;
          case "2":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop2) {
                Amount = ChoosenFieldcropsArray[i].averagecrop;
              }
            }
            break;
          case "3":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop3) {
                Amount = ChoosenFieldcropsArray[i].averagecrop;
              }
            }
            break;
          case "4":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop4) {
                Amount = ChoosenFieldcropsArray[i].averagecrop;
              }
            }
            break;
          default:
            Amount = "0";
        }
      }
      else Amount = "0";

      Amount += ' ' + Language.GrowerChooseVegWeight;
    } catch (e) {
      return Amount;
    }

    return Amount;
  };

  GetVegLink = (ItemId) => {
    var Link = '';
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg1) {
                Link = ChoosenVegArray[i].moreinfolink;
              }
            }
            break;
          case "2":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg2) {
                Link = ChoosenVegArray[i].moreinfolink;
              }
            }
            break;
          case "3":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg3) {
                Link = ChoosenVegArray[i].moreinfolink;
              }
            }
            break;
          case "4":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg4) {
                Link = ChoosenVegArray[i].moreinfolink;
              }
            }
            break;
          default:
            Link = "";
        }
      }
      else Link = "";

    } catch (e) {
      return Link;
    }

    return Link;
  };

  GetFieldCropLink = (ItemId) => {
    var Link = '';
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop1) {
                Link = ChoosenFieldcropsArray[i].moreinfolink;
              }
            }
            break;
          case "2":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop2) {
                Link = ChoosenFieldcropsArray[i].moreinfolink;
              }
            }
            break;
          case "3":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop3) {
                Link = ChoosenFieldcropsArray[i].moreinfolink;
              }
            }
            break;
          case "4":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop4) {
                Link = ChoosenFieldcropsArray[i].moreinfolink;
              }
            }
            break;
          default:
            Link = "";
        }
      }
      else Link = "";

    } catch (e) {
      return Link;
    }

    return Link;
  };

  GetPlanData = (DataType) => {
    var PlanDataToReturn = '';
    const { Language } = this.props;
    try {
      if (this.props.PlanParam !== '' && this.props.PlanParam !== null && this.props.PlanParam !== undefined) {
        if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
          const planprice = this.props.choosenfarmer.ChoosenFarmerById[0].plans.find(item => item.name === this.props.PlanParam);
          if (DataType === "name") {
            PlanDataToReturn = this.props.PlanParam;
          }
          else PlanDataToReturn = planprice.cost + ' ' + Language.Shekals;
        }
      }
      else PlanDataToReturn = '';
    } catch (e) {
      return PlanDataToReturn;
    }

    return PlanDataToReturn;
  }

  GetVegData = (ItemId, DataType) => {
    var DataToRetrive = '';
    const { Language } = this.props;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg1) {
                if (DataType === "amount") {
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
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg2) {
                if (DataType === "amount") {
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
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg3) {
                if (DataType === "amount") {
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
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg4) {
                if (DataType === "amount") {
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

        if (DataType === "amount") {
          DataToRetrive += ' ' + Language.GrowerChooseVegPlants;
        }
        else DataToRetrive += ' ' + Language.Shekals;
      }
    } catch (e) {
      return DataToRetrive;
    }

    return DataToRetrive;
  };

  GetFieldCropData = (ItemId, DataType) => {
    var DataToRetrive = '';
    const { Language } = this.props;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop1) {
                if (DataType === "amount") {
                  DataToRetrive = ChoosenFieldcropsArray[i].amount;
                }
                else {
                  var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  DataToRetrive = CaculatedData.toString();
                }
              }
            }
            break;
          case "2":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop2) {
                if (DataType === "amount") {
                  DataToRetrive = ChoosenFieldcropsArray[i].amount;
                }
                else {
                  var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  DataToRetrive = CaculatedData.toString();
                }
              }
            }
            break;
          case "3":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop3) {
                if (DataType === "amount") {
                  DataToRetrive = ChoosenFieldcropsArray[i].amount;
                }
                else {
                  var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  DataToRetrive = CaculatedData.toString();
                }
              }
            }
            break;
          case "4":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop4) {
                if (DataType === "amount") {
                  DataToRetrive = ChoosenFieldcropsArray[i].amount;
                }
                else {
                  var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  DataToRetrive = CaculatedData.toString();
                }
              }
            }
            break;
          default:
            DataToRetrive = "0";
        }

        if (DataType === "amount") {
          DataToRetrive += ' ' + Language.GrowerChooseVegPlants;
        }
        else DataToRetrive += ' ' + Language.Shekals;
      }
    } catch (e) {
      return DataToRetrive;
    }

    return DataToRetrive;
  };

  GetTotalPayment = (DataType) => {
    var DataToRetrive = 0;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        var i = 0;

        if (DataType === "3") {
          for (i = 0; i < ChoosenVegArray.length; i++) {
            if (ChoosenVegArray[i].name === this.state.GrowerVeg1) {
              DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
              break;
            }
          }

          for (i = 0; i < ChoosenVegArray.length; i++) {
            if (ChoosenVegArray[i].name === this.state.GrowerVeg2) {
              DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
              break;
            }
          }

          for (i = 0; i < ChoosenVegArray.length; i++) {
            if (ChoosenVegArray[i].name === this.state.GrowerVeg3) {
              DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
              break;
            }
          }

          for (i = 0; i < ChoosenVegArray.length; i++) {
            if (ChoosenVegArray[i].name === this.state.GrowerVeg4) {
              DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
              break;
            }
          }

          if (this.props.PlanParam !== '' && this.props.PlanParam !== null && this.props.PlanParam !== undefined) {
            const planprice = this.props.choosenfarmer.ChoosenFarmerById[0].plans.find(item => item.name === this.props.PlanParam);
            if (planprice !== undefined) {
              DataToRetrive += parseFloat(planprice.cost);
            }
          }
        }
        else {
          if (DataType === "1") {
            for (var i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg1) {
                DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                break;
              }
            }

            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg2) {
                DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                break;
              }
            }

            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg3) {
                DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                break;
              }
            }

            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg4) {
                DataToRetrive += parseFloat(ChoosenVegArray[i].amount) * parseFloat(ChoosenVegArray[i].price);
                break;
              }
            }
          }
          else {
            if (DataType === "2") {
              if (this.props.PlanParam !== '' && this.props.PlanParam !== null && this.props.PlanParam !== undefined) {
                const planprice = this.props.choosenfarmer.ChoosenFarmerById[0].plans.find(item => item.name === this.props.PlanParam);
                if (planprice !== undefined) {
                  DataToRetrive += parseFloat(planprice.cost);
                }
              }
            }
          }
        }
      }
      //this.props.SetTotalGrowerVegBag(this.GetTotalPayment());
      DataToRetrive = DataToRetrive.toString();
    } catch (e) {
      return DataToRetrive;
    }

    return DataToRetrive;

  }

  GetFieldCropTotalPayment = (DataType) => {
    var DataToRetrive = 0;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        if (this.props.choosenfarmer.ChoosenFarmerById[0].fieldcropplan.avaliabile && this.state.FieldCropStatus) {
          var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
          var i = 0;

          if (DataType === "3") {
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop1) {
                DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                break;
              }
            }

            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop2) {
                DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                break;
              }
            }

            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop3) {
                DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                break;
              }
            }

            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop4) {
                DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                break;
              }
            }

            DataToRetrive += parseFloat(this.state.FieldCropPlanCost);
          }
          else {
            if (DataType === "1") {
              for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
                if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop1) {
                  DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  break;
                }
              }

              for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
                if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop2) {
                  DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  break;
                }
              }

              for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
                if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop3) {
                  DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  break;
                }
              }

              for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
                if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop4) {
                  DataToRetrive += parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                  break;
                }
              }
            }
            else {
              if (DataType === "2") {
                DataToRetrive += parseFloat(this.state.FieldCropPlanCost);
              }
            }
          }


        }
      }
      DataToRetrive = DataToRetrive.toString();
    } catch (e) {
      return DataToRetrive;
    }

    return DataToRetrive;

  }

  GetVegTotalBilling = (ItemId, DataType) => {
    var DataToRetrive = '';
    const { Language } = this.props;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg1) {
                switch (DataType) {
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
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg2) {
                switch (DataType) {
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
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg3) {
                switch (DataType) {
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
            for (i = 0; i < ChoosenVegArray.length; i++) {
              if (ChoosenVegArray[i].name === this.state.GrowerVeg4) {
                switch (DataType) {
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

        if (DataType !== "averagecrop") {
          DataToRetrive += ' ' + Language.Shekals;
        }
      }
    } catch (e) {
      return DataToRetrive;
    }

    return DataToRetrive;
  };

  GetFieldCropTotalBilling = (ItemId, DataType) => {
    var DataToRetrive = '';
    const { Language } = this.props;
    try {
      if (this.props.choosenfarmer.ChoosenFarmerById[0] !== undefined) {
        var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
        var i = 0;
        switch (ItemId) {
          case "1":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop1) {
                switch (DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenFieldcropsArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenFieldcropsArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                    break;
                  default:
                }
              }
            }
            break;
          case "2":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop2) {
                switch (DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenFieldcropsArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenFieldcropsArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                    break;
                  default:
                }
              }
            }
            break;
          case "3":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop3) {
                switch (DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenFieldcropsArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenFieldcropsArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
                    DataToRetrive = CaculatedData.toString();
                    break;
                  default:
                }
              }
            }
            break;
          case "4":
            for (i = 0; i < ChoosenFieldcropsArray.length; i++) {
              if (ChoosenFieldcropsArray[i].name === this.state.GrowerFieldCrop4) {
                switch (DataType) {
                  case "averagecrop":
                    DataToRetrive = ChoosenFieldcropsArray[i].amount;
                    break;
                  case "price":
                    DataToRetrive = ChoosenFieldcropsArray[i].price;
                    break;
                  case "Total":
                    var CaculatedData = parseFloat(ChoosenFieldcropsArray[i].amount) * parseFloat(ChoosenFieldcropsArray[i].price);
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

        if (DataType !== "averagecrop") {
          DataToRetrive += ' ' + Language.Shekals;
        }
      }
    } catch (e) {
      return DataToRetrive;
    }

    return DataToRetrive;
  };

  AddVegToGrowerBag = (VegValue, ValueToDelete) => {
    try {
      var ChoosenVegArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenvegetables;
      var ObjectToAdd = {};
      for (var i = 0; i < ChoosenVegArray.length; i++) {
        if (ChoosenVegArray[i].name === VegValue) {
          ObjectToAdd = ChoosenVegArray[i];
        }
      }

      if (ValueToDelete !== '') {
        this.props.deleteFromGrowerVegBag(ValueToDelete);
      }
      this.props.addToGrowerVegBag(ObjectToAdd);
    } catch (e) {
      console.log('error', e);
    }
  };

  AddFieldCropToGrowerBag = (VegValue, ValueToDelete) => {
    try {
      var ChoosenFieldcropsArray = this.props.choosenfarmer.ChoosenFarmerById[0].choosenfieldcrops;
      var ObjectToAdd = {};
      for (var i = 0; i < ChoosenFieldcropsArray.length; i++) {
        if (ChoosenFieldcropsArray[i].name === VegValue) {
          ObjectToAdd = ChoosenFieldcropsArray[i];
        }
      }

      if (ValueToDelete !== '') {
        this.props.deleteFromGrowerFieldCropBag(ValueToDelete);
      }
      this.props.addToGrowerFieldCropBag(ObjectToAdd);
    } catch (e) {
      console.log('error', e);
    }
  };

  ValidateDuplicates = (GrowerBag) => {
    try {
      var GrowerBagSpecialVeg = '';
      var DuplicateCounter = 0;
      var DuplicateList = [];
      const { Language } = this.props;
      for (var k = 0; k < 4; k++) {
        if (GrowerBag[k].numberofveginrow === "2") {
          DuplicateList.push(GrowerBag[k].name);
          DuplicateCounter++;
        }
      }

      switch (DuplicateCounter) {
        case 1:
          GrowerBagSpecialVeg = DuplicateList[0];
          break;
        case 2:
          if (DuplicateList[0] !== DuplicateList[1]) {
            GrowerBagSpecialVeg = DuplicateList[0] + Language.GrowerAndText + DuplicateList[1];
          }
          break;
        case 3:
          if (DuplicateList[0] !== DuplicateList[1] && DuplicateList[0] !== DuplicateList[2]) {
            GrowerBagSpecialVeg = DuplicateList[0];
            if (DuplicateList[2] !== DuplicateList[1]) {
              GrowerBagSpecialVeg = GrowerBagSpecialVeg + ", " + DuplicateList[1] + Language.GrowerAndText + DuplicateList[2];
            }
          }
          else {
            if (DuplicateList[0] === DuplicateList[1]) {
              GrowerBagSpecialVeg = DuplicateList[2];
            }
            else GrowerBagSpecialVeg = DuplicateList[1];
          }
          break;
        case 4:
          if (DuplicateList[0] !== DuplicateList[1] && DuplicateList[0] !== DuplicateList[2] && DuplicateList[0] !== DuplicateList[3]) {
            GrowerBagSpecialVeg = DuplicateList[0];
            if (DuplicateList[1] !== DuplicateList[2] && DuplicateList[1] !== DuplicateList[3]) {
              if (DuplicateList[2] === DuplicateList[3]) {
                GrowerBagSpecialVeg = GrowerBagSpecialVeg + Language.GrowerAndText + DuplicateList[1];
              }
              else {
                GrowerBagSpecialVeg = GrowerBagSpecialVeg + ", " + DuplicateList[1] + ", " + DuplicateList[2] + Language.GrowerAndText + DuplicateList[3];
              }
            }
          }
          else {
            if (DuplicateList[0] === DuplicateList[1]) {
              if (DuplicateList[2] !== DuplicateList[3]) {
                GrowerBagSpecialVeg = DuplicateList[2] + Language.GrowerAndText + DuplicateList[3];
              }
            }
            else {
              if (DuplicateList[0] === DuplicateList[2]) {
                if (DuplicateList[1] !== DuplicateList[3]) {
                  GrowerBagSpecialVeg = DuplicateList[1] + Language.GrowerAndText + DuplicateList[3];
                }
              }
              else {
                if (DuplicateList[1] !== DuplicateList[2]) {
                  GrowerBagSpecialVeg = DuplicateList[1] + Language.GrowerAndText + DuplicateList[2];
                }
              }
            }
          }
          break;
        default:
      }

      if (GrowerBagSpecialVeg === '') {
        this.setState({
          DuplicatesVegInBag: '',
          DuplicaesValidationActive: true
        });
      }
      else {
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

  ValidateFieldCropsDuplicates = (GrowerBag) => {
    try {
      var GrowerBagSpecialVeg = '';
      var DuplicateCounter = 0;
      var DuplicateList = [];
      const { Language } = this.props;
      for (var k = 0; k < 4; k++) {
        if (GrowerBag[k].numberofveginrow === "2") {
          DuplicateList.push(GrowerBag[k].name);
          DuplicateCounter++;
        }
      }

      switch (DuplicateCounter) {
        case 1:
          GrowerBagSpecialVeg = DuplicateList[0];
          break;
        case 2:
          if (DuplicateList[0] !== DuplicateList[1]) {
            GrowerBagSpecialVeg = DuplicateList[0] + Language.GrowerAndText + DuplicateList[1];
          }
          break;
        case 3:
          if (DuplicateList[0] !== DuplicateList[1] && DuplicateList[0] !== DuplicateList[2]) {
            GrowerBagSpecialVeg = DuplicateList[0];
            if (DuplicateList[2] !== DuplicateList[1]) {
              GrowerBagSpecialVeg = GrowerBagSpecialVeg + ", " + DuplicateList[1] + Language.GrowerAndText + DuplicateList[2];
            }
          }
          else {
            if (DuplicateList[0] === DuplicateList[1]) {
              GrowerBagSpecialVeg = DuplicateList[2];
            }
            else GrowerBagSpecialVeg = DuplicateList[1];
          }
          break;
        case 4:
          if (DuplicateList[0] !== DuplicateList[1] && DuplicateList[0] !== DuplicateList[2] && DuplicateList[0] !== DuplicateList[3]) {
            GrowerBagSpecialVeg = DuplicateList[0];
            if (DuplicateList[1] !== DuplicateList[2] && DuplicateList[1] !== DuplicateList[3]) {
              if (DuplicateList[2] === DuplicateList[3]) {
                GrowerBagSpecialVeg = GrowerBagSpecialVeg + Language.GrowerAndText + DuplicateList[1];
              }
              else {
                GrowerBagSpecialVeg = GrowerBagSpecialVeg + ", " + DuplicateList[1] + ", " + DuplicateList[2] + Language.GrowerAndText + DuplicateList[3];
              }
            }
          }
          else {
            if (DuplicateList[0] === DuplicateList[1]) {
              if (DuplicateList[2] !== DuplicateList[3]) {
                GrowerBagSpecialVeg = DuplicateList[2] + Language.GrowerAndText + DuplicateList[3];
              }
            }
            else {
              if (DuplicateList[0] === DuplicateList[2]) {
                if (DuplicateList[1] !== DuplicateList[3]) {
                  GrowerBagSpecialVeg = DuplicateList[1] + Language.GrowerAndText + DuplicateList[3];
                }
              }
              else {
                if (DuplicateList[1] !== DuplicateList[2]) {
                  GrowerBagSpecialVeg = DuplicateList[1] + Language.GrowerAndText + DuplicateList[2];
                }
              }
            }
          }
          break;
        default:
      }

      if (GrowerBagSpecialVeg === '') {
        this.setState({
          DuplicatesFieldCropInBag: '',
          DuplicaesFieldCropValidationActive: true
        });
      }
      else {
        this.setState({
          DuplicatesFieldCropInBag: GrowerBagSpecialVeg,
          DuplicaesFieldCropValidationActive: false
        });
      }
    }
    catch{
      console.log();
    }
  };

  onChange = e => {

    switch (e.target.getAttribute('name')) {
      case "FarmerChoice":
        var FilteredChoosenFarmer = this.props.farmer.farmers.filter(farmer => farmer._id === e.target.value);
        this.props.updatechoosenfarmer(FilteredChoosenFarmer);
        this.props.ResetGrowerVegBag();
        this.props.ResetGrowerFieldCropBag();
        var ChoosenVegArrayToPlace = FilteredChoosenFarmer[0].choosenvegetables;
        if (FilteredChoosenFarmer[0].fieldcropplan.avaliabile && this.state.FieldCropStatus) {
          var ChoosenFieldCropsArrayToPlace = FilteredChoosenFarmer[0].choosenfieldcrops;
          this.setState({
            ChoosenFarmerId: e.target.value,
            GrowerVeg1: ChoosenVegArrayToPlace[0].name,
            GrowerVeg2: ChoosenVegArrayToPlace[0].name,
            GrowerVeg3: ChoosenVegArrayToPlace[0].name,
            GrowerVeg4: ChoosenVegArrayToPlace[0].name,
            GrowerFieldCrop1: ChoosenFieldCropsArrayToPlace[0].name,
            GrowerFieldCrop2: ChoosenFieldCropsArrayToPlace[0].name,
            GrowerFieldCrop3: ChoosenFieldCropsArrayToPlace[0].name,
            GrowerFieldCrop4: ChoosenFieldCropsArrayToPlace[0].name
          }, () => {
            var DefaultTotalCalc = parseFloat(ChoosenVegArrayToPlace[0].price) * parseFloat(ChoosenVegArrayToPlace[0].amount) * 4 + parseFloat(FilteredChoosenFarmer[0].plans.find(element => element.name === this.props.PlanParam).cost);
            this.props.SetTotalGrowerVegBag(DefaultTotalCalc.toString());
            var DefaultFieldCropTotalCalc = parseFloat(ChoosenFieldCropsArrayToPlace[0].price) * parseFloat(ChoosenFieldCropsArrayToPlace[0].amount) * 4 + parseFloat(FilteredChoosenFarmer[0].fieldcropplan.cost);
            this.props.SetTotalGrowerFieldCropBag(DefaultFieldCropTotalCalc.toString());
          });

          this.props.SetPlanGrowerVegBag(FilteredChoosenFarmer[0].plans.find(element => element.name === this.props.PlanParam));

          for (var j = 0; j < 4; j++) {
            this.props.addToGrowerVegBag(ChoosenVegArrayToPlace[0], '');
            this.props.addToGrowerFieldCropBag(ChoosenFieldCropsArrayToPlace[0], '');
          }
        }
        else {
          var ChoosenFieldCropsArrayToPlace = FilteredChoosenFarmer[0].choosenfieldcrops;
          this.setState({
            ChoosenFarmerId: e.target.value,
            GrowerVeg1: ChoosenVegArrayToPlace[0].name,
            GrowerVeg2: ChoosenVegArrayToPlace[0].name,
            GrowerVeg3: ChoosenVegArrayToPlace[0].name,
            GrowerVeg4: ChoosenVegArrayToPlace[0].name,
          }, () => {
            var DefaultTotalCalc = parseFloat(ChoosenVegArrayToPlace[0].price) * parseFloat(ChoosenVegArrayToPlace[0].amount) * 4 + parseFloat(FilteredChoosenFarmer[0].plans.find(element => element.name === this.props.PlanParam).cost);
            this.props.SetTotalGrowerVegBag(DefaultTotalCalc.toString());
            var DefaultFieldCropTotalCalc = 0;
            this.props.SetTotalGrowerFieldCropBag(DefaultFieldCropTotalCalc.toString());
          });
          this.props.SetPlanGrowerVegBag(FilteredChoosenFarmer[0].plans.find(element => element.name === this.props.PlanParam));

          for (var j = 0; j < 4; j++) {
            this.props.addToGrowerVegBag(ChoosenVegArrayToPlace[0], '');
          }
        }
        break;
      case "GrowerVeg1":
        this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg1);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerVegBag(this.GetTotalPayment("3"));
        });
        break;
      case "GrowerVeg2":
        this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg2);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerVegBag(this.GetTotalPayment("3"));
        });
        break;
      case "GrowerVeg3":
        this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg3);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerVegBag(this.GetTotalPayment("3"));
        });
        break;
      case "GrowerVeg4":
        this.AddVegToGrowerBag(e.target.value, this.state.GrowerVeg4);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerVegBag(this.GetTotalPayment("3"));
        });
        break;
      case "GrowerFieldCrop1":
        this.AddFieldCropToGrowerBag(e.target.value, this.state.GrowerFieldCrop1);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerFieldCropBag(this.GetFieldCropTotalPayment("3"));
        });
        break;
      case "GrowerFieldCrop2":
        this.AddFieldCropToGrowerBag(e.target.value, this.state.GrowerFieldCrop2);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerFieldCropBag(this.GetFieldCropTotalPayment("3"));
        });
        break;
      case "GrowerFieldCrop3":
        this.AddFieldCropToGrowerBag(e.target.value, this.state.GrowerFieldCrop3);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerFieldCropBag(this.GetFieldCropTotalPayment("3"));
        });
        break;
      case "GrowerFieldCrop4":
        this.AddFieldCropToGrowerBag(e.target.value, this.state.GrowerFieldCrop4);
        this.setState({ [e.target.name]: e.target.value }, () => {
          this.props.SetTotalGrowerFieldCropBag(this.GetFieldCropTotalPayment("3"));
        });
        break;
      case "CheckFieldCropsPlan":
        this.setState({
          FieldCropStatus: e.target.checked
        });
        var FilteredChoosenFarmer = this.props.choosenfarmer.ChoosenFarmerById[0];
        if (FilteredChoosenFarmer.fieldcropplan.avaliabile && e.target.checked) {
          this.props.ResetGrowerFieldCropBag();
          var ChoosenFieldCropsArrayToPlace = FilteredChoosenFarmer.choosenfieldcrops;
          this.setState({
            GrowerFieldCrop1: ChoosenFieldCropsArrayToPlace[0].name,
            GrowerFieldCrop2: ChoosenFieldCropsArrayToPlace[0].name,
            GrowerFieldCrop3: ChoosenFieldCropsArrayToPlace[0].name,
            GrowerFieldCrop4: ChoosenFieldCropsArrayToPlace[0].name
          }, () => {
            var DefaultFieldCropTotalCalc = parseFloat(ChoosenFieldCropsArrayToPlace[0].price) * parseFloat(ChoosenFieldCropsArrayToPlace[0].amount) * 4 + parseFloat(FilteredChoosenFarmer.fieldcropplan.cost);
            this.props.SetTotalGrowerFieldCropBag(DefaultFieldCropTotalCalc.toString());
          });

          for (var j = 0; j < 4; j++) {
            this.props.addToGrowerFieldCropBag(ChoosenFieldCropsArrayToPlace[0], '');
          }
        }
        else {
          if (!e.target.checked) {
            this.props.ResetGrowerFieldCropBag();
          }
        }
        break;
      default:
    }

  }

  render() {
    const { farmers } = this.props.farmer;
    const { Language, direction } = this.props;
    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    let OnTheLeftText = Language.GrowerTotalBillPlants + ' ';
    let OnTheRightText = '';
    if (direction === 'rtl') {
      FloatClass = "Co-Align-Right";
      TextAlignClass = "Co-Text-Align-Right";
      OnTheLeftText = Language.GrowerTotalBillPlants + ' ';
      OnTheRightText = '';
    }
    else {
      FloatClass = "Co-Align-Left";
      TextAlignClass = "Co-Text-Align-Left";
      OnTheLeftText = '';
      OnTheRightText = ' ' + Language.GrowerTotalBillPlants;
    }
    if (this.state.ChoosenFarmerId !== '') {
      var ExtractFarmer = this.props.farmer.farmers.filter(farmer => farmer._id === this.state.ChoosenFarmerId);
      var ChoosenFarmerContainer = ExtractFarmer[0].choosenvegetables;
      var ChoosenFarmerFieldCrops = ExtractFarmer[0].choosenfieldcrops;
    }
    else {
      var ChoosenFarmerContainer = [];
      var ChoosenFarmerFieldCrops = [];
    }

    return (
      <Container>
        <div className="ListOfFarmersByArea">
          <ListGroup>
            <ListGroupItem className="FarmerListTitleListItem" >
              <div className='FarmerListTitle'>
                <div className={'FarmerListTitleText1 ' + FloatClass + " " + TextAlignClass}>
                  <span>{Language.GrowerFarmerName}</span>
                </div>
                <div className={'FarmerListTitleText2 ' + FloatClass + " " + TextAlignClass}>
                  <span>{Language.GrowerFarmerAboutMe}</span>
                </div>
                <div className={'FarmerListTitleText3 ' + FloatClass + " " + TextAlignClass}>
                  <span>{Language.GrowerFarmerVegs}</span>
                </div>
                <div className={'FarmerListTitleText4 ' + FloatClass + " " + TextAlignClass}>
                  <span>{Language.GrowerFarmerPlans}</span>
                </div>
              </div>
            </ListGroupItem>
          </ListGroup>
          <ListGroup className='ListOfFarmersByAreaMaxHeight Scroolbar-style-2'>
            {farmers.map(({ _id, name, familyname, phone, email, address, sizearea, hamamasize, numberofactivefarms, aboutme, imageurl, choosenvegetables, choosenfieldcrops, plans, fieldcropplan }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
                <ListGroupItem>
                  <div className={'FarmerList ' + TextAlignClass}>
                    <div className={'FarmerListRadioBtn ' + FloatClass}>
                      <Label check for={_id}>
                        <CustomInput
                          type="radio"
                          name='FarmerChoice'
                          id={_id}
                          value={_id}
                          className='mb-3'
                          checked={this.state.ChoosenFarmerId === _id}
                          disabled={parseFloat(numberofactivefarms) > 0 ? false : true}
                          onChange={this.onChange} />
                      </Label>
                    </div>
                    <div className={'FarmerListImage ' + FloatClass}>
                      <img
                        alt=""
                        src={imageurl}
                        className='FarmerThemeImage'
                      />
                    </div>
                    <div className={'FarmerListName ' + FloatClass}>
                      <span>{name + " " + familyname}</span>
                    </div>
                    <div className={'FarmerListAboutme ' + FloatClass}>
                      <span>{aboutme}&nbsp;</span>
                    </div>
                    <div className={'FarmerListchoosenvegetables ' + FloatClass}>
                      <span>{this.ReturnChoosingVegtabilesAsString(choosenvegetables)}&nbsp;</span>
                    </div>
                    <div className={'FarmerListplans ' + FloatClass}>
                      {plans.map(({ name, cost }) => (
                        <span className='PlanItem' key={name}>
                          {this.ReturnPlanInChoosenLanguage(name) + '- ' + cost + Language.GrowerShekalsPerMonth}
                          <br />
                        </span>
                      ))}
                    </div>
                    <div className={'FarmerListReadMore ' + FloatClass}>
                      <span><ReadMoreModal FarmerFullNmae={name + " " + familyname} FarmerPhone={phone} FarmerEmail={email} FarmerLocation={address} FarmerFieldCropPlan={fieldcropplan} FarmerFieldCrops={this.ReturnChoosingVegtabilesAsString(choosenfieldcrops)} FarmerNumberOfActiveFarms={numberofactivefarms} /></span>
                    </div>
                  </div>
                </ListGroupItem>
              </CSSTransition>
            ))}
          </ListGroup>
        </div>
        {this.state.ChoosenFarmerId !== '' && this.state.ChoosenFarmerId !== undefined ?
          <div className="GrowerMainPicking">
            <div className={'GrowerVegContainer2 ' + FloatClass}>
              <div className={'GrowerVegContainer2Example ' + FloatClass + " " + TextAlignClass}>{Language.GrowerChooseVegHeader}</div>
              <ListGroup>
                <ListGroupItem>
                  <div className="GrowerMainPickingTitle">
                    {Language.GrowerChooseVegMiniTitle}
                  </div>
                </ListGroupItem>
              </ListGroup>
              <ListGroup>
                <ListGroupItem>
                  <div className={'GrowerVegHolder ' + FloatClass}>
                    <Label for='GrowerVeg1'></Label>
                    <Input type="select" name="GrowerVeg1" id="GrowerVeg1" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg1}>
                      {ChoosenFarmerContainer.map(({ _id, name }) => (
                        <option className='GrowerVegItem' key={_id} value={name}>
                          {this.Translate(name)}
                        </option>
                      ))}
                    </Input>
                  </div>
                  <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                    <span>{this.GetVegAmount("1")}</span>
                  </div>
                  <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                    <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                    <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetVegLink("1")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div className={'GrowerVegHolder ' + FloatClass}>
                    <Label for='GrowerVeg2'></Label>
                    <Input type="select" name="GrowerVeg2" id="GrowerVeg2" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg2}>
                      {ChoosenFarmerContainer.map(({ _id, name }) => (
                        <option className='GrowerVegItem' key={_id} value={name}>
                          {this.Translate(name)}
                        </option>
                      ))}
                    </Input>
                  </div>
                  <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                    <span>{this.GetVegAmount("2")}</span>
                  </div>
                  <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                    <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                    <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetVegLink("2")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div className={'GrowerVegHolder ' + FloatClass}>
                    <Label for='GrowerVeg3'></Label>
                    <Input type="select" name="GrowerVeg3" id="GrowerVeg3" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg3}>
                      {ChoosenFarmerContainer.map(({ _id, name }) => (
                        <option className='GrowerVegItem' key={_id} value={name}>
                          {this.Translate(name)}
                        </option>
                      ))}
                    </Input>
                  </div>
                  <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                    <span>{this.GetVegAmount("3")}</span>
                  </div>
                  <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                    <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                    <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetVegLink("3")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <div className={'GrowerVegHolder ' + FloatClass}>
                    <Label for='GrowerVeg4'></Label>
                    <Input type="select" name="GrowerVeg4" id="GrowerVeg4" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerVeg4}>
                      {ChoosenFarmerContainer.map(({ _id, name }) => (
                        <option className='GrowerVegItem' key={_id} value={name}>
                          {this.Translate(name)}
                        </option>
                      ))}
                    </Input>
                  </div>
                  <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                    <span>{this.GetVegAmount("4")}</span>
                  </div>
                  <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                    <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                    <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetVegLink("4")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                  </div>
                </ListGroupItem>
              </ListGroup>
            </div>
            <div className={'GrowerFieldsGroupsContainer ' + FloatClass} >
              <div className={'GrowerFieldsGroupsContainerExample ' + TextAlignClass} >{Language.GrowerChooseVegHelkaHeader}</div>
              <div className="GrowerFieldsGroupsSection" >
                <div className="GrowerHelka1" >
                  <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerVeg1)}</span>
                  <span className="GrowerHelkaAmount" >{this.GetVegData("1", "amount")}</span>
                  <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                  <span className="GrowerHelkaTotalPrice" >{this.GetVegData("1", "totalcost")}</span>
                </div>
                <div className="GrowerHelka2" >
                  <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerVeg2)}</span>
                  <span className="GrowerHelkaAmount" >{this.GetVegData("2", "amount")}</span>
                  <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                  <span className="GrowerHelkaTotalPrice" >{this.GetVegData("2", "totalcost")}</span>
                </div>
                <div className="GrowerHelka3" >
                  <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerVeg3)}</span>
                  <span className="GrowerHelkaAmount" >{this.GetVegData("3", "amount")}</span>
                  <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                  <span className="GrowerHelkaTotalPrice" >{this.GetVegData("3", "totalcost")}</span>
                </div>
                <div className="GrowerHelka4" >
                  <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerVeg4)}</span>
                  <span className="GrowerHelkaAmount" >{this.GetVegData("4", "amount")}</span>
                  <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                  <span className="GrowerHelkaTotalPrice" >{this.GetVegData("4", "totalcost")}</span>
                </div>
              </div>
            </div>
            {!this.state.DuplicaesValidationActive ? <div className="DuplicatesAlert" ><Alert className='DuplicatesAlertContent' color="danger">{Language.GrowerDoubleHelkaErrorText1} {this.state.DuplicatesVegInBag}, {Language.GrowerDoubleHelkaErrorText2}</Alert></div> : null}
            {this.state.FieldCropPlanActive ?
              <div className='GrowerChoosenFieldCrops'>
                <div className={'GrowerChoosenFieldCropsCheckBox ' + FloatClass + " " + TextAlignClass}>
                  <span>{Language.GrowerFieldCropsPlanApproval}</span>
                  <Label check for='CheckFieldCropsPlan'>
                    <CustomInput
                      type="checkbox"
                      name='CheckFieldCropsPlan'
                      id='CheckFieldCropsPlan'
                      className='mb-3'
                      onChange={this.onChange}
                      defaultChecked={this.state.FieldCropStatus}
                    />
                  </Label>
                </div>
                {this.state.FieldCropStatus && this.state.FieldCropPlanActive ?
                  <div className='GrowerChoosenFieldCropsCheckBoxLogic'>
                    <div className={'PlanPriceHeader ' + TextAlignClass}>{Language.GrowerFieldCropsPlanCost} {this.state.FieldCropPlanCost} {Language.Shekals}</div>
                    <div className="GrowerMainPicking">
                      <div className={'GrowerVegContainer2 ' + FloatClass}>
                        <div className={'GrowerVegContainer2Example ' + FloatClass + " " + TextAlignClass} >{Language.GrowerChooseFieldCropHeader}</div>
                        <ListGroup>
                          <ListGroupItem>
                            <div className="GrowerMainPickingTitle">
                              {Language.GrowerChooseVegMiniTitle}
                            </div>
                          </ListGroupItem>
                        </ListGroup>
                        <ListGroup>
                          <ListGroupItem>
                            <div className={'GrowerVegHolder ' + FloatClass}>
                              <Label for='GrowerFieldCrop1'></Label>
                              <Input type="select" name="GrowerFieldCrop1" id="GrowerFieldCrop1" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerFieldCrop1}>
                                {ChoosenFarmerFieldCrops.map(({ _id, name }) => (
                                  <option className='GrowerVegItem' key={_id} value={name}>
                                    {this.Translate(name)}
                                  </option>
                                ))}
                              </Input>
                            </div>
                            <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                              <span>{this.GetFieldCropAmount("1")}</span>
                            </div>
                            <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                              <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                              <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetFieldCropLink("1")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className={'GrowerVegHolder ' + FloatClass}>
                              <Label for='GrowerFieldCrop2'></Label>
                              <Input type="select" name="GrowerFieldCrop2" id="GrowerFieldCrop2" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerFieldCrop2}>
                                {ChoosenFarmerFieldCrops.map(({ _id, name }) => (
                                  <option className='GrowerVegItem' key={_id} value={name}>
                                    {this.Translate(name)}
                                  </option>
                                ))}
                              </Input>
                            </div>
                            <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                              <span>{this.GetFieldCropAmount("2")}</span>
                            </div>
                            <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                              <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                              <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetFieldCropLink("2")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className={'GrowerVegHolder ' + FloatClass}>
                              <Label for='GrowerFieldCrop3'></Label>
                              <Input type="select" name="GrowerFieldCrop3" id="GrowerFieldCrop3" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerFieldCrop3}>
                                {ChoosenFarmerFieldCrops.map(({ _id, name }) => (
                                  <option className='GrowerVegItem' key={_id} value={name}>
                                    {this.Translate(name)}
                                  </option>
                                ))}
                              </Input>
                            </div>
                            <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                              <span>{this.GetFieldCropAmount("3")}</span>
                            </div>
                            <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                              <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                              <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetFieldCropLink("3")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                            </div>
                          </ListGroupItem>
                          <ListGroupItem>
                            <div className={'GrowerVegHolder ' + FloatClass}>
                              <Label for='GrowerFieldCrop4'></Label>
                              <Input type="select" name="GrowerFieldCrop4" id="GrowerFieldCrop4" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.GrowerFieldCrop4}>
                                {ChoosenFarmerFieldCrops.map(({ _id, name }) => (
                                  <option className='GrowerVegItem' key={_id} value={name}>
                                    {this.Translate(name)}
                                  </option>
                                ))}
                              </Input>
                            </div>
                            <div className={'GrowerChoosenVegAVGPrice ' + FloatClass}>
                              <span>{this.GetFieldCropAmount("4")}</span>
                            </div>
                            <div className={'GrowerChoosenVegMoreInfo ' + FloatClass}>
                              <span className={'GrowerChoosenVegMoreInfoIMG ' + FloatClass}><img alt="" src={require('../Resources/QuestionMark.png')} /></span>
                              <span className={'GrowerChoosenVegMoreInfoText ' + FloatClass}><a href={this.GetFieldCropLink("4")} target="_blank" rel="noopener noreferrer">{Language.GrowerChooseVegMoreInformation}</a></span>
                            </div>
                          </ListGroupItem>
                        </ListGroup>
                      </div>
                      <div className={'GrowerFieldsGroupsContainer ' + FloatClass} >
                        <div className={'GrowerFieldsGroupsContainerExample ' + FloatClass + " " + TextAlignClass} >{Language.GrowerChooseVegHelkaHeader}</div>
                        <div className="GrowerFieldsGroupsSection" >
                          <div className="GrowerHelka1" >
                            <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerFieldCrop1)}</span>
                            <span className="GrowerHelkaAmount" >{this.GetFieldCropData("1", "amount")}</span>
                            <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                            <span className="GrowerHelkaTotalPrice" >{this.GetFieldCropData("1", "totalcost")}</span>
                          </div>
                          <div className="GrowerHelka2" >
                            <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerFieldCrop2)}</span>
                            <span className="GrowerHelkaAmount" >{this.GetFieldCropData("2", "amount")}</span>
                            <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                            <span className="GrowerHelkaTotalPrice" >{this.GetFieldCropData("2", "totalcost")}</span>
                          </div>
                          <div className="GrowerHelka3" >
                            <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerFieldCrop3)}</span>
                            <span className="GrowerHelkaAmount" >{this.GetFieldCropData("3", "amount")}</span>
                            <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                            <span className="GrowerHelkaTotalPrice" >{this.GetFieldCropData("3", "totalcost")}</span>
                          </div>
                          <div className="GrowerHelka4" >
                            <span className="GrowerHelkaName" >{this.Translate(this.state.GrowerFieldCrop4)}</span>
                            <span className="GrowerHelkaAmount" >{this.GetFieldCropData("4", "amount")}</span>
                            <span className="GrowerHelkaTotal" >{Language.GrowerChooseVegTotalCost2}:</span>
                            <span className="GrowerHelkaTotalPrice" >{this.GetFieldCropData("4", "totalcost")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!this.state.DuplicaesFieldCropValidationActive ? <div className="DuplicatesAlert" ><Alert className='DuplicatesAlertContent' color="danger">{Language.GrowerDoubleHelkaErrorText1} {this.state.DuplicatesFieldCropInBag}, {Language.GrowerDoubleHelkaErrorText2}</Alert></div> : null}
                  </div>
                  : null}
              </div>
              : null}
            <div className="GrowerFinalBilling" >
              <div className={'GrowerFinalBillingContainer ' + FloatClass + " " + TextAlignClass} >
                <div className={'GrowerFinalBillingExample ' + FloatClass + " " + TextAlignClass} >{Language.GrowerTotalBillMonthlyTitle}</div>
                <ul className="GrowerFinalBillingSection" >
                  <li className="GrowerFinalBillingMainHeader1" >
                    <span className={'GrowerFinalBillingItemName ' + FloatClass}>{Language.GrowerTotalBillMonthlyItem}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass}>{Language.GrowerTotalBillMonthlyItemCost}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass}>{Language.GrowerTotalBillMonthlyItemAnount}</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{Language.GrowerTotalBillMonthlyItemTotal}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillItemPaymentType}</span>
                  </li>
                  <li>
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{this.ReturnPlanInChoosenLanguage(this.GetPlanData("name"))}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass}>{this.GetPlanData("price")}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >1</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetPlanData("price")}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillMonthlyItemPaymentType}</span>
                  </li>
                  {this.state.FieldCropStatus && this.state.FieldCropPlanActive ?
                    <li>
                      <span className={'GrowerFinalBillingItemName ' + FloatClass} >{Language.GrowerFieldCropsText}</span>
                      <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.state.FieldCropPlanCost} {Language.Shekals}</span>
                      <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >1</span>
                      <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.state.FieldCropPlanCost} {Language.Shekals}</span>
                      <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillMonthlyItemPaymentType}</span>
                    </li> : null}
                  <li className="GrowerFinalBillingMainHeader2" >
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{Language.GrowerTotalBillMonthlyTotalToPay}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} ></span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass} ></span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{(parseFloat(this.GetFieldCropTotalPayment("2")) + parseFloat(this.GetTotalPayment("2"))).toString()} {Language.Shekals}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} ></span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="GrowerFinalBilling" >
              <div className={'GrowerFinalBillingContainer ' + FloatClass + " " + TextAlignClass} >
                <div className={'GrowerFinalBillingExample ' + FloatClass + " " + TextAlignClass} >{Language.GrowerTotalBillOneTimeTitle}</div>
                <ul className="GrowerFinalBillingSection" >
                  <li className="GrowerFinalBillingMainHeader1" >
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{Language.GrowerTotalBillMonthlyItem}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{Language.GrowerTotalBillMonthlyItemCost}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{Language.GrowerTotalBillMonthlyItemAnount}</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{Language.GrowerTotalBillMonthlyItemTotal}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillItemPaymentType}</span>
                  </li>
                  <li>
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerVeg1)}{OnTheRightText}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetVegTotalBilling("1", "price")}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{this.GetVegTotalBilling("1", "averagecrop")}</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetVegTotalBilling("1", "Total")}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                  </li>
                  <li>
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerVeg2)}{OnTheRightText}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetVegTotalBilling("2", "price")}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass}>{this.GetVegTotalBilling("2", "averagecrop")}</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetVegTotalBilling("2", "Total")}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                  </li>
                  <li>
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerVeg3)}{OnTheRightText}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetVegTotalBilling("3", "price")}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass}>{this.GetVegTotalBilling("3", "averagecrop")}</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetVegTotalBilling("3", "Total")}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                  </li>
                  <li>
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerVeg4)}{OnTheRightText}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetVegTotalBilling("4", "price")}</span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{this.GetVegTotalBilling("4", "averagecrop")}</span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetVegTotalBilling("4", "Total")}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                  </li>
                  {this.state.FieldCropStatus && this.state.FieldCropPlanActive ?
                    <li>
                      <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerFieldCrop1)}{OnTheRightText}</span>
                      <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetFieldCropTotalBilling("1", "price")}</span>
                      <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{this.GetFieldCropTotalBilling("1", "averagecrop")}</span>
                      <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetFieldCropTotalBilling("1", "Total")}</span>
                      <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                    </li> : null}
                  {this.state.FieldCropStatus && this.state.FieldCropPlanActive ?
                    <li>
                      <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerFieldCrop2)}{OnTheRightText}</span>
                      <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetFieldCropTotalBilling("2", "price")}</span>
                      <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{this.GetFieldCropTotalBilling("2", "averagecrop")}</span>
                      <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetFieldCropTotalBilling("2", "Total")}</span>
                      <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                    </li> : null}
                  {this.state.FieldCropStatus && this.state.FieldCropPlanActive ?
                    <li>
                      <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerFieldCrop3)}{OnTheRightText}</span>
                      <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetFieldCropTotalBilling("3", "price")}</span>
                      <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{this.GetFieldCropTotalBilling("3", "averagecrop")}</span>
                      <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetFieldCropTotalBilling("3", "Total")}</span>
                      <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                    </li> : null}
                  {this.state.FieldCropStatus && this.state.FieldCropPlanActive ?
                    <li>
                      <span className={'GrowerFinalBillingItemName ' + FloatClass} >{OnTheLeftText}{this.Translate(this.state.GrowerFieldCrop4)}{OnTheRightText}</span>
                      <span className={'GrowerFinalBillingItemPrice ' + FloatClass} >{this.GetFieldCropTotalBilling("4", "price")}</span>
                      <span className={'GrowerFinalBillingItemAmount ' + FloatClass} >{this.GetFieldCropTotalBilling("4", "averagecrop")}</span>
                      <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{this.GetFieldCropTotalBilling("4", "Total")}</span>
                      <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} >{Language.GrowerTotalBillOneTimeItemPaymentType}</span>
                    </li> : null}
                  <li className="GrowerFinalBillingMainHeader2" >
                    <span className={'GrowerFinalBillingItemName ' + FloatClass} >{Language.GrowerTotalBillMonthlyTotalToPay}</span>
                    <span className={'GrowerFinalBillingItemPrice ' + FloatClass} ></span>
                    <span className={'GrowerFinalBillingItemAmount ' + FloatClass} ></span>
                    <span className={'GrowerFinalBillingItemTotal ' + FloatClass} >{(parseFloat(this.GetFieldCropTotalPayment("1")) + parseFloat(this.GetTotalPayment("1"))).toString()} {Language.Shekals}</span>
                    <span className={'GrowerFinalBillingItemBullingType ' + FloatClass} ></span>
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
  ChoosenFarmerById: state.choosenfarmer.ChoosenFarmerById,
  growervegbuyingbag: state.growervegbuyingbag,
  growerfieldcropsbuyingbag: state.growerfieldcropsbuyingbag,
  FieldCropsToBuy: state.growerfieldcropsbuyingbag.FieldCropsToBuy,
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction,
  LanguageCode: state.language.LanguageCode,
  languagedbconversion: state.languagedbconversion,
  vegetablelsanguages: state.languagedbconversion.vegetablelsanguages
});

export default connect(
  mapStateToProps,
  {
    getfarmersbyarea, resetFarmersList, updatechoosenfarmer, getchoosenfarmer, resetchoosenfarmer, addToGrowerVegBag,
    deleteFromGrowerVegBag, getGrowerVegBag, ResetGrowerVegBag, SetTotalGrowerVegBag, SetPlanGrowerVegBag, SetIsValidatedVegBag,
    getGrowerFieldCropBag, addToGrowerFieldCropBag, deleteFromGrowerFieldCropBag, ResetGrowerFieldCropBag, SetTotalGrowerFieldCropBag,
    SetPlanGrowerFieldCropBag, SetIsValidatedFieldCropBag, getvegetablelanguages
  }
)(ChooseFarmer);