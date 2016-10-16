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
    $(".navbar-btn").remove()
    btn = `<div class="btn-group navbar-right">
                    <button id="nickname" type="button" class="navbar-btn btn-pos btn btn-primary dropdown-toggle" 
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      `+ user.email + "  " + `<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>` +
                    `</button>
                    <ul class="dropdown-menu">
                        <li><a href="#">Selling Items</a></li>
                        <li><a href="#">Interesting Items</a></li>
                        <li><a href="#">Profile settings </a></li>
                        <li role="separator" class="divider"></li>
                        <li id="logout" onclick="javascript: firebase.auth().signOut(); window.location = '/'"> <a href="#"> Logout</a> </li>
                    </ul>
                </div>`
    $(".navbar-header").after(btn)
  } else {
    $(".btn-group").remove()
    btn = `<button type="button" class="btn-pos navbar-btn navbar-right btn btn-primary" 
            onclick="javascript: window.location='/login'"> Login </button>`
    $(".navbar-header").after(btn)
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

  $('#signup').click(function (event) {
    const user = $('#username').val()
    const pass = $('#password').val()
    const auth = firebase.auth()

    auth.createUserWithEmailAndPassword(user, pass).then(function (value) {
      location.replace('loggedin')
    }, function (error) {
      pushError(error.message)
    })

    return false
  })

  $('#login').click(function (event) {
    const user = $('#username').val()
    const pass = $('#password').val()
    const auth = firebase.auth()

    auth.signInWithEmailAndPassword(user, pass).then(function (value) {
      location.replace('loggedin')
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
  
  //$("#logout").click(function (){
  //  firebase.auth().signOut()
  //  })
})
