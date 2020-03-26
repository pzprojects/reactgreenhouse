import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';
import { Spinner } from 'reactstrap';

class Loader extends Component {
  state = {
    modal: true
  };


  componentDidUpdate() {

    // If authenticated, close modal
    
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} >
          <ModalHeader >Loading...</ModalHeader>
          <ModalBody>
            <div className='SpinnerHolder'>
              <Spinner className='Spinner1' type="grow" color="success" />
              <Spinner className='Spinner2' type="grow" color="success" />
              <Spinner className='Spinner3' type="grow" color="success" />
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Loader