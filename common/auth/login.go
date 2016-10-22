package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/dghubble/ctxh"
	"github.com/dghubble/gologin"
	"github.com/dghubble/gologin/facebook"
	"github.com/dghubble/gologin/google"
	"github.com/dghubble/sessions"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	facebookOAuth2 "golang.org/x/oauth2/facebook"
	googleOAuth2 "golang.org/x/oauth2/google"
)

const (
	sessionName    = "example-facebook-app"
	sessionSecret  = "example cookie signing secret"
	sessionUserKey = "facebookID"
)

// sessionStore encodes and decodes session data stored in signed cookies
var sessionStore = sessions.NewCookieStore([]byte(sessionSecret), nil)

// Config configures the main ServeMux.
type Config struct {
	ClientID     string
	ClientSecret string
}

// New returns a new ServeMux with app routes.
func New(googleConfig *Config, facebookConfig *Config) *http.ServeMux {

	mux := http.NewServeMux()
	mux.HandleFunc("/", welcomeHandler)
	mux.Handle("/profile", requireLogin(http.HandlerFunc(profileHandler)))
	mux.HandleFunc("/logout", logoutHandler)

	// 1. Register Login and Callback handlers
	facebookOauth2Config := &oauth2.Config{
		ClientID:     facebookConfig.ClientID,
		ClientSecret: facebookConfig.ClientSecret,
		RedirectURL:  "http://localhost:8060/auth/facebook/callback",
		Endpoint:     facebookOAuth2.Endpoint,
	}

	// 1. Register Login and Callback handlers
	googleOauth2Config := &oauth2.Config{
		ClientID:     googleConfig.ClientID,
		ClientSecret: googleConfig.ClientSecret,
		RedirectURL:  "http://localhost:8060/auth/google/callback",
		Endpoint:     googleOAuth2.Endpoint,
		Scopes:       []string{"profile", "email"},
	}

	// state param cookies require HTTPS by default; disable for localhost development
	facebookStateConfig := gologin.DebugOnlyCookieConfig
	mux.Handle("/auth/facebook/login", ctxh.NewHandler(facebook.StateHandler(
		facebookStateConfig, facebook.LoginHandler(facebookOauth2Config, nil))))
	mux.Handle("/auth/facebook/callback", ctxh.NewHandler(facebook.StateHandler(
		facebookStateConfig, facebook.CallbackHandler(facebookOauth2Config, issueSession("facebook"), nil))))

	googleStateConfig := gologin.DebugOnlyCookieConfig
	mux.Handle("/auth/google/login", ctxh.NewHandler(google.StateHandler(
		googleStateConfig, google.LoginHandler(googleOauth2Config, nil))))
	mux.Handle("/auth/google/callback", ctxh.NewHandler(google.StateHandler(
		googleStateConfig, google.CallbackHandler(googleOauth2Config, issueSession("google"), nil))))

	return mux
}

// issueSession issues a cookie session after successful Facebook login
func issueSession(kind string) ctxh.ContextHandler {
	var fn func(ctx context.Context, w http.ResponseWriter, req *http.Request)

	switch {
	case kind == "google":
		fn = func(ctx context.Context, w http.ResponseWriter, req *http.Request) {
			googleUser, err := google.UserFromContext(ctx)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			// 2. Implement a success handler to issue some form of session
			session := sessionStore.New(sessionName)
			session.Values[sessionUserKey] = googleUser.Id
			session.Save(w)
			http.Redirect(w, req, "/profile", http.StatusFound)
		}
	case kind == "facebook":
		fn = func(ctx context.Context, w http.ResponseWriter, req *http.Request) {
			facebookUser, err := facebook.UserFromContext(ctx)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			// 2. Implement a success handler to issue some form of session
			session := sessionStore.New(sessionName)
			session.Values[sessionUserKey] = facebookUser.ID
			session.Save(w)
			http.Redirect(w, req, "/profile", http.StatusFound)
		}
	}

	return ctxh.ContextHandlerFunc(fn)
}

// welcomeHandler shows a welcome message and login button.
func welcomeHandler(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path != "/" {
		http.NotFound(w, req)
		return
	}
	if isAuthenticated(req) {
		http.Redirect(w, req, "/profile", http.StatusFound)
		return
	}

	page, err := ioutil.ReadFile("home.html")
	if err != nil {
		fmt.Fprintf(w, "500")
	}
	fmt.Fprintf(w, string(page))
}

// profileHandler shows protected user content.
func profileHandler(w http.ResponseWriter, req *http.Request) {
	var loggedin = `<p>You are logged in!</p>
		<form action="/logout" method="post">
			<input type="submit" value="Logout">
		</form>`

	fmt.Fprint(w, loggedin)
}

// logoutHandler destroys the session on POSTs and redirects to home.
func logoutHandler(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		sessionStore.Destroy(w, sessionName)
	}
	http.Redirect(w, req, "/", http.StatusFound)
}

// requireLogin redirects unauthenticated users to the login route.
func requireLogin(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, req *http.Request) {
		if !isAuthenticated(req) {
			http.Redirect(w, req, "/", http.StatusFound)
			return
		}
		next.ServeHTTP(w, req)
	}
	return http.HandlerFunc(fn)
}

// isAuthenticated returns true if the user has a signed session cookie.
func isAuthenticated(req *http.Request) bool {
	if _, err := sessionStore.Get(req, sessionName); err == nil {
		return true
	}
	return false
}

// main creates and starts a Server listening.
func main() {
	const address = "localhost:8060"
	// read credentials from environment variables if available
	facebookConfig := &Config{
		ClientID:     "572776972920354",
		ClientSecret: "8da489497737c528645cfcfd022dc37a",
	}

	googleConfig := &Config{
		ClientID:     "657570214292-g7mh8030hpjrghmnjmaguf13o13hohn7.apps.googleusercontent.com",
		ClientSecret: "oGylys8U-CxWmUCq3Lp4Qm4l",
	}

	log.Printf("Starting Server listening on %s\n", address)
	err := http.ListenAndServe(address, New(googleConfig, facebookConfig))
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
