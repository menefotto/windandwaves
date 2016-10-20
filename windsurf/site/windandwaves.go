package windandwaves

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func indexView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index.html", "base", nil)
}

/*
func loginView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "login.html", "base", nil)
}

func signupView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "signup.html", "base", nil)
}

func loggedinView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "loggedin.html", "base_private", nil)
}

func messagesView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "messages.html", "base_private", nil)
}

func passwordResetView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "reset_password.html", "base", nil)
}

func changePasswordView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "change_password.html", "base", nil)
}

func profileSettingsView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "profile_settings.html", "base_private", nil)
}
*/

func renderTemplate(w http.ResponseWriter, filename, tmplname string, optval map[string]interface{}) {

	tmpl, ok := templates[filename]
	if !ok {
		http.Error(w, "Template not found!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	err := tmpl.ExecuteTemplate(w, tmplname, optval)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var templates map[string]*template.Template

func loadTemplates() error {
	if err := os.Chdir("static/templ"); err != nil {
		return err
	}

	if templates == nil {
		templates = make(map[string]*template.Template)
	}

	Must := template.Must
	Parse := template.ParseFiles

	templates["index.html"] = Must(Parse("base.tmpl", "base_pubblic.tmpl", "index.tmpl"))
	/*
		templates["login.html"] = Must(Parse("login.tmpl", "base.tmpl"))
		templates["signup.html"] = Must(Parse("signup.tmpl", "base.tmpl"))
		templates["loggedin.html"] = Must(Parse("loggedin.tmpl", "base_private.tmpl"))
		templates["messages.html"] = Must(Parse("messages.tmpl", "base_private.tmpl"))
		templates["reset_password.html"] = Must(Parse("reset_password.tmpl", "base.tmpl"))
		templates["change_password.html"] = Must(Parse("change_password.tmpl", "base.tmpl"))
		templates["profile_settings.html"] = Must(Parse("profile_settings.tmpl", "base_private.tmpl"))
	*/

	if err := os.Chdir("../../"); err != nil {
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
	gorillamux.HandleFunc("/windsurf", indexView)
	http.Handle("/", gorillamux) // registering http to use gorilla mux

	/*
		gorillamux.HandleFunc("/login", loginView)
		gorillamux.HandleFunc("/signup", signupView)
		gorillamux.HandleFunc("/loggedin", loggedinView)
		gorillamux.HandleFunc("/messages", messagesView)
		gorillamux.HandleFunc("/password_reset", passwordResetView)
		gorillamux.HandleFunc(`/change_password/{rest:.*}`, changePasswordView)
		gorillamux.HandleFunc(`/profile_settings`, profileSettingsView)
	*/
}
