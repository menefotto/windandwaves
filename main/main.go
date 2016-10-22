package windandwaves

import (
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

const statusPermanentRedirect = 307

func indexView(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index.html", "base", nil)
}

func supView(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://sup-dot-waterandboards.appspot.com/",
		statusPermanentRedirect)
}

func surfView(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://surf-dot-waterandboards.appspot.com/",
		statusPermanentRedirect)
}

func windsurfView(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://windsurf-dot-waterandboards.appspot.com/",
		statusPermanentRedirect)
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

	templates["index.html"] = Must(Parse("base.tmpl", "base_pubblic.tmpl", "index.tmpl"))

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
	gorillamux.HandleFunc("/", indexView)
	gorillamux.HandleFunc("/sup", supView)
	gorillamux.HandleFunc("/surf", surfView)
	gorillamux.HandleFunc("/windsurf", windsurfView)
	http.Handle("/", gorillamux)
}
