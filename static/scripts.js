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


$("#signup").click(function() {
    const user = $("#username").val();
    const pass = $("#password").val();
    const auth = firebase.auth();

    console.log(user + pass);
    auth.createUserWithEmailAndPassword(user, pass).catch(function(error) {
        var errorCode = error.code;
        errorMsg = error.message;

        Errors(errorMsg);
    });
});

$("#login").click(function() {
    const user = $("#username").val();
    const pass = $("#password").val();
    const auth = firebase.auth();
    alert(user + pass);

    auth.signInWithEmailAndPassword(user, pass).catch(function(error) {
        var errorCode = error.code;
        errorMsg = error.message;

        Errors(errorMsg);
    });
});

$("#reset").click(function() {
    const user = $("#username").val();
    const auth = firebase.auth();
    alert("user" + user);
    auth.sendPasswordResetEmail(user).catch(function(error) {
        var errorCode = error.code;
        errorMsg = error.message;

        Errors(errorMsg);
    });
});


firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
        console.log("logged in");
    } else {
        console.log("not logged in");
    }
});