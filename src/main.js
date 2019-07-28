// ==UserScript==
// @name        ac-favorite-manager
// @namespace   https://atcoder.jp/
// @version     1.1.0
// @description AtCoderのお気に入りの管理を行います。
// @author      keymoon
// @license     MIT
// @match       https://atcoder.jp/*
// @exclude     https://atcoder.jp/*/json
// @match       http://atcoder-circles.com/circles/*
// @exclude     http://atcoder-circles.com/circles/
// ==/UserScript==

import atcoder_main from "./atcoder/main.js";
import circles_main from "./circles/main.js";

if (location.hostname === "atcoder.jp"){
    atcoder_main();
}
else if (location.hostname === "atcoder-circles.com"){
    circles_main();
}