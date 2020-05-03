import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ReadMoreModal extends Component {
  state = {
    modal: false,
  };

  static propTypes = {
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
        <Link to="#" onClick={this.toggle} href='#'>
          קרא עוד
        </Link>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>מידע נוסף על החקלאי</ModalHeader>
          <ModalBody>
            <div>
              <ListGroup flush>
                <ListGroupItem className="ReadMoreItem"><span><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.props.FarmerFullNmae}</span></ListGroupItem>
                <ListGroupItem className="ReadMoreItem"><span><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.props.FarmerPhone}</span></ListGroupItem>
                <ListGroupItem className="ReadMoreItem"><span><img alt="" src={require('../Resources/mail.png')} size='sm' /><a href={"mailto:" + this.props.FarmerEmail}>{this.props.FarmerEmail}</a></span></ListGroupItem>
                <ListGroupItem className="ReadMoreItem"><span><img alt="" src={require('../Resources/location.png')} size='sm' />{this.props.FarmerLocation}</span></ListGroupItem>
                {this.props.FarmerFieldCropPlan.avaliabile ?
                <ListGroupItem className="ReadMoreItem"><span><img alt="" src={require('../Resources/FieldCropMoney.png')} size='sm' />עלות תכנית גידולי שדה: {this.props.FarmerFieldCropPlan.cost} ש"ח</span></ListGroupItem>
                : null}
                {this.props.FarmerFieldCropPlan.avaliabile ?
                <ListGroupItem className="ReadMoreItem"><span><img alt="" src={require('../Resources/FieldCrop.png')} size='sm' />גידולי שדה אפשריים: {this.props.FarmerFieldCrops}</span></ListGroupItem>
                : null}
                </ListGroup>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

export default connect(
  mapStateToProps,
  { }
)(ReadMoreModal);