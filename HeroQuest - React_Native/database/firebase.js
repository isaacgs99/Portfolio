import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDAMD5Smzp-p6LE9OhUzbjFUZhkOGfp04A",
    authDomain: "heroquest-bec09.firebaseapp.com",
    databaseURL: "https://heroquest-bec09-default-rtdb.firebaseio.com",
    projectId: "heroquest-bec09",
    storageBucket: "heroquest-bec09.appspot.com",
    messagingSenderId: "589079479295",
    appId: "1:589079479295:web:9a0fef4af8992e1b759dca",
    measurementId: "G-XRYSK5QHNC"
};

// Initialize Firebase
firebase.default.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase.default;




/* firebase.initializeApp(config);

// Listen for authentication state to change.
firebase.auth().onAuthStateChanged(user => {
  if (user != null) {
    console.log('We are authenticated now!');
  }

  // Do other things
});

async function loginWithFacebook() {
  await Facebook.initializeAsync('<FACEBOOK_APP_ID>');

  const { type, token } = await Facebook.logInWithReadPermissionsAsync({
    permissions: ['public_profile'],
  });

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    // const credential = firebase.auth.FacebookAuthProvider.credential(token);
    const credential = firebase.default.auth.GoogleAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    firebase
      .auth()
      .signInWithCredential(credential)
      .catch(error => {
        // Handle Errors here.
      });
  }
}
*/