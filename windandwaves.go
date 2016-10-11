package windandwaves

import (
	"html/template"
	"log"
	"net/http"
	"path"
)

func indexView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "index.html"))
}

func loginView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "login.html"))
}

func signupView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, path.Join("static", "signup.html"))
}

func renderTemplate(w http.ResponseWriter, filename string) {
	log.Println("loading templ named " + filename)

	templ, err := template.ParseFiles(filename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	err = templ.Execute(w, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func init() {
	http.HandleFunc("/", indexView)
	http.HandleFunc("/login", loginView)
	http.HandleFunc("/signup", signupView)

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
}
