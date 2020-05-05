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
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody ,
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
                    <span className='AdminVegetableItemHeaderText2'>מחיר בש"ח</span>
                    <span className='AdminVegetableItemHeaderText3'>יבול ממוצע לשנה בק"ג</span>
                    <span className='AdminVegetableItemHeaderText4'>כמות שתילים לטור גידול</span>
                    <span className='AdminVegetableItemHeaderText5'>מספר שורות לגידול</span>
                    <span className='AdminVegetableItemHeaderText6'>קישור לדף מידע למוצר</span>
                    <span className='AdminVegetableItemHeaderText7'>&nbsp;</span>
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
                    <span className='AdminVegetableItemLink'><a href={moreinfolink} target="_blank">לינק לפריט</a>&nbsp;</span>
                    <span className='AdminVegetableItemButtons'>
                      {this.props.isAuthenticated ? (
                        <span className='AdminVegetableItemButtonsHolder'>
                        <Button color="danger" id={"PopoverLegacy" + _id}  size='sm' className='AdminVegRemoveBtn' type="button" ><TiDeleteOutline size={24} /></Button>
                        <UncontrolledPopover  trigger="legacy" placement="bottom" target={"PopoverLegacy" + _id}>
                          <PopoverHeader style={{ textAlign: 'center' }}>הסרת ירק</PopoverHeader>
                          <PopoverBody>
                            <span className="AdminDeleteVegForGoodText">האם אתה בטוח שברצונך למחוק את הירק לצמיתות?</span>
                            <span className="AdminDeleteVegForGoodButtons">
                              <span><Button outline color="success" onClick={() => this.onDeleteClick(_id)} type="button" >אישור</Button></span>
                            </span>
                          </PopoverBody>
                        </UncontrolledPopover >
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
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >ממשק מנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>}
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