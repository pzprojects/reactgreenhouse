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
  FormText,
  Spinner
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader';
import Vegetables from '../components/Vegetables';
import FieldCrops from '../components/FieldCrops';
import VegetablesPricing from '../components/VegetablesPricing';
import FarmCropsPricing from '../components/FarmCropsPricing';
import { getChoosenVegetables, resetChoosenVegetables } from '../actions/choosenVegetablesAction';
import { getChoosenfieldCrops, resetChoosenfieldCrop } from '../actions/choosenFieldCropsAction';
import { addFarmer, resetFarmersList } from '../actions/farmerAction';
import { API_URL } from '../config/keys';
import { getSystemData } from '../actions/systemAction';


class RegisterPage extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    password: '',
    passwordconfirmation: '',
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
    FieldCropsButtonOn: true,
    AddBackgroundClassToVeg: 'vegetables',
    cost1: '',
    plan1: false,
    Checkplan1: '',
    cost2: '',
    plan2: false,
    Checkplan2: '',
    cost3: '',
    plan3: false,
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
    VegPricingValidation: false,
    FarmerPlanValidation: false,
    FarmerPlanCostValidation: false,
    address: '',
    SuccessFileUpload: false,
    fieldcropplancost: '',
    CheckFieldCropsPlan: '',
    FieldCropStatus: false,
    fieldcropplancostValidation: false,
    fieldcropplanShouldBeActive: false,
    Checkplan1Img: false,
    Checkplan2Img: false,
    Checkplan3Img: false,
    EmptyVegActive: false,
    SmallLoaderActivated: false,
    fullnameValidation: true,
    accountnumberValidation: true,
    banknameValidation: true,
    banknumberValidation: true,
    CountdownTime: "10"
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getChoosenVegetables: PropTypes.func.isRequired,
    choosenvegetable: PropTypes.object.isRequired,
    getChoosenfieldCrops: PropTypes.func.isRequired,
    choosenfieldcrop: PropTypes.object.isRequired,
    addFarmer: PropTypes.func.isRequired,
    farmer: PropTypes.object.isRequired,
    system: PropTypes.object.isRequired,
    getSystemData: PropTypes.func.isRequired,
    resetChoosenVegetables: PropTypes.func.isRequired,
    resetChoosenfieldCrop: PropTypes.func.isRequired,
    resetFarmersList: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getChoosenVegetables();
    this.props.getChoosenfieldCrops();
    this.props.getSystemData();
  }

  componentWillUnmount() {
    this.props.resetFarmersList();
    this.props.resetChoosenVegetables();
    this.props.resetChoosenfieldCrop();
  }

  componentDidUpdate(prevProps) {
    const { SystemData, error, isAuthenticated } = this.props;
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

    // retrive system data
    try {
      if (SystemData !== prevProps.SystemData) {
        this.setState({
          cost1: SystemData.plan1cost,
          cost2: SystemData.plan2cost,
          cost3: SystemData.plan3cost,
          fieldcropplancost: SystemData.fieldcropplancost
        });
      }
    }
    catch { }

    // If authenticated, close modal
    if (this.state.modal) {
      if (isAuthenticated && this.state.SuccessFileUpload) {
        this.toggle();
      }
    }

    // If modal closed and authenticated, go to homepage
    if (!this.state.modal) {
      if (isAuthenticated) {
        this.props.history.push('/');
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.resetChoosenVegetables();
    this.props.resetChoosenfieldCrop();
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
    this.setState({
      ActivateLoader: !this.state.ActivateLoader
    });
    this.props.history.push('/FarmersubmissionMSG');
  };

  ValidateEmail = (mail) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
  }

  ValidateForm = () => {

    const { SystemData } = this.props.system;
    const { ChoosenFieldCrops } = this.props.choosenfieldcrop;
    var Validated = true;
    var ScrollToLocation = "top";
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var english = /^[A-Za-z0-9@!~#$%^&*_-]*$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    let numberofactivefarms = (parseFloat(this.state.hamamasize) / parseFloat(SystemData.hamamadefaultsize)).toString();
    const choosenvegetables = this.props.choosenvegetable.ChoosenVegetables;
    let FoundEmpty = false;

    // Regulations
    if (this.state.Regulations === false) {
      this.setState({
        RegulationsValidation: false
      });
      Validated = false;
      ScrollToLocation = "bottom";
    }

    // Passwords
    if (this.state.password !== this.state.passwordconfirmation) {
      this.setState({
        PasswordValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    if (this.state.password.length < 8 || !this.state.password.match(numbers) || !this.state.password.match(upperCaseLetters) || !this.state.password.match(lowerCaseLetters) || !english.test(this.state.password)) {
      this.setState({
        PasswordStrengthValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

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

    if (this.state.address === '') {
      this.setState({
        addressValidation: false
      });
      Validated = false;
      ScrollToLocation = "top";
    }

    // Validate veg pricing
    for (var i = 0; i < choosenvegetables.length; i++) {
      if (choosenvegetables[i].price === '') {
        FoundEmpty = true;
      }
    }
    for (var j = 0; j < ChoosenFieldCrops.length; j++) {
      if (ChoosenFieldCrops[j].price === '') {
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

    // Plans validation
    if (this.state.plan1 || this.state.plan2 || this.state.plan3) {
      this.setState({
        FarmerPlanValidation: false
      })
    }
    else {
      Validated = false;
      ScrollToLocation = "bottom";
      this.setState({
        FarmerPlanValidation: true
      })
    }

    // Plans cost validation
    if (this.state.cost1 === '' || this.state.cost2 === '' || this.state.cost3 === '') {
      if (this.state.cost1 === '' && this.state.plan1) {
        Validated = false;
        ScrollToLocation = "bottom";
        this.setState({
          FarmerPlanCostValidation: true
        })
      }

      if (this.state.cost2 === '' && this.state.plan2) {
        Validated = false;
        ScrollToLocation = "bottom";
        this.setState({
          FarmerPlanCostValidation: true
        })
      }

      if (this.state.cost3 === '' && this.state.plan3) {
        Validated = false;
        ScrollToLocation = "bottom";
        this.setState({
          FarmerPlanCostValidation: true
        })
      }
    }
    else {
      this.setState({
        FarmerPlanCostValidation: false
      })
    }

    // Check if there is atleast one vegtabile or one field Crop
    console.log(ChoosenFieldCrops.length + '  :  ' + this.state.FieldCropStatus)
    if (choosenvegetables.length === 0 || (ChoosenFieldCrops.length === 0 && this.state.FieldCropStatus)) {
      this.setState({
        EmptyVegActive: true
      });
      Validated = false;
      ScrollToLocation = "bottom";
    }
    else {
      this.setState({
        EmptyVegActive: false
      });
    }

    // Fields crops validation

    if (this.state.FieldCropStatus && this.state.fieldcropplancost === '') {
      Validated = false;
      ScrollToLocation = "bottom";
      this.setState({
        fieldcropplancostValidation: true
      })
    }

    if ((ChoosenFieldCrops.length > 0) && !this.state.FieldCropStatus) {
      Validated = false;
      ScrollToLocation = "bottom";
      this.setState({
        fieldcropplanShouldBeActive: true
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

  ValidatePayment = () => {

    var Validated = true;

    // Empty fields
    if (this.state.fullname === '') {
      this.setState({
        fullnameValidation: false
      });
      Validated = false;
    }

    if (this.state.accountnumber === '') {
      this.setState({
        accountnumberValidation: false
      });
      Validated = false;
    }

    if (this.state.bankname === '' || this.state.bankname === 'בנק') {
      this.setState({
        banknameValidation: false
      });
      Validated = false;
    }

    if (this.state.banknumber === '') {
      this.setState({
        banknumberValidation: false
      });
      Validated = false;
    }

    return Validated;
  };

  ChangeScreen = (ScreenNum) => {
    const { Language } = this.props;
    if (this.ValidateForm()) {
      switch (ScreenNum) {
        case "2":
          this.setState({
            SmallLoaderActivated: true
          });
          // Check if user exist
          axios
            .get(`${API_URL}/api/userexist/${this.state.email}`).then(res => {
              if (res.data.useravaliabile) {
                this.setState({
                  ScreenNumber: ScreenNum,
                  SmallLoaderActivated: false
                });
              } else {
                // User already exist
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                this.setState({
                  msg: Language.UserExistErrorMsg,
                  SmallLoaderActivated: false
                });
              }
            })
            .catch(err => {
              console.log("SERVER ERROR TO CLIENT:", err);
              // User already exist
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
              this.setState({
                msg: Language.UserExistErrorMsg,
                SmallLoaderActivated: false
              });
            });
          break;
        case "3":
          if (this.ValidatePayment()) {
            this.setState({
              ScreenNumber: ScreenNum,
              SmallLoaderActivated: false
            });
            this.CheckIfPaymentRecived();
          }
          break;
        default:
          this.setState({
            ScreenNumber: ScreenNum
          });
      }
    }
  };

  ValidatePassword = (password) => {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var english = /^[A-Za-z0-9@!~#$%^&*_-]*$/;
    if (password.length < 8 || !password.match(numbers) || !password.match(upperCaseLetters) || !password.match(lowerCaseLetters) || !english.test(password)) {
      if (password.length !== 0) {
        if (this.state.PasswordStrengthValidation) {
          this.setState({
            PasswordStrengthValidation: false
          });
        }
      }
      else {
        if (!this.state.PasswordStrengthValidation) {
          this.setState({
            PasswordStrengthValidation: true
          });
        }
      }
    }
    else {
      if (!this.state.PasswordStrengthValidation) {
        this.setState({
          PasswordStrengthValidation: true
        });
      }
    }
  };

  ResetValidation = (FieldToReset) => {

    switch (FieldToReset) {
      case "password":
        // password
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
      case "hamamasize":
        this.setState({
          hamamasizeValidation: true
        });
        break;
      case "address":
        this.setState({
          addressValidation: true
        });
        break;
      case "fullname":
        this.setState({
          fullnameValidation: true
        });
        break;
      case "accountnumber":
        this.setState({
          accountnumberValidation: true
        });
        break;
      case "bankname":
        this.setState({
          banknameValidation: true
        });
        break;
      case "banknumber":
        this.setState({
          banknumberValidation: true
        });
        break;
      default:
    }
  };

  OnImgClick = (ImageName) => {
    switch (ImageName) {
      case "Checkplan1Img":
        this.setState({
          plan1: !this.state.plan1,
          FarmerPlanValidation: false,
          Checkplan1Img: !this.state.Checkplan1Img
        });
        break;
      case "Checkplan2Img":
        this.setState({
          plan2: !this.state.plan2,
          FarmerPlanValidation: false,
          Checkplan2Img: !this.state.Checkplan2Img
        });
        break;
      case "Checkplan3Img":
        this.setState({
          plan3: !this.state.plan3,
          FarmerPlanValidation: false,
          Checkplan3Img: !this.state.Checkplan3Img
        });
        break;
      default:
    }
  }

  onChange = e => {
    // deal with checkbox
    switch (e.target.name) {
      case "Checkplan1":
        this.setState({
          plan1: e.target.checked,
          FarmerPlanValidation: false,
          EmptyVegActive: false
        });
        break;
      case "Checkplan2":
        this.setState({
          plan2: e.target.checked,
          FarmerPlanValidation: false,
          EmptyVegActive: false
        });
        break;
      case "Checkplan3":
        this.setState({
          plan3: e.target.checked,
          FarmerPlanValidation: false,
          EmptyVegActive: false
        });
        break;
      case "CheckFieldCropsPlan":
        this.setState({
          FieldCropStatus: e.target.checked,
          fieldcropplancostValidation: false,
          fieldcropplanShouldBeActive: false,
          EmptyVegActive: false
        });
        break;
      default:
    }

    // validations
    switch (e.target.name) {
      case "passwordconfirmation":
        // password validation
        if (this.state.PasswordValidation === false) {
          this.ResetValidation("password")
        }
        break;
      case "password":
        // password strength validation
        this.ValidatePassword(e.target.value);
        break;
      case "CheckRegulations":
        // Regulations validation
        if (e.target.checked === true) {
          this.ResetValidation("Regulations")
        }
        this.setState({
          Regulations: e.target.checked
        });
        break;
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
        break;
      case "address":
        if (this.state.addressValidation === false) {
          this.ResetValidation("address")
        }
        break;
      case "cost1":
        this.setState({
          FarmerPlanCostValidation: false
        })
        break;
      case "cost2":
        this.setState({
          FarmerPlanCostValidation: false
        })
        break;
      case "cost3":
        this.setState({
          FarmerPlanCostValidation: false
        })
        break;
      case "fullname":
        if (this.state.fullnameValidation === false) {
          this.ResetValidation("fullname")
        }
        break;
      case "accountnumber":
        if (this.state.accountnumberValidation === false) {
          this.ResetValidation("accountnumber")
        }
        break;
      case "bankname":
        if (this.state.banknameValidation === false) {
          this.ResetValidation("bankname")
        }
        break;
      case "banknumber":
        if (this.state.banknumberValidation === false) {
          this.ResetValidation("banknumber")
        }
        break;
      default:
    }

    this.setState({ [e.target.name]: e.target.value });
    this.setState({ msg: null });
  };

  onSubmit = () => {

    if (this.ValidateForm()) {

      const { SystemData } = this.props.system;
      const choosenvegetables = this.props.choosenvegetable.ChoosenVegetables;
      const choosenfieldcrops = this.props.choosenfieldcrop.ChoosenFieldCrops;
      let workingwith = [];
      let plans = [];
      let numberofactivefarms = (parseFloat(this.state.hamamasize) / parseFloat(SystemData.hamamadefaultsize)).toString();
      if (this.state.plan1) plans.push({ name: "מגדל עצמאי", cost: this.state.cost1 });
      if (this.state.plan2) plans.push({ name: "ביניים", cost: this.state.cost2 });
      if (this.state.plan3) plans.push({ name: "ליווי שוטף", cost: this.state.cost3 });
      const fieldcropplan = { avaliabile: this.state.FieldCropStatus, cost: this.state.fieldcropplancost }

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
        numberofactivefarms,
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

      const newFarmer = {
        name,
        familyname,
        phone,
        email,
        sizearea,
        hamamasize,
        numberofactivefarms,
        aboutme,
        imageurl,
        choosenvegetables,
        choosenfieldcrops,
        plans,
        address,
        fieldcropplan
      };

      // Attempt to register
      this.props.addFarmer(newFarmer);
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

  StartCountDown = () => {
    let CalcCountdownTime = parseInt(this.state.CountdownTime);
    let RefreshTimer = setInterval(() => {
      CalcCountdownTime = CalcCountdownTime - 1;
      if (CalcCountdownTime == 0) {
        clearInterval(RefreshTimer);
      } else {
        this.setState({
          CountdownTime: CalcCountdownTime.toString()
        });
      }
    }, 60000);
  }

  PaymentRecivedApiCall = () => {
    return new Promise((resolve, reject) => {
      const role = this.state.usertype;
      const email = this.state.email;
      axios
        .get(`${API_URL}/api/payments/${role}/${email}`).then(res => {
          // Get payments data
          const { SystemData } = this.props.system;
          if (res.data.length == 1) {
            if (res.data[0].sumpayed == SystemData.farmerplancost && res.data[0].recursum == SystemData.farmerplancost) {
              // Change To Final Screen
              this.ChangeScreen("4");
              this.SendAccDetailsToAccountent();
              this.onSubmit();
              resolve(true);
            } else {
              // Payment fraud
              this.props.history.push('/PaymentFraudMsg');
              resolve(true);
            }

          } else {
            // Payment fraud
            this.props.history.push('/PaymentFraudMsg');
            resolve(true);
          }
        })
        .catch(err => {
          console.log("SERVER ERROR TO CLIENT:", err);
          resolve(false);
        });
    });
  }

  CheckIfPaymentRecived = async () => {
    this.StartCountDown();
    let Result = false;
    let CalcCountdownTime = parseInt(this.state.CountdownTime);

    while (1 < CalcCountdownTime) {
      Result = await this.PaymentRecivedApiCall();
      if (Result) {
        break;
      }
      CalcCountdownTime = parseInt(this.state.CountdownTime);
    }

    if (!Result) {
      this.props.history.push('/TimoutMsg');
    }
  }

  SendAccDetailsToAccountent = () => {
    const { fullname, accountnumber, bankname, banknumber, email, phone } = this.state;
    const farmerfullname = this.state.name + ' ' + this.state.familyname;
    const newpaymentmethod = { fullname, accountnumber, bankname, banknumber, email, phone, farmerfullname };
    axios
      .post(`${API_URL}/api/sendpaymentdata`, newpaymentmethod).then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log("SERVER ERROR TO CLIENT:", err);
        this.props.history.push('/TimoutMsg');
      });
  }

  GenerateIframeUrl = () => {
    const { SystemData } = this.props.system;
    let IframeUrl = 'https://direct.tranzila.com/greenhouse/iframenew.php?currency=1&lang=il&recur_transaction=4_approved'
    IframeUrl += '&sum=' + SystemData.farmerplancost;
    IframeUrl += '&recur_sum=' + SystemData.farmerplancost;
    IframeUrl += '&company=' + 'GreenHouse';
    IframeUrl += '&pdesc=' + this.state.usertype;
    IframeUrl += '&email=' + this.state.email;
    IframeUrl += '&phone=' + this.state.phone;
    IframeUrl += '&contact=' + 'GreenHouse';

    return IframeUrl;
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

  render() {
    let ShowVegPricing = false;
    const { Language, direction } = this.props;
    let ShowFieldCropPricing = false;
    let { imagePreviewUrl } = this.state;
    let $imagePreview;
    let FloatClass = "Co-Align-Right";
    let TextAlignClass = "Co-Text-Align-Right";
    let ReverseTextAlignClass = "Co-Text-Align-Left";
    let HelpBtnClass = "HelpBtnRtl";
    if (direction === 'rtl') {
      $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload.png')} onClick={this.OpenFileExplorer} />);
      FloatClass = "Co-Align-Right";
      TextAlignClass = "Co-Text-Align-Right";
      ReverseTextAlignClass = "Co-Text-Align-Left";
      HelpBtnClass = "HelpBtnRtl";
    }
    else {
      $imagePreview = (<img alt="" className="ProfileImage" src={require('../Resources/Upload-English.png')} onClick={this.OpenFileExplorer} />);
      FloatClass = "Co-Align-Left";
      TextAlignClass = "Co-Text-Align-Left";
      ReverseTextAlignClass = "Co-Text-Align-Right";
      HelpBtnClass = "HelpBtnLtr";
    }
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="" className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    }
    try {
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
    }
    catch { }

    return (
      <div>
        <Container>
          {this.state.msg ? (
            <Alert color='danger'>{this.state.msg}</Alert>
          ) : null}
          {this.state.ScreenNumber === "1" && direction === "rtl" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step1-farmer.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "2" && direction === "rtl" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step2-farmer.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "3" && direction === "rtl" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step3-farmer.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "4" && direction === "rtl" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step4-farmer.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "1" && direction === "ltr" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step1-farmer-english.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "2" && direction === "ltr" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step2-farmer-english.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "3" && direction === "ltr" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step3-farmer-english.png')} />
            </div>
          ) :
            null
          }
          {this.state.ScreenNumber === "4" && direction === "ltr" ? (
            <div className='RegisterStatus'>
              <img alt="" src={require('../Resources/Step4-farmer-english.png')} />
            </div>
          ) :
            null
          }
          <Form>
            {this.state.ScreenNumber === "1" || this.state.ScreenNumber === "4" ? (
              <FormGroup>
                {this.state.ScreenNumber === "1" ? (
                  <div className={'ProfileName ' + FloatClass + " " + TextAlignClass}>
                    <h1>{Language.FarmerProfile}</h1>
                  </div>
                ) :
                  <div className={'ProfileName ' + FloatClass + " " + TextAlignClass}>
                    <h1>{Language.FarmerProfileNameFinalApprove}</h1>
                  </div>
                }
                <div className={'PersonalDetails ' + FloatClass}>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='name'>{Language.FirstName}</Label>
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
                    <Label className={FloatClass + " " + TextAlignClass} for='familyname'>{Language.LastName}</Label>
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
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='phone'>{Language.Phone}</Label>
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
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='email'>{Language.Email}</Label>
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
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.EmailValidationError}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='password'>{Language.Password}</Label>
                    <Input
                      type='password'
                      name='password'
                      id='password'
                      autoComplete="off"
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      invalid={!this.state.PasswordStrengthValidation}
                      onChange={this.onChange}
                      value={this.state.password}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.PasswordError}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='passwordconfirmation'>{Language.PasswordConfirmation}</Label>
                    <Input
                      type='password'
                      name='passwordconfirmation'
                      id='passwordconfirmation'
                      autoComplete="off"
                      placeholder='*'
                      className={'mb-3 ' + FloatClass + " " + TextAlignClass}
                      onChange={this.onChange}
                      value={this.state.passwordconfirmation}
                      invalid={!this.state.PasswordValidation}
                      required
                    />
                    <FormFeedback className={ReverseTextAlignClass}>{Language.PasswordConfirmError}</FormFeedback>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='sizearea'>{Language.FarmerLocation}</Label>
                    <Input type="select" name="sizearea" id="sizearea" className={'SizeArea mb-3 ' + FloatClass + " " + TextAlignClass} onChange={this.onChange} value={this.state.sizearea}>
                      <option value="מרכז">{Language.FarmerLocationOption1}</option>
                      <option value="צפון">{Language.FarmerLocationOption2}</option>
                      <option value="דרום">{Language.FarmerLocationOption3}</option>
                    </Input>
                  </div>
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='address'>{Language.Address}</Label>
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
                  <div className="form-group">
                    <Label className={FloatClass + " " + TextAlignClass} for='hamamasize'>{Language.FarmerSizeArea}</Label>
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
                    <Label className={FloatClass + " " + TextAlignClass} for='aboutme'>{Language.FarmerAboutMe}</Label>
                    <Input type="textarea" name="aboutme" id="aboutme" className={'AboutMe mb-3 ' + FloatClass + " " + TextAlignClass} onChange={this.onChange} value={this.state.aboutme} />
                    <FormText className={ReverseTextAlignClass}>* {Language.FarmerAboutMeMsg}</FormText>
                  </div>
                </div>
                <div className={'UploadImage ' + FloatClass}>
                  <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                  {$imagePreview}
                </div>
                <div className={this.state.AddBackgroundClassToVeg}>
                  <h3>{Language.ExperienceToGrow}</h3>
                  {this.state.VegtButtonOn && this.state.FieldCropsButtonOn ?
                    <Button color="success" onClick={this.OpenListOfvegetables}>{Language.FarmerGreenhouseCropsButtonText}</Button> : null}
                  {this.state.VegtButtonOn ? null : <Vegetables OpenListOfvegetables={this.OpenListOfvegetables} />}
                  {this.state.FieldCropsButtonOn && this.state.VegtButtonOn ?
                    <Button color="success" onClick={this.OpenListOfFieldsCrops}>{Language.FarmerFieldCropsButtonText}</Button> : null}
                  {this.state.FieldCropsButtonOn ? null : <FieldCrops OpenListOffieldcrops={this.OpenListOfFieldsCrops} />}
                </div>
                {this.state.EmptyVegActive ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.FarmerHaveEmptyVegInList}</Alert></div> : null}
                <div className="ListOfVegCost">
                  <p>{Language.PricingComment}</p>
                  <p>{Language.SeasonWarning}</p>
                  {ShowVegPricing ? <VegetablesPricing /> : null}
                  {ShowFieldCropPricing ? <FarmCropsPricing /> : null}
                </div>
                {this.state.VegPricingValidation ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.VegPricingComment}</Alert></div> : null}
                <div className='AddFieldCropsPlan'>
                  <div className='AddFieldCropsPlanCheckBox'>
                    <span>{Language.IntrestingInFieldCrops}</span>
                    <Label check for='CheckFieldCropsPlan' className='AddFieldCropsPlanCheckBoxApproval'>
                      <CustomInput
                        type="checkbox"
                        name='CheckFieldCropsPlan'
                        id='CheckFieldCropsPlan'
                        className='mb-3'
                        onChange={this.onChange}
                        defaultChecked={this.state.CheckFieldCropsPlan}
                      />
                    </Label>
                  </div>
                  {this.state.FieldCropStatus ?
                    <div className='AddFieldCropsPlanLogic'>
                      <span>{Language.FieldCropPrice} </span>
                      <Label check for='fieldcropplancost'>
                        <Input
                          type="text"
                          name='fieldcropplancost'
                          id='fieldcropplancost'
                          value={this.state.fieldcropplancost}
                          className='mb-3'
                          onChange={this.onChange} />
                      </Label>
                      <span> {Language.Shekals}</span>
                    </div>
                    : null}
                </div>
                {this.state.fieldcropplancostValidation ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.FarmerFieldCropsPriceError}</Alert></div> : null}
                {this.state.fieldcropplanShouldBeActive ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.FarmerFieldCropsChoosePlanError}</Alert></div> : null}
                <div className="Plans">
                  <div className={"PlanCard " + FloatClass}>
                    <div className="PlanCardHeader">
                      <div className="Card1Image" onClick={() => this.OnImgClick('Checkplan1Img')}>
                        <img
                          alt=""
                          src={require('../Resources/plan1.png')}
                          className='PlanHeaderVegetableImage'
                        />
                        <Label check for='Checkplan1'>
                          <CustomInput
                            type="checkbox"
                            name='Checkplan1'
                            id='Checkplan1'
                            className='mb-3'
                            checked={this.state.plan1}
                            onChange={this.onChange} />
                        </Label>
                        <span className='PlanTitle' >{Language.PlanName1}</span>
                      </div>
                    </div>
                    <div className="PlanCardBody">
                      <div className="CardCost">
                        <div className="CardCostLabel">
                          <Label check for='cost1' className={FloatClass}>
                            <Input
                              type="text"
                              name='cost1'
                              id='cost1'
                              className='mb-3'
                              placeholder={this.state.cost1}
                              value={this.state.cost1}
                              onChange={this.onChange} />
                          </Label>
                          <span>{Language.Shekals}</span>
                        </div>
                      </div>
                      <div className="CardDetails">
                        <span className="CardDetailsHeader">{Language.FarmerPlan1}<br /> {Language.FarmerPlanInclude}</span>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanArea} {HamamadefaultsizeContainer} {Language.SquareMeter}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanWater}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanBfertilization}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanCommunity}<a href="https://www.co-greenhouse.com/ourcommunity" className='PlansCommunityLink' target="_blank" rel="noopener noreferrer">{Language.FarmerPlanCommunity2}</a></span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanSupport}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanBySeeds}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"PlanCard " + FloatClass}>
                    <div className="PlanCardHeader">
                      <div className="Card2Image" onClick={() => this.OnImgClick('Checkplan2Img')}>
                        <img
                          alt=""
                          src={require('../Resources/plan2.png')}
                          className='PlanHeaderVegetableImage'
                        />
                        <Label check for='Checkplan2'>
                          <CustomInput
                            type="checkbox"
                            name='Checkplan2'
                            id='Checkplan2'
                            checked='mb-3'
                            checked={this.state.plan2}
                            onChange={this.onChange} />
                        </Label>
                        <span className='PlanTitle' >{Language.PlanName2}</span>
                      </div>
                    </div>
                    <div className="PlanCardBody">
                      <div className="CardCost">
                        <div className="CardCostLabel">
                          <Label check for='cost2' className={FloatClass}>
                            <Input
                              type="text"
                              name='cost2'
                              id='cost2'
                              value={this.state.cost2}
                              className='mb-3'
                              placeholder={this.state.cost2}
                              onChange={this.onChange} />
                          </Label>
                          <span>{Language.Shekals}</span>
                        </div>
                      </div>
                      <div className="CardDetails">
                        <span className="CardDetailsHeader">{Language.FarmerPlan2}<br /> {Language.FarmerPlanInclude}</span>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanArea} {HamamadefaultsizeContainer} {Language.SquareMeter}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanWater}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanBfertilization}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanCommunity}<a href="https://www.co-greenhouse.com/ourcommunity" className='PlansCommunityLink' target="_blank" rel="noopener noreferrer">{Language.FarmerPlanCommunity2}</a></span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanSupport}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanBySeeds}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}><strong>{Language.FarmerPlanApointment}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"PlanCard " + FloatClass}>
                    <div className="PlanCardHeader">
                      <div className="Card3Image" onClick={() => this.OnImgClick('Checkplan3Img')}>
                        <img
                          alt=""
                          src={require('../Resources/plan3.png')}
                          className='PlanHeaderVegetableImage'
                        />
                        <Label check for='Checkplan3'>
                          <CustomInput
                            type="checkbox"
                            name='Checkplan3'
                            id='Checkplan3'
                            className='mb-3'
                            checked={this.state.plan3}
                            onChange={this.onChange} />
                        </Label>
                        <span className='PlanTitle' >{Language.PlanName3}</span>
                      </div>
                    </div>
                    <div className="PlanCardBody">
                      <div className="CardCost">
                        <div className="CardCostLabel">
                          <Label check for='cost3' className={FloatClass}>
                            <Input
                              type="text"
                              name='cost3'
                              id='cost3'
                              className='mb-3'
                              placeholder={this.state.cost3}
                              value={this.state.cost3}
                              onChange={this.onChange} />
                          </Label>
                          <span>{Language.Shekals}</span>
                        </div>
                      </div>
                      <div className="CardDetails" >
                        <span className="CardDetailsHeader">{Language.FarmerPlan3}<br /> {Language.FarmerPlanInclude}</span>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanArea} {HamamadefaultsizeContainer} {Language.SquareMeter}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanWater}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanBfertilization}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanCommunity}<a href="https://www.co-greenhouse.com/ourcommunity" className='PlansCommunityLink' target="_blank" rel="noopener noreferrer">{Language.FarmerPlanCommunity2}</a></span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanSupport2}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}>{Language.FarmerPlanBySeeds}</span>
                        </div>
                        <div className={'PlanIncludeSection ' + TextAlignClass}>
                          <span className={'PlanVegetableImage ' + FloatClass + " " + ReverseTextAlignClass}><img alt="" src={require('../Resources/Leaf.png')} size='sm' /></span>
                          <span className={'PlanVegetableImageText ' + FloatClass + " " + TextAlignClass}><strong>{Language.FarmerPlanCare}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.FarmerPlanValidation ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.FarmerVegPlansError}</Alert></div> : null}
                {this.state.FarmerPlanCostValidation ? <div className='FarmerChoosePlanAlert'><Alert color='danger'>{Language.FarmerVegPlansPricingError}</Alert></div> : null}
                <div className='ApproveRegulations'>
                  <div className={'RegulationsCheckBox ' + FloatClass}>
                    <Label check for='CheckRegulations'>
                      <CustomInput
                        type="checkbox"
                        name='CheckRegulations'
                        id='CheckRegulations'
                        className='mb-3'
                        onChange={this.onChange}
                        defaultChecked={this.state.Regulations}
                        invalid={!this.state.RegulationsValidation} />
                    </Label>
                  </div>
                  <div className={'RegulationsLink ' + FloatClass}>
                    <span>{Language.Approval1} </span>
                    <a href="https://www.co-greenhouse.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" >{Language.Approval2}</a>
                    <span> {Language.Approval3}</span>
                  </div>
                </div>
                {this.state.ScreenNumber === "1" ? (
                  <div className='MoveToPaymentScreenButton'>
                    <Button color="info" onClick={() => this.ChangeScreen("2")} type="button" >
                      {this.state.SmallLoaderActivated ? Language.WaitButtonText : Language.FormContinue} {this.state.SmallLoaderActivated ? <Spinner color="light"></Spinner> : null}
                    </Button>
                  </div>
                ) : null}
              </FormGroup>
            ) : null}

            {this.state.ScreenNumber === "2" || this.state.ScreenNumber === "4" ? (
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
                        value={this.state.fullname} invalid={!this.state.fullnameValidation}
                      />
                      <FormFeedback className={ReverseTextAlignClass} >{Language.EmptyField}</FormFeedback>
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
                        invalid={!this.state.accountnumberValidation}
                      />
                      <FormFeedback className={ReverseTextAlignClass} >{Language.EmptyField}</FormFeedback>
                    </div>
                    <div className="payment-form-group">
                      <div className="bankDetails">
                        <div className="bankname">
                          <Label for='bankname'></Label>
                          <Input type="select" name="bankname" id="bankname" className='mb-3' placeholder='בנק' onChange={this.onChange} value={this.state.bankname} invalid={!this.state.banknameValidation}>
                            <option value='בנק' >{Language.PaymentDetailsChooseBank}</option>
                            <option value='בנק אגוד'>{Language.PaymentDetailsBankName1}</option>
                            <option value='בנק אוצר החייל'>{Language.PaymentDetailsBankName2}</option>
                            <option value='בנק דיסקונט'>{Language.PaymentDetailsBankName3}</option>
                            <option value='בנק הפועלים'>{Language.PaymentDetailsBankName4}</option>
                            <option value='בנק לאומי'>{Language.PaymentDetailsBankName5}</option>
                            <option value='בנק מזרחי'>{Language.PaymentDetailsBankName6}</option>
                            <option value='הבנק הבינלאומי'>{Language.PaymentDetailsBankName7}</option>
                          </Input>
                          <FormFeedback className={ReverseTextAlignClass} >{Language.EmptyField}</FormFeedback>
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
                            invalid={!this.state.banknumberValidation}
                          />
                          <FormFeedback className={ReverseTextAlignClass} >{Language.EmptyField}</FormFeedback>
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

            {this.state.ScreenNumber === "3" ? (
              <FormGroup>
                <div className='BankCollectPaymentContainer'>
                  <div className='PaymentContainer'>
                    <div className="Countdown">{'ההרשמה תינעל בעוד כ ' + this.state.CountdownTime + ' דקות'}</div>
                    <iframe src={this.GenerateIframeUrl()} height="700" width="100%" title="Iframe Example"></iframe>
                  </div>
                </div>
              </FormGroup>
            ) : null}
          </Form>
          {this.state.ActivateLoader ? <Loader /> : null}
          <div className={HelpBtnClass}><a href="https://www.co-greenhouse.com/faq" target="_blank" rel="noopener noreferrer">{direction === 'rtl' ? <img alt="" src={require('../Resources/help.png')} /> : <img alt="" src={require('../Resources/help-english.png')} />}</a></div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  choosenvegetable: state.choosenvegetable,
  choosenvegetables: state.choosenvegetable.ChoosenVegetables,
  choosenfieldcrop: state.choosenfieldcrop,
  ChoosenFieldCrops: state.choosenfieldcrop.ChoosenFieldCrops,
  farmer: state.farmer,
  system: state.system,
  SystemData: state.system.SystemData,
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getChoosenVegetables, resetChoosenVegetables, getChoosenfieldCrops, resetChoosenfieldCrop, addFarmer, resetFarmersList, getSystemData }
)(RegisterPage);