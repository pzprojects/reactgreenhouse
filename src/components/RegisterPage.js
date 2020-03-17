import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  NavLink,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Spinner } from 'reactstrap';
import Loader from '../components/Loader';
import Vegetables from '../components/Vegetables';
import { getChoosenVegetables, addChoosenVegetable, deleteChoosenVegetable } from '../actions/choosenVegetablesAction';


class RegisterPage extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    password: '',
    familyname: '',
    phone: '',
    sizearea: '',
    hamamasize: '',
    aboutme: '',
    msg: null,
    profileimg: '',
    file: '',
    imageurl: '',
    imagePreviewUrl: '',
    imagename: '',
    role: 'חקלאי',
    ActivateLoader: false,
    VegtButtonOn: true,
    AddBackgroundClassToVeg: 'vegetables'
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getChoosenVegetables: PropTypes.func.isRequired,
    choosenvegetable: PropTypes.object.isRequired
  };

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
      ActivateLoader: !this.state.ActivateLoader
    });
    this.props.history.push('/');
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    
    this.setState({
      ActivateLoader: !this.state.ActivateLoader,
      modal: !this.state.modal
    });

    if(this.state.imagename!=''){
      this.uploadFile();
    }

    const { name, email, password, familyname, phone, sizearea, hamamasize, aboutme, imageurl } = this.state;

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
      imageurl
    };

    // Attempt to register
    this.props.register(newUser);
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

    const generatePutUrl = '/generate-put-url';
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
          console.log("Update Image");
        })
        .catch(err => {
          console.log('err', err);
        });
    });
  };

  OpenListOfvegetables = e => {
    e.preventDefault();
    
    let ChoosenClass = this.state.AddBackgroundClassToVeg;

    if(ChoosenClass == 'vegetablesOpen'){
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
    let $imagePreview = (<img className="ProfileImage" src={require('../Resources/Upload.png')} onClick={this.OpenFileExplorer}/>);
    if (imagePreviewUrl) {
      $imagePreview = (<img className="ProfileImage" src={imagePreviewUrl} onClick={this.OpenFileExplorer} />);
    }

    return (
      <div>
        <Container>
            {this.state.msg ? (
              <Alert color='danger'>{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <div className='PersonalDetails'>
                  <div className="form-group">
                    <Label for='name'>שם פרטי</Label>
                    <Input
                      type='text'
                      name='name'
                      id='name'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='familyname'>שם משפחה</Label>
                    <Input
                      type='text'
                      name='familyname'
                      id='familyname'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='phone'>טלפון</Label>
                    <Input
                      type='text'
                      name='phone'
                      id='phone'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='email'>אימייל (שם משתמש)</Label>
                    <Input
                      type='email'
                      name='email'
                      id='email'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='password'>סיסמה</Label>
                    <Input
                      type='password'
                      name='password'
                      id='password'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='passwordconfirmation'>אימות סיסמה</Label>
                    <Input
                      type='password'
                      name='passwordconfirmation'
                      id='passwordconfirmation'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='sizearea'>אזור השטח לגידול</Label>
                    <Input type="select" name="sizearea" id="sizearea" className='SizeArea mb-3' onChange={this.onChange}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Input>
                  </div>
                  <div className="form-group">
                    <Label for='hamamasize'>גודל שטח החממה</Label>
                    <Input
                      type='text'
                      name='hamamasize'
                      id='hamamasize'
                      placeholder=''
                      className='mb-3'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="form-group">
                    <Label for='aboutme'>על עצמי</Label>
                    <Input type="textarea" name="aboutme" id="aboutme" className='AboutMe mb-3' onChange={this.onChange}/>
                  </div>
                </div>
                <div className='UploadImage'>
                  <Input type="file" name="profileimg" id="profileimg" onChange={this.handleUploadFile} />
                  {$imagePreview}
                </div>
                <div className={this.state.AddBackgroundClassToVeg}>
                  <h3>יש לי את התנאים והניסיון לגדל:</h3>
                  { this.state.VegtButtonOn ? 
                  <Button color="success" onClick={this.OpenListOfvegetables}>רשימת ירקות לגידול</Button> : null }
                  { this.state.VegtButtonOn ? null : <Vegetables OpenListOfvegetables={this.OpenListOfvegetables} /> }
                </div>
                <div className="ListOfVegCost">
                  <p>המחירים הינם מומלצים ע"י החנות של Co-Greenhouse וניתנים לשינוי</p>
                </div>
                <Button color='dark' style={{ marginTop: '2rem' }} block >
                  Register
                </Button>
              </FormGroup>
            </Form>
            { this.state.ActivateLoader ? <Loader /> : null }
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  choosenvegetable: state.choosenvegetable
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getChoosenVegetables }
)(RegisterPage);