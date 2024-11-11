import React from 'react';
import './signUpHead.css';
import signUpImg from '../../assets/signUpImages/acaa3f24a138ec9c6bbdf068ba64c088.png';

export default function SignUpHead() {
  return (
    <div className="signUp__headSec">
      <div className='container'>
        <div className="row">
          <div className="col-12">
            <h1>
              Welcome to
            </h1>
            <div className="signUp__heading-image">
              <img src={signUpImg} alt="sign up page Logo" />
            </div>
            <p>
              Attracting the Best to Your Doorstep.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
