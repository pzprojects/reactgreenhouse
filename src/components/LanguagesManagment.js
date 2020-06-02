import React, { Component } from 'react';
import {
    Button,
    Container,
    Alert,
    UncontrolledPopover,
    PopoverHeader,
    PopoverBody,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { getvegetablelanguages, deletevegetablelanguage } from '../actions/vegLanguageConvertorAction';
import { TiDeleteOutline } from "react-icons/ti";
import VegLanguageAddItem from './VegLanguageAddItem';
import VegLanguageUpdateItem from './VegLanguageUpdateItem';

class LanguagesManagment extends Component {
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
        getvegetablelanguages: PropTypes.func.isRequired,
        deletevegetablelanguage: PropTypes.func.isRequired,
        languagedbconversion: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.getvegetablelanguages();
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
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
        this.props.deletevegetablelanguage(id);
    };

    render() {
        const { vegetablelsanguages } = this.props;
        const { isAuthenticated, user } = this.props.auth;

        return (
            <div>
                {this.state.msg ? (
                    <Alert color='danger'>{this.state.msg}</Alert>
                ) : null}
                {isAuthenticated ?
                    user.usertype === 'SysAdmin' ?
                        <Container>
                            <VegLanguageAddItem />
                            <div className='VegLanguagesListContainer'>
                                <ListGroup>
                                    <TransitionGroup className='VegLanguagesListHeader'>
                                        <CSSTransition timeout={500} classNames='fade'>
                                            <ListGroupItem>
                                                <span className='VegLanguagesListItemHeaderText1'>שם הירק</span>
                                                <span className='VegLanguagesListItemHeaderText2'>תרגום</span>
                                                <span className='VegLanguagesListItemHeaderText3'>&nbsp;</span>
                                            </ListGroupItem>
                                        </CSSTransition>
                                    </TransitionGroup>
                                </ListGroup>
                                <ListGroup>
                                    <TransitionGroup className='VegLanguagesListBody'>
                                        {vegetablelsanguages.map(({ _id, vegname, langconvert }) => (
                                            <CSSTransition key={_id} timeout={500} classNames='fade'>
                                                <ListGroupItem>
                                                    <span className='VegLanguagesListItemName'>{vegname}&nbsp;</span>
                                                    <span className='VegLanguagesListItemTranslation'>{langconvert.map(({ langname, langvalue }) => (
                                                        <span key={langname}><p>{langname} : {langvalue}</p></span>
                                                    ))}&nbsp;</span>
                                                    <span className='VegLanguagesListItemButtons'>
                                                        {this.props.isAuthenticated ? (
                                                            <span className='VegLanguagesListItemButtonsHolder'>
                                                                <Button color="danger" id={"PopoverLegacy" + _id} size='sm' className='AdminVegRemoveBtn' type="button" ><TiDeleteOutline size={24} /></Button>
                                                                <UncontrolledPopover trigger="legacy" placement="bottom" target={"PopoverLegacy" + _id}>
                                                                    <PopoverHeader style={{ textAlign: 'center' }}>הסרת שפות ירק</PopoverHeader>
                                                                    <PopoverBody>
                                                                        <span className="AdminDeleteVegForGoodText">האם אתה בטוח שברצונך למחוק את שפות הירק לצמיתות?</span>
                                                                        <span className="AdminDeleteVegForGoodButtons">
                                                                            <span><Button outline color="success" onClick={() => this.onDeleteClick(_id)} type="button" >אישור</Button></span>
                                                                        </span>
                                                                    </PopoverBody>
                                                                </UncontrolledPopover >
                                                                <VegLanguageUpdateItem ItemId={_id} ItemName={vegname} ItemTranslationList={langconvert} />
                                                            </span>
                                                        ) : null}
                                                    </span>
                                                </ListGroupItem>
                                            </CSSTransition>
                                        ))}
                                    </TransitionGroup>
                                </ListGroup>
                            </div>
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
    languagedbconversion: state.languagedbconversion,
    vegetablelsanguages: state.languagedbconversion.vegetablelsanguages
});

export default connect(
    mapStateToProps,
    { register, clearErrors, getvegetablelanguages, deletevegetablelanguage }
)(LanguagesManagment);