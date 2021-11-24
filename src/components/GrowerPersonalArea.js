import React, { Component } from 'react';
import { Link } from "react-router-dom"
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
  Card
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader';
import { getfarmerbyemail, resetFarmersList } from '../actions/farmerAction';
import { updategrowerprofile, updategrowerbyemail, deactivategrowerplan, deactivateuserplan, growerDeactivationSuccess, userDeactivationSuccess, resetUpdateUser } from '../actions/updateUserAction';
import { getvegetablelanguages } from '../actions/vegLanguageConvertorAction';
import { Redirect } from "react-router-dom";
import { API_URL } from '../config/keys';
import { FiEdit } from "react-icons/fi";

class GrowerPersonalArea extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    familyname: '',
    phone: '',
    msg: null,
    profileimg: '',
    file: '',
    imageurl: '',
    imagePreviewUrl: '',
    imagename: '',
    usertype: 'מגדל',
    ActivateLoader: false,
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
    addressValidation: true,
    address: '',
    ActivePlan: '',
    RegisterDate: '',
    FarmerFullNmae: '',
    FarmerEmail: '',
    FarmerPhone: '',
    FarmerLocation: '',
    UserID: '',
    redirect: null,
    UserActive: false,
    SuccessFileUpload: false,
    FieldCropPlanActive: false,
    DeactivateRequest: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getfarmerbyemail: PropTypes.func.isRequired,
    resetFarmersList: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    updategrowerprofile: PropTypes.func.isRequired,
    updateduser: PropTypes.object.isRequired,
    updategrowerbyemail: PropTypes.func.isRequired,
    deactivategrowerplan: PropTypes.func.isRequired,
    deactivateuserplan: PropTypes.func.isRequired,
    growerDeactivationSuccess: PropTypes.func.isRequired,
    userDeactivationSuccess: PropTypes.func.isRequired,
    resetUpdateUser: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired,
    languagedbconversion: PropTypes.object.isRequired,
    getvegetablelanguages: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getvegetablelanguages();
    const { user } = this.props.auth;

    if (user.workingwith[0].active) {
      this.props.getfarmerbyemail(user.workingwith[0].email);
    }

    this.setState({
      name: user.name,
      email: user.email,
      familyname: user.familyname,
      phone: user.phone,
      address: user.address,
      imageurl: user.imageurl,
      imagePreviewUrl: user.imageurl,
      UserID: user._id,
      UserActive: user.workingwith[0].active,
      FieldCropPlanActive: user.fieldcropplan.avaliabile
    })
  }

  componentDidUpdate(prevProps) {
    const { farmers, error, isAuthenticated, growerdeactivate, userdeactivate } = this.props;
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

    if (farmers !== prevProps.farmers) {
      // Update the farmer details
      if (typeof (this.props.farmer.farmers[0]) !== "undefined") {
        try {
          if (this.state.UserActive) {
            var FarmerDetails = this.props.farmer.farmers[0];
            this.setState({
              FarmerFullNmae: FarmerDetails.name + " " + FarmerDetails.familyname,
              FarmerEmail: FarmerDetails.email,
              FarmerPhone: FarmerDetails.phone,
              FarmerLocation: FarmerDetails.address
            })
          }
        } catch (e) {

        }
      }
    }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated && this.state.SuccessFileUpload) {
        this.toggle();
      }
    }

    // If Deactivated, close modal
    if (this.state.modal && this.state.DeactivateRequest) {
      if (isAuthenticated && growerdeactivate && userdeactivate) {
        this.toggle();
      }
    }
  }

  componentWillUnmount() {
    this.props.resetUpdateUser();
    this.props.resetFarmersList();
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.props.resetUpdateUser();
    if(this.state.DeactivateRequest){
      this.setState({
        modal: !this.state.modal,
        DeactivateRequest: !this.state.DeactivateRequest,
        ActivateLoader: !this.state.ActivateLoader,
        redirect: '/GrowerDeactivateMsg'
      });
    }
    else{
      this.setState({
        modal: !this.state.modal,
        DeactivateRequest: !this.state.DeactivateRequest,
        ActivateLoader: !this.state.ActivateLoader,
        redirect: '/DeatilsUpdatedMSG'
      });
    }
    
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

  ValidateEmail = (mail) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  ValidateForm = () => {

    var Validated = true;
    var ScrollToLocation = "top";
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

    if (this.state.address === '') {
      this.setState({
        addressValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
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
      case "address":
        // Regulations
        this.setState({
          addressValidation: true
        });
        break;
      default:
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });

    // validations
    switch (e.target.name) {
      case "name":
        // password strength validation
        if (this.state.nameValidation === false) {
          this.ResetValidation("name")
        }
        break;
      case "familyname":
        // password strength validation
        if (this.state.familynameValidation === false) {
          this.ResetValidation("familyname")
        }
        break;
      case "email":
        // password strength validation
        if (this.state.emailValidation === false) {
          this.ResetValidation("email")
        }
        break;
      case "phone":
        // password strength validation
        if (this.state.phoneValidation === false) {
          this.ResetValidation("phone")
        }
        break;
      case "address":
        // password strength validation
        if (this.state.addressValidation === false) {
          this.ResetValidation("address")
        }
        break;
      default:
    }
  };

  onSubmit = e => {
    e.preventDefault();

    if (this.ValidateForm()) {

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


      const { name, familyname, phone, address, imageurl } = this.state;

      // Create user object
      const newUser = {
        name,
        familyname,
        phone,
        address,
        imageurl
      };

      const newGrower = {
        name,
        familyname,
        phone,
        address,
        imageurl
      };

      // Attempt to register
      this.props.updategrowerbyemail(this.state.email, newGrower);
      this.props.updategrowerprofile(this.state.UserID, newUser);

    }
  };

  DeactivateAcount = () => {
    const { user } = this.props.auth;

    try {
      this.setState({
        ActivateLoader: !this.state.ActivateLoader,
        modal: !this.state.modal,
        DeactivateRequest: !this.state.DeactivateRequest
      });

      const chossenfarmer = user.workingwith[0].email;

      //let workingwith = [{email: user.workingwith[0].email, usertype: user.workingwith[0].usertype ,active: false, totalpayed: user.workingwith[0].totalpayed}];
      let workingwith = user.workingwith;
      workingwith[0].active = false;


      // Create user object
      const newUser = {
        workingwith
      };

      const newGrower = {
        chossenfarmer
      };

      // Attempt to deactivate
      this.props.deactivategrowerplan(this.state.email, newGrower);
      this.props.deactivateuserplan(this.state.UserID, newUser);

    } catch (e) {
      this.setState({
        ActivateLoader: false,
        modal: false,
        DeactivateRequest: false
      });
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
    let { imagePreviewUrl } = this.state;
    let $imagePreview;
    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    let ReverseTextAlignClass = "Co-Text-Align-Left";
    let UpdateMyuserName = "UpdateMyuserNameRTL";
    if (direction === 'rtl') {
      $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload.png')} onClick={this.OpenFileExplorer} />);
      FloatClass = "Co-Align-Right";
      TextAlignClass = "Co-Text-Align-Right";
      ReverseTextAlignClass = "Co-Text-Align-Left";
      UpdateMyuserName = "UpdateMyuserNameRTL";
    }
    else {
      $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload-English.png')} onClick={this.OpenFileExplorer} />);
      FloatClass = "Co-Align-Left";
      TextAlignClass = "Co-Text-Align-Left";
      ReverseTextAlignClass = "Co-Text-Align-Right";
      UpdateMyuserName = "UpdateMyuserNameLTR";
    }
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="" className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    }
    const { user } = this.props.auth;
    try {
      var RegisterDate = new Date(user.workingwith[0].activation_date);
      var RegisterDateToStringFormat = RegisterDate.getDate() + "/" + parseInt(RegisterDate.getMonth() + 1) + "/" + RegisterDate.getFullYear();
      var ChoosenPersonalUserVeg = user.choosenvegetables;
      var ChoosenPersonalUserFieldCrops = user.choosenfieldcrops;
      if (user.workingwith[0].active) {
        var PlanName = user.plans[0].name;
      }
      else PlanName = 'ללקוח זה לא משוייך מסלול';
    } catch (e) {
      RegisterDateToStringFormat = '';
      ChoosenPersonalUserVeg = user.choosenvegetables;
      ChoosenPersonalUserFieldCrops = user.choosenfieldcrops;
      PlanName = '';
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
                <Button tag={Link} to='/GrowerPersonalShop' outline color="success" type="button" disabled={!this.state.UserActive} >
                  {Language.GrowerPurchaseInShop}
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
                <Button tag={Link} to='/GrowerPersonalShop' outline color="success" type="button" disabled={!this.state.UserActive} >
                  {Language.GrowerPurchaseInShop}
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
                  <div className="personal-form-group">
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
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmptyField}</FormFeedback>
                  </div>
                  <div className="personal-form-group">
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
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmptyField}</FormFeedback>
                  </div>
                  <div className="personal-form-group">
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
                    <FormFeedback className={ReverseTextAlignClass}>{Language.PhoneNumberError}</FormFeedback>
                  </div>
                  <div className="personal-form-group">
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
                    <div className={UpdateMyuserName}><Link to="/UpdateGrowerEmail" className="ghost-btn"><FiEdit /></Link></div>
                  </div>
                  <div className="personal-form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='address'>{Language.Address}:</Label>
                    <Input
                      type='text'
                      name='address'
                      id='address'
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.address}
                      invalid={!this.state.addressValidation}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmptyField}</FormFeedback>
                  </div>
                  <div className="personal-form-group">
                    <Label className={FloatClass + " " + TextAlignClass}>{Language.GrowerPersonalAreaChoosenPlan}:</Label>
                    {this.state.UserActive ? <div className={'CurrentPlan ' + FloatClass + " " + TextAlignClass}>{this.ReturnPlanInChoosenLanguage(PlanName)}{this.state.FieldCropPlanActive ? Language.GrowerListFieldCropsExtra : null}</div>
                    : <div className={'CurrentPlan ' + FloatClass + " " + TextAlignClass}>{Language.NonActivePlan}</div>}
                  </div>
                  <div className="personal-form-group">
                    <Label className={FloatClass + " " + TextAlignClass}>{Language.GrowerPersonalAreaChoosenVeg}:</Label>
                    <div className={'PersonalChoosenVeg ' + FloatClass + " " + TextAlignClass}>
                      {ChoosenPersonalUserVeg.map(({ _id, name }, index) => (
                        <div className={'PersonalChoosenVegItem ' + TextAlignClass} key={_id + index}>
                          <span className={'PersonalChoosenVegItemImage ' + FloatClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PersonalChoosenVegItemName ' + FloatClass}>{this.Translate(name)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {this.state.FieldCropPlanActive ?
                    <div className="personal-form-group">
                      <Label className={FloatClass + " " + TextAlignClass}>{Language.GrowerPersonalAreaChoosenFieldCrops}:</Label>
                      <div className={'PersonalChoosenVeg ' + FloatClass + " " + TextAlignClass}>
                        {ChoosenPersonalUserFieldCrops.map(({ _id, name }, index) => (
                          <div className={'PersonalChoosenVegItem ' + TextAlignClass} key={_id + index}>
                            <span className={'PersonalChoosenVegItemImage ' + FloatClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                            <span className={'PersonalChoosenVegItemName ' + FloatClass}>{this.Translate(name)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    : null}
                  <div className="personal-form-group">
                    <Label className={FloatClass + " " + TextAlignClass}>{Language.GrowerPersonalAreaChoosenFarmer}:</Label>
                    <div className={'PersonalChoosenFarmer ' + FloatClass + " " + TextAlignClass}>
                      <span><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.state.FarmerFullNmae}</span>
                      <span><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.state.FarmerPhone}</span>
                      <span><img alt="" src={require('../Resources/mail.png')} size='sm' /><a href={"mailto:" + this.state.FarmerEmail}>{this.state.FarmerEmail}</a></span>
                      <span><img alt="" src={require('../Resources/location.png')} size='sm' />{this.state.FarmerLocation}</span>
                    </div>
                  </div>
                  <div className="personal-form-group">
                    <Label className={FloatClass + " " + TextAlignClass}>{Language.GrowerPersonalAreaSubscriptionActivationDate}:</Label>
                    <div className={'RegisterDate ' + FloatClass + " " + TextAlignClass}>{RegisterDateToStringFormat}</div>
                    <div className={'CancelSubscription ' + FloatClass}>
                      <Button color="danger" id="toggler" style={{ marginBottom: '1rem' }} type="button" disabled={!this.state.UserActive} >{Language.GrowerPersonalAreaCancelSubButton}</Button>
                      <UncontrolledCollapse toggler="#toggler">
                        <Card>
                          <CardBody>
                            <span className="CancelSubscriptionAlertText">{Language.GrowerPersonalAreaCancelSubButtonAreUSure}</span>
                            <span className="CancelSubscriptionAlertButtons">
                              <span><Button outline color="success" onClick={() => this.DeactivateAcount()} type="button" >{Language.Yes}</Button></span>
                              <span><Button outline color="danger" id="toggler" style={{ marginBottom: '1rem' }} type="button" >{Language.No}</Button></span>
                            </span>
                          </CardBody>
                        </Card>
                      </UncontrolledCollapse>
                    </div>
                  </div>
                </div>
                <div className={'UploadImage ' + FloatClass}>
                  <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                  {$imagePreview}
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
  farmer: state.farmer,
  farmers: state.farmer.farmers,
  updateduser: state.updateduser,
  growerdeactivate: state.updateduser.growerdeactivate,
  userdeactivate: state.updateduser.userdeactivate,
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
    register, clearErrors, getfarmerbyemail, resetFarmersList, updategrowerprofile, updategrowerbyemail, deactivategrowerplan, deactivateuserplan,
    growerDeactivationSuccess, userDeactivationSuccess, resetUpdateUser, getvegetablelanguages
  }
)(GrowerPersonalArea);