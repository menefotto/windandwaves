const config = {
  apiKey: 'AIzaSyCsy7Y7JIBrblVA8n8yzsbLYDdiUymgG68',
  authDomain: 'testapp-e2023.firebaseapp.com',
  databaseURL: 'https://testapp-e2023.firebaseio.com',
  storageBucket: 'testapp-e2023.appspot.com',
  messagingSenderId: '317031868553'
}
firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.email + ' logged in')
    $('#nickname').append(user.email)
  } else {
    console.log('not logged in')
  }
})

var pushError = function(error) {
  $('#errp').append('<strong>Ops something went wrong! </strong>' + error.message)
  $('#err').removeClass('hide')
}

var pushMessage = function(message) {
  $('#errp').append('<strong>Operation perform successfully! </strong>' + message)
  $('#errp').removeClass('alert-danger')
  $('#errp').addClass('alert-success')
  $('#err').removeClass('hide')
}

$(function() {
  $('.close').click(function() {
    location.reload()
  })

  $('#signup').click(function(event) {
    const user = $('#username').val()
    const pass = $('#password').val()
    const auth = firebase.auth()

    auth.createUserWithEmailAndPassword(user, pass).then(function(value) {
      location.replace('loggedin')
    }, function(error) {
      pushError(error)
    })

    return false
  })

  $('#login').click(function(event) {
    const user = $('#username').val()
    const pass = $('#password').val()
    const auth = firebase.auth()

    auth.signInWithEmailAndPassword(user, pass).then(function(value) {
        location.replace('loggedin')
      },
      function(error) {
        pushError(error)
      })

    return false
  })

  $('#reset').click(function(event) {
    event.preventDefault()

    const user = $('#username').val()
    const auth = firebase.auth()

    auth.sendPasswordResetEmail(user).then(function() {
      pushMessage("An email should be arriving shortly!")
    }, function(error) {
      pushError(error)
    })
  })
  
  $('#change_passwd').click(function(event) {
    event.preventDefault()
    
    const passwd = $('#passwd_reset').val()
    const passwd1 = $('#passwd_reset1').val()
    if ( passwd === passwd1) {        
      pushError("Ops passwords must be the same!")
      return
    }
    
    const code = $(location).attr("href").split("=")[2].split("&")[0]
    console.log("reset code is: " code)
    
    const auth = firebase.auth()
    auth.confirmPasswordReset(code, passwd).then(function() {
        location.replace('login')
      },
      function() {
        pushError("Invalid reset code!")
      })

    return false
  })


  $('#logout').click(function() {
    firebase.auth().signOut()
  })

  
 
})
