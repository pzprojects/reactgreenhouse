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
import { getGrowerShoopinList, addToGrowerShoopinList, deleteFromShoopinList, ResetGrowerShoopinList } from '../actions/growerShoppingListAction';
import { Redirect } from "react-router-dom";
import { API_URL } from '../config/keys';
import { FiEdit } from "react-icons/fi";

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
        SuccessFileUpload: false,
        FieldCropPlanActive: false,
        ChoosenVegName: '',
        ChoosenVegAmount: "0",
        ChoosenVegPrice: ''
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
        ResetGrowerShoopinList: PropTypes.func.isRequired
    };

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        const { farmers, error, isAuthenticated } = this.props;
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

            try{
                if (user.usertype !== 'מגדל') {
                    this.setState({
                        redirect: '/'
                    });
                }
    
                if (user.workingwith[0].active) {
                    this.props.getfarmerbyemail(user.workingwith[0].email);
                }
                else{
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
            if (isAuthenticated && this.state.SuccessFileUpload) {
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
        this.setState({
            modal: !this.state.modal
        });
        this.setState({
            ActivateLoader: !this.state.ActivateLoader,
            redirect: '/DeatilsUpdatedMSG'
        });
    };

    ValidateForm = () => {

        var Validated = true;
        var ScrollToLocation = "top";

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

        if (this.state.phone === '') {
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
                    ChoosenVegAmount: "0",
                    ChoosenVegPrice: this.GetVegPrice(e.target.value)
                });
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

    DecreseAmount = () => {
        this.setState({
            ChoosenVegAmount: (parseFloat(this.state.ChoosenVegAmount) - 1).toString()
        });
    }

    IncreseAmount = () => {
        this.setState({
            ChoosenVegAmount: (parseFloat(this.state.ChoosenVegAmount) + 1).toString()
        });
    }

    AddToBucket = () => {
        const { ChoosenVegName, ChoosenVegAmount, ChoosenVegPrice } = this.state;
        const Item = {
            ChoosenVegName,
            ChoosenVegAmount,
            ChoosenVegPrice
        };
        this.props.addToGrowerShoopinList(Item)
    }

    render() {
        const { farmers } = this.props.farmer;
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
                                <div className="GrowerPersonalShop-form-group">
                                    <Label>החקלאי שנבחר:</Label>
                                    <div className="GrowerPersonalShopChoosingFarmer">
                                        <span><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.state.FarmerFullNmae}</span>
                                        <span><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.state.FarmerPhone}</span>
                                        <span><img alt="" src={require('../Resources/mail.png')} size='sm' /><a href={"mailto:" + this.state.FarmerEmail}>{this.state.FarmerEmail}</a></span>
                                        <span><img alt="" src={require('../Resources/location.png')} size='sm' />{this.state.FarmerLocation}</span>
                                    </div>
                                </div>
                                <div className="GrowerPersonalShop-form-group">
                                    <div className="GrowerPersonalShopItemsToBuy">
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
                                                    <span>{this.state.ChoosenVegPrice}</span>
                                                </div>
                                                <div className="GrowerPersonalShopVegAmount">
                                                    <span><Button outline color="success" onClick={() => this.DecreseAmount()} type="button" >-</Button></span>
                                                    <Label for='ChoosenVegAmount'></Label>
                                                    <Input type="text" name="ChoosenVegAmount" id="ChoosenVegAmount" className='GrowerVeg mb-3' onChange={this.onChange} value={this.state.ChoosenVegAmount} />
                                                    <span><Button outline color="success" onClick={() => this.IncreseAmount()} type="button" >+</Button></span>
                                                </div>
                                                <div className="GrowerPersonalShopVegAddToBucket">
                                                    <span><Button outline color="success" onClick={() => this.AddToBucket()} type="button" >הוסף לסל</Button></span>
                                                </div>
                                            </ListGroupItem>
                                        </ListGroup>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
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
    growershop: state.growershop
});

export default connect(
    mapStateToProps,
    { register, clearErrors, getfarmerbyemail, getGrowerShoopinList, addToGrowerShoopinList, deleteFromShoopinList, ResetGrowerShoopinList }
)(GrowerPersonalShop);