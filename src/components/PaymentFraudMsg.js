import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class PaymentFraudMsg extends Component {
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
                <div className='GeneralMsgHeader'>
                    <span className='GeneralMsgHeaderText1'>
                        {Language.PaymentFraudMsg}
                    </span>
                    <span className='GeneralMsgHeaderText2'>
                        {Language.PaymentFraudMsgDesc}
                    </span>
                    <span className="GeneralMsgButtonHolder">
                        <a className="FraudMsgBtn" href="https://www.co-greenhouse.com/contact">{Language.NavBarContactUs}</a>
                    </span>
                </div>
            </div >
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
)(PaymentFraudMsg);