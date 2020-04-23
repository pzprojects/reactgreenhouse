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
import { getChoosenVegetables,addChoosenVegetable } from '../actions/choosenVegetablesAction';
import { updatefarmerprofile, updatefarmerbyemail } from '../actions/updateUserAction';
import { addFarmer } from '../actions/farmerAction';
import ListOfGrowers from '../components/ListOfGrowers';
import { Redirect } from "react-router-dom";
import { API_URL } from '../config/keys';
import { getSystemData } from '../actions/systemAction';


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
    VegtButtonOn: true,
    AddBackgroundClassToVeg: 'vegetables',
    cost1 : '200',
    plan1 : false,
    cost2 : '300',
    plan2 : false,
    cost3 : '400',
    plan3 : false,
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
    UserID: '',
    TotalNumberOfHamamot: '0',
    DefaultNumberOfHamamot: '0',
    CurrentActiveFarms: '',
    redirect: null,
    SystemDefaulNumberOfHamamot: '16',
    SuccessFileUpload: false
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
    addFarmer: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    updatefarmerprofile : PropTypes.func.isRequired,
    updateduser: PropTypes.object.isRequired,
    updatefarmerbyemail: PropTypes.func.isRequired,
    getSystemData: PropTypes.func.isRequired,
    system: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getChoosenVegetables();
    this.props.getSystemData();

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
        TotalNumberOfHamamot: (parseFloat(user.hamamasize)/16).toString(),
        DefaultNumberOfHamamot: (parseFloat(user.hamamasize)/16).toString(),
        CurrentActiveFarms: user.numberofactivefarms
    })

    for(var i=0; i < user.choosenvegetables.length; i++){
      this.props.addChoosenVegetable(user.choosenvegetables[i]);
    }
  }

  componentDidUpdate(prevProps) {
    const { system, error, isAuthenticated } = this.props;
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
    
    if (system !== prevProps.system) {
      try{
        const { SystemData } = this.props.system;
        this.setState({
          SystemDefaulNumberOfHamamot: SystemData.hamamadefaultsize,
          TotalNumberOfHamamot: (parseFloat(this.state.hamamasize)/parseFloat(SystemData.hamamadefaultsize)).toString(),
          DefaultNumberOfHamamot: (parseFloat(this.state.hamamasize)/parseFloat(SystemData.hamamadefaultsize)).toString()
        });
      }
      catch{}
    }

    // If authenticated, close modal
    if (this.state.modal) {
        if (isAuthenticated && this.state.SuccessFileUpload) {
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
    let numberofactivefarms = (parseFloat(this.state.hamamasize)/parseFloat(this.state.SystemDefaulNumberOfHamamot)).toString();

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

    if(this.state.hamamasize === '' || (numberofactivefarms%1) !== 0){
      this.setState({
        hamamasizeValidation: false
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
    switch(e.target.name) {
      case "name":
        if(this.state.nameValidation === false){
          this.ResetValidation("name")
        }
        break;
      case "familyname":
        if(this.state.familynameValidation === false){
          this.ResetValidation("familyname")
        }
        break;
      case "email":
        if(this.state.emailValidation === false){
          this.ResetValidation("email")
        }
        break;
      case "phone":
        if(this.state.phoneValidation === false){
          this.ResetValidation("phone")
        }
        break;
      case "hamamasize":
        if(this.state.hamamasizeValidation === false){
          this.ResetValidation("hamamasize")
        }
        this.setState({
          TotalNumberOfHamamot: (parseFloat(e.target.value)/parseFloat(this.state.SystemDefaulNumberOfHamamot)).toString()
        })
        break;
      default:
    }

    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    if(this.ValidateForm()){

      const choosenvegetables = this.props.choosenvegetable.ChoosenVegetables;
      let HelkotToAdd = parseFloat(this.state.TotalNumberOfHamamot) - parseFloat(this.state.DefaultNumberOfHamamot);
      let numberofactivefarms = (parseFloat(this.state.CurrentActiveFarms) + HelkotToAdd).toString();
    
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
        choosenvegetables
      };

      const newFarmer = {
        name,
        familyname,
        phone,
        hamamasize,
        numberofactivefarms,
        aboutme,
        imageurl,
        choosenvegetables
      };

      // Attempt to save data
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

  OpenListOfvegetables = e => {
    e.preventDefault();
    
    let ChoosenClass = this.state.AddBackgroundClassToVeg;

    if(ChoosenClass === 'vegetablesOpen'){
      ChoosenClass = 'vegetables';
    }
    else ChoosenClass = 'vegetablesOpen';

    this.setState({
      VegtButtonOn: !this.state.VegtButtonOn,
      AddBackgroundClassToVeg: ChoosenClass
    });

  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload.png')} onClick={this.OpenFileExplorer}/>);
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="" className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    }
    const { user } = this.props.auth;
    try{
      var PersonalUserPlans = user.plans;
    }catch(e){
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
                  <Label for='hamamasize'>גודל שטח החממה:</Label>
                  <Input
                    type='text'
                    name='hamamasize'
                    id='hamamasize'
                    placeholder=''
                    className='mb-3'
                    onChange={this.onChange}
                    value={this.state.hamamasize}
                    invalid= {!this.state.hamamasizeValidation}
                    required
                  />
                  <FormText>* יש להזין את גודל השטח בכפולות של {this.state.SystemDefaulNumberOfHamamot} מ"ר</FormText>
                  <FormFeedback>שדה זה אינו יכול להישאר ריק או לא להיות בכפולות שצוינו</FormFeedback>
                </div>
                <div className="form-group">
                  <Label for='TotalNumberOfHamamot'>מספר חלקות:</Label>
                  <Input
                    type='text'
                    name='TotalNumberOfHamamot'
                    id='TotalNumberOfHamamot'
                    placeholder=''
                    className='mb-3'
                    value={this.state.TotalNumberOfHamamot}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <Label for='aboutme'>על עצמי:</Label>
                  <Input type="textarea" name="aboutme" id="aboutme" className='AboutMe mb-3' onChange={this.onChange} value={this.state.aboutme}/>
                  <FormText>* טקסט זה יופיע כאשר הלקוח יבחר חקלאי</FormText>
                </div>
              </div>
              <div className='UploadImage'>
                <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                {$imagePreview}
              </div>
              {this.state.email !== '' ? <div className='MyGrowersList'><ListOfGrowers FarmerEmail={this.state.email} /></div> : null}
              <div className={this.state.AddBackgroundClassToVeg}>
                <h3>יש לי את התנאים והניסיון לגדל:</h3>
                { this.state.VegtButtonOn ? 
                <Button color="success" onClick={this.OpenListOfvegetables}>רשימת ירקות לגידול</Button> : null }
                { this.state.VegtButtonOn ? null : <Vegetables OpenListOfvegetables={this.OpenListOfvegetables} /> }
              </div>
              <div className="ListOfVegCost">
                <p>המחירים הינם מומלצים ע"י החנות של Co-Greenhouse וניתנים לשינוי</p>
                <VegetablesPricing />
              </div>
              <div className="farmer-personal-form-group">
                <div className="PersonalFarmerPlansContainer">
                  <div className="PersonalFarmerPlansHeader">מחירי מסלולים</div>
                  <div className="PersonalFarmerPlans">
                    {PersonalUserPlans.map(function(item, key) {
                      return (
                        <div className='PersonalChoosenPlanItem'  key={key}>
                          <div className='PersonalChoosenPlanItemName'>
                            <span className='PersonalChoosenPlanItemImage'><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                            <span className='PersonalChoosenPlanItemTitle'>{item.name}</span>
                            <span className='PersonalChoosenPlanItemCost'> ₪ {item.cost}</span>
                            <span className='PersonalChoosenPlanItemText1'>לחודש</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "2" ? (
              <FormGroup>
                <div className='BankCollectPaymentContainer'>
                  <div className='BankCollectPayment'>
                    <span className='RecivePaymentHeader'>חשבון בנק לקבלת תשלום</span>
                    <div className="payment-form-group">
                      <Label for='fullname'></Label>
                      <Input
                        type='text'
                        name='fullname'
                        id='fullname'
                        placeholder='שם בעל החשבון'
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
                        placeholder='מספר חשבון הבנק'
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
                            <option>בחר בנק</option>
                            <option>בנק אגוד</option>
                            <option>בנק אוצר החייל</option>
                            <option>בנק דיסקונט</option>
                            <option>בנק הפועלים</option>
                            <option>בנק לאומי</option>
                            <option>בנק מזרחי</option>
                            <option>הבנק הבינלאומי</option>
                        </Input>
                        </div>
                        <div className="banknumber">
                          <Label for='banknumber'></Label>
                          <Input
                            type='text'
                            name='banknumber'
                            id='banknumber'
                            placeholder='שם בעל החשבון'
                            className='mb-3'
                            onChange={this.onChange}
                            value={this.state.banknumber}
                          />
                        </div>
                    </div>
                   </div>                 
                  </div>
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
  choosenvegetable: state.choosenvegetable,
  farmer: state.farmer,
  updateduser: state.updateduser,
  system: state.system
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getChoosenVegetables, addChoosenVegetable, addFarmer, updatefarmerprofile, updatefarmerbyemail, getSystemData}
)(FarmerPersonalArea);