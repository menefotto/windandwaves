// firebase app setup
const config = {
  apiKey: 'AIzaSyCsy7Y7JIBrblVA8n8yzsbLYDdiUymgG68',
  authDomain: 'testapp-e2023.firebaseapp.com',
  databaseURL: 'https://testapp-e2023.firebaseio.com',
  storageBucket: 'testapp-e2023.appspot.com',
  messagingSenderId: '317031868553'
}
firebase.initializeApp(config)

// document ready
$(function () {
  $('.close').click(function () {
    $('#err').addClass('hide')
  })

  $('#login-btn').click(function () {
    location.replace('../login')
  })

  if (window.location.pathname == '/messages') {
    loadMessages()
  }
})
// profile settings functions
function updateNick () {
  const nick = $('#nickname').val()
  const nick2 = $('#nickname2').val()
  const user = firebase.auth().currentUser

  if (nick !== nick2) {
    pushError(' Nicknames must be equal!')

    return
  }

  user.updateProfile({displayName: nick}).then(function () {
    pushMessage(' Nickname update successfully!')
  }, function (error) {
    pushError(error.message)
  })

  userSet(nick, null, null)

  window.setTimeout(function () {
    $('#collapseNick').collapse('hide')
  }, 1500)
}

function updateEmail () {
  const user = firebase.auth().currentUser

  const email = $('#email').val()
  const email2 = $('#email2').val()

  if (email !== email2) {
    pushError(' Emails must be the same')

    return
  }

  user.updateEmail(email).then(function () {
    pushMessage(' Email updated successfully!')
  }, function (error) {
    pushError(error.message)
  })

  window.setTimeout(function () {
    $('#collapseEmail').collapse('hide')
  }, 1500)
}

function updatePhoto () {
  const user = firebase.auth().currentUser
  const storageRef = firebase.storage().ref()

  const file = $('#uploadPic').get(0).files[0]
  var metadata = {contentType: 'image/' + file.type}
  var url = null

  // show progress bar
  $('#uploadBar').removeClass('hide')

  var uploadTask = storageRef.child(user.uid + '/images/' + file.name).put(file, metadata)
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      $('#progressbar').attr('style', 'width:' + progress + '%')
      $('#progressbar').text(progress)
    }, function (error) {
      pushError(error.message)
    }, function () {
      url = uploadTask.snapshot.downloadURL

      // cache user image localy and set it
      userSet(user.displayName, url, null)
      // actually update user profile
      user.updateProfile({photoURL: url}).then(function () {
        pushMessage(user.displayName + ' Your new profile pic had been updated successfully!')
      }, function (error) {
        pushError(error.message)
      })

      window.setTimeout(function () {
        $('#collapsePhoto').collapse('hide')
        $('#uploadBar').addClass('hide')
      }, 1500)
    }
  )
}

function updatePhone () {
  const user = firebase.auth().currentUser
  const phoneNumber = $('#phonenumber').val()

  firebase.database().ref('/users/' + user.uid).update({number: phoneNumber}).then(function () {
    pushMessage(' Phone number updated successfully!')
  }, function (error) {
    pushError(error.message)
  })

  window.setTimeout(function () {
    $('#collapsePhone').collapse('hide')
  }, 1500)
}

// global current user login
var cuser = 'no'
// auth observer
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    cuser = 'yes'
    loggedinRedirect(user)
  } else {
    cuser = 'no'
  }
})

// login/signup functions
function login () {
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
}

function logOut () {
  var user = firebase.auth().currentUser

  if (!user.displayName) {
    userSet(user.displayName, null, 'false')
  }else {
    userSet(user.email, null, 'false')
  }

  firebase.auth().signOut().then(function () {
    // ok case    
  }, function (error) {
    pushError(error.message)
  })
}

function signup () {
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
}

function glogin () {
  var provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/plus.login')

  firebase.auth().signInWithRedirect(provider).then(function () {}, function (error) {
    pushError(error.message)
  })
}

function twlogin () {
  var provider = new firebase.auth.TwitterAuthProvider()

  firebase.auth().signInWithRedirect(provider).then(function () {
    window.location.replace('/loggedin')
  }, function (error) {
    pushError(error.message)
  })
}

function fblogin () {
  var provider = new firebase.auth.FacebookAuthProvider()

  firebase.auth().signInWithRedirect(provider).then(function () {}, function (error) {
    pushError(error.message)
  })
}

