package windandwaves

import (
	"html/template"
	"log"
	"net/http"
	"path"

	"github.com/gorilla/mux"
)

func indexView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "index.html"), nil)
}

func loginView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "login.html"), nil)
}

func signupView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "signup.html"), nil)
}

func loggedinView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "loggedin.html"), nil)
}

func passwordResetView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "password_reset.html"), nil)
}

func completePasswordResetView(w http.ResponseWriter, r *http.Request) {
	log.Println("url: ", r.URL.Path)
	renderTemplate(w, path.Join("static", "complete_password_reset.html"), nil)
}

func renderTemplate(w http.ResponseWriter, filename string, optval map[string]string) {
	log.Println("loading templ named " + filename)

	templ, err := template.ParseFiles(filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	err = templ.Execute(w, optval)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func init() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	gorillamux := mux.NewRouter()
	gorillamux.HandleFunc("/", indexView)
	gorillamux.HandleFunc("/login", loginView)
	gorillamux.HandleFunc("/signup", signupView)
	gorillamux.HandleFunc("/loggedin", loggedinView)
	gorillamux.HandleFunc("/password_reset", passwordResetView)
	gorillamux.HandleFunc(`/complete_password_reset/{rest:.*}`, completePasswordResetView)
	http.Handle("/", gorillamux) // registering http to use gorilla mux
}
