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

var pushError = function(error) {
    $("#errp").append("<strong>Ops something went wrong! </strong>" + error.message);
    $("#err").removeClass("hide");
}

var pushMessage = function(message) {
    $("#errp").append("<strong>Operation perform successfully! </strong>" + message);
    $("#errp").removeClass("alert-danger");
    $("#errp").addClass("alert-success");
    $("#err").removeClass("hide");
}

$(function() {
    $(".close").click(function() {
        location.reload();
    });

    $("#signup").click(function(event) {
        event.preventDefault();

        const user = $("#username").val();
        const pass = $("#password").val();
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(user, pass).then(function(value) {
            location.replace("loggedin");
        }, function(error) {
            pushError(error);
        });
    });

    $("#login").click(function(event) {
        event.prenventDefault();

        const user = $("#username").val();
        const pass = $("#password").val();
        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(user, pass).then(function(value) {
            location.replace("loggedin");
        }, function(error) {
            pushError(error);
        });
    });

    $("#reset").click(function(event) {
        event.preventDefault();

        const user = $("#username").val();
        const auth = firebase.auth();

        auth.sendPasswordResetEmail(user).then(function(value) {
            pushMessage(value);
        }, function(error) {
            pushError(error);
        });
    });

});