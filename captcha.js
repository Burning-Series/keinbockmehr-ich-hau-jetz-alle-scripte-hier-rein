// ==UserScript==
// @name         google captcha
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*
// @match        http://*/*
// @match        about:*
// @match        https://*/*
// @grant        none
// donationsURL paypal.me/JonathanHeindl :3
// ==/UserScript==


//if the captcha is reloading the images at click fail it (im not sure if the image data is set up in that case)

if(location.href.indexOf("www.google.com/recaptcha/api2")>-1){
	sc.D.sT(function () {
		var checkbox = sc.g.C("recaptcha-checkbox-checkmark");
		if (checkbox) {
			checkbox.click();
		}
		sc.D.sT(function () {
			var imgwr = sc.g.C("rc-image-tile-wrapper");
			if (imgwr && imgwr.length > 0) {
				var length = Math.sqrt(imgwr.length);
				var imagesrc = imgwr[0].children[0].src;
				var img = new Image();
				img.src = imagesrc;
				img.width = length * 100;
				img.height = length * 100;
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext('2d');
				img.ctx = ctx;
				img.length = length;
				img.imgcontainer = imgwr;
				img.onload = function (event) {
					event.target.ctx.drawImage(event.target, 0, 0);
					event.target.style.display = 'none';
					var saved= sc.G.g("googlecaptchafin", []);
					for (var i = 0; i < event.target.length; i++) {
						for (var j = 0; j < event.target.length; j++) {
							var width = 20;
							var data = event.target.ctx.getImageData(i * 100, j * 100, width, width).data;
							var container = sc.g.T("tbody").children;
							var obj = container[j].children[i].children[0].children[0].children[0];
							var tag;
							if (sc.g.C("rc-imageselect-desc-wrapper").children[1].children[0]) {
								tag = sc.g.C("rc-imageselect-desc-wrapper").children[1].children[0].innerText;
							} else if (sc.g.C("rc-imageselect-desc-wrapper").children[0].children[0]) {
								tag = sc.g.C("rc-imageselect-desc-wrapper").children[0].children[0].innerText;
							}
							obj.tag=tag;
							obj.data = data;
							var found=false;
							for(var k=0;k<saved.length;k++){
								if(obj.data.toString()===saved[k].data.toString()&&obj.tag===saved[k].tag){
									found=true;
									new Notification("found match :o");
									obj.click();
								}
							}
							if(!found){
								obj.onclick = function (ev) {
									sc.G.p("googlecaptchatemp", {data: ev.target.data, tag: obj.tag}, []);
								};
							}
						}
					}

				};
				var confirm = sc.g.C("rc-button-default goog-inline-block");
				confirm.onclick = function () {
					sc.D.sT(function () {
						var incorrect = sc.g.C("rc-imageselect-incorrect-response").style.display;
						var more=sc.g.C("rc-imageselect-error-select-more").style.display;
						var newimg=sc.g.C("rc-imageselect-error-dynamic-more").style.display;
						if (incorrect==="none"&&more==="none"&&newimg==="none") {
						}else{
							sc.G.s("googlecaptchatemp", []);
						}
					}, 500);
				};
			}
		}, 2000);
	}, 500);
}
else{
	var list=sc.G.g("googlecaptchatemp");
	if(list.length>0){
		debugger;
		for(var i=0;i<list.length;i++){
			sc.G.p("googlecaptchafin",list[i]);
		}
		sc.G.s("googlecaptchatemp", []);
	}

}