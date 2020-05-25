import React, { Component } from 'react';
import {
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
    const { Language, direction } = this.props;
    let ReadMoreItem = "ReadMoreItemRtl";
    if(direction === 'rtl'){
     ReadMoreItem = "ReadMoreItemRtl";
    }
    else{
     ReadMoreItem = "ReadMoreItemLtr";
    }

    return (
      <div>
        <Link to="#" onClick={this.toggle} href='#'>
          {Language.GrowerFarmerReadMore}
        </Link>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{Language.ReadMoreTitle}</ModalHeader>
          <ModalBody>
            <div>
              <ListGroup flush>
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/Name.png')} size='sm' />{this.props.FarmerFullNmae}</span></ListGroupItem>
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/phone.png')} size='sm' />{this.props.FarmerPhone}</span></ListGroupItem>
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/mail.png')} size='sm' /><a href={"mailto:" + this.props.FarmerEmail}>{this.props.FarmerEmail}</a></span></ListGroupItem>
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/location.png')} size='sm' />{this.props.FarmerLocation}</span></ListGroupItem>
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/AactiveFarms.png')} size='sm' />{this.props.FarmerNumberOfActiveFarms} {Language.ReadMoreActiveFarms}</span></ListGroupItem>
                {this.props.FarmerFieldCropPlan.avaliabile ?
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/FieldCropMoney.png')} size='sm' />{Language.ReadMoreFieldsCropsCostInformation} {this.props.FarmerFieldCropPlan.cost} {Language.Shekals}</span></ListGroupItem>
                : null}
                {this.props.FarmerFieldCropPlan.avaliabile ?
                <ListGroupItem className={ReadMoreItem}><span><img alt="" src={require('../Resources/FieldCrop.png')} size='sm' />{Language.ReadMoreFieldsCrops} {this.props.FarmerFieldCrops}</span></ListGroupItem>
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
  language: state.language,
  Language: state.language.Language,
  direction: state.language.direction
});

export default connect(
  mapStateToProps,
  { }
)(ReadMoreModal);