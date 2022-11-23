/**
 * @file Contains the code needed to access the Google Identity Services API, and 
 * implements a button to sign in with a Google account.
 * button.
 * @author Sivanesh Shanmugam, Andy Goh
 */
import React from 'react';
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

        const requestBody = {
            "id": res.profileObj.googleId
        }
        refreshTokenSetup(res);
        fetch("http://127.0.0.1:8000/api/getCalendar", {
            crossDomain: true,
            mode: 'cors',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        }).then(res => res.json())
            .then(data => {
                if (Object.keys(data).length === 0) {
                    navigate("/dars", { state: res.profileObj });
                } else {
                    navigate("/calendar", { state: { data: data , id: res.profileObj.googleId } });
                }
            })
            .catch(err => console.log(err));
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