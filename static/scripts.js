const config = {
    apiKey: "AIzaSyCsy7Y7JIBrblVA8n8yzsbLYDdiUymgG68",
    authDomain: "testapp-e2023.firebaseapp.com",
    databaseURL: "https://testapp-e2023.firebaseio.com",
    storageBucket: "testapp-e2023.appspot.com",
    messagingSenderId: "317031868553"
};
firebase.initializeApp(config);


var credentials = new Object();

window.document.onload = function() {
    credentials.password = document.getElementById('password');
    credentials.username = document.getElementById('username');
    credentials.signupbtn = document.getElementById('signup');
};

credentials.signupbtn.addEventListener('click', e => {
    const user = credentials.username.value;
    const pass = credentials.password.value;

    firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
});


firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log("not logged in");
    }
});