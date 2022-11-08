/**
 * @file Contains the code needed to access the Google Identity Services API, and 
 * implements a button to logout from a Google account.
 * button.
 * @author Sivanesh Shanmugam, Andy Goh
 */

import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { CustomizedButton } from './CustomizedButton.js'

const clientId =
  '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';

/**
 * 
 * @returns Google logout button
 */
function Logout() {
  const navigate = useNavigate();

  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully ✌');
    navigate('/');
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        render={renderProps => (
          <CustomizedButton onClick={renderProps.onClick} text="Sign in with Google" />
        )}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;