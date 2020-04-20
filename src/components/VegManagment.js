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
import { getVegetables, deleteVegetable } from '../actions/vegetableAction';
import { IoIosAddCircleOutline } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { FiEdit } from "react-icons/fi";
import ItemModal from './ItemModal';
import UpdateItemModal from './UpdateItemModal';

class VegManagment extends Component {
  state = {
    modal: false,
    msg: null,
    ActivateLoader: false,
    redirect: null,
    UserActive: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getVegetables: PropTypes.func.isRequired,
    deleteVegetable: PropTypes.func.isRequired,
    vegetable: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getVegetables();
  }

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
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDeleteClick = id => {
    this.props.deleteVegetable(id);
  };

  render() {
    const { vegetables } = this.props.vegetable;
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div>
        {this.state.msg ? (
          <Alert color='danger'>{this.state.msg}</Alert>
        ) : null}
        {isAuthenticated ? 
          user.usertype === 'SysAdmin' ?
          <Container>
          <ItemModal />
          <ListGroup>
            <TransitionGroup className='AdminVegListHeader'>
                <CSSTransition timeout={500} classNames='fade'>
                  <ListGroupItem>
                    <span className='AdminVegetableItemHeaderText1'>שם</span>
                    <span className='AdminVegetableItemHeaderText2'>מחיר</span>
                    <span className='AdminVegetableItemHeaderText3'>ייבול ממוצע לשנה</span>
                    <span className='AdminVegetableItemHeaderText4'>כמות שתילים</span>
                    <span className='AdminVegetableItemHeaderText5'>מספר שורות לגידול</span>
                    <span className='AdminVegetableItemHeaderText6'>לינק למוצר</span>
                    <span className='AdminVegetableItemHeaderText7'></span>
                  </ListGroupItem>
                </CSSTransition>
            </TransitionGroup>
          </ListGroup>
          <ListGroup>
            <TransitionGroup className='AdminVegListBody'>
              {vegetables.map(({ _id, name, price, averagecrop, amount, numberofveginrow, moreinfolink }) => (
                <CSSTransition key={_id} timeout={500} classNames='fade'>
                  <ListGroupItem>
                    <span className='AdminVegetableItemName'>{name}&nbsp;</span>
                    <span className='AdminVegetableItemPrice'>{price}&nbsp;</span>
                    <span className='AdminVegetableItemAveragecrop'>{averagecrop}&nbsp;</span>
                    <span className='AdminVegetableItemAmount'>{amount}&nbsp;</span>
                    <span className='AdminVegetableItemRows'>{numberofveginrow}&nbsp;</span>
                    <span className='AdminVegetableItemLink'><a href={moreinfolink} >לינק לפריט</a>&nbsp;</span>
                    <span className='AdminVegetableItemButtons'>
                      {this.props.isAuthenticated ? (
                        <span className='AdminVegetableItemButtonsHolder'>
                        <Button
                          className='AdminVegRemoveBtn'
                          color='danger'
                          size='sm'
                          onClick={this.onDeleteClick.bind(this, _id)}
                        >
                          <TiDeleteOutline size={24} />
                        </Button>
                        <UpdateItemModal ItemId={_id} ItemName={name} ItemPrice={price} ItemAveragecrop={averagecrop} ItemAmont={amount} ItemNumberofveginrow={numberofveginrow} ItemLink={moreinfolink} />
                        </span>
                      ) : null}
                    </span>
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
  vegetable: state.vegetable
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getVegetables, deleteVegetable }
)(VegManagment);