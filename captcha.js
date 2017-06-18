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
// @grant       GM_getValue
// @grant       GM_setValue
// donationsURL paypal.me/JonathanHeindl :3
// ==/UserScript==

//if the captcha is reloading the images at click fail it (im not sure if the image data is set up in that case)
var sc = {
    c: constants = {
        sI: storage_identifiers = {
            LS: {
                instantrefresh: "now",
                blockhost: "notallowed",
                youtubemostrecent: "mostRecentVideo", //used for check if new videos arrived (can be reset)
                cine_lastvideo_index: "cinelastvideo", // used for check if new videos arrived (can be reset)
                countdown_refreshtimer: "refreshtimer"  //storage for automatic refershtimers shouldnt be reset but no big problem
            },
            SS: {
                crossdomainstorage: "name",
                timer_checking: "checking",
                timer_paused: "pause"
            },
            SSCD: {
                historylog: "history",
                buttonsfornextinstance: "nextbuttons"
            },
            GS: {
                eventstorage: "recentevents",
                whatsappgroupchats: "whatsappchats",
                scriptcomm: "communication",
                scriptcomm2: "communication2",
                timed_notifications: "notificationstimed",
                cinewatchlist: "watchlist",
                kissanimecaptcha: "kissanimecaptchafinished"
            }
        },
        buttonsfornextinstance: "nextinstancebuttons",
        youtube_save_duration: 48, //how long to save youtube vidoes
        followed_csgo_teams: ["fnatic", "GODSENT"],
        matching_icons: [
            "data:image/png;base64,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",
            "data:image/jpeg;base64,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"
        ], //to followed_csgo_teams
        notification_awareness_string: "now\nhere",
        recent_notifications_amount: 20,
        notification_save_duration: 24, //how long to save notifications
        notification_check_interval: 1,
        twitch_emotes_replacer: ["shrug", ["#", 175, 92, 95, 40, 12484, 41, 95, 47, 175], "sad", "BibleThump"],
        chat_bot: [["hallo", "o/ hallo", "chat"], ["hello", "o/ hello", "chat"], ["Kreygasm", "Kreygasm", "chat"], ["command", function () {}, "command"]],
        twitch_chat_color_timeout: 1000 * 60 * 2,
        twitch_chat_bot_coms: [["time", "sc.T.m2D(sc.T.n() - sc.T.rt)"], ["lottery", "\"you have \"+(Math.random()>0.5?\"won\":\"lost\")"]],
        twitch_chat_bot_difficulty: 10,
        GS_function_call_string: [],
        reloadtime: 30 + ((Math.random() - 0.5) * 5), //minutes
        checkingtime: 10, //days
        setting_completed_to_last_link: false, //sets all completed+unwatched animes+to newest link (might trigger spam/ddos filter)
        checkingfornewAnimeenabled: true,
        main_runs: 5,
        main_sites: [],
        site_checkurls: ["http://kissanime.ru/BookmarkList", "http://kissmanga.com/BookmarkList", "https://www.hltv.org/", "https://bs.to/", "https://cine.to/"],
        site_check_time: 90   //minutes until recheck
    },
    g: getter = {
        I: function ID(string, iF) {
            if (iF !== undefined) {
                return iF.contentDocument.getElementById(string);
            }
            return document.getElementById(string);
        },
        C: function className(string, iF) {
            var list;
            if (iF !== undefined) {
                list = iF.contentDocument.getElementsByClassName(string);
            } else {
                list = document.getElementsByClassName(string);
            }
            if (list.length === 1) {
                return list[0];
            } else if (list.length === 0) {
                return undefined;
            }
            return list;
        },
        T: function tag(string, iF) {
            var list;
            if (iF === undefined) {
                list = document.getElementsByTagName(string);
            } else {
                list = iF.contentDocument.getElementsByTagName(string);
            }
            if (list.length === 1) {
                return list[0];
            } else if (list.length === 0) {
                return undefined;
            }
            return list;
        },
        c0: function child(element, count = 0) {
            if (count === 0) {
                return element;
            }
            return child(element.children[0], count - 1);
        },
        W: function (top = false, wnd) {
            //sc.D.l(location.host+" scripts.getwindow()",3);
            if (top) {
                if (wnd === undefined) {
                    wnd = sc.g.W();
                }
                if (wnd.parentElement !== undefined) {
                    return sc.g.W(true, wnd.parentElement);
                } else if (wnd.parent !== undefined) {
                    return sc.g.W(true, wnd.parent);
                } else {
                    return wnd;
                }
            }
            if (window.unsafeWindow !== undefined) {
                return unsafeWindow;
            }
            return window;
        }
    },
    L: LocalStorage = {
        s: function setLS(identifier, element, log = 1) {
            sc.D.l("writing " + element.toString() + " in " + identifier, log);
            localStorage.setItem("tampermonkey_" + identifier, JSON.stringify(element));
        },
        g: function getLS(identifier, standard = new Array(0), log = 1) {
            var element = JSON.parse(localStorage.getItem("tampermonkey_" + identifier));
            if (element === null) {
                element = JSON.parse(localStorage.getItem(identifier));
                if (element !== null) {
                    this.s(identifier, element);
                    localStorage.removeItem(identifier);
                    try {
                        localStorage.removeItem("checking");
                    } catch (e) {
                    }
                }
            }
            if (element === null) {
                this.s(identifier, standard);
                return standard;
            }
            sc.D.l("getting " + element.toString() + " from " + identifier, log);
            return element;
        },
        p: function pushLS(identifier, object, standard) {
            var ar = this.g(identifier, standard);
            if (ar.constructor.name === "Array") {
                ar.push(object);
                this.s(identifier, ar);
            } else {
                sc.D.e("not an array");
            }
        }
    },
    S: SessionStoage = {
        s: function setSS(identifier, element, log = 1) {
            sc.D.l("writing " + element.toString() + " in " + identifier, log);
            sessionStorage.setItem("tampermonkey_" + identifier, JSON.stringify(element));
        },
        g: function getSS(identifier, standard = new Array(0), log = 1) {
            var element = JSON.parse(sessionStorage.getItem("tampermonkey_" + identifier));
            if (element === null) {
                this.s(identifier, standard);
                return standard;
            }
            sc.D.l("getting " + element.toString() + " from " + identifier, log);
            return element;
        },
        p: function pushSS(identifier, object, standard) {
            var ar = this.g(identifier, standard);
            if (ar.constructor.name === "Array") {
                ar.push(object);
                this.s(identifier, ar);
            } else {
                sc.D.e("not an array");
            }
        },
        CD: crossdomain = {
            getObject: function getnametoObject(identifier) {
                if (sc.g.W().name === "" || sc.g.W().name.indexOf("{") === -1) {
                    if (sc.g.W().name2 === "" || sc.g.W().name2 === undefined || sc.g.W().name2.indexOf("{") === -1) {
                        sc.g.W().name = JSON.stringify(sc.S.g(sc.c.sI.SS.crossdomainstorage, {}));
                    }
                }

                var storageObject;
                try {
                    storageObject = JSON.parse(sc.g.W().name);
                } catch (e) {
                    storageObject = JSON.parse(sc.g.W().name2);
                }
                var GO = sc.G.g("tempSS", {});
                if (GO.url === location.href && GO.identifier === identifier) {
                    var obj = {};
                    obj[identifier] = GO.content;
                    return obj;
                }

                // return sc.S.g("name");
                return storageObject;
            },
            s: function setSSCD(identifier, element, log = 1) {
                sc.D.l("writing SS CD " + element.toString() + " in " + identifier, log);
                var storageObject = this.getObject(identifier);
                storageObject[identifier] = element;
                sc.g.W().name = JSON.stringify(storageObject);
                sc.S.s(sc.c.sI.SS.crossdomainstorage, storageObject);
                return sc.g.W().name;
            },
            g: function getSSCD(identifier, standard = new Array(0), log = 1) {
                var obj = this.getObject(identifier);
                var element = obj[identifier];
                if (element === undefined || element === null) {
                    this.s(identifier, standard);
                    return standard;
                }
                sc.D.l("getting SS CD" + element.toString() + " from " + identifier, log);
                return element;
            },
            p: function pushSSCD(identifier, object, standard) {
                var ar = this.g(identifier, standard);
                ar.push(object);
                this.s(identifier, ar);
                return sc.g.W().name;
            }

        }
    },
    G: GreasemonkeyStorage = {
        s: function setGS(identifier, element, log = 2) {
            sc.D.l("writing " + JSON.stringify(element) + " in " + identifier, log);
            GM_setValue(identifier, element);
        },
        g: function getGS(identifier, standard = new Array(0), log = 1) {
            var element = GM_getValue(identifier);
            if (element === null || element === undefined) {
                this.s(identifier, standard);
                return standard;
            }
            sc.D.l("getting " + element.constructor.name + " from " + identifier, log);
            return element;
        },
        p: function (identifier, object, standard = new Array(0)) {
            var ar = this.g(identifier, standard);
            ar.push(object);
            this.s(identifier, ar);
        },
        l: function (name, fn, value1) {
            function callfn(name, oldV, newV, remote) {
                if (value1) {
                    fn(value1, name, oldV, newV, remote);
                } else {
                    fn(name, oldV, newV, remote);
                }
                //fn : function(name, old_value, new_value, remote) {}
            }
            return GM_addValueChangeListener(name, callfn);
        }
    },
    A: ArrayTools = {
        c: function contains(e, f) {           // array e   element of e f ?
            for (var i = 0; i < e.length - 2; i++) {
                if (f.indexOf(e[i].firstChild.href) > -1) {
                    return true;
                }
            }
            return false;
        },
        cEQ: function contains(e, f, split = undefined, replace = undefined) {           // array e   element of e f ?
            for (var i = 0; i < e.length; i++) {
                if (f.indexOf(e[i].split(split)[0].replace(replace, "")) > -1) {
                    return true;
                }
            }
            return false;
        },
        /*rI: function removeArraybyIndex(e, f) {     //array e element of e index f
         var g = new Array(e.length - 1);
         for (var i = 0; i < e.length; i++) {
         if (i < f) {
         g[i] = e[i];
         } else {
         if (i === f) {
         } else {
         g[i - 1] = e[i];
         }
         }
         }
         return g;
         },
         rE: function removeArrayByElement(e, f) {     //array e element of e  element f
         var g = new Array(e.length - 1);
         var found = false;
         for (var i = 0; i < e.length; i++) {
         if (e[i] === f) {
         found = true;
         } else {
         if (!found) {
         g[i] = e[i];
         } else {
         g[i - 1] = e[i];
         }
         }
         }
         return g;
         },
         f: function findArray(e, f, equal = false, path = "", first = true) {
         var index = -1;
         for (var i = 0; i < e.length; i++) {
         if (equal) {
         if (f === eval("e[i]" + path)) {
         index = i;
         if (first) {
         return index;
         }
         }
         } else {
         if (f.toString().indexOf(eval("e[i]" + path)) > -1) {
         index = i;
         if (first) {
         return index;
         }
         }
         }
         }
         return index;
         },*/
        l: function logArray(e) {
            var alertS = "";
            for (var j = 0; j < e.length; j++) {
                alertS += e[j] + "\n";
            }
            sc.D.l(alertS);
        },
        iB: function insertBefore(ar, e, i) {//array ar element e to insert , before element i
            var t = new Array(ar.length + 1);
            var inserted = false;
            for (var f = 0; f < t.length; f++) {
                if (inserted) {
                    t[f] = ar[f - 1];
                } else {
                    if (ar[f] === i) {
                        t[f] = e;
                        inserted = true;
                    } else {
                        t[f] = ar[f];
                    }
                }
            }
            return t;
        },
        /*a: function (array, fnc) {
         for (var i = 0; i < array.length; i++) {
         fnc(array, i);
         }
         },
         ar: function (array, fnc) {
         for (var i = array.length - 1; i > -1; i--) {
         fnc(array, i);
         }
         },*/
        r: function recursive(stopcrit, stopfnc, array, fnc, addition = "", prefix = "", index = 0, isremoving = true, closetimeout = 100) {
            sc.D.l(location.host + " sc.A.recursive()", 3);
            sc.D.l("stopcrit: " + stopcrit + " index : " + index + " array :" + array + " function : " + ((fnc !== null) ? "is there" : "null") + " addition : " + addition + " prefix :" + prefix);
            if (stopcrit === null) {
                stopcrit = array.length;
            }
            if (index !== stopcrit) {
                sc.D.l("url :" + prefix + array[index] + addition);
                scripts.DOM.crIF(document.body, prefix + array[index] + addition, (function () {
                    return function (iFr) {
                        sc.D.l("loaded " + iFr.src);
                        if (fnc !== null) {
                            var ar = new Array(stopcrit);
                            ar[index] = iFr;
                            fnc(ar, index);
                        }
                        if (isremoving) {
                            sc.D.sT(function () {
                                iFr.remove();
                            }, closetimeout);
                        }
                        sc.D.sT(function () {
                            recursive(stopcrit, stopfnc, array, fnc, addition, prefix, index + 1, isremoving, closetimeout);
                        }, closetimeout + 1000);
                    };
                }()));
            } else {
                sc.D.l("calling stop");
                try {
                    if (stopfnc !== null) {
                        stopfnc.call(this);
                    }
                } catch (e) {
                    sc.D.e("error calling stopfunction");
                }
        }
        }
    },
    T: TIME = {
        aT: false,
        n: function now() {
            return new Date().valueOf();
        },
        D: function toDate(a) {
            try {
                a = JSON.parse(a);
            } catch (e) {
                sc.D.e(e);
            }
            var t = new Date();
            t.setMilliseconds(t.valueOf() * -1);
            t.setMilliseconds(a);
            return t.toLocaleString();
        },
        m2D: function milliToDays(a) {
            var negative = false;
            if (a < 0) {
                negative = true;
                a *= -1;
            }
            var timestamp = a;
            var output = "";
            var time = 0;
            while (timestamp > 1000 * 60 * 60 * 24 * 365) {
                time++;
                timestamp -= 1000 * 60 * 60 * 24 * 365;
            }
            if (time !== 0) {
                output += time + " years, ";
            }
            time = 0;
            while (timestamp > 1000 * 60 * 60 * 24 * 1) {
                time++;
                timestamp -= 1000 * 60 * 60 * 24 * 1;
            }
            if (time !== 0) {
                output += time + " days, ";
            }
            time = 0;
            while (timestamp > 1000 * 60 * 60 * 1) {
                time++;
                timestamp -= 1000 * 60 * 60 * 1;
            }
            if (time !== 0) {
                output += time + " hours, ";
            }
            time = 0;
            while (timestamp > 1000 * 60 * 1) {
                time++;
                timestamp -= 1000 * 60 * 1;
            }
            if (time !== 0) {
                output += time + " minutes, ";
            }
            time = 0;
            while (timestamp > 1000 * 1) {
                time++;
                timestamp -= 1000 * 1;
            }
            output += time + " seconds";
            if (negative) {
                return "- " + output;
            }
            return output;
        },
        t: function time(delay, object, startTime, instantonly = false, refresh = "", preString = "") {
            sc.D.l(location.host + " sc.T.t " + (startTime + delay - sc.T.n()), 3);
            sc.T.aT = true;
            if (refresh !== "") {
                delay = sc.L.g(refresh, "", 0);
                if (delay < 0) {
                    if (object.type === "text") {
                        object.value = "disabled";
                    } else {
                        object.innerHTML = "disabled";
                    }
                    sc.T.aT = false;
                    return;
                }
            } else {
                if (delay < 0) {
                    sc.T.aT = false;
                    return;
                }
            }
            if (sc.S.g(sc.c.sI.SS.timer_checking, 0, 0) !== 1) {
                try {
                    if (object.type === "text" && !object.isclicked) {
                        object.value = preString + sc.T.m2D(startTime + delay - sc.T.n()) + " seconds until refresh";
                    } else {
                        object.innerHTML = preString + sc.T.m2D(startTime + delay - sc.T.n()) + " seconds until refresh";
                    }
                    bar.updateswitch();
                } catch (e) {
                    sc.D.e(e);
                    sc.D.l(sc.T.m2D(startTime + delay - sc.T.n()) + " seconds until refresh instnatonly :" + instantonly, 0);
                }
                if (location.href === sc.L.g(sc.c.sI.LS.instantrefresh, -1, 0)) {
                    sc.D.l("refreshing on instant ");
                    sc.L.s(sc.c.sI.LS.instantrefresh, -1, 0);
                    sc.T.aT = false;
                    reload();
                }
                if (sc.T.n() > startTime + delay && !instantonly) {
                    var lastreload = sc.G.g("lastreload", 0);
                    var reloadtimeout = 2; //minutes
                    if (lastreload[0] + (1000 * 60 * reloadtimeout) < sc.T.n()) {
                        sc.G.s("lastreload", [sc.T.n(), location.href]);
                        sc.D.l("reloading");
                        reload();
                        sc.T.aT = false;
                        return;
                    } else {
                        console.log("last reload < " + reloadtimeout + " from " + lastreload[1] + "difference: " + (lastreload[0] + (1000 * 60 * reloadtimeout)) + " now : " + sc.T.n());
                        console.log("next check in " + sc.T.m2D((lastreload[0] + (1000 * 60 * reloadtimeout)) - sc.T.n()));
                        sc.D.sT(time, (lastreload[0] + (1000 * 60 * reloadtimeout)) - sc.T.n(), delay, object, startTime, instantonly, refresh, preString);
                        return;
                    }
                } else {
                    sc.D.sT(time, 1000, delay, object, startTime, instantonly, refresh, preString);
                }
            } else {
                if (object.type === "text" && !object.isclicked) {
                    object.value = "checking disabled";
                } else {
                    object.innerHTML = "currently checking";
                }
                if (!sc.S.g("final", false)) {
                    sc.D.sT(time, 1000, delay + 1000, object, startTime, instantonly, refresh, preString);
                } else {
                    sc.T.aT = false;
                    return;
                }
        }
        },
        rt: new Date().valueOf()
    },
    X: XMLRequests = {
        g: function get(url, requestHeader = [], c, PW = []) {
            //function check(btn,c){
            var http = new XMLHttpRequest();
            if (PW.length === 2) {
                http.open("GET", url, true, PW[0], PW[1]);
            } else {
                http.open("GET", url, true);
            }
            //Send the proper header information along with the request
            //http.setRequestHeader("Content-type", "text/html; charset=utf-8");
            if (requestHeader === undefined || requestHeader === null) {
                http.setRequestHeader("Content-type", "text/html; charset=utf-8");
                // http.setRequestHeader("referrer-policy", "no-referrer");
            } else if (requestHeader.constructor.name !== "Array") {
                http.setRequestHeader(requestHeader.split(',')[0], requestHeader.split(',')[1]);
            } else {
                for (var i = 0; i < requestHeader.length; i++) {
                    http.setRequestHeader(requestHeader[i][0], requestHeader[i][1]);
                }
            }
            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState === 4 && http.status === 200) {
                    var list = http.responseText;
                    try {
                        c.call(this, list);
                    } catch (error) {
                        sc.D.e(error);
                    }
                }
            };
            http.send();
        },
        s: function post(url, requestHeader, c, params) {
            var http = new XMLHttpRequest();
            // var url = "https://bs.to/ajax/edit-seriesnav.php";
            //var params = new FormData();
            var form = "series%5B%5D=";
            // form += ar[0];
            //for (var z = 1; z < ar.length; z++) {
            //    form += "&series%5B%5D=" + ar[z];
            //
            //params.append("",form);
            //var params = form;
            http.open("POST", url, true);
            //Send the proper header information along with the request
            //http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            if (requestHeader === undefined || requestHeader === null || requestHeader.length === 0) {
                http.setRequestHeader("Content-type", "text/html; charset=utf-8");
            } else {
                http.setRequestHeader(requestHeader[0], requestHeader[1]);
            }
            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState === 4 && http.status === 200) {
                    sc.D.l(http.responseText);
                    //c.call(this);
                }
            };
            http.send(params);
        }
    },
    D: debug = {
        d: 5, //3 includes all logged function calls
        c: true,
        n: 0,
        lO: new Array(0),
        aL: function (object, string, fn, value1) {
            function runcaught(a, b, c, d, e, f) {
                try {
                    fn(a, b, c, d, e, f);
                } catch (e) {
                    sc.D.e(e);
                }
            }
            ;
            if (object === "GM") {
                if (value1 && value1.target.script === "sec") {
                    sc.g.W().sec.l(string, runcaught, value1);
                } else {
                    scripts.listenercontainer.push(sc.G.l(string, runcaught, value1));
                }
            } else if (string === "att") {
                var obs = new MutationObserver(runcaught);
                obs.observe(object, {attributes: true, childList: true, characterData: true});
            } else {
                scripts.listenercontainer.push([object, string, runcaught]);
                object.addEventListener(string, runcaught);
            }

        },
        l: function log(text, value = 5, stack = false) {
            if (this.d <= value) {
                if (stack) {
                    var array = new Array(0);
                    try {
                        array[1] = array[2][2];
                    } catch (e) {
                        try {

                            console.log(sc.T.n() + "; " + text + "\n" + e.stack.replace(e.message, "").replace("TypeError:", "").replace("\n", "").replace(" ", ""));
                        } catch (er) {
                            sc.D.e(er);
                        }
                    }
                } else {
                    try {
                        console.log(sc.T.n() + "; " + text);
                    } catch (er) {
                        sc.D.e(er);
                    }
                }
        }
        },
        e: function err(text, callstack = "", value = 5) {
            if (this.d <= value) {
                if (text.stack === undefined) {
                    text.stack = "";
                }
                debugger;
                if (text.stack.indexOf("Error") === -1) {
                    var line = text.stack;
                } else {
                    var lines = text.stack.split("\n");
                    var line = "";
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i].indexOf(" at E_c") > -1) {
                            line = lines[i].split("at E_c")[1].split(",")[1].split(":")[1] - 4;
                            break;
                        }
                    }
                }
                new Notification(location.href, {body: "line :" + line + "\n" + text});
                var ar = sc.G.g("customlog", new Array(0), 0);
                ar.push(text);
                sc.G.s("customlog", ar, 0);
                try {
                    console.error(sc.T.n() + " ; " + text.stack + "\n" + callstack);
                } catch (e) {
                    sc.D.e(e);
                }
        }
        },
        s: function setAttribute(object, identifier, attribute) {
            if (attribute.constructor.name === "Function") {
                object[identifier] = function () {
                    if (sc.D.c) {
                        try {
                            attribute();
                        } catch (error) {
                            sc.D.e(error);
                        }
                    } else {
                        attribute();
                    }
                };
            } else {
                object[identifier] = attribute;
            }
        },
        sT: function setCustomTimeout(fnc, time, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
            return setTimeout(function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
                if (sc.D.c) {
                    /* fnccopy = fnc;
                     var spl = (fnccopy + "").split("{");
                     func = "return " + spl[0] + "{\n try";
                     for (var i = 1; i < spl.length; i++) {
                     func += "{" + spl[i];
                     }
                     func += "catch(error){\n\tsc.D.e(error);\n}};";
                     new Function(func)()(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);*/
                    try {
                        fnc(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
                    } catch (error) {
                        sc.D.e(error);
                    }
                } else {
                    fnc(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
                }

            }, time, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
        },
        o: function openwindow(url, indexurl = location.href, focus = sc.G.g("standardopeninnewtab", true), sametab = false) {
            if (sametab) {
                location.href = url;
                return window;
            } else {
                if (!focus) {
                    var win = GM_openInTab(url, {active: false, insert: false}); //active ~focused insert: append at end or after the current tab
                    win.name = window.name;
                    return win;
                } else {
                    var win = sc.g.W().opencopy(url);
                    if (win) {
                        win.url = indexurl;
                    }
                    return win;
                }
        }
        }
    }
};
sc.g.W().sc = sc;

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
							obj.data = data.toString();
							var found=false;
							for(var k=0;k<saved.length;k++){
								if(obj.data===saved[k].data&&obj.tag===saved[k].tag){
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