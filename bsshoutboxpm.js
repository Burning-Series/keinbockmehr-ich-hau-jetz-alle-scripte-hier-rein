// ==UserScript==
// @name         bs pm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://bs.to/home*
// @grant        none
// donationsURL paypal.me/JonathanHeindl :3
// ==/UserScript==
var l = {
	s: function setLS(identifier, element, log = 1) {
		localStorage.setItem("tampermonkey_" + identifier, JSON.stringify(element));
	},
	g: function getLS(identifier, standard = new Array(0), log = 1) {
		var element = JSON.parse(localStorage.getItem("tampermonkey_" + identifier));
		if (element === null) {
			this.s(identifier, standard);
			return standard;
		}
		return element;
	}
};
var bar;
(function() {
	'use strict';
	function set(obj){
		obj.children[0].onmouseenter=function(a){
			if(a.target.ref===undefined){
				a.target.ref=document.createElement("button");
				a.target.ref.innerText="start pm";
				a.target.ref.name=obj.children[0].innerText;
				a.target.ref.onclick=function(c){
					createMenu(c.target.name);
					c.target.remove();
				};
				a.target.ref.style.position="fixed";
				a.target.ref.style.left=a.x+10+"px";
				a.target.ref.style.top=a.target.offsetTop+10+"px";
				a.target.ref.onmouseenter=function(b){
					b.target.mouse=true;
				};
				a.target.ref.onmouseleave=function(b){
					b.target.mouse=false;
				};
				a.target.parentElement.append(a.target.ref);
			}
		};
		obj.children[0].onmouseleave=function(a){
			setTimeout(function(a){
				if(a.target.ref.mouse!==true){
					a.target.ref.remove();
					a.target.ref=undefined;
				}
			},1,a);


		};
	}
	if (!Array.prototype.f) {
		Object.defineProperty(Array.prototype, "remI", {
                enumerable: false,
                value: function (index) {
                    for (var i = 0; i < this.length; i++) {
                        if (i > index) {
                            this[i - 1] = this[i];
                        }
                    }
                    this.length--;
                }
            });
		Object.defineProperty(Array.prototype, "f", {
			enumerable: false,
			value: function findArray(f, equal = false, path = "", first = true) {
				var index = -1;
				for (var i = 0; i < this.length; i++) {
					if (equal) {
						if (f === eval("this[i]" + path)) {
							index = i;
							if (first) {
								return index;
							}
						}
					} else {
						if (f.toString().indexOf(eval("this[i]" + path)) > -1) {
							index = i;
							if (first) {
								return index;
							}
						}
					}
				}
				return index;
			}
		});
	}
	setInterval(function(){
		function get(url, c) {
			var http = new XMLHttpRequest();
			http.open("GET", url, true);
			http.setRequestHeader("Content-type", "text/html; charset=utf-8");
			http.onreadystatechange = function () {//Call a function when the state changes.
				if (http.readyState === 4 && http.status === 200) {
					var list = http.responseText;
					c.call(this, list);
				}
			};
			http.send();
		}
		get("https://bs.to/messages",function(text){
			var messages=text.split("<table>")[1].split("</table>")[0].split("<tr");
			for(var i=messages.length-1;i>1;i--){
				var message=messages[i];
				var lines=message.split("\n");
				var msgobj={};
				msgobj.text=lines[2].split("\">")[1].split("</a>")[0];
				if(lines[4].indexOf("user")>-1){
					msgobj.user=lines[4].split("user/")[1].split("\">")[0];
				}else{
					msgobj.user=lines[3].split("user/")[1].split("\">")[0];	
				}
				msgobj.time=lines[5].split("<time>")[1].split("</time>")[0];
				msgobj.timestamp=msgobj.time.split(" ")[1].split(":")[1]-0+msgobj.time.split(" ")[1].split(":")[0]*60+msgobj.time.split(" ")[0].split(".")[0]*60*24+msgobj.time.split(" ")[0].split(".")[1]*60*24*40+msgobj.time.split(" ")[0].split(".")[2]*60*24*35*12;
				if(msgobj.timestamp>l.g("lastpm",0)){
					pushtoSB(msgobj);
				}
				if(i===2){
					l.s("lastpm",msgobj.timestamp);	
				}
			}
		});
	},5000);
	bar =document.createElement("div");
	bar.style.height="20px";
	bar.style.position="static";
	document.getElementById("shoutbox").children[1].insertBefore(bar,document.getElementById("shoutbox").children[1].children[1]);
	bar.style.width=bar.parentElement.scrollWidth+"px";
	bar.w=bar.parentElement.scrollWidth;
	bar.menus=[];
	bar.index=0;
	var main=createMenu("main");
	main.ref=document.getElementById("sbPosts");
	main.ref.addEventListener("DOMNodeInserted",function(a,b,c){
		var obj=a.target;
		if(obj.localName==="dt"){
			for(var i in bar.menus){
				if(bar.menus[i].username===obj.children[0].innerText||obj.children[0].innerText===document.getElementById("navigation").children[0].childNodes[1].innerText){
					return;
				}else{
					set(obj);
				}
			}
		}
	});
	for(var i in main.ref.children){
		var obj=main.ref.children[i];
		if(obj.localName==="dt"){
			for(var i in bar.menus){
				if(bar.menus[i].username===obj.children[0].innerText||obj.children[0].innerText===document.getElementById("navigation").children[0].childNodes[1].innerText){
					return;
				}else{
					set(obj);
				}
			}
		}
	}


	var rem=document.createElement("button");
	rem.innerText="X";
	rem.onclick=function(b){
		if(bar.index!==0){
			bar.menus[bar.index].ref.remove();
			bar.menus[bar.index].remove();
			bar.menus.remI(bar.index);
			bar.index=0;
			setvis();
			setwid();
		}

	};
	rem.style.position="absolute";
	rem.style.top=bar.offsetTop+3+"px";
	rem.style.left=bar.offsetWidth-10+"px";
	bar.appendChild(rem);
})();
setTimeout(function(){
	Shoutbox.checkEnterc=Shoutbox.checkEnter;
	Shoutbox.checkEnter=function(a,b,c){
		if(a.keyCode===13){
			if(bar.index!==0){
				var i = document.createElement('iframe');
				document.body.appendChild(i);
				i.frameBorder = "0";
				i.src = "https://bs.to/messages/new";
				iFrameReady(i, function(a,b){
					var cont=a.contentDocument.getElementsByClassName("messages")[0].children[1].children[0].children;
					cont[1].children[0].value=bar.menus[bar.index].username;
					cont[2].children[0].value="SBMESSAGE:"+document.getElementById("sbMsg").value;
					cont[3].children[0].value="shoutboxmessage";
					cont[4].click();
					document.getElementById("sbMsg").value="";
				}, false);
			}else{
				return this.checkEnterc(a,b,c);	
			}
		}else{
			return this.checkEnterc(a,b,c);
		}
	};
},2000);
function setvis(){
	for(var i=0;i<bar.menus.length;i++){
		if(i!==bar.index){
			bar.menus[i].ref.style.visibility="hidden";
		}else{
			bar.menus[i].ref.style.visibility="visible";
		}
	}
}
function setwid(){
	for(var i in bar.menus){
		if(i>0){
			var w=document.defaultView.getComputedStyle(bar.menus[i-1]).width.split("px")[0];
			var newl=bar.menus[i-1].left+(w-0)+5;
			bar.menus[i].style.left=newl+"px";
			bar.menus[i].left=newl;
		}else{
			bar.menus[i].style.left=20+"px";
			bar.menus[i].left=20;
		}
		bar.menus[i].style.position="absolute";
		bar.menus[i].style.top=bar.offsetTop+3+"px";
		if((!bar.index&&i==="0")||(bar.index&&bar.index.toString()===i.toString())){
			bar.menus[i].style.backgroundColor="green";
		}else{
			bar.menus[i].style.backgroundColor="grey";
		}
	}
}
function pushtoSB(msg){
	new Audio("https://notificationsounds.com/sound-effects/sucked-into-the-dark-side-401"+"/download/mp3").play();
	var index=bar.menus.f(msg.user,true,".username");
	if(index===-1){
		createMenu(msg.user,function(a){
		}).pushmsg(msg);
	}else{
		bar.menus[index].pushmsg(msg);
	}
}
function createMenu(text,onclick){
	var menubutton=document.createElement("button");
	menubutton.textContent=text;
	menubutton.style.border="1px black";
	menubutton.username=text;
	var ref=document.getElementById("sbPosts").cloneNode(true);
	document.getElementById("shoutbox").children[1].append(ref);
	ref.style.position="absolute";
	ref.style.top=ref.parentElement.offsetTop+"px";
	ref.style.width=ref.parentElement.offsetWidth+"px";
	ref.style.visibility="hidden";
	for(var i=ref.children.length-1;i>-1;i--){
		ref.children[i].remove();
	}
	menubutton.ref=ref;
	menubutton.pushmsg=function(msg){
		var head=document.createElement("dt");

		var a=document.createElement("a");
		a.innerText=msg.user;
		a.style.marginLeft="10px";
		var time=document.createElement("time");
		time.style.marginLeft="10px";
		time.innerText=msg.time;

		head.append(a);
		head.append(time);

		var txt =document.createElement("dd");
		txt.innerText=msg.text.replace("SBMESSAGE:","");
		this.ref.insertBefore(txt,this.ref.children[0]);
		this.ref.insertBefore(head,this.ref.children[0]);
		var dt=new Date().valueOf();
		if(this.time===undefined||this.time+3000<dt){
			this.time=dt;
			this.style.backgroundColor="white";
			setTimeout(function(btn){
				if((!bar.index&&i==="0")||(bar.index&&bar.index.toString()===i.toString())){
					bar.menus[i].style.backgroundColor="green";
				}else{
					bar.menus[i].style.backgroundColor="grey";
				}
			},500,this);
		}
	};
	menubutton.cfnc=onclick;
	menubutton.onclick=function(a,b){
		bar.index=a.target.index;
		for(var i in bar.menus){
			if((!bar.index&&i==="0")||(bar.index&&bar.index.toString()===i.toString())){
				bar.menus[i].style.backgroundColor="green";
			}else{
				bar.menus[i].style.backgroundColor="grey";
			}
		}
		var btn=a.target;
		setvis();
		if(a.target.cfnc){
			a.target.cfnc(a,b);
		}
	};
	bar.appendChild(menubutton);
	menubutton.index=bar.menus.push(menubutton)-1;
	setwid();
	return menubutton;
}
function iFrameReady(iFrame, fn, hiding) {//calls fn when iFrame DOMCONTENT LOADED
	var timer;
	var fired = false;
	function ready() {
		if (!fired) {
			fired = true;
			clearTimeout(timer);
			iFrame.hidden = hiding;
			if (fn !== null && fn !== undefined) {
				try {
					fn.call(this, iFrame);
				} catch (err) {
					sc.D.e(err);
				}
			}
		}
	}
	function readyState() {
		if (this.readyState === "complete") {
			ready.call(this);
		}
	}
	// cross platform event handler for compatibility with older IE versions
	function addEvent(elem, event, fn) {
		if (elem.addEventListener) {
			return elem.addEventListener(event, fn);
		} else {
			return elem.attachEvent("on" + event, function () {
				return fn.call(elem, window.event);
			});
		}
	}
	// use iFrame load as a backup - though the other events should occur first
	addEvent(iFrame, "load", function () {
		ready.call(iFrame.contentDocument || iFrame.contentWindow.document);
	});
	function checkLoaded() {
		var doc = iFrame.contentDocument || iFrame.contentWindow.document;
		// We can tell if there is a dummy document installed because the dummy document
		// will have an URL that starts with "about:".  The real document will not have that URL
		if (doc.URL.indexOf("about:") !== 0) {
			if (doc.readyState === "complete") {
				ready.call(doc);
			} else {
				// set event listener for DOMContentLoaded on the new document
				addEvent(doc, "DOMContentLoaded", ready);
				addEvent(doc, "readystatechange", readyState);
			}
		} else {
			// still same old original document, so keep looking for content or new document
			timer = sc.D.sT(checkLoaded, 1);
		}
	}
	checkLoaded();
}