const config = {
    apiKey: "AIzaSyCsy7Y7JIBrblVA8n8yzsbLYDdiUymgG68",
    authDomain: "testapp-e2023.firebaseapp.com",
    databaseURL: "https://testapp-e2023.firebaseio.com",
    storageBucket: "testapp-e2023.appspot.com",
    messagingSenderId: "317031868553"
};
firebase.initializeApp(config);

Errors = function(text) {
    var err = document.getElementById('err');
    const errbtn = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
    const message = '<div class="alert alert-danger" role="alert">' + errbtn + text + '</div>'
    err.innerHTML = message
}

document.addEventListener("DOMContentLoaded", function(event) {
    var credentials = new Object();
    var errMsg = "";

    credentials.password = document.getElementById('password');
    credentials.username = document.getElementById('username');
    credentials.signupbtn = document.getElementById('signup');
    credentials.loginbtn = document.getElementById('login');
    credentials.resetbtn = document.getElementById('reset');

    if (credentials.signupbtn) {
        credentials.signupbtn.addEventListener('click', e => {
            const user = credentials.username.value;
            const pass = credentials.password.value;
            const auth = firebase.auth();

            auth.createUserWithEmailAndPassword(user, pass).catch(function(error) {
                var errorCode = error.code;
                errorMsg = error.message;

                Errors(errorMsg);
            });
        });
    }

    if (credentials.loginbtn) {
        credentials.loginbtn.addEventListener('click', e => {
            const user = credentials.username.value;
            const pass = credentials.password.value;
            const auth = firebase.auth();

            auth.signInWithEmailAndPassword(user, pass).catch(function(error) {
                var errorCode = error.code;
                errorMsg = error.message;

                Errors(errorMsg);
            });
        });
    }

    if (credentials.resetbtn) {
        credentials.resetbtn.addEventListener('click', e => {
            const user = credentials.username.value;
            const pass = credentials.password.value;
            const auth = firebase.auth();

            auth.sendPasswordResetEmail(user).catch(function(error) {
                var errorCode = error.code;
                errorMsg = error.message;

                Errors(errorMsg);
            });
        });
    }

});

firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
        console.log("logged in");
    } else {
        console.log("not logged in");
    }
});