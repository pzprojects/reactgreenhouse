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
  FormText
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader';
import Vegetables from '../components/Vegetables';
import VegetablesPricing from '../components/VegetablesPricing';
import FieldCrops from '../components/FieldCrops';
import FarmCropsPricing from '../components/FarmCropsPricing';
import { getChoosenVegetables, addChoosenVegetable, resetChoosenVegetables } from '../actions/choosenVegetablesAction';
import { getChoosenfieldCrops, addChoosenfieldCrop, resetChoosenfieldCrop } from '../actions/choosenFieldCropsAction';
import { updatefarmerprofile, updatefarmerbyemail } from '../actions/updateUserAction';
import { addFarmer } from '../actions/farmerAction';
import ListOfGrowers from '../components/ListOfGrowers';
import { Redirect } from "react-router-dom";
import { API_URL } from '../config/keys';
import { getSystemData } from '../actions/systemAction';
import { addVegLog, ResetVegLog, SetVegLogDone } from '../actions/veglogAction';


class FarmerPersonalArea extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    familyname: '',
    phone: '',
    sizearea: 'מרכז',
    hamamasize: '',
    aboutme: '',
    msg: null,
    profileimg: '',
    file: '',
    imageurl: '',
    imagePreviewUrl: '',
    imagename: '',
    usertype: 'חקלאי',
    ActivateLoader: false,
    FieldCropsButtonOn: true,
    VegtButtonOn: true,
    AddBackgroundClassToVeg: 'vegetables',
    cost1: '200',
    plan1: false,
    cost2: '300',
    plan2: false,
    cost3: '400',
    plan3: false,
    ScreenNumber: "1",
    fullname: '',
    accountnumber: '',
    bankname: '',
    banknumber: '',
    CreditCardfullname: '',
    CreditCardNumber: '',
    CreditCardDate: '',
    CreditCardCVV: '',
    CreditCardBusniessNumber: '',
    nameValidation: true,
    emailValidation: true,
    familynameValidation: true,
    phoneValidation: true,
    hamamasizeValidation: true,
    VegPricingValidation: false,
    UserID: '',
    TotalNumberOfHamamot: '0',
    DefaultNumberOfHamamot: '0',
    CurrentActiveFarms: '',
    redirect: null,
    SystemDefaulNumberOfHamamot: '16',
    SuccessFileUpload: false,
    CropFieldPlanActive: false,
    CropFieldPlanCost: '',
    IgnoreVegLog: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getChoosenVegetables: PropTypes.func.isRequired,
    addChoosenVegetable: PropTypes.func.isRequired,
    choosenvegetable: PropTypes.object.isRequired,
    getChoosenfieldCrops: PropTypes.func.isRequired,
    addChoosenfieldCrop: PropTypes.func.isRequired,
    choosenfieldcrop: PropTypes.object.isRequired,
    addFarmer: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    updatefarmerprofile: PropTypes.func.isRequired,
    updateduser: PropTypes.object.isRequired,
    updatefarmerbyemail: PropTypes.func.isRequired,
    getSystemData: PropTypes.func.isRequired,
    system: PropTypes.object.isRequired,
    veglog: PropTypes.object.isRequired,
    addVegLog: PropTypes.func.isRequired,
    ResetVegLog: PropTypes.func.isRequired,
    SetVegLogDone: PropTypes.func.isRequired,
    resetChoosenVegetables: PropTypes.func.isRequired,
    resetChoosenfieldCrop: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getChoosenVegetables();
    this.props.getChoosenfieldCrops();
    this.props.resetChoosenVegetables();
    this.props.resetChoosenfieldCrop();
    this.props.getSystemData();
    var i = 0;
    const { user } = this.props.auth;

    this.setState({
      name: user.name,
      email: user.email,
      familyname: user.familyname,
      phone: user.phone,
      imageurl: user.imageurl,
      imagePreviewUrl: user.imageurl,
      UserID: user._id,
      hamamasize: user.hamamasize,
      aboutme: user.aboutme,
      TotalNumberOfHamamot: (parseFloat(user.hamamasize) / 16).toString(),
      DefaultNumberOfHamamot: (parseFloat(user.hamamasize) / 16).toString(),
      CurrentActiveFarms: user.numberofactivefarms,
      CropFieldPlanActive: user.fieldcropplan.avaliabile,
      CropFieldPlanCost: user.fieldcropplan.cost
    })

    for (i = 0; i < user.choosenvegetables.length; i++) {
      this.props.addChoosenVegetable(user.choosenvegetables[i]);
    }
    for (i = 0; i < user.choosenfieldcrops.length; i++) {
      this.props.addChoosenfieldCrop(user.choosenfieldcrops[i]);
    }
  }

  componentWillUnmount() {
    this.props.resetChoosenVegetables();
    this.props.resetChoosenfieldCrop();
    this.props.ResetVegLog();
  }

  componentDidUpdate(prevProps) {
    const { VegLogUpdated, system, error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      this.setState({
        ActivateLoader: false
      });

      // Check for update error
      if (error.id === 'UPDATE_FAIL') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    if (system !== prevProps.system) {
      try {
        const { SystemData } = this.props.system;
        this.setState({
          SystemDefaulNumberOfHamamot: SystemData.hamamadefaultsize,
          TotalNumberOfHamamot: (parseFloat(this.state.hamamasize) / parseFloat(SystemData.hamamadefaultsize)).toString(),
          DefaultNumberOfHamamot: (parseFloat(this.state.hamamasize) / parseFloat(SystemData.hamamadefaultsize)).toString()
        });
      }
      catch{ }
    }

    // If authenticated, close modal
    if (this.state.modal) {
      let VegLogUpdatedSuccess = false;
      if (!this.state.IgnoreVegLog) {
        VegLogUpdatedSuccess = VegLogUpdated;
      }
      else {
        VegLogUpdatedSuccess = true;
      }
      if (isAuthenticated && this.state.SuccessFileUpload && VegLogUpdatedSuccess) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.props.ResetVegLog();
    this.props.resetChoosenVegetables();
    this.props.resetChoosenfieldCrop();
    this.setState({
      modal: !this.state.modal
    });
    this.setState({
      ActivateLoader: !this.state.ActivateLoader,
      redirect: '/DeatilsUpdatedMSG'
    });
  };

  ValidateEmail = (mail) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  ValidateForm = () => {

    var Validated = true;
    var ScrollToLocation = "top";
    let numberofactivefarms = (parseFloat(this.state.hamamasize) / parseFloat(this.state.SystemDefaulNumberOfHamamot)).toString();
    const choosenvegetables = this.props.choosenvegetable.ChoosenVegetables;
    const { ChoosenFieldCrops } = this.props.choosenfieldcrop;
    let FoundEmpty = false;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    // Empty fields
    if (this.state.name === '') {
      this.setState({
        nameValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if (this.state.email === '' || !this.ValidateEmail(this.state.email)) {
      this.setState({
        emailValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if (this.state.familyname === '') {
      this.setState({
        familynameValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if (this.state.phone === '' || !this.state.phone.match(phoneno)) {
      this.setState({
        phoneValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if (this.state.hamamasize === '' || (numberofactivefarms % 1) !== 0) {
      this.setState({
        hamamasizeValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    // Validate veg pricing
    var i = 0;
    for (i = 0; i < choosenvegetables.length; i++) {
      if (choosenvegetables[i].price === '') {
        FoundEmpty = true;
      }
    }
    for (i = 0; i < ChoosenFieldCrops.length; i++) {
      if (ChoosenFieldCrops[i].price === '') {
        FoundEmpty = true;
      }
    }
    if (FoundEmpty) {
      Validated = false;
      ScrollToLocation = "bottom";
      this.setState({
        VegPricingValidation: true
      })
    }
    else {
      this.setState({
        VegPricingValidation: false
      })
    }

    if (!Validated) {
      if (ScrollToLocation === "top") {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    return Validated;
  };

  ChangeScreen = (ScreenNum) => {
    if (this.ValidateForm()) {
      this.setState({
        ScreenNumber: ScreenNum
      });
    }
  };

  ResetValidation = (FieldToReset) => {

    switch (FieldToReset) {
      case "name":
        // Regulations
        this.setState({
          nameValidation: true
        });
        break;
      case "familyname":
        // Regulations
        this.setState({
          familynameValidation: true
        });
        break;
      case "email":
        // Regulations
        this.setState({
          emailValidation: true
        });
        break;
      case "phone":
        // Regulations
        this.setState({
          phoneValidation: true
        });
        break;
      case "hamamasize":
        // Regulations
        this.setState({
          hamamasizeValidation: true
        });
        break;
      default:
    }
  };

  onChange = e => {

    // validations
    switch (e.target.name) {
      case "name":
        if (this.state.nameValidation === false) {
          this.ResetValidation("name")
        }
        break;
      case "familyname":
        if (this.state.familynameValidation === false) {
          this.ResetValidation("familyname")
        }
        break;
      case "email":
        if (this.state.emailValidation === false) {
          this.ResetValidation("email")
        }
        break;
      case "phone":
        if (this.state.phoneValidation === false) {
          this.ResetValidation("phone")
        }
        break;
      case "hamamasize":
        if (this.state.hamamasizeValidation === false) {
          this.ResetValidation("hamamasize")
        }
        this.setState({
          TotalNumberOfHamamot: (parseFloat(e.target.value) / parseFloat(this.state.SystemDefaulNumberOfHamamot)).toString()
        })
        break;
      default:
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  mergeArrayObjects = (arr1, arr2) => {
    let merge = [];

    for (var i = 0; i < arr1.length; i++) {
      for (var j = 0; j < arr2.length; j++) {
        if (arr1[i].name === arr2[j].name && arr1[i].price !== arr2[j].price) {
          //pushing the merged objects into array
          merge.push({ _id: arr1[i]._id, name: arr1[i].name, pricebefore: arr1[i].price, priceafter: arr2[j].price })
        }
      }
    }
    return merge;
  }

  onSubmit = e => {
    e.preventDefault();

    if (this.ValidateForm()) {
      const { user } = this.props.auth;
      const choosenvegetables = this.props.choosenvegetable.ChoosenVegetables;
      const choosenfieldcrops = this.props.choosenfieldcrop.ChoosenFieldCrops;

      let MergeOldNewVeg = this.mergeArrayObjects(user.choosenvegetables, choosenvegetables);
      let MergeOldNewFieldCrop = this.mergeArrayObjects(user.choosenfieldcrops, choosenfieldcrops);
      let vegetablesafterchange = MergeOldNewVeg.concat(MergeOldNewFieldCrop);
      const farmername = this.state.name + " " + this.state.familyname;
      const farmeremail = this.state.email;

      let HelkotToAdd = parseFloat(this.state.TotalNumberOfHamamot) - parseFloat(this.state.DefaultNumberOfHamamot);
      let numberofactivefarms = (parseFloat(this.state.CurrentActiveFarms) + HelkotToAdd).toString();

      this.setState({
        ActivateLoader: !this.state.ActivateLoader,
        modal: !this.state.modal
      });

      if (this.state.imagename !== '') {
        this.uploadFile();
      }
      else {
        this.setState({
          SuccessFileUpload: true
        });
      }


      const { name, familyname, phone, hamamasize, aboutme, imageurl } = this.state;

      // Create user object
      const newUser = {
        name,
        familyname,
        phone,
        hamamasize,
        numberofactivefarms,
        aboutme,
        imageurl,
        choosenvegetables,
        choosenfieldcrops
      };

      const newFarmer = {
        name,
        familyname,
        phone,
        hamamasize,
        numberofactivefarms,
        aboutme,
        imageurl,
        choosenvegetables,
        choosenfieldcrops
      };

      const newLog = {
        farmername,
        farmeremail,
        vegetablesafterchange
      };

      // Attempt to save data
      if (vegetablesafterchange.length > 0) {
        this.props.addVegLog(newLog);
      }
      else {
        this.setState({
          IgnoreVegLog: true
        });
      }
      this.props.updatefarmerbyemail(this.state.email, newFarmer);
      this.props.updatefarmerprofile(this.state.UserID, newUser);

    }
  };

  handleUploadFile = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    const Allfiles = e.target.files;
    if (Allfiles && Allfiles.length > 0) {
      const tempFile = Allfiles[0];
      this.setState({ file: tempFile });
      var improvedname = uuidv4() + tempFile.name;
      improvedname = improvedname.replace(/[/\\?%_*:|"<>]/g, '-').trim().toLowerCase();
      improvedname = improvedname.replace(/\s/g, '');
      const GenerateUrl = "https://profileimages12.s3.eu-west-1.amazonaws.com/" + improvedname;
      this.setState({ imageurl: GenerateUrl, imagename: improvedname });
    }

    reader.onloadend = () => {
      this.setState({
        profileimg: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  OpenFileExplorer = e => {
    e.preventDefault();

    document.getElementById("profileimg").click()

  }

  uploadFile = e => {

    const { file } = this.state;
    const contentType = file.type; // eg. image/jpeg or image/svg+xml

    const generatePutUrl = API_URL + '/generate-put-url';
    const options = {
      params: {
        Key: this.state.imagename,
        ContentType: contentType
      },
      headers: {
        'Content-Type': contentType
      }
    };

    axios.get(generatePutUrl, options).then(res => {
      const {
        data: { putURL }
      } = res;
      axios
        .put(putURL, file, options)
        .then(res => {
          this.setState({
            SuccessFileUpload: true
          });
        })
        .catch(err => {
          console.log('err', err);
        });
    });
  };

  OpenListOfvegetables = e => {
    e.preventDefault();

    let ChoosenClass = this.state.AddBackgroundClassToVeg;

    if (ChoosenClass === 'vegetablesOpen') {
      ChoosenClass = 'vegetables';
    }
    else ChoosenClass = 'vegetablesOpen';

    this.setState({
      VegtButtonOn: !this.state.VegtButtonOn,
      AddBackgroundClassToVeg: ChoosenClass
    });

  }

  OpenListOfFieldsCrops = e => {
    e.preventDefault();

    let ChoosenClass = this.state.AddBackgroundClassToVeg;

    if (ChoosenClass === 'vegetablesOpen') {
      ChoosenClass = 'vegetables';
    }
    else ChoosenClass = 'vegetablesOpen';

    this.setState({
      FieldCropsButtonOn: !this.state.FieldCropsButtonOn,
      AddBackgroundClassToVeg: ChoosenClass
    });
  }

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

  render() {
    const { Language, direction } = this.props;
    let ShowVegPricing = false;
    let ShowFieldCropPricing = false;
    let { imagePreviewUrl } = this.state;
    let $imagePreview;
    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    let ReverseTextAlignClass = "Co-Text-Align-Left";
    if (direction === 'rtl') {
      $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload.png')} onClick={this.OpenFileExplorer} />);
      FloatClass = "Co-Align-Right";
      TextAlignClass = "Co-Text-Align-Right";
      ReverseTextAlignClass = "Co-Text-Align-Left";
    }
    else {
      $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload-English.png')} onClick={this.OpenFileExplorer} />);
      FloatClass = "Co-Align-Left";
      TextAlignClass = "Co-Text-Align-Left";
      ReverseTextAlignClass = "Co-Text-Align-Right";
    }
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="" className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    }
    const { user } = this.props.auth;
    try {
      var PersonalUserPlans = user.plans;
      const { SystemData } = this.props.system;
      var HamamadefaultsizeContainer = SystemData.hamamadefaultsize;
      const { ChoosenVegetables } = this.props.choosenvegetable;
      if (ChoosenVegetables.length !== 0) {
        ShowVegPricing = true;
      }
      const { ChoosenFieldCrops } = this.props.choosenfieldcrop;
      if (ChoosenFieldCrops.length !== 0) {
        ShowFieldCropPricing = true;
      }
    } catch (e) {
      PersonalUserPlans = [];
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div>
        <Container>
          {this.state.msg ? (
            <Alert color='danger'>{this.state.msg}</Alert>
          ) : null}
          {this.state.ScreenNumber === "1" ? (
            <div className='GrowerPersonalAreaTabs'>
              <div className='GrowerPersonalAreaTabsButtons'>
                <Button color="success" type="button" disabled>
                  {Language.PersonalDetails}
                </Button>
                <Button outline color="success" onClick={() => this.ChangeScreen("2")} type="button" >
                  {Language.ChangePaymentMethod}
                </Button>
              </div>
            </div>
          ) : null}
          {this.state.ScreenNumber === "2" ? (
            <div className='GrowerPersonalAreaTabs'>
              <div className='GrowerPersonalAreaTabsButtons'>
                <Button outline color="success" onClick={() => this.ChangeScreen("1")} type="button" >
                  {Language.PersonalDetails}
                </Button>
                <Button color="success" type="button" disabled>
                  {Language.ChangePaymentMethod}
                </Button>
              </div>
            </div>
          ) : null}
          <Form onSubmit={this.onSubmit}>
            {this.state.ScreenNumber === "1" ? (
              <FormGroup>
                <div className={'PersonalDetails ' + FloatClass}>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='name'>{Language.FirstName}:</Label>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.name}
                      invalid={!this.state.nameValidation}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass} >{Language.EmptyField}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='familyname'>{Language.LastName}:</Label>
                    <Input
                      type='text'
                      name='familyname'
                      id='familyname'
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.familyname}
                      invalid={!this.state.familynameValidation}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass} >{Language.EmptyField}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='phone'>{Language.Phone}:</Label>
                    <Input
                      type='text'
                      name='phone'
                      id='phone'
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.phone}
                      invalid={!this.state.phoneValidation}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass} >{Language.PhoneNumberError}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='email'>{Language.Email}:</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.email}
                      invalid={!this.state.emailValidation}
                      required
                      disabled
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmailValidationError}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='hamamasize'>{Language.FarmerSizeArea}:</Label>
                    <Input
                      type='text'
                      name='hamamasize'
                      id='hamamasize'
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.hamamasize}
                      invalid={!this.state.hamamasizeValidation}
                      required
                    />
                    <FormText className={ReverseTextAlignClass}>* {Language.FarmerSizeAreaMsg1} {HamamadefaultsizeContainer} {Language.SquareMeter}</FormText>
                    <FormFeedback className={ReverseTextAlignClass}>{Language.SizeAreaError}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='TotalNumberOfHamamot'>{Language.NumberOfActivePlots}:</Label>
                    <Input
                      type='text'
                      name='TotalNumberOfHamamot'
                      id='TotalNumberOfHamamot'
                      placeholder=''
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      value={this.state.TotalNumberOfHamamot}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='aboutme'>{Language.FarmerAboutMe}:</Label>
                    <Input type="textarea" name="aboutme" id="aboutme" className={'AboutMe mb-3 ' + FloatClass + " " + TextAlignClass} onChange={this.onChange} value={this.state.aboutme} />
                    <FormText className={ReverseTextAlignClass}>* {Language.FarmerAboutMeMsg}</FormText>
                  </div>
                </div>
                <div className={'UploadImage ' + FloatClass}>
                  <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                  {$imagePreview}
                </div>
                {this.state.email !== '' ? <div className='MyGrowersList'><ListOfGrowers FarmerEmail={this.state.email} /></div> : null}
                <div className={this.state.AddBackgroundClassToVeg}>
                  <h3>{Language.ExperienceToGrow}</h3>
                  {this.state.VegtButtonOn && this.state.FieldCropsButtonOn ?
                    <Button color="success" onClick={this.OpenListOfvegetables}>{Language.VegList}</Button> : null}
                  {this.state.VegtButtonOn ? null : <Vegetables OpenListOfvegetables={this.OpenListOfvegetables} />}
                  {this.state.FieldCropsButtonOn && this.state.VegtButtonOn && this.state.CropFieldPlanActive ?
                    <Button color="success" onClick={this.OpenListOfFieldsCrops}>{Language.FieldCropList}</Button> : null}
                  {this.state.FieldCropsButtonOn ? null : <FieldCrops OpenListOffieldcrops={this.OpenListOfFieldsCrops} />}
                </div>
                <div className="ListOfVegCost">
                  <p>{Language.PricingComment}</p>
                  {ShowVegPricing ? <VegetablesPricing /> : null}
                  {ShowFieldCropPricing ? <FarmCropsPricing /> : null}
                </div>
                {this.state.VegPricingValidation ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.VegPricingComment}</Alert></div> : null}
                <div className="farmer-personal-form-group">
                  <div className="PersonalFarmerPlansContainer">
                    <div className="PersonalFarmerPlansHeader">{Language.FarmerPersonalAreaPlansCost}</div>
                    <div className="PersonalFarmerPlans">
                      {PersonalUserPlans.map(({ name, cost, }) => (
                        <div className='PersonalChoosenPlanItem' key={name}>
                          <div className='PersonalChoosenPlanItemName'>
                            <span className={'PersonalChoosenPlanItemImage ' + FloatClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                            <span className={'PersonalChoosenPlanItemTitle ' + FloatClass}>{this.ReturnPlanInChoosenLanguage(name)}</span>
                            <span className={'PersonalChoosenPlanItemCost ' + FloatClass}> ₪ {cost}</span>
                            <span className={'PersonalChoosenPlanItemText1 ' + FloatClass}>{Language.PerMonth}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {this.state.CropFieldPlanActive ?
                  <div className="farmer-personal-form-group">
                    <div className="PersonalFarmerPlansContainer">
                      <div className="PersonalFarmerPlansHeader">{Language.FarmerPersonalAreaFieldCropPlanCost}</div>
                      <div className="PersonalFarmerPlans">
                        <div className='PersonalChoosenPlanItem'>
                          <div className='PersonalChoosenPlanItemName'>
                            <span className={'PersonalChoosenPlanItemImage ' + FloatClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                            <span className={'PersonalChoosenPlanItemTitle ' + FloatClass}>{Language.GrowerFieldCropsText}</span>
                            <span className={'PersonalChoosenPlanItemCost ' + FloatClass}> ₪ {this.state.CropFieldPlanCost}</span>
                            <span className={'PersonalChoosenPlanItemText1 ' + FloatClass}>{Language.PerMonth}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  : null}
              </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "2" ? (
              <FormGroup>
                <div className='BankCollectPaymentContainer'>
                  <div className='BankCollectPayment'>
                    <span className='RecivePaymentHeader'>{Language.PaymentDetailsTitle}</span>
                    <div className="payment-form-group">
                      <Label for='fullname'></Label>
                      <Input
                        type='text'
                        name='fullname'
                        id='fullname'
                        placeholder={Language.PaymentDetailsAccOwner}
                        className='mb-3'
                        onChange={this.onChange}
                        value={this.state.fullname}
                      />
                    </div>
                    <div className="payment-form-group">
                      <Label for='accountnumber'></Label>
                      <Input
                        type='text'
                        name='accountnumber'
                        id='accountnumber'
                        placeholder={Language.PaymentDetailsAccNumber}
                        className='mb-3'
                        onChange={this.onChange}
                        value={this.state.accountnumber}
                      />
                    </div>
                    <div className="payment-form-group">
                      <div className="bankDetails">
                        <div className="bankname">
                          <Label for='bankname'></Label>
                          <Input type="select" name="bankname" id="bankname" className='mb-3' placeholder='בנק' onChange={this.onChange} value={this.state.bankname}>
                            <option value='בנק' >{Language.PaymentDetailsChooseBank}</option>
                            <option value='בנק אגוד'>{Language.PaymentDetailsBankName1}</option>
                            <option value='בנק אוצר החייל'>{Language.PaymentDetailsBankName2}</option>
                            <option value='בנק דיסקונט'>{Language.PaymentDetailsBankName3}</option>
                            <option value='בנק הפועלים'>{Language.PaymentDetailsBankName4}</option>
                            <option value='בנק לאומי'>{Language.PaymentDetailsBankName5}</option>
                            <option value='בנק מזרחי'>{Language.PaymentDetailsBankName6}</option>
                            <option value='הבנק הבינלאומי'>{Language.PaymentDetailsBankName7}</option>
                          </Input>
                        </div>
                        <div className="banknumber">
                          <Label for='banknumber'></Label>
                          <Input
                            type='text'
                            name='banknumber'
                            id='banknumber'
                            placeholder={Language.PaymentDetailsBankNumber}
                            className='mb-3'
                            onChange={this.onChange}
                            value={this.state.banknumber}
                          />
                        </div>
                      </div>
                    </div>
                    {this.state.ScreenNumber === "2" ? (
                      <div className='MoveToSecondPaymentScreenButton'>
                        <Button color="info" onClick={() => this.ChangeScreen("3")} type="button" >
                          {Language.Approve}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "2" ? (
              <FormGroup>
                <div className='BankCollectPaymentContainer'>
                  <div className='BankCollectPayment'>
                    <span className='RecivePaymentHeader'>{Language.PaymentCreditCardTitle}</span>
                    <div className="payment-form-group">
                      <Label for='CreditCardfullname'></Label>
                      <Input
                        type='text'
                        name='CreditCardfullname'
                        id='CreditCardfullname'
                        placeholder={Language.PaymentCreditCardfullname}
                        className='mb-3'
                        onChange={this.onChange}
                      />
                    </div>
                    <div className="payment-form-group">
                      <Label for='CreditCardNumber'></Label>
                      <Input
                        type='text'
                        name='CreditCardNumber'
                        id='CreditCardNumber'
                        placeholder={Language.PaymentCreditCardNumber}
                        className='mb-3'
                        onChange={this.onChange}
                      />
                    </div>
                    <div className="payment-form-group">
                      <div className="bankDetails">
                        <div className="bankname">
                          <Label for='CreditCardDate'></Label>
                          <Input
                            type="text"
                            maxLength="5"
                            name="CreditCardDate"
                            id="CreditCardDate"
                            className='mb-3'
                            placeholder={Language.PaymentCreditCardDate}
                            onChange={this.onChange}>
                          </Input>
                        </div>
                        <div className="banknumber">
                          <Label for='CreditCardCVV'></Label>
                          <Input
                            type='text'
                            name='CreditCardCVV'
                            id='CreditCardCVV'
                            placeholder={Language.PaymentCreditCardCVV}
                            className='mb-3'
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="payment-form-group">
                      <Label for='CreditCardBusniessNumber'></Label>
                      <Input
                        type='text'
                        name='CreditCardBusniessNumber'
                        id='CreditCardBusniessNumber'
                        placeholder={Language.PaymentCreditCardBusniessNumber}
                        className='mb-3'
                        onChange={this.onChange}
                      />
                    </div>
                    {this.state.ScreenNumber === "3" ? (
                      <div className='MoveToSecondPaymentScreenButton'>
                        <Button color="info" onClick={() => this.ChangeScreen("4")} type="button" >
                          {Language.Approve}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </FormGroup>
            ) : null}

            <div className='RegisterButtonContainer'>
              <Button color="success" className='UpdateDetails' >
                {Language.Update} 
                </Button>
            </div>
          </Form>
          {this.state.ActivateLoader ? <Loader /> : null}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  choosenvegetable: state.choosenvegetable,
  farmer: state.farmer,
  updateduser: state.updateduser,
  system: state.system,
  choosenfieldcrop: state.choosenfieldcrop,
  ChoosenFieldCrops: state.choosenfieldcrop.ChoosenFieldCrops,
  veglog: state.veglog,
  VegLogUpdated: state.veglog.VegLogUpdated,
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  {
    register, clearErrors, getChoosenVegetables, addChoosenVegetable, resetChoosenVegetables, addFarmer, updatefarmerprofile, updatefarmerbyemail, getSystemData, getChoosenfieldCrops,
    addChoosenfieldCrop, resetChoosenfieldCrop, addVegLog, ResetVegLog, SetVegLogDone
  }
)(FarmerPersonalArea);