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
    ActivateSuccessMessage: false,
    plan1name: '',
    plan1cost: '',
    plan2name: '',
    plan2cost: '',
    plan3name: '',
    plan3cost: '',
    fieldcropplanname: '',
    fieldcropplancost: '',
    FirstTimeIn: true
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
    const { system, SystemData, error } = this.props;
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

    try{
      if (SystemData !== prevProps.SystemData && this.state.FirstTimeIn) {
        this.setState({
            hamamadefaultsize: SystemData.hamamadefaultsize,
            plan1name: SystemData.plan1name,
            plan1cost: SystemData.plan1cost,
            plan2name: SystemData.plan2name,
            plan2cost: SystemData.plan2cost,
            plan3name: SystemData.plan3name,
            plan3cost: SystemData.plan3cost,
            fieldcropplanname: SystemData.fieldcropplanname,
            fieldcropplancost: SystemData.fieldcropplancost,
            FirstTimeIn: false
        });
      }
    }
    catch{}
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { hamamadefaultsize, plan1name, plan1cost, plan2name, plan2cost, plan3name, plan3cost, fieldcropplanname, fieldcropplancost } = this.state;
    const { SystemData } = this.props.system;

    const newItem = {
        hamamadefaultsize,
        plan1name,
        plan1cost,
        plan2name,
        plan2cost,
        plan3name,
        plan3cost,
        fieldcropplanname,
        fieldcropplancost
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
                    value={this.state.hamamadefaultsize}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='plan1name'>שם מסלול גידולי ירקות 1</Label>
                  <Input
                    type='text'
                    name='plan1name'
                    id='plan1name'
                    value={this.state.plan1name}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='plan1cost'>מחיר מסלול גידולי ירקות 1</Label>
                  <Input
                    type='text'
                    name='plan1cost'
                    id='plan1cost'
                    value={this.state.plan1cost}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='plan2name'>שם מסלול גידולי ירקות 2</Label>
                  <Input
                    type='text'
                    name='plan2name'
                    id='plan2name'
                    value={this.state.plan2name}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='plan2cost'>מחיר מסלול גידולי ירקות 2</Label>
                  <Input
                    type='text'
                    name='plan2cost'
                    id='plan2cost'
                    value={this.state.plan2cost}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='plan3name'>שם מסלול גידולי ירקות 3</Label>
                  <Input
                    type='text'
                    name='plan3name'
                    id='plan3name'
                    value={this.state.plan3name}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='plan3cost'>מחיר מסלול גידולי ירקות 3</Label>
                  <Input
                    type='text'
                    name='plan3cost'
                    id='plan3cost'
                    value={this.state.plan3cost}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='fieldcropplanname'>שם מסלול גידולי שדה</Label>
                  <Input
                    type='text'
                    name='fieldcropplanname'
                    id='fieldcropplanname'
                    value={this.state.fieldcropplanname}
                    className='mb-3'
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <Label for='fieldcropplancost'>מחיר מסלול גידולי שדה</Label>
                  <Input
                    type='text'
                    name='fieldcropplancost'
                    id='fieldcropplancost'
                    value={this.state.fieldcropplancost}
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
        : <div className='PersonalAreaWelcomeContainer' ><span className='PersonalAreaWelcomeText1' >ממשק מנהל מערכת</span><span className='PersonalAreaWelcomeText2'>CO-Greenhouse</span></div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  system: state.system,
  SystemData: state.system.SystemData
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getSystemData, updateSystemData }
)(SystemSettings);