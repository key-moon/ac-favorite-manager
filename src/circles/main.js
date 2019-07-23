import {favSets} from "../favs";
import {saveFile} from "../files";
import getTimeStamp from "../getTimeStamp";


export default function () {
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