package main

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

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", indexView)
	mux.HandleFunc("/login", loginView)
	mux.HandleFunc("/signup", signupView)

	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	log.Fatal(http.ListenAndServe(":8080", mux))
}
