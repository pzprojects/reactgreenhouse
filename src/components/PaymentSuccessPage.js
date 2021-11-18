import React, { Component } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import { Spinner } from 'reactstrap';
import axios from "axios";
import { API_URL } from '../config/keys'

class Loader extends Component {
    state = {
        modal: true
    };


    componentDidMount() {
        //this.SavePaymentData();
    }

    SavePaymentData = () => {
        const userrole = 'מגדל';
        const useremail = 'test2@projects.org.il';
        const farmertopay = 'farmer@projects.org.il';
        const phone = '0500000000';
        const sumpayed = '50';
        const cardtype = '1';
        const currency = '1';

        const NewPayment = {
            userrole,
            useremail,
            farmertopay,
            phone,
            sumpayed,
            cardtype,
            currency
        };

        axios
            .post(
                `${API_URL}/api/payments`, NewPayment
            )
            .then(res => console.log("RESPONSE FROM SERVER TO CLIENT:", res))
            .catch(err => console.log("SERVER ERROR TO CLIENT:", err))
    };

    render() {
        return (
            <div>
                <div className='SpinnerHolder'>
                    <Spinner className='Spinner1' type="grow" color="success" />
                    <Spinner className='Spinner2' type="grow" color="success" />
                    <Spinner className='Spinner3' type="grow" color="success" />
                </div>
            </div>
        );
    }
}

export default Loader