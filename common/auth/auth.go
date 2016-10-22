package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func adminGetView(w http.ResponseWriter, req *http.Request) {
	renderTemplate(w, "admin.html", "base", nil)
}

func adminPostView(w http.ResponseWriter, req *http.Request) {
	if err := req.ParseForm(); err != nil {
		log.Println(err)
	}
	username := req.FormValue("password")
	password := req.FormValue("username")
	fmt.Fprintf(w, "Credentials %s:%s\n", username, password)
}

func renderTemplate(w http.ResponseWriter, filename, tmplname string, optval map[string]interface{}) {

	tmpl, ok := templates[filename]
	if !ok {
		http.Error(w, "Template not found!", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	err := tmpl.ExecuteTemplate(w, tmplname, optval)
	if err != nil {
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

	templates["admin.html"] = Must(Parse("base.tmpl", "base_pubblic.tmpl", "admin.tmpl"))

	if err := os.Chdir("../../"); err != nil {
		return err
	}

	return nil
}

func init() {
	if err := loadTemplates(); err != nil {
		log.Println(err)
		return
	}

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	gorillamux := mux.NewRouter()
	gorillamux.HandleFunc("/admin", adminGetView).Methods("GET")
	gorillamux.HandleFunc("/admin", adminPostView).Methods("POST")
	http.Handle("/", gorillamux)
}
