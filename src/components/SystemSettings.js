import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { getSystemData, updateSystemData } from '../actions/systemAction';
import Loader from '../components/Loader';

class SystemSettings extends Component {
  state = {
    modal: false,
    msg: null,
    ActivateLoader: false,
    redirect: null,
    UserActive: false,
    hamamadefaultsize: '',
    ActivateSuccessMessage: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    getSystemData: PropTypes.func.isRequired,
    updateSystemData: PropTypes.func.isRequired,
    system: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.getSystemData();
  }

  componentDidUpdate(prevProps) {
    const { system, error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    if (system !== prevProps.system) {
        this.setState({
            ActivateLoader: false
        });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { hamamadefaultsize } = this.state;
    const { SystemData } = this.props.system;

    const newItem = {
        hamamadefaultsize
    };

    this.props.updateSystemData(SystemData._id, newItem);

    this.setState({
      ActivateLoader: !this.state.ActivateLoader,
      ActivateSuccessMessage: true
    });

    setTimeout(
      function() {
        this.setState({ActivateSuccessMessage: false});
      }
    .bind(this),
    3000
    );

  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    try{
        const { SystemData } = this.props.system;
        var hamamadefaultsizeNum = SystemData.hamamadefaultsize;
    }
    catch{}

    return (
      <div>
        {this.state.msg ? (
          <Alert color='danger'>{this.state.msg}</Alert>
        ) : null}
        {isAuthenticated ? 
          user.usertype === 'SysAdmin' ?
          <Container>
          <Form onSubmit={this.onSubmit}>
              <FormGroup>
              <div className='SystemDetailsHeader'>הגדרות מערכת</div>
              <div className='SystemDetails'>
                <div className="form-group">
                  <Label for='hamamadefaultsize'>גודל חלקה סטנדרטי במ"ר</Label>
                  <Input
                    type='text'
                    name='hamamadefaultsize'
                    id='hamamadefaultsize'
                    placeholder={hamamadefaultsizeNum}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
              </div>
              </FormGroup>
              <div className='SystemUpdateButtonHolder'>
                <Button color='success' className='SystemUpdateButton' >
                  עדכן
                </Button>
              </div>
              <div className='SystemSuccessMsg'>
                {this.state.ActivateSuccessMessage ? (
                  <Alert color='success'>הנתונים עודכנו בהצלחה</Alert>
                ) : null}
              </div>
            </Form>
            { this.state.ActivateLoader ? <Loader /> : null }
          </Container>
          : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >משתמש זה אינו מנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >הירשם כמנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  system: state.system
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getSystemData, updateSystemData }
)(SystemSettings);