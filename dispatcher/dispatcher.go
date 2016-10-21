package windandwaves

import (
	"net/http"

	"github.com/gorilla/mux"
)

const statusPermanentRedirect = 307

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

func init() {
	gorillamux := mux.NewRouter()
	gorillamux.HandleFunc("/sup", supView)
	gorillamux.HandleFunc("/surf", surfView)
	gorillamux.HandleFunc("/windsurf", windsurfView)
	http.Handle("/", gorillamux) // registering http to use gorilla mux
}
