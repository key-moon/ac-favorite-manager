// ==UserScript==
// @name        ac-favorite-manager
// @namespace   https://atcoder.jp/
// @version     1.0.1
// @description AtCoderのお気に入りの管理を行います。
// @author      keymoon
// @license     MIT
// @match       https://atcoder.jp/*
// @exclude     https://atcoder.jp/*/json
// @match       http://atcoder-circles.com/circles/*
// @exclude     http://atcoder-circles.com/circles/
// ==/UserScript==


import injectFavHandler from "./injectFavHandler";
import generateElement from "./generateElement";
import {favSets} from "./favs";
import {saveFile} from "./files";
import getTimeStamp from "./getTimeStamp";


if (location.hostname === "atcoder.jp"){
    injectFavHandler();
    generateElement();
}
else{
    let elem = $("<div style=\"text-align: center;\"><a style=\"color: gray;\" href=\"#\" onclick=\"return false;\">お気に入り用のファイルをダウンロード</a></div>");
    $("table").before(elem);
    $("a", elem).click(() => {
        const circleName = location.pathname.split('/')[2];
        $.get(`/circles/${circleName}/api`).then(members => {
            let exportSets = new favSets();
            exportSets.sets[circleName] = new Set();
            exportSets.isActive[circleName] = true;
            members.forEach((member) => {
                exportSets.sets[circleName].add(member);
            });
            saveFile(favSets.stringify(exportSets, false), `circles-${circleName}-${getTimeStamp()}.json`);
        });
    });
}