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
    ListGroup,
    ListGroupItem,
    FormFeedback,
    UncontrolledCollapse,
    CardBody,
    Card,
    CardHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import Loader from '../components/Loader';
import { getfarmerbyemail } from '../actions/farmerAction';
import { getGrowerShoopinList, addToGrowerShoopinList, deleteFromShoopinList, ResetGrowerShoopinList, UpdateGrowerShoopinList } from '../actions/growerShoppingListAction';
import { addpersonalShoopingItems } from '../actions/personalShoopingListAction';
import { Redirect } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class GrowerPersonalShop extends Component {
    state = {
        modal: false,
        name: '',
        email: '',
        familyname: '',
        phone: '',
        msg: null,
        ActivateLoader: false,
        fullname: '',
        FarmerFullNmae: '',
        FarmerEmail: '',
        FarmerPhone: '',
        FarmerLocation: '',
        UserID: '',
        redirect: null,
        UserActive: false,
        FieldCropPlanActive: false,
        ChoosenVegName: '',
        ChoosenVegAmount: "1",
        ChoosenVegPrice: '',
        ListEmptyValidation: true
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        getfarmerbyemail: PropTypes.func.isRequired,
        farmer: PropTypes.object.isRequired,
        growershop: PropTypes.object.isRequired,
        getGrowerShoopinList: PropTypes.func.isRequired,
        addToGrowerShoopinList: PropTypes.func.isRequired,
        deleteFromShoopinList: PropTypes.func.isRequired,
        ResetGrowerShoopinList: PropTypes.func.isRequired,
        UpdateGrowerShoopinList: PropTypes.func.isRequired,
        personalshop: PropTypes.object.isRequired,
        addpersonalShoopingItems: PropTypes.func.isRequired
    };

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        const { transactionDone, farmers, error, isAuthenticated } = this.props;
        const { user } = this.props.auth;
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

        if (isAuthenticated !== prevProps.isAuthenticated && isAuthenticated) {

            try {
                if (user.usertype !== 'מגדל') {
                    this.setState({
                        redirect: '/'
                    });
                }

                if (user.workingwith[0].active) {
                    this.props.getfarmerbyemail(user.workingwith[0].email);
                }
                else {
                    this.setState({
                        redirect: '/'
                    });
                }

                this.setState({
                    name: user.name,
                    email: user.email,
                    familyname: user.familyname,
                    phone: user.phone,
                    address: user.address,
                    UserID: user._id,
                    UserActive: user.workingwith[0].active,
                    FieldCropPlanActive: user.fieldcropplan.avaliabile
                })
            }
            catch{
                this.setState({
                    redirect: '/'
                });
            }
        }

        if (farmers !== prevProps.farmers) {
            // Update the farmer details
            if (typeof (this.props.farmer.farmers[0]) !== "undefined") {
                try {
                    if (this.state.UserActive) {
                        var FarmerDetails = farmers[0];
                        var vegetablesforshop = FarmerDetails.choosenvegetables.concat(FarmerDetails.choosenfieldcrops);
                        this.setState({
                            FarmerFullNmae: FarmerDetails.name + " " + FarmerDetails.familyname,
                            FarmerEmail: FarmerDetails.email,
                            FarmerPhone: FarmerDetails.phone,
                            FarmerLocation: FarmerDetails.address,
                            ChoosenVegName: vegetablesforshop[0].name,
                            ChoosenVegPrice: vegetablesforshop[0].price
                        })
                    }
                } catch (e) { }
            }
        }

        // If authenticated, close modal
        if (this.state.modal) {
            if (isAuthenticated && transactionDone) {
                this.toggle();
            }
        }

        if (isAuthenticated !== prevProps.isAuthenticated && !isAuthenticated) {
            this.setState({
                redirect: '/'
            });
        }
    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
        this.props.ResetGrowerShoopinList();
        this.setState({
            modal: !this.state.modal
        });
        this.setState({
            ActivateLoader: !this.state.ActivateLoader,
            redirect: '/PurchaseCompleted'
        });
    };

    ValidateForm = () => {

        var Validated = true;
        var ScrollToLocation = "top";
        const { GrowerShoopingList } = this.props;

        // Empty fields
        if (GrowerShoopingList.length < 1) {
            this.setState({
                ListEmptyValidation: false
            });
            setTimeout(() => {
                this.setState({
                    ListEmptyValidation: true
                });
            }, 3000);
            Validated = false;
            ScrollToLocation = "top";
        }

        if (this.GetTotalPayment() === '0') {
            Validated = false;
            ScrollToLocation = "bottom";
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

    GetVegPrice = (VegName) => {
        try {
            var price = "0";
            const { farmers } = this.props.farmer;
            var vegetablesforshop = farmers[0].choosenvegetables.concat(farmers[0].choosenfieldcrops);
            for (var i = 0; i < vegetablesforshop.length; i++) {
                if (vegetablesforshop[i].name === VegName) {
                    price = vegetablesforshop[i].price;
                    break;
                }
            }
            return price;
        }
        catch{ }
    }


    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });

        // validations
        switch (e.target.name) {
            case "ChoosenVegName":
                this.setState({
                    ChoosenVegAmount: "1",
                    ChoosenVegPrice: this.GetVegPrice(e.target.value)
                });
                break;
            default:
        }
    };

    onSubmit = e => {
        e.preventDefault();

        if (this.ValidateForm()) {
            const { GrowerShoopingList } = this.props;

            const growername = this.state.name + " " + this.state.familyname;
            const groweremail = this.state.email;
            const farmername = this.state.FarmerFullNmae;
            const farmeremail = this.state.FarmerEmail;
            const totalpayed = this.GetTotalPayment();
            const growershoopinglist = GrowerShoopingList;
                

            this.setState({
                ActivateLoader: !this.state.ActivateLoader,
                modal: !this.state.modal
            });

            // Create ShopList object
            const newShopList = {
                growername,
                groweremail,
                farmername,
                farmeremail,
                totalpayed,
                growershoopinglist
            };

            // Attempt to add shop list item
            this.props.addpersonalShoopingItems(newShopList);

        }
    };

    DecreseAmount = () => {
        if ((parseFloat(this.state.ChoosenVegAmount) - 1) > 0) {
            this.setState({
                ChoosenVegAmount: (parseFloat(this.state.ChoosenVegAmount) - 1).toString()
            });
        }
    }

    IncreseAmount = () => {
        this.setState({
            ChoosenVegAmount: (parseFloat(this.state.ChoosenVegAmount) + 1).toString()
        });
    }

    AddToBucket = () => {
        const { GrowerShoopingList } = this.props;
        const { ChoosenVegName, ChoosenVegAmount, ChoosenVegPrice } = this.state;
        const Item = {
            ChoosenVegName,
            ChoosenVegAmount,
            ChoosenVegPrice
        };
        if (GrowerShoopingList.some(item => ChoosenVegName === item.ChoosenVegName)) {
            this.props.UpdateGrowerShoopinList(ChoosenVegName, ChoosenVegAmount);
        }
        else {
            this.props.addToGrowerShoopinList(Item);
        }
    }

    GetTotalPayment = () => {
        const { GrowerShoopingList } = this.props;
        var TotalPayment = 0;
        for (var i = 0; i < GrowerShoopingList.length; i++) {
            TotalPayment += parseFloat(GrowerShoopingList[i].ChoosenVegAmount) * parseFloat(GrowerShoopingList[i].ChoosenVegPrice);
        }

        TotalPayment = TotalPayment.toString();
        return TotalPayment;
    }

    RemoveFromBucket = (name) => {
        this.props.deleteFromShoopinList(name);
    }

    render() {
        const { farmers } = this.props.farmer;
        const { GrowerShoopingList } = this.props;
        try {
            var vegetablesforshop = farmers[0].choosenvegetables.concat(farmers[0].choosenfieldcrops);
        }
        catch{
            vegetablesforshop = [];
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
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <div className='GrowerPersonalShop'>
                                <div className='GrowerPersonalShopHeader'> רכישת שתילים מהחקלאי שלי </div>
                                <div className="GrowerPersonalShop-form-group">
                                    <div className="GrowerPersonalShopItemsToBuy">
                                        {vegetablesforshop.length > 0 ?
                                            <ListGroup>
                                                <ListGroupItem>
                                                    <div className="GrowerPersonalShopVeg">
                                                        <Label for='ChoosenVegName'></Label>
                                                        <Input type="select" name="ChoosenVegName" id="ChoosenVegName" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.ChoosenVeg}>
                                                            {vegetablesforshop.map(function (item, thirdkey) {
                                                                return (
                                                                    <option className='GrowerVegItem' key={thirdkey}>
                                                                        {item.name}
                                                                    </option>
                                                                )
                                                            })}
                                                        </Input>
                                                    </div>
                                                    <div className="GrowerPersonalShopVegPrice">
                                                        <span>{this.state.ChoosenVegPrice} ₪</span>
                                                    </div>
                                                    <div className="GrowerPersonalShopVegAmount">
                                                        <div className="GrowerPersonalShopVegAmountContainer">
                                                            <span><Button outline color="success" onClick={() => this.DecreseAmount()} type="button" >-</Button></span>
                                                            <Label for='ChoosenVegAmount'></Label>
                                                            <Input type="text" name="ChoosenVegAmount" id="ChoosenVegAmount" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.ChoosenVegAmount} disabled />
                                                            <span><Button outline color="success" onClick={() => this.IncreseAmount()} type="button" >+</Button></span>
                                                        </div>
                                                    </div>
                                                    <div className="GrowerPersonalShopVegAddToBucket">
                                                        <span><Button outline color="success" onClick={() => this.AddToBucket()} type="button" >הוסף לסל</Button></span>
                                                    </div>
                                                </ListGroupItem>
                                            </ListGroup>
                                            :
                                            <ListGroup>
                                                <ListGroupItem>
                                                    לחקלאי זה אין שתילים למכירה
                                            </ListGroupItem>
                                            </ListGroup>
                                        }
                                    </div>
                                </div>
                                <div className="GrowerPersonalShop-form-group">
                                    <div className="GrowerPersonalShopBilling">
                                        <div className="GrowerPersonalShopBucket">
                                            <ListGroup>
                                                <CSSTransition timeout={500} classNames='fade'>
                                                    <ListGroupItem className="GrowerPersonalShopBucketItemHeader">
                                                        <div className='GrowerPersonalShopBucketItemHeaderContainer'>
                                                            <div className='GrowerPersonalShopBucketItemHeaderText1'>
                                                                <span>שם המוצר</span>
                                                            </div>
                                                            <div className='GrowerPersonalShopBucketItemHeaderText2'>
                                                                <span>כמות</span>
                                                            </div>
                                                            <div className='GrowerPersonalShopBucketItemHeaderText3'>
                                                                <span>מחיר</span>
                                                            </div>
                                                            <div className='GrowerPersonalShopBucketItemHeaderText4'>
                                                                <span>&nbsp;</span>
                                                            </div>
                                                        </div>
                                                    </ListGroupItem>
                                                </CSSTransition>
                                            </ListGroup>
                                            {GrowerShoopingList.length > 0 ?
                                                <ListGroup>
                                                    {GrowerShoopingList.map(({ ChoosenVegName, ChoosenVegAmount, ChoosenVegPrice }) => (
                                                        <CSSTransition key={ChoosenVegName} timeout={500} classNames='fade'>
                                                            <ListGroupItem className="GrowerPersonalShopBucketItem">
                                                                <div className='GrowerPersonalShopBucketItemContainer'>
                                                                    <div className='GrowerPersonalShopBucketItemName'>
                                                                        <span>{ChoosenVegName}&nbsp;</span>
                                                                    </div>
                                                                    <div className='GrowerPersonalShopBucketItemAmount'>
                                                                        <span>{ChoosenVegAmount}&nbsp;</span>
                                                                    </div>
                                                                    <div className='GrowerPersonalShopBucketItemPrice'>
                                                                        <span>{(parseFloat(ChoosenVegAmount) * parseFloat(ChoosenVegPrice)).toString()}&nbsp;</span>
                                                                    </div>
                                                                    <div className='GrowerPersonalShopBucketItemRemoveBtn'>
                                                                        <span><span className='Deletebutton' onClick={() => this.RemoveFromBucket(ChoosenVegName)} >x</span></span>
                                                                    </div>
                                                                </div>
                                                            </ListGroupItem>
                                                        </CSSTransition>
                                                    ))}
                                                </ListGroup>
                                                :
                                                <ListGroup>
                                                    <CSSTransition timeout={500} classNames='fade'>
                                                        <ListGroupItem className="GrowerPersonalShopBucketItem">
                                                            <div className='GrowerPersonalShopBucketItemContainer'>
                                                                סל הקניות ריק
                                                            </div>
                                                        </ListGroupItem>
                                                    </CSSTransition>
                                                </ListGroup>
                                            }
                                            {GrowerShoopingList.length > 0 ?
                                                <ListGroup>
                                                    <CSSTransition timeout={500} classNames='fade'>
                                                        <ListGroupItem className="GrowerPersonalShopBucketItemHeader">
                                                            <div className='GrowerPersonalShopBucketItemHeaderContainer'>
                                                                <div className='GrowerPersonalShopBucketItemHeaderText1'>
                                                                    <span>סה"כ לתשלום</span>
                                                                </div>
                                                                <div className='GrowerPersonalShopBucketItemHeaderText2'>
                                                                    <span>&nbsp;</span>
                                                                </div>
                                                                <div className='GrowerPersonalShopBucketItemHeaderText3'>
                                                                    <span>{this.GetTotalPayment()} ש"ח</span>
                                                                </div>
                                                                <div className='GrowerPersonalShopBucketItemHeaderText4'>
                                                                    <span>&nbsp;</span>
                                                                </div>
                                                            </div>
                                                        </ListGroupItem>
                                                    </CSSTransition>
                                                </ListGroup>
                                                : null}
                                        </div>
                                        <div className="GrowerPersonalShopChoosingFarmer">
                                            <Card>
                                                <CardHeader>פרטי החקלאי שלי</CardHeader>
                                                <CardBody>
                                                    <span><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.state.FarmerFullNmae}</span>
                                                    <span><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.state.FarmerPhone}</span>
                                                    <span><img alt="" src={require('../Resources/mail.png')} size='sm' /><a href={"mailto:" + this.state.FarmerEmail}>{this.state.FarmerEmail}</a></span>
                                                    <span><img alt="" src={require('../Resources/location.png')} size='sm' />{this.state.FarmerLocation}</span>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        {!this.state.ListEmptyValidation ? (<div className="DuplicatesAlert" ><Alert className='DuplicatesAlertContent' color="danger">יש לרכוש לפחות מוצר אחד</Alert></div>) : null}
                        <div className='GrowerPersonalShopBuyButtonHolder'>
                            <Button color="success" className='GrowerPersonalShopBuyButton' >
                                לסיום ורכישה
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
    growershop: state.growershop,
    GrowerShoopingList: state.growershop.GrowerShoopingList,
    personalshop: state.personalshop,
    transactionDone: state.personalshop.transactionDone
});

export default connect(
    mapStateToProps,
    { register, clearErrors, getfarmerbyemail, getGrowerShoopinList, addToGrowerShoopinList, deleteFromShoopinList, ResetGrowerShoopinList, UpdateGrowerShoopinList, addpersonalShoopingItems }
)(GrowerPersonalShop);