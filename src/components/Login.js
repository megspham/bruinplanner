// Source: https://dev.to/sivaneshs/add-google-login-to-your-react-apps-in-10-mins-4del

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from './utils/refreshToken';
import { CustomizedButton } from './CustomizedButton';

const clientId =
    '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';

function Login() {
    const navigate = useNavigate();

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