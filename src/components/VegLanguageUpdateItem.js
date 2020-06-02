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
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import { connect } from 'react-redux';
import { updatevegetablelanguage } from '../actions/vegLanguageConvertorAction';
import PropTypes from 'prop-types';
import { FiEdit } from "react-icons/fi";

class VegLanguageUpdateItem extends Component {
    state = {
        modal: false,
        vegname: '',
        langname: 'he',
        langvalue: '',
        langconvert: [],
        ItemId: ''
    };

    componentDidMount() {
        this.setState({
            vegname: this.props.ItemName,
            langconvert: this.props.ItemTranslationList,
            ItemId: this.props.ItemId
        });
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    AddVegLanguageToList = () => {
        var langconvertlist = this.state.langconvert;
        if(langconvertlist.some(item => this.state.langname === item.langname)){
            langconvertlist = langconvertlist.filter(item => this.state.langname !== item.langname);
            langconvertlist.push({langname: this.state.langname, langvalue: this.state.langvalue});
        }
        else{
            langconvertlist.push({langname: this.state.langname, langvalue: this.state.langvalue});
        }
        this.setState({
            langconvert: langconvertlist,
            NameBlocked: true
        });
    };

    onSubmit = e => {
        e.preventDefault();

        const { vegname, langconvert } = this.state;

        const newItem = {
            vegname,
            langconvert
        };

        // Add item via addItem action
        this.props.updatevegetablelanguage(this.state.ItemId, newItem);

        // Close modal
        this.toggle();
    };

    render() {
        const { langconvert } = this.state;
        return (
            <div className='AdminVegUpdateButtonHolder' >
                {this.props.isAuthenticated ? (
                    <Button
                        className='AdminVegUpdateBtn'
                        color='info'
                        size='sm'
                        onClick={this.toggle}
                    >
                        <FiEdit size={20} />
                    </Button>
                ) : (
                        null
                    )}

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>עדכון נתוני ירק</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <div className="VegLanguage-form-group">
                                    <Label for='vegname'>שם הירק</Label>
                                    <Input
                                        type='text'
                                        name='vegname'
                                        id='vegname'
                                        placeholder=''
                                        className='mb-3'
                                        onChange={this.onChange}
                                        value={this.state.vegname}
                                        required
                                    />
                                </div>
                                <div className="VegLanguage-form-group">
                                    <div className="VegLanguage-form-group-child">
                                        <Label for='langname'></Label>
                                        <Input type="select" name="langname" id="langname" className='mb-3' onChange={this.onChange} value={this.state.langname}>
                                            <option value='he' >עברית</option>
                                            <option value='en'>english</option>
                                        </Input>
                                    </div>
                                    <div className="VegLanguage-form-group-child">
                                        <Label for='langvalue'></Label>
                                        <Input
                                            type='text'
                                            name='langvalue'
                                            id='langvalue'
                                            placeholder='תרגום'
                                            className='mb-3'
                                            onChange={this.onChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="VegLanguage-form-group">
                                    <span><Button outline color="success" onClick={() => this.AddVegLanguageToList()} type="button" >הוסף</Button></span>
                                </div>
                                <div className="VegLanguage-form-group">
                                    <ListGroup>
                                        {langconvert.map(({ langname, langvalue }) => (
                                            <ListGroupItem key={langname}><span>{langname}:</span><span> {langvalue}</span></ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </div>
                                <Button color='success' style={{ marginTop: '2rem' }} block>
                                    שמור וסיים
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    languagedbconversion: state.languagedbconversion,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(
    mapStateToProps,
    { updatevegetablelanguage }
)(VegLanguageUpdateItem);