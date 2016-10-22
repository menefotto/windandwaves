// preload image background func
function preload(arrayOfImages) {
	$(arrayOfImages).each(function() {
			(new Image()).src = this;
	});
}
preload(["static/imgs/windboards.jpg",
		"static/imgs/surfboards.jpg",
		"static/imgs/supboards.jpg"]);


var currentImg = 0;
setInterval(function(){
	var imgUrls = ["surfboards.jpg","supboards.jpg","windboards.jpg"];
	const basePath = "/static/imgs/";

	if (currentImg > 2 ) {
		currentImg = 0;
	}

	const url = "url(" + '"' + basePath + imgUrls[currentImg] + '"' +")";
	$('#grid').css('background-image', url);
	currentImg++;

},3000);


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
