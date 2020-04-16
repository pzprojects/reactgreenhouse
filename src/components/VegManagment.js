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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { getVegetables } from '../actions/vegetableAction';

class VegManagment extends Component {
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
    farmer: PropTypes.object.isRequired,
    getVegetables: PropTypes.func.isRequired,
    vegetable: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getVegetables();
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

 

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onDeleteClick = id => {
    //this.props.deleteItem(id);
  };

  render() {
    const { vegetables } = this.props.vegetable;
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div>
        {isAuthenticated ? 
          user.usertype === 'SysAdmin' ?
          <Container>
          <ListGroup>
            <TransitionGroup className='shopping-list'>
              {vegetables.map(({ _id, name, price, averagecrop, amount }) => (
                <CSSTransition key={_id} timeout={500} classNames='fade'>
                  <ListGroupItem>
                    <span className='AdminVegetableItemName'>{name}</span>
                    <span className='AdminVegetableItemPrice'>{price}</span>
                    <span className='AdminVegetableItemAveragecrop'>{averagecrop}</span>
                    <span className='AdminVegetableItemAmount'>{amount}</span>
                    {this.props.isAuthenticated ? (
                      <Button
                        className='remove-btn'
                        color='danger'
                        size='sm'
                        onClick={this.onDeleteClick.bind(this, _id)}
                      >
                        &times;
                      </Button>
                    ) : null}
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup>
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
  vegetable: state.vegetable
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getVegetables }
)(VegManagment);