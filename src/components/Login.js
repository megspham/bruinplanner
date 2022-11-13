/**
 * @file Contains the code needed to access the Google Identity Services API, and 
 * implements a button to sign in with a Google account.
 * button.
 * @author Sivanesh Shanmugam, Andy Goh
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from './utils/refreshToken';
import { CustomizedButton } from './CustomizedButton';

/**
 * Client ID needed to connect to Google Identity Services API
 * @constant
 * @type {string}
 */
const clientId =
    '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';

/**
 * 
 * @returns Google login button
 */
function Login() {
    const navigate = useNavigate();

    /**
     * Behavior upon successful Google sign-in. The token is refreshed, and the user is
     * redirected to the DARs page. The response object is sent to the DARs page as a state.
     * @function
     * @param {Object} res GoogleAuth response object, containing user information 
     */
    const onSuccess = (res) => {
        console.log('Login Success: currentUser:', res.profileObj);
        refreshTokenSetup(res);
        navigate("/dars", { state: res.profileObj });
    };

    const onFailure = (res) => {
        console.log('Login failed: res:', res);
        alert(
            `Failed to login. Please try again.`
        );
    };

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                render={renderProps => (
                    <CustomizedButton onClick={renderProps.onClick} text="Sign in with Google" />
                )}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                // style={{ marginTop: '100px' }}
                isSignedIn={false}
            />
        </div>
    );
}

export default Login;