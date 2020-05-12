import React, { Component } from 'react';
import {
  Container
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';
import { getVegeLogs } from '../actions/veglogAction';
import { ExportCSV }  from './ExportCSV';

class SystemLogs extends Component {
  state = {
    modal: false,
    msg: null,
    redirect: null,
    UserActive: false
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    veglog: PropTypes.object.isRequired,
    getVegeLogs: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getVegeLogs();
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  ReturnChoosingVegtabilesAsStringForExcel = (Mychoosenvegetables) => {
    var VegAsString = '';
    for(var i=0; i<Mychoosenvegetables.length ;i++){
      if(Mychoosenvegetables.length === (i+1)){
        VegAsString += Mychoosenvegetables[i].name + ": עודכן ממחיר " + Mychoosenvegetables[i].pricebefore + " שקלים למחיר " + Mychoosenvegetables[i].priceafter + " שקלים ";
      }
      else VegAsString += Mychoosenvegetables[i].name + ": עודכן ממחיר " + Mychoosenvegetables[i].pricebefore + " שקלים למחיר " + Mychoosenvegetables[i].priceafter + " שקלים, ";   
    }
    return VegAsString;
  };

  GetLogsForExcel = (logs) => {
    const LogToExcel = logs.map( log => ({
      'מזהה': log._id,
      'שם החקלאי': log.farmername, 
      'אימייל': log.farmeremail, 
      'מחירי ירקות ששונו': this.ReturnChoosingVegtabilesAsStringForExcel(log.vegetablesafterchange)
    }));

    return LogToExcel;
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { veglogs } = this.props.veglog;

    return (
      <div>
        {isAuthenticated ? 
          user.usertype === 'SysAdmin' ?
          <Container>
            <div className='SysLogsHolder' >
                <div className='SysLogsHeader'>בכדי לצפות במחירים של גידולי החממה וגידולי השדה ששונו על ידי החקלאים ייצא את הנתונים לאקסל</div>
                <div className='SysLogsBody'><ExportCSV csvData={this.GetLogsForExcel(veglogs)} fileName='שינוי מחירים על ידי חקלאים' /></div>
            </div>
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
  veglog: state.veglog,
  veglogs: state.veglog.veglogs
});

export default connect(
  mapStateToProps,
  { register, clearErrors, getVegeLogs }
)(SystemLogs);