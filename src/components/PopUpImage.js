import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PopUpImage extends Component {
    state = {
        modal: false,
    };

    static propTypes = {
        language: PropTypes.object.isRequired
    };

    componentDidUpdate(prevProps) {

    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {

        return (
            <div>
                <img
                    onClick={this.toggle}
                    alt=""
                    src={this.props.ImageUrl}
                    className='FarmerThemeImage'
                />

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalBody toggle={this.toggle}>
                        <div className='PopUpImageContainer'>
                            <img
                                alt=""
                                src={this.props.ImageUrl}
                                className='PopUpImageContent'
                            />
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.language,
    Language: state.language.Language,
    direction: state.language.direction
});

export default connect(
    mapStateToProps,
    {}
)(PopUpImage);