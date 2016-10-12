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

var setDisplayError = function(state) {
    localStorage.setItem("displayError", state);
}
setDisplayError("false");


var checkShowError = function() {
    var displayError = localStorage.getItem("displayError");
    console.log("de: "+ displayError);
    if (displayError === "true") {
        $("#err").removeClass("hide");
        setDisplayError("true");
    } else {
        $("#err").addClass("hide");
        setDisplayError("false");
    }
}

$(function() {
    checkShowError();


    $("#signup").click(function() {
        const user = $("#username").val();
        const pass = $("#password").val();
        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(user, pass).catch(function(error) {
            $("#errp").append(error.message);
            setDisplayError("true");
        });
    });

    $("#login").click(function() {
        const user = $("#username").val();
        const pass = $("#password").val();
        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(user, pass).catch(function(error) {
            $("#errp").append(error.message);
            setDisplayError("true");
        });
    });

    $("#reset").click(function() {
        const user = $("#username").val();
        const auth = firebase.auth();

        auth.sendPasswordResetEmail(user).catch(function(error) {
            $("#errp").append(error.message);
            setDisplayError("true");
        });
    });

});