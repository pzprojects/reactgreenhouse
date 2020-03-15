import React, { Component } from 'react';
import {} from 'reactstrap';
import { Spinner } from 'reactstrap';

class Loader extends Component {
  state = {
  };

  render() {
    return (
      <div className='SpinnerHolder'>
        <Spinner className='Spinner1' type="grow" color="success" />
        <Spinner className='Spinner2' type="grow" color="success" />
        <Spinner className='Spinner3' type="grow" color="success" />
      </div>
    );
  }
}

export default Loader