import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class TimoutMsg extends Component {
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
                        {Language.PaymentTimeoutMsg}
                    </span>
                    <span className='GeneralMsgHeaderText2'>
                        {Language.PaymentTimeoutMsgDesc}
                    </span>
                    <span className="GeneralMsgButtonHolder">
                        <Button className="GeneralMsgBtn" type="button" size="lg" tag={Link} to="/">{Language.NavBarHomePage}</Button>
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
)(TimoutMsg);