import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

class PaymentSuccessPage extends Component {
    state = {
        modal: true
    };

    static propTypes = {
        language: PropTypes.object.isRequired
    };

    componentDidMount() {

    }

    render() {
        const { Language } = this.props;
        return (
            <div>
                <div className='PaymentSuccessHeader'>
                    <span className='PaymentSuccessHeaderText1'>
                        {Language.PaymentSuccessMsg}
                    </span>
                    <span className='PaymentSuccessHeaderText2'>
                        {Language.PaymentSuccessMsgDesc}
                    </span>
                </div>
                <div className='SpinnerHolder'>
                    <Spinner className='Spinner1' type="grow" color="success" />
                    <Spinner className='Spinner2' type="grow" color="success" />
                    <Spinner className='Spinner3' type="grow" color="success" />
                </div>
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
)(PaymentSuccessPage);