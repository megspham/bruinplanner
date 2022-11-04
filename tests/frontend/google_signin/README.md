# Google Sign-in Tests
As this is a frontend UI test, there is no code to automate testing. The input is an interaction from a user, while the output is a visual element displayed on the screen.


## Test 1 (Positive)

### Objective

This test checks whether or not the user is taken to the DARs page upon a successful login from the landing page.

### Input

The user clicks the "Sign in with Google" button on the landing page, and successfuly logs in with their Google account.

### Expected Output

The user is redirected to the DARs page, which has a welcome message with their name: "Welcome, {name}!" 


### Actual Output

![GIF of login success](signin_success.gif)

## Test 2 (Negative)

### Objective

This test checks whether or not the user is alerted of an unsuccessful login

### Input

The user clicks the "Sign in with Google" button on the landing page, but the login process is unsuccessful.

### Expected Output

The user is given an alert of the failure, and is *not* redirected to the DARs page.

### Actual Output

![GIF of login failure](signin_failure.gif)
