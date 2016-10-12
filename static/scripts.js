const config = {
    apiKey: "AIzaSyCsy7Y7JIBrblVA8n8yzsbLYDdiUymgG68",
    authDomain: "testapp-e2023.firebaseapp.com",
    databaseURL: "https://testapp-e2023.firebaseio.com",
    storageBucket: "testapp-e2023.appspot.com",
    messagingSenderId: "317031868553"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
        console.log("logged in");
    } else {
        console.log("not logged in");
    }
});



PrintError = function(text) {
    const err = document.getElementById('err');
    err.innerHTML = message;
}


$(function() {

    $("#signup").click(function() {
        const user = $("#username").val();
        const pass = $("#password").val();
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(user, pass).catch(function(error) {

            PrintError(error.message);
        });
    });

    $("#login").click(function() {
        const user = $("#username").val();
        const pass = $("#password").val();
        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(user, pass).catch(function(error) {

            PrintError(error.message);
        });
    });

    $("#reset").click(function() {
        const user = $("#username").val();
        const auth = firebase.auth();

        auth.sendPasswordResetEmail(user).catch(function(error) {

            PrintError(error.message);
        });
    });

    lastError = $("#err").text();
    console.log(lastError);
    if (lastError != " ") {
        localStorage.setItem("lastError", "");
    } else {
        PrintError(GetLastError());
    }
});