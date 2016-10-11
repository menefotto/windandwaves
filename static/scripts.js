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
    err.innerHTML = '<div class="alert alert-danger" role="alert">' + text + '</div>'
}


document.addEventListener("DOMContentLoaded", function(event) {
    var credentials = new Object();
    credentials.password = document.getElementById('password');
    credentials.username = document.getElementById('username');
    credentials.signupbtn = document.getElementById('signup');

    credentials.signupbtn.addEventListener('click', e => {
        alert("clicked")
        const user = credentials.username.value;
        const pass = credentials.password.value;
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(user, pass).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                Errors('The password is too weak.');
            } else {
                Errors(errorMessage);
            }
        });
    });
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log("not logged in");
    }
});