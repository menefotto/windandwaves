// preload image background func
function preload(arrayOfImages) {
	$(arrayOfImages).each(function() {
			(new Image()).src = this;
	});
}
preload(["static/imgs/windboards.jpg"]);

// on main image load hide the dimmer...
$(document).ready(function() {

// stolen by this fiddle https://jsfiddle.net/tovic/gmzSG/ thanks man...
	function getBgUrl(el) {
		var bg = "";

		if (el.currentStyle) { // IE
			bg = el.currentStyle.backgroundImage;
		} else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
			bg = document.defaultView.getComputedStyle(el, "").backgroundImage;
		} else { // try and get inline style
			bg = el.style.backgroundImage;
		}

		return bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
	}

	var image = document.createElement('img');
	image.src = getBgUrl(document.getElementById('grid'));

	image.onload = function () {
		console.log('Loaded!');
		$("#loader").removeClass("active");
	};

});
