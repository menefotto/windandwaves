package windandwaves

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func indexView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index.html", nil)
}

func loginView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "login.html", nil)
}

func signupView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "signup.html", nil)
}

func loggedinView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "loggedin.html", nil)
}

func passwordResetView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "reset_password.html", nil)
}

func changePasswordView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "change_password.html", nil)
}

func renderTemplate(w http.ResponseWriter, filename string, optval map[string]interface{}) {

	tmpl, ok := templates[filename]
	if !ok {
		http.Error(w, "Template not found!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	err := tmpl.ExecuteTemplate(w, "base", optval)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var templates map[string]*template.Template

func loadTemplates() error {
	if err := os.Chdir("static"); err != nil {
		return err
	}

	if templates == nil {
		templates = make(map[string]*template.Template)
	}

	Must := template.Must
	Parse := template.ParseFiles

	templates["index.html"] = Must(Parse("index.tmpl", "base.tmpl"))
	templates["login.html"] = Must(Parse("login.tmpl", "base.tmpl"))
	templates["signup.html"] = Must(Parse("signup.tmpl", "base.tmpl"))
	templates["loggedin.html"] = Must(Parse("loggedin.tmpl", "base.tmpl"))
	templates["reset_password.html"] = Must(Parse("reset_password.tmpl", "base.tmpl"))
	templates["change_password.html"] = Must(Parse("change_password.tmpl", "base.tmpl"))

	if err := os.Chdir("../"); err != nil {
		return err
	}

	return nil
}

func init() {
	err := loadTemplates()
	if err != nil {
		log.Println(err)
	}

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	gorillamux := mux.NewRouter()
	gorillamux.HandleFunc("/", indexView)
	gorillamux.HandleFunc("/login", loginView)
	gorillamux.HandleFunc("/signup", signupView)
	gorillamux.HandleFunc("/loggedin", loggedinView)
	gorillamux.HandleFunc("/password_reset", passwordResetView)
	gorillamux.HandleFunc(`/change_password/{rest:.*}`, changePasswordView)
	http.Handle("/", gorillamux) // registering http to use gorilla mux
}
