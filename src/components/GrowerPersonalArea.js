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
  Card
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader';
import { getfarmerbyemail } from '../actions/farmerAction';
import { updategrowerprofile, updategrowerbyemail, deactivategrowerplan, deactivateuserplan } from '../actions/updateUserAction';
import { Redirect } from "react-router-dom";
import { API_URL } from '../config/keys';

class GrowerPersonalArea extends Component {
  state = {
    modal: false,
    name:'',
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
    FarmerPhone:'',
    UserID: '',
    redirect: null,
    UserActive: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getfarmerbyemail: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    updategrowerprofile : PropTypes.func.isRequired,
    updateduser: PropTypes.object.isRequired,
    updategrowerbyemail: PropTypes.func.isRequired,
    deactivategrowerplan: PropTypes.func.isRequired,
    deactivateuserplan: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { user } = this.props.auth;

    if(user.workingwith[0].active){
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
        UserActive: user.workingwith[0].active
    })
  }

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      this.setState({
        ActivateLoader: false
      });
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // Update the farmer details
    if(typeof(this.props.farmer.farmers[0]) !== "undefined"){
        try{
            if(this.state.UserActive){
              var FarmerDetails = this.props.farmer.farmers[0];
              this.setState({
                FarmerFullNmae: FarmerDetails.name + " " + FarmerDetails.familyname,
                FarmerEmail: FarmerDetails.phone,
                FarmerPhone: FarmerDetails.email
              })
            }
        }catch(e){

        } 
    }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
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

  ResetValidation = (FieldToReset) => {

    switch(FieldToReset) {
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
    switch(e.target.name) {
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
  };

  onSubmit = e => {
    e.preventDefault();

    if(this.ValidateForm()){
    
      this.setState({
        ActivateLoader: !this.state.ActivateLoader,
        modal: !this.state.modal
      });

      if(this.state.imagename!==''){
        this.uploadFile();
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

    try{
        this.setState({
            ActivateLoader: !this.state.ActivateLoader,
            modal: !this.state.modal
          });
      
          const chossenfarmer = user.workingwith[0].email;
      
          let workingwith = [{email: user.workingwith[0].email, usertype: user.workingwith[0].usertype ,active: false, totalpayed: user.workingwith[0].totalpayed}];
      
      
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
        
    }catch(e){
        this.setState({
          ActivateLoader: false,
          modal: false
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
      const improvedname = uuidv4() + tempFile.name;
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
        })
        .catch(err => {
          console.log('err', err);
        });
    });
  };

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = (<img alt="" className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    const { user } = this.props.auth;
    try{
        var RegisterDate = new Date(user.workingwith[0].activation_date);
        var RegisterDateToStringFormat = RegisterDate.getDate() + "/"+ parseInt(RegisterDate.getMonth()+1) +"/"+RegisterDate.getFullYear();
        var ChoosenPersonalUserVeg = user.choosenvegetables;
        if(user.workingwith[0].active){
          var PlanName = user.plans[0].name;
        }
        else PlanName = 'ללקוח זה לא משוייך מסלול';
    }catch(e){
        var RegisterDateToStringFormat = '';
        var ChoosenPersonalUserVeg = user.choosenvegetables;
        var PlanName = '';
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
                    פרטים אישיים
                    </Button>
                    <Button outline color="success" onClick={() => this.ChangeScreen("2")} type="button" >
                    שינוי פרטים לתשלום חודשי
                    </Button>
                  </div>
                </div>
            ) : null}
            {this.state.ScreenNumber === "2" ? (
                <div className='GrowerPersonalAreaTabs'>
                  <div className='GrowerPersonalAreaTabsButtons'>
                    <Button outline color="success" onClick={() => this.ChangeScreen("1")} type="button" >
                    פרטים אישיים
                    </Button>
                    <Button color="success" type="button" disabled>
                    שינוי פרטים לתשלום חודשי
                    </Button>
                  </div>
                </div>
            ) : null}
            <Form onSubmit={this.onSubmit}>
            {this.state.ScreenNumber === "1" ? (
              <FormGroup>
              <div className='PersonalDetails'>
                <div className="personal-form-group">
                  <Label for='name'>שם פרטי:</Label>
                  <Input
                    type='text'
                    name='name'
                    id='name'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.name}
                    invalid= {!this.state.nameValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="personal-form-group">
                  <Label for='familyname'>שם משפחה:</Label>
                  <Input
                    type='text'
                    name='familyname'
                    id='familyname'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.familyname}
                    invalid= {!this.state.familynameValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="personal-form-group">
                  <Label for='phone'>טלפון:</Label>
                  <Input
                    type='text'
                    name='phone'
                    id='phone'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.phone}
                    invalid= {!this.state.phoneValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="personal-form-group">
                  <Label for='email'>אימייל (שם משתמש):</Label>
                  <Input
                    type='email'
                    name='email'
                    id='email'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.email}
                    invalid= {!this.state.emailValidation}
                    required
                    disabled
                  />
                  <FormFeedback>כתובת האימייל שגויה</FormFeedback>
                </div>
                <div className="personal-form-group">
                  <Label for='address'>כתובת:</Label>
                  <Input
                    type='text'
                    name='address'
                    id='address'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.address}
                    invalid= {!this.state.addressValidation}
                    required
                  />
                  <FormFeedback>שדה זה אינו יכול להישאר ריק</FormFeedback>
                </div>
                <div className="personal-form-group">
                  <Label>תאריך תחילת מנוי:</Label>
                  <div className="RegisterDate">{RegisterDateToStringFormat}</div>
                  <div className="CancelSubscription">
                    <Button color="danger" id="toggler" style={{ marginBottom: '1rem' }} type="button" disabled={!this.state.UserActive} >ביטול מנוי</Button>
                    <UncontrolledCollapse toggler="#toggler">
                      <Card>
                        <CardBody>
                          <span className="CancelSubscriptionAlertText">האם אתה בטוח שברצונך לבטל את המנוי?</span>
                          <span className="CancelSubscriptionAlertButtons">
                            <span><Button outline color="success" onClick={() => this.DeactivateAcount()} type="button" >אישור</Button></span>
                            <span><Button outline color="danger" id="toggler" style={{ marginBottom: '1rem' }} type="button" >ביטול</Button></span>
                          </span>
                        </CardBody>
                      </Card>
                    </UncontrolledCollapse>
                  </div>
                </div>
                <div className="personal-form-group">
                  <Label>מסלול שנבחר:</Label>
                  <div className="CurrentPlan">{PlanName}</div>
                </div>
                <div className="personal-form-group">
                  <Label>גידולים שנבחרו:</Label>
                  <div className="PersonalChoosenVeg">
                    {ChoosenPersonalUserVeg.map(function(item, key) {
                      return (
                        <div className='PersonalChoosenVegItem'  key={key}>
                          <span className='PersonalChoosenVegItemImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className='PersonalChoosenVegItemName'>{item.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="personal-form-group">
                  <Label>החקלאי שנבחר:</Label>
                  <div className="PersonalChoosenFarmer">
                    <span><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.state.FarmerFullNmae}</span>
                    <span><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.state.FarmerPhone}</span>
                    <span><img alt="" src={require('../Resources/mail.png')} size='sm' />{this.state.FarmerEmail}</span>
                  </div>
                </div>
              </div>
              <div className='UploadImage'>
                <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                {$imagePreview}
              </div>
            </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "2" ? (
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
                  </div>
                </div>
              </FormGroup>
            ) : null}

            <div className='RegisterButtonContainer'>
              <Button color="success" className='UpdateDetails' >
                עדכון
              </Button>
            </div>
              
            </Form>
            { this.state.ActivateLoader ? <Loader /> : null }
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
  updateduser: state.updateduser
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getfarmerbyemail, updategrowerprofile, updategrowerbyemail, deactivategrowerplan, deactivateuserplan }
)(GrowerPersonalArea);