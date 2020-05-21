import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  CustomInput,
  Alert,
  FormFeedback
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader';
import ChooseFarmer from '../components/ChooseFarmer';
import { addFarmer, resetFarmersList} from '../actions/farmerAction';
import { getchoosenfarmer, resetchoosenfarmer } from '../actions/choosenFarmerAction';
import { getGrowerVegBag, ResetGrowerVegBag } from '../actions/growerVegChoiceAction';
import { getGrowerFieldCropBag, ResetGrowerFieldCropBag } from '../actions/growerFieldCropsChoiceAction';
import { addgrower, resetgrowerlist } from '../actions/growerAction';
import { updatefarmeractivefarms, updateuseractivefarms, resetactivefarms } from '../actions/updateFarmerActiveFarmsAction.js';
import { API_URL } from '../config/keys';
import { getSystemData } from '../actions/systemAction';


class GrowerRegisterPage extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    password: '',
    passwordconfirmation: '',
    familyname: '',
    phone: '',
    sizearea: 'מרכז',
    hamamasize: 'null',
    aboutme: 'null',
    msg: null,
    profileimg: '',
    file: '',
    imageurl: '',
    imagePreviewUrl: '',
    imagename: '',
    usertype: 'מגדל',
    ActivateLoader: false,
    VegtButtonOn: true,
    AddBackgroundClassToVeg: 'vegetables',
    cost1 : '',
    plan1 : false,
    Checkplan1: '',
    cost2 : '',
    plan2 : false,
    Checkplan2: '',
    cost3 : '',
    plan3 : false,
    Checkplan3: '',
    PasswordValidation: true,
    ScreenNumber: "1",
    Regulations: false,
    RegulationsValidation: true,
    CheckRegulations: '',
    fullname: '',
    accountnumber: '',
    bankname: '',
    banknumber: '',
    CreditCardfullname: '',
    CreditCardNumber: '',
    CreditCardDate: '',
    CreditCardCVV: '',
    CreditCardBusniessNumber: '',
    PasswordStrengthValidation: true,
    nameValidation: true,
    emailValidation: true,
    familynameValidation: true,
    phoneValidation: true,
    hamamasizeValidation: true,
    addressValidation: true,
    address: '',
    ActivePlan: '',
    SuccessFileUpload: false,
    PlanValidation: false,
    ChooseFarmerValidation: false,
    UpdateActiveFarms: true
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    addFarmer: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    getchoosenfarmer: PropTypes.func.isRequired,
    choosenfarmer: PropTypes.object.isRequired,
    growervegbuyingbag: PropTypes.object.isRequired,
    getGrowerVegBag: PropTypes.func.isRequired,
    grower: PropTypes.object.isRequired,
    addgrower: PropTypes.func.isRequired,
    FarmerActiveFarms: PropTypes.object.isRequired,
    system: PropTypes.object.isRequired,
    getSystemData: PropTypes.func.isRequired,
    growerfieldcropsbuyingbag: PropTypes.object.isRequired,
    getGrowerFieldCropBag: PropTypes.func.isRequired,
    resetchoosenfarmer: PropTypes.func.isRequired,
    ResetGrowerFieldCropBag: PropTypes.func.isRequired,
    ResetGrowerVegBag: PropTypes.func.isRequired,
    resetFarmersList: PropTypes.func.isRequired,
    resetgrowerlist: PropTypes.func.isRequired,
    resetactivefarms: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getchoosenfarmer();
    this.props.getGrowerVegBag();
    this.props.getGrowerFieldCropBag();
    this.props.getSystemData();

  }

  componentWillUnmount() {
    this.props.resetFarmersList();
    this.props.resetchoosenfarmer();
    this.props.ResetGrowerVegBag();
    this.props.ResetGrowerFieldCropBag();
    this.props.resetgrowerlist();
    this.props.resetactivefarms();
  }

  componentDidUpdate(prevProps) {
    const { FarmersNumLoaded, UsersNumLoaded, error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      this.setState({
        ActivateLoader: false
      });
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
    if (this.state.modal) {
        if (isAuthenticated && this.state.SuccessFileUpload) {
          if(this.state.UpdateActiveFarms){
            this.UpdateFarmersActiveFarms();
          }
          if(FarmersNumLoaded && UsersNumLoaded){
            this.toggle();
          }
        }
    }

    // If modal open and authenticated, go to homepage
    if (!this.state.modal) {
      if (isAuthenticated) {
        this.props.history.push('/');
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    
    this.setState({
        modal: !this.state.modal,
        ActivateLoader: !this.state.ActivateLoader
    });
    this.props.history.push('/GrowersubmissionMSG');
  };

  ValidateEmail = (mail) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  ValidateForm = () => {

    var Validated = true;
    var ScrollToLocation = "top";
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    const { IsValidated } = this.props.growervegbuyingbag;
    const { FieldCropsIsValidated } = this.props.growerfieldcropsbuyingbag;
    const { ChoosenFarmerById } = this.props.choosenfarmer;

    // Regulations
    if(this.state.Regulations === false){
      this.setState({
        RegulationsValidation: false
      });
      Validated = false;
      ScrollToLocation = "bottom";
    }

    // Passwords
    if(this.state.password !== this.state.passwordconfirmation){
      this.setState({
        PasswordValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if(this.state.password.length < 8 || !this.state.password.match(numbers) || !this.state.password.match(upperCaseLetters ) || !this.state.password.match(lowerCaseLetters )){
      this.setState({
        PasswordStrengthValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    // Empty fields
    if(this.state.name === ''){
      this.setState({
        nameValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if(this.state.email === '' || !this.ValidateEmail(this.state.email)){
      this.setState({
        emailValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if(this.state.familyname === ''){
      this.setState({
        familynameValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if(this.state.phone === ''){
      this.setState({
        phoneValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if(this.state.address === ''){
        this.setState({
          addressValidation: false
        });
        Validated = false;
        ScrollToLocation = "top";
    }

    if(this.state.ActivePlan === ''){
      this.setState({
        PlanValidation: true
      });
      Validated = false;
      ScrollToLocation = "bottom";
    }

    if(ChoosenFarmerById.length !== 1){
      this.setState({
        ChooseFarmerValidation: true
      });
      Validated = false;
      ScrollToLocation = "bottom";
    }
    else{
      this.setState({
        ChooseFarmerValidation: false
      });
    }

    // VegBag
    if(!IsValidated){
      Validated = false;
      ScrollToLocation = "bottom";
    }

    // FildCropBag
    if(!FieldCropsIsValidated){
      Validated = false;
      ScrollToLocation = "bottom";
    }

    if(!Validated){
      if(ScrollToLocation === "top"){
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    return Validated;
  };

  ChangeScreen = (ScreenNum) => {
    if(this.ValidateForm()){
      this.setState({
        ScreenNumber: ScreenNum
      });
    }
  };

  ValidatePassword = (password) => {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if(password.length < 8 || !password.match(numbers) || !password.match(upperCaseLetters ) || !password.match(lowerCaseLetters )){
      if(password.length !== 0){
        if(this.state.PasswordStrengthValidation){
          this.setState({
            PasswordStrengthValidation: false
          });
        }
      }
      else{
        if(!this.state.PasswordStrengthValidation){
          this.setState({
            PasswordStrengthValidation: true
          });
        }
      }
    }
    else{
      if(!this.state.PasswordStrengthValidation){
        this.setState({
          PasswordStrengthValidation: true
        });
      }
    }
  };

  ResetValidation = (FieldToReset) => {

    switch(FieldToReset) {
      case "password":
        this.setState({
          PasswordValidation: true
        });
        break;
      case "Regulations":
        this.setState({
          RegulationsValidation: true
        });
        break;
      case "PasswordStrength":
        this.setState({
          PasswordStrengthValidation: true
        });
        break;
      case "name":
        this.setState({
          nameValidation: true
        });
        break;
      case "familyname":
        this.setState({
          familynameValidation: true
        });
        break;
      case "email":
        this.setState({
          emailValidation: true
        });
        break;
      case "phone":
        this.setState({
          phoneValidation: true
        });
        break;
      case "address":
        this.setState({
          addressValidation: true
        });
        break;
      default:
    }
  };

  onChange = e => {
    // deal with checkbox
    switch(e.target.value) {
      case "Checkplan1":
        this.setState({
          plan1: e.target.checked,
          plan2: !e.target.checked,
          plan3: !e.target.checked,
          PlanValidation: false,
          ActivePlan: 'מגדל עצמאי'
        });
        break;
      case "Checkplan2":
        this.setState({
          plan1: !e.target.checked,
          plan2: e.target.checked,
          plan3: !e.target.checked,
          PlanValidation: false,
          ActivePlan: 'ביניים'
        });
        break;
      case "Checkplan3":
        this.setState({
          plan1: !e.target.checked,
          plan2: !e.target.checked,
          plan3: e.target.checked,
          PlanValidation: false,
          ActivePlan: 'ליווי שוטף'
        });
        break;
      default:
    }
    
    // validations
    switch(e.target.name) {
      case "passwordconfirmation":
        // password validation
        if(this.state.PasswordValidation === false){
          this.ResetValidation("password")
        }
        break;
      case "password":
        // password strength validation
        this.ValidatePassword(e.target.value);
      break;
      case "CheckRegulations":
        // Regulations validation
        if(e.target.checked === true){
          this.ResetValidation("Regulations")
        }
        this.setState({
          Regulations: e.target.checked
        });
        break;
      case "name":
        // password strength validation
        if(this.state.nameValidation === false){
          this.ResetValidation("name")
        }
        break;
      case "familyname":
        // password strength validation
        if(this.state.familynameValidation === false){
          this.ResetValidation("familyname")
        }
        break;
      case "email":
        // password strength validation
        if(this.state.emailValidation === false){
          this.ResetValidation("email")
        }
        break;
      case "phone":
        // password strength validation
        if(this.state.phoneValidation === false){
          this.ResetValidation("phone")
        }
        break;
      case "address":
        // password strength validation
        if(this.state.addressValidation === false){
          this.ResetValidation("address")
        }
        break;
      default:
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  UpdateFarmersActiveFarms = () => {
    const GrowerChoosenFarmer =  this.props.choosenfarmer.ChoosenFarmerById[0];

    let chossenfarmer = GrowerChoosenFarmer.email;
    let numberofactivefarms = (parseFloat(GrowerChoosenFarmer.numberofactivefarms) -1).toString();

    const newnumberofactivefarms = {
      numberofactivefarms
    };

    // update Farmer Active farms
    this.props.updatefarmeractivefarms(chossenfarmer, newnumberofactivefarms);
    this.props.updateuseractivefarms(chossenfarmer, newnumberofactivefarms);

    this.setState({
      UpdateActiveFarms: false
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if(this.ValidateForm()){

      const choosenvegetables = this.props.growervegbuyingbag.VegToBuy;
      const choosenfieldcrops = this.props.growerfieldcropsbuyingbag.FieldCropsToBuy;
      const GrowerChoosenFarmer =  this.props.choosenfarmer.ChoosenFarmerById[0];
      let workingwith = [{_id: uuidv4(), email: GrowerChoosenFarmer.email, usertype: 'חקלאי' ,active: true, totalpayed: this.props.growervegbuyingbag.Total}];
      let plans = [];
      let plan = {};
      let fieldcropplan = {};
      let chossenfarmer = GrowerChoosenFarmer.email;
      let totalpayment = (parseFloat(this.props.growervegbuyingbag.Total) + parseFloat(this.props.growerfieldcropsbuyingbag.FieldCropsTotal)).toString();
      let isactive = true;
      const chossenfarmerfullname = GrowerChoosenFarmer.name + " " + GrowerChoosenFarmer.familyname;
      plans.push(this.props.growervegbuyingbag.Plan);
      plan = this.props.growervegbuyingbag.Plan;
      if(this.props.growerfieldcropsbuyingbag.FieldCropsTotal !== "0"){
        fieldcropplan = { avaliabile: true, cost: GrowerChoosenFarmer.fieldcropplan.cost }
      }
      else{
        fieldcropplan = { avaliabile: false, cost: '0' }
      }
    
      this.setState({
        ActivateLoader: !this.state.ActivateLoader,
        modal: !this.state.modal
      });

      if(this.state.imagename!==''){
        this.uploadFile();
      }
      else{
        this.setState({
          SuccessFileUpload: true
        });
      }


      const { name, password, familyname, phone, sizearea, hamamasize, aboutme, imageurl, usertype, address } = this.state;
      const email = this.state.email.toLowerCase();

      // Create user object
      const newUser = {
        name,
        email,
        password,
        familyname,
        phone,
        sizearea,
        hamamasize,
        aboutme,
        imageurl,
        choosenvegetables,
        choosenfieldcrops,
        plans,
        usertype,
        workingwith,
        address,
        fieldcropplan
      };

      const newGrower = {
        name,
        familyname,
        phone,
        email,
        sizearea,
        address,
        imageurl,
        choosenvegetables,
        choosenfieldcrops,
        plan,
        chossenfarmer,
        chossenfarmerfullname,
        totalpayment,
        isactive,
        fieldcropplan
      };

      // Attempt to register
      this.props.addgrower(newGrower);
      this.props.register(newUser);

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
      improvedname = improvedname.replace(/\s/g,'');
      const GenerateUrl = "https://profileimages12.s3.eu-west-1.amazonaws.com/" + improvedname;
      this.setState({imageurl: GenerateUrl, imagename: improvedname});
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

  render() {
    const { Language, direction } = this.props;
    let {imagePreviewUrl} = this.state;
    let $imagePreview;
    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    let ReverseTextAlignClass = "Co-Text-Align-Left";
    let HelpBtnClass = "HelpBtnRtl";
    if(direction === 'rtl'){
     $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload.png')} onClick={this.OpenFileExplorer}/>);
     FloatClass = "Co-Align-Right";
     TextAlignClass = "Co-Text-Align-Right";
     ReverseTextAlignClass = "Co-Text-Align-Left";
     HelpBtnClass = "HelpBtnRtl";
    }
    else{
     $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload-English.png')} onClick={this.OpenFileExplorer}/>);
     FloatClass = "Co-Align-Left";
     TextAlignClass = "Co-Text-Align-Left";
     ReverseTextAlignClass = "Co-Text-Align-Right";
     HelpBtnClass = "HelpBtnLtr";
    }
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="" className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    }

    try{
      const { SystemData } = this.props.system;
      var HamamadefaultsizeContainer = SystemData.hamamadefaultsize;
    }
    catch{}

    return (
      <div>
        <Container>
            {this.state.msg ? (
              <Alert color='danger'>{this.state.msg}</Alert>
            ) : null}
            {this.state.ScreenNumber === "1" ? (
                  <div className='RegisterStatus'>
                    <img alt="" src={require('../Resources/Step1-client.png')} />
                  </div>
                ) : 
                  null
            }
            {this.state.ScreenNumber === "2" ? (
                  <div className='RegisterStatus'>
                    <img alt="" src={require('../Resources/Step2-client.png')} />
                  </div>
                ) : 
                  null
            }
            {this.state.ScreenNumber === "3" ? (
                  <div className='RegisterStatus'>
                    <img alt="" src={require('../Resources/Step3-client.png')} />
                  </div>
                ) : 
                  null
            }
            <Form onSubmit={this.onSubmit}>
            {this.state.ScreenNumber === "1" || this.state.ScreenNumber === "3" ? (
              <FormGroup>
                {this.state.ScreenNumber === "1" ? (
                  <div className='ProfileName'>
                    <h1>פרופיל מגדל</h1>
                  </div>
                ) : 
                  <div className='ProfileName'>
                    <h1>שליחה לאישור סופי</h1>
                  </div>
                }
              <div className='PersonalDetails'>
                <div className="form-group">
                  <Label for='name'>שם פרטי</Label>
                  <Input
                    type='text'
                    name='name'
                    id='name'
                    placeholder='*'
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.name}
                    invalid= {!this.state.nameValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='familyname'>שם משפחה</Label>
                  <Input
                    type='text'
                    name='familyname'
                    id='familyname'
                    placeholder='*'
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.familyname}
                    invalid= {!this.state.familynameValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='phone'>טלפון</Label>
                  <Input
                    type='text'
                    name='phone'
                    id='phone'
                    placeholder='*'
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.phone}
                    invalid= {!this.state.phoneValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='email'>אימייל (שם משתמש)</Label>
                  <Input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='*'
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.email}
                    invalid= {!this.state.emailValidation}
                    required
                  />
                  <FormFeedback>כתובת האימייל שגויה</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='password'>סיסמה</Label>
                  <Input
                    type='password'
                    name='password'
                    id='password'
                    autoComplete="off"
                    placeholder='*'
                    className='mb-3'
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    invalid= {!this.state.PasswordStrengthValidation}
                    onChange={this.onChange}
                    value={this.state.password}
                    required
                  />
                  <FormFeedback>הסיסמה חייבת להכיל 8 תווים, אות גדולה, אות קטנה ומספר</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='passwordconfirmation'>אימות סיסמה</Label>
                  <Input
                    type='password'
                    name='passwordconfirmation'
                    id='passwordconfirmation'
                    autoComplete="off"
                    placeholder='*'
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.passwordconfirmation}
                    invalid= {!this.state.PasswordValidation}
                    required
                  />
                  <FormFeedback>הסיסמאות לא זהות!</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='address'>כתובת</Label>
                  <Input
                    type='text'
                    name='address'
                    id='address'
                    placeholder='*'
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.address}
                    invalid= {!this.state.addressValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
              </div>
              <div className='UploadImage'>
                <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                {$imagePreview}
              </div>
              <div className="PlansAlert">בחירת מסלול (יש לבחור מסלול אחד)</div>
              <div className="Plans">
                <div className="PlanCard">
                  <div className="PlanCardHeader">
                    <div className="Card1Image">
                       <img
                        alt=""
                        src={require('../Resources/plan1.png')}
                        className='PlanHeaderVegetableImage'
                       />
                      <Label check for='Checkplan1'>
                        <CustomInput 
                        type="radio"
                        name='Checkplan'
                        id='Checkplan1'
                        value='Checkplan1'
                        className='mb-3'
                        checked={this.state.plan1}
                        onChange={this.onChange} />
                      </Label> 
                      <span className='PlanTitle' >מגדל עצמאי</span>
                    </div>
                  </div>
                  <div className="PlanCardBody">
                    <div className="CardDetails">
                      <span className="GrowerCardDetailsHeader">במסלול זה אין התערבות של החקלאי<br /> המסלול כולל:</span>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>שטח של {HamamadefaultsizeContainer} מ"ר</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>מים</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="PlanCard">
                  <div className="PlanCardHeader">
                    <div className="Card2Image">
                       <img
                        alt=""
                        src={require('../Resources/plan2.png')}
                        className='PlanHeaderVegetableImage'
                       />
                      <Label check for='Checkplan2'>
                        <CustomInput 
                        type="radio"
                        name='Checkplan'
                        id='Checkplan2'
                        className='mb-3'
                        value='Checkplan2'
                        checked={this.state.plan2}
                        onChange={this.onChange} />
                      </Label> 
                      <span className='PlanTitle' >ביניים</span>
                    </div>
                  </div>
                  <div className="PlanCardBody">
                    <div className="CardDetails">
                      <span className="GrowerCardDetailsHeader">במסלול זה יש התערבות חלקית של החקלאי<br /> המסלול כולל:</span>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>ייעוץ אישי</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>שטח של {HamamadefaultsizeContainer} מ"ר</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>מים</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>דישון</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="PlanCard">
                  <div className="PlanCardHeader">
                    <div className="Card3Image">
                       <img
                        alt=""
                        src={require('../Resources/plan3.png')}
                        className='PlanHeaderVegetableImage'
                       />
                      <Label check for='Checkplan3'>
                        <CustomInput 
                        type="radio"
                        name='Checkplan'
                        id='Checkplan3'
                        value='Checkplan3'
                        checked={this.state.plan3}
                        className='mb-3'
                        onChange={this.onChange} />
                      </Label> 
                      <span className='PlanTitle' >ליווי שוטף</span>
                    </div>
                  </div>
                  <div className="PlanCardBody">
                    <div className="CardDetails" >
                      <span className="GrowerCardDetailsHeader">במסלול זה יש התערבות מלאה של החקלאי<br /> המסלול כולל:</span>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>ייעוץ אישי</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>שטח של {HamamadefaultsizeContainer} מ"ר</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>מים</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>דישון</span>
                      </div>
                      <div className='PlanIncludeSection'>
                        <span className='PlanVegetableImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                        <span className='PlanVegetableImageText'>טיפול מלא בחלקה</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.state.PlanValidation ? <div className='GrowerRegisterPlanAlert'><Alert color='danger'>יש לבחור מסלול</Alert></div> : null}
              <div className="Growersizearea">
                <div className="form-group">
                  <Label for='sizearea'>אזור השטח לגידול</Label>
                  <Input type="select" name="sizearea" id="sizearea" className='SizeArea mb-3' onChange={this.onChange} value={this.state.sizearea}>
                    <option value="מרכז">{Language.FarmerLocationOption1}</option>
                    <option value="צפון">{Language.FarmerLocationOption2}</option>
                    <option value="דרום">{Language.FarmerLocationOption3}</option>
                  </Input>
                </div>
              </div>
              {this.state.ChooseFarmerValidation ? <div className='GrowerRegisterPlanAlert'><Alert color='danger'>יש לבחור חקלאי</Alert></div> : null}
              { this.state.ActivePlan !== '' ? <div className='FarmerListContent'><ChooseFarmer SizeAreaParam={this.state.sizearea} PlanParam={this.state.ActivePlan}/></div> : null}
              <div className='ApproveRegulations'>
                <div  className='RegulationsCheckBox'>
                  <Label check for='CheckRegulations'>
                  <CustomInput 
                    type="checkbox"
                    name='CheckRegulations'
                    id='CheckRegulations'
                    className='mb-3'
                    onChange={this.onChange}
                    defaultChecked={this.state.Regulations}
                    invalid= {!this.state.RegulationsValidation} />
                  </Label> 
                </div>
                  <div  className='RegulationsLink'>
                    <span>קראתי את </span>
                    <a href="/" target="_blank" rel="noopener noreferrer" >התקנון</a>
                    <span> ואני מסכים לכל תנאיו</span>
                </div>
              </div>
              {this.state.ScreenNumber === "1" ? (
              <div className='MoveToPaymentScreenButton'>
                <Button color="info" onClick={() => this.ChangeScreen("2")} type="button" >
                  המשך להזנת אמצעי תשלום
                </Button>
              </div>
              ) : null}
            </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "2" || this.state.ScreenNumber === "3" ? (
              <FormGroup>
                <div className='BankCollectPaymentContainer'>
                  <div className='BankCollectPayment'>
                    <span className='RecivePaymentHeader'>אמצעי תשלום</span>
                    <div className="payment-form-group">
                      <Label for='CreditCardfullname'></Label>
                      <Input
                        type='text'
                        name='CreditCardfullname'
                        id='CreditCardfullname'
                        placeholder='שם בעל הכרטיס'
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
                        placeholder='מספר כרטיס האשראי'
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
                          placeholder='תוקף'
                          onChange={this.onChange}>
                        </Input>
                        </div>
                        <div className="banknumber">
                          <Label for='CreditCardCVV'></Label>
                          <Input
                            type='text'
                            name='CreditCardCVV'
                            id='CreditCardCVV'
                            placeholder='CVV'
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
                        placeholder='מספר עוסק מורשה/ח.פ'
                        className='mb-3'
                        onChange={this.onChange}
                      />
                    </div>
                    {this.state.ScreenNumber === "2" ? (
                     <div className='MoveToSecondPaymentScreenButton'>
                       <Button color="info" onClick={() => this.ChangeScreen("3")} type="button" >
                         אישור
                       </Button>
                     </div>
                    ) : null}  
                  </div>
                </div>
              </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "3" ? (
              <div className='RegisterButtonContainer'>
                <Button className='RegisterButton' >
                  הירשם
                </Button>
              </div>
            ) : null}
            </Form>
            { this.state.ActivateLoader ? <Loader /> : null }
            <div className={HelpBtnClass}><a href="https://www.co-greenhouse.com/faq" target="_blank" rel="noopener noreferrer">{direction === 'rtl' ? <img alt="" src={require('../Resources/help.png')} /> : <img alt="" src={require('../Resources/help-english.png')} />}</a></div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  farmer: state.farmer,
  choosenfarmer: state.choosenfarmer,
  growervegbuyingbag: state.growervegbuyingbag,
  grower: state.grower,
  FarmerActiveFarms: state.FarmerActiveFarms,
  FarmersNumLoaded: state.FarmerActiveFarms.FarmersNumLoaded,
  UsersNumLoaded: state.FarmerActiveFarms.UsersNumLoaded,
  system: state.system,
  growerfieldcropsbuyingbag: state.growerfieldcropsbuyingbag,
  FieldCropsToBuy: state.growerfieldcropsbuyingbag.FieldCropsToBuy,
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { register, clearErrors, addFarmer, resetFarmersList, resetchoosenfarmer, getchoosenfarmer,
    resetactivefarms, getGrowerVegBag, ResetGrowerVegBag, addgrower, resetgrowerlist, updatefarmeractivefarms,
    updateuseractivefarms, getSystemData, getGrowerFieldCropBag, ResetGrowerFieldCropBag }
)(GrowerRegisterPage);