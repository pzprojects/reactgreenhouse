import React, { Component } from 'react';
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
    CardBody,
    Card,
    CardHeader
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import Loader from '../components/Loader';
import { getfarmerbyemail, resetFarmersList } from '../actions/farmerAction';
import { getGrowerShoopinList, addToGrowerShoopinList, deleteFromShoopinList, ResetGrowerShoopinList, UpdateGrowerShoopinList } from '../actions/growerShoppingListAction';
import { addpersonalShoopingItems, resetpersonalShoopingItems } from '../actions/personalShoopingListAction';
import { getvegetablelanguages } from '../actions/vegLanguageConvertorAction';
import { Redirect } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

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
        addpersonalShoopingItems: PropTypes.func.isRequired,
        resetpersonalShoopingItems: PropTypes.func.isRequired,
        resetFarmersList: PropTypes.func.isRequired,
        language: PropTypes.object.isRequired,
        languagedbconversion: PropTypes.object.isRequired,
        getvegetablelanguages: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.getvegetablelanguages();
        const { user } = this.props.auth;
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

    componentDidUpdate(prevProps) {
        const { transactionDone, farmers, error, isAuthenticated } = this.props;
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

    componentWillUnmount() {
        this.props.ResetGrowerShoopinList();
        this.props.resetpersonalShoopingItems();
        this.props.resetFarmersList();
    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
        this.props.ResetGrowerShoopinList();
        this.props.resetpersonalShoopingItems();
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
        if (e.target.name !== 'ChoosenVegAmount') {
            this.setState({ [e.target.name]: e.target.value });
        }

        // validations
        switch (e.target.name) {
            case "ChoosenVegName":
                this.setState({
                    ChoosenVegAmount: "1",
                    ChoosenVegPrice: this.GetVegPrice(e.target.value)
                });
                break;
            case "ChoosenVegAmount":
                if (e.target.value > 0 && e.target.value < 1000) {
                    this.setState({ [e.target.name]: e.target.value });
                }
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

    Translate = name => {
        try {
            const { vegetablelsanguages, LanguageCode } = this.props;
            var VegToFind = vegetablelsanguages.find(vegetablelanguage => vegetablelanguage.vegname === name);
            var NameToReturn = VegToFind.langconvert.find(vegetablelanguage => vegetablelanguage.langname === LanguageCode);
            return (NameToReturn.langvalue);
        }
        catch{ return name; }

        return name;
    };

    RemoveFromBucket = (name) => {
        this.props.deleteFromShoopinList(name);
    }

    render() {
        const { farmers } = this.props.farmer;
        const { GrowerShoopingList } = this.props;
        const { Language, direction } = this.props;
        let FloatClass = "Co-Align-Right";
        let TextAlignClass = "Co-Text-Align-Right";
        let ReverseTextAlignClass = "Co-Text-Align-Left";
        if (direction === 'rtl') {
            FloatClass = "Co-Align-Right";
            TextAlignClass = "Co-Text-Align-Right";
            ReverseTextAlignClass = "Co-Text-Align-Left";
        }
        else {
            FloatClass = "Co-Align-Left";
            TextAlignClass = "Co-Text-Align-Left";
            ReverseTextAlignClass = "Co-Text-Align-Right";
        }
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
                                <div className='GrowerPersonalShopHeader'>{Language.GrowerPersonalShopTitle}</div>
                                <div className="GrowerPersonalShop-form-group">
                                    <div className="GrowerPersonalShopItemsToBuy">
                                        {vegetablesforshop.length > 0 ?
                                            <ListGroup>
                                                <ListGroupItem>
                                                    <div className={'GrowerPersonalShopVeg ' + FloatClass}>
                                                        <Label for='ChoosenVegName'></Label>
                                                        <Input type="select" name="ChoosenVegName" id="ChoosenVegName" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.ChoosenVeg}>
                                                            {vegetablesforshop.map(({ _id, name }) => (
                                                                <option className='GrowerVegItem' key={_id} value={name}>
                                                                    {this.Translate(name)}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </div>
                                                    <div className={'GrowerPersonalShopVegPrice ' + FloatClass}>
                                                        <span>{this.state.ChoosenVegPrice} ₪</span>
                                                    </div>
                                                    <div className={'GrowerPersonalShopVegAmount ' + FloatClass}>
                                                        <div className="GrowerPersonalShopVegAmountContainer">
                                                            <span className={FloatClass}><Button outline color="success" onClick={() => this.DecreseAmount()} type="button" >-</Button></span>
                                                            <Label className={FloatClass} for='ChoosenVegAmount'></Label>
                                                            <Input className={'GrowerVeg mb-3 ' + FloatClass} type="text" name="ChoosenVegAmount" id="ChoosenVegAmount" onChange={this.onChange} value={this.state.ChoosenVegAmount} />
                                                            <span className={FloatClass}><Button outline color="success" onClick={() => this.IncreseAmount()} type="button" >+</Button></span>
                                                        </div>
                                                    </div>
                                                    <div className={'GrowerPersonalShopVegAddToBucket ' + FloatClass}>
                                                        <span><Button outline color="success" onClick={() => this.AddToBucket()} type="button" >{Language.GrowerPersonalShopAddToBucket}</Button></span>
                                                    </div>
                                                </ListGroupItem>
                                            </ListGroup>
                                            :
                                            <ListGroup>
                                                <ListGroupItem>
                                                    {Language.GrowerPersonalShopFarmerEmpty}
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
                                                            <div className={'GrowerPersonalShopBucketItemHeaderText1 ' + FloatClass}>
                                                                <span>{Language.GrowerPersonalShopProductName}</span>
                                                            </div>
                                                            <div className={'GrowerPersonalShopBucketItemHeaderText2 ' + FloatClass}>
                                                                <span>{Language.GrowerPersonalShopProductAmount}</span>
                                                            </div>
                                                            <div className={'GrowerPersonalShopBucketItemHeaderText3 ' + FloatClass}>
                                                                <span>{Language.GrowerPersonalShopProductPrice}</span>
                                                            </div>
                                                            <div className={'GrowerPersonalShopBucketItemHeaderText4 ' + FloatClass}>
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
                                                                    <div className={'GrowerPersonalShopBucketItemName ' + FloatClass}>
                                                                        <span>{this.Translate(ChoosenVegName)}&nbsp;</span>
                                                                    </div>
                                                                    <div className={'GrowerPersonalShopBucketItemAmount ' + FloatClass}>
                                                                        <span>{ChoosenVegAmount}&nbsp;</span>
                                                                    </div>
                                                                    <div className={'GrowerPersonalShopBucketItemPrice ' + FloatClass}>
                                                                        <span>{(parseFloat(ChoosenVegAmount) * parseFloat(ChoosenVegPrice)).toString()}&nbsp;</span>
                                                                    </div>
                                                                    <div className={'GrowerPersonalShopBucketItemRemoveBtn ' + FloatClass}>
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
                                                                {Language.GrowerPersonalShopBucketEmpty}
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
                                                                <div className={'GrowerPersonalShopBucketItemHeaderText1 ' + FloatClass}>
                                                                    <span>{Language.GrowerPersonalShopTotalToPay}</span>
                                                                </div>
                                                                <div className={'GrowerPersonalShopBucketItemHeaderText2 ' + FloatClass}>
                                                                    <span>&nbsp;</span>
                                                                </div>
                                                                <div className={'GrowerPersonalShopBucketItemHeaderText3 ' + FloatClass}>
                                                                    <span>{this.GetTotalPayment()} {Language.Shekals}</span>
                                                                </div>
                                                                <div className={'GrowerPersonalShopBucketItemHeaderText4 ' + FloatClass}>
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
                                                <CardHeader>{Language.GrowerPersonalShopFarmerDetails}</CardHeader>
                                                <CardBody>
                                                    <span className={TextAlignClass}><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.state.FarmerFullNmae}</span>
                                                    <span className={TextAlignClass}><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.state.FarmerPhone}</span>
                                                    <span className={TextAlignClass}><img alt="" src={require('../Resources/mail.png')} size='sm' /><a href={"mailto:" + this.state.FarmerEmail}>{this.state.FarmerEmail}</a></span>
                                                    <span className={TextAlignClass}><img alt="" src={require('../Resources/location.png')} size='sm' />{this.state.FarmerLocation}</span>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        {!this.state.ListEmptyValidation ? (<div className="DuplicatesAlert" ><Alert className='DuplicatesAlertContent' color="danger">{Language.GrowerPersonalShopError}</Alert></div>) : null}
                        <div className='GrowerPersonalShopBuyButtonHolder'>
                            <Button color="success" className='GrowerPersonalShopBuyButton' >
                                {Language.GrowerPersonalShopPurchase}
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
    transactionDone: state.personalshop.transactionDone,
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
        register, clearErrors, getfarmerbyemail, resetFarmersList, getGrowerShoopinList, addToGrowerShoopinList, deleteFromShoopinList,
        ResetGrowerShoopinList, resetpersonalShoopingItems, UpdateGrowerShoopinList, addpersonalShoopingItems, getvegetablelanguages
    }
)(GrowerPersonalShop);