function loggedinRedirect (user) {
  var span = '<span class="glyphicon glyphicon-menu-hamburger"></span>'
  var s = '<strong>'
  var e = '</strong>'

  if (cuser == 'yes') {
    if (location.pathname == '/login') {
      location.replace('../profile_settings')
    }
  }

  if (document.cookie !== '') {
    $('#profileImg').attr('src', 'data:image/png;base64,' + pic)
    console.log('set image from cache')
  }else {
    console.log('loaded from user url')
    $('#profileImg').attr('src', user.photoURL)
  }

  cuser.displayName = ''

  if (!user.displayName) {
    cuser.displayName = user.email
    $('#loggedin-btn').append(s + user.email + e + '  ' + span)
  }else {
    cuser.displayName = user.displayName
    $('#loggedin-btn').append(s + user.displayName + e + '  ' + span)
  }

  $('#loggedin-btn').removeClass('hide')
  if (!user.photoURL) {
    setUser(cuser.displayName, null, 'true')
  }else {
    setUser(cuser.displayName, user.photoURL, 'true')
  }
}

// password  reset/change functions
function resetPasswd () {
  event.preventDefault()

  const user = $('#username').val()
  const auth = firebase.auth()

  var res = auth.sendPasswordResetEmail(user)
  res.then(function () {
    pushMessage('An email should be arriving shortly!')
  }, function (error) {
    pushError(error.message)
  })
}

function changePasswd () {
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
}

// error/message push functions
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

// caching functions 

function saveImg (url) {
  var imgNew = new Image()
  imgNew.setAttribute('crossorigin', 'anonymous')
  // as from https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
  imgNew.src = url

  imgNew.onload = function () {
    var canvas = document.createElement('canvas')
    canvas.setAttribute('width', imgNew.width)
    canvas.setAttribute('height', imgNew.height)

    var context = canvas.getContext('2d')
    context.drawImage(imgNew, imgNew.width, imgNew.height)

    var data = canvas.toDataURL('image/png')

    document.cookie = data
  }
}

// chat functions
function getCurDateTime () {
  var date = new Date()
  var unixTime = date.getTime()

  return unixTime
}

function displayMessage (key, displayName, text, photoUrl) {
  var helpSpan = '<span class="help-block"></span>'
  name = '<strong>' + displayName + ' : </strong>'
  $('#msgSend').before(helpSpan + " <div class='bubble'>" + name + text + '</div>' + helpSpan)
}

function loadMessages () {
  const msgs = firebase.database().ref('/messages')

  var setMessage = function (data) {
    var val = data.val()
    displayMessage(data.key, val.name, val.text, val.photoUrl)
    // needed to keep the bar scrolled down
    var chat = $('#chat').get(0)
    chat.scrollTop = chat.scrollHeight - chat.clientHeight
  }.bind(this)

  displayUsers()

  msgs.limitToLast(20).on('child_added', setMessage)
}

function sendMessage () {
  const date = getCurDateTime()
  const user = firebase.auth().currentUser
  const msg = $('#msg').val()
  const name = user.displayName
  $('#msg').val('')

  firebase.database().ref('/messages/' + date).update({'name': name, 'text': msg}).then(function (spanshot) {}, function (error) {
    if (error.code == 'PERMISSION_DENIED') {
      pushError(' Messages must no be longer than 100 charachters!')
    }else {
      pushError(error.message)
    }
  })
}

function userSet (name, photoUrl, status) {
  var users = firebase.database().ref('/users')
  const user = firebase.auth().currentUser
  var userData = {}
  
  if (status) {
    userData[user.uid] = status
  }else {
    return false
  }

  users.update(userData).then(function () {}, function (error) {
    pushMessage(error.message)
  })
}

function displayUsers () {
  const users = firebase.database().ref('/users')
  users.on('child_changed', function (spanshot) {
    snapshot.forEach(function (user) {
      var data = user.val()
      console.log(data)
      $('#users-found').append('<div>' + data.name + ' ' + data.online + '</div>')
    })
  }, function (error) {
    pushError(error.message)
  })

  const query = users.orderByKey()
  query.once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var data = childSnapshot.val()
      $('#users-found').append('<div>' + data.name + ' ' + data.status + '</div>')
    })
  })
}
