const config = {
  apiKey: 'AIzaSyCsy7Y7JIBrblVA8n8yzsbLYDdiUymgG68',
  authDomain: 'testapp-e2023.firebaseapp.com',
  databaseURL: 'https://testapp-e2023.firebaseio.com',
  storageBucket: 'testapp-e2023.appspot.com',
  messagingSenderId: '317031868553'
}
firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (!user.displayName) {
      $('#loggedin-btn').text(user.email)
    }else {
      $('#loggedin-btn').text(user.displayName)
    }
    console.log('in')
  } else {
    console.log('not in')
  }
})

var pushError = function (message) {
  $('#errp').append('<strong>Ops something went wrong: </strong>' + message)
  $('#err').removeClass('hide')
}

var pushMessage = function (message) {
  $('#errp').append('<strong>Operation perform successfully: </strong>' + message)
  $('#err').removeClass('alert-danger')
  $('#err').addClass('alert-success')
  $('#err').removeClass('hide')
}

$(function () {
  $('.close').click(function () {
    location.reload()
  })

  $('#login-btn').click(function () {
    location.replace('../login')
  })

  $('#signup').click(function (event) {
    const user = $('#username').val()
    const pass = $('#password').val()
    const nick = $('#nickname').val()
    const auth = firebase.auth()

    auth.createUserWithEmailAndPassword(user, pass).then(function (cuser) {
      location.replace('../loggedin')
    }, function (error) {
      pushError(error.message)
    })

    return false
  })

  $('#facebook').click(function () {
    var provider = new firebase.auth.FacebookAuthProvider()

    firebase.auth().signInWithRedirect(provider).then(function () {
      location.replace('../loggedin')
    }, function (error) {
      pushError(error.message)
    })
  })

  $('#google').click(function () {
    var provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/plus.login')

    firebase.auth().signInWithRedirect(provider).then(function () {
      location.replace('../loggedin')
    }, function (error) {
      pushError(error.message)
    })
  })

  $('#twitter').click(function () {
    var provider = new firebase.auth.TwitterAuthProvider()

    firebase.auth().signInWithRedirect(provider).then(function () {
      location.replace('../loggedin')
    }, function (error) {
      pushError(error.message)
    })
  })

  $('#login').click(function (event) {
    const user = $('#username').val()
    const pass = $('#password').val()
    const auth = firebase.auth()

    auth.signInWithEmailAndPassword(user, pass).then(function (value) {
      location.replace('../loggedin')
    },
      function (error) {
        pushError(error.message)
      })

    return false
  })

  $('#reset').click(function (event) {
    event.preventDefault()

    const user = $('#username').val()
    const auth = firebase.auth()

    var res = auth.sendPasswordResetEmail(user)
    res.then(function () {
      pushMessage('An email should be arriving shortly!')
    }, function (error) {
      pushError(error.message)
    })
  })

  $('#change_passwd').click(function (event) {
    event.preventDefault()

    var codeurl = $(location).attr('href').split('=')[2]
    const code = codeurl.split('&')[0]

    const auth = firebase.auth()

    var passwd = $('#passwd_reset').val()
    var passwd1 = $('#passwd_reset1').val()
    if (passwd !== passwd1) {
      pushError('Ops passwords must be the same!')
      return false
    }

    var res = auth.confirmPasswordReset(code, passwd)
    res.then(function () {
      location.replace('../login')
    },
      function () {
        pushError('Invalid reset code!')
      })

    return false
  })
})
