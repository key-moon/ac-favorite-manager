import {favSets} from "../favs";
import {getObjectURL} from "../files";
import getTimeStamp from "../getTimeStamp";


export default function () {
    const circleName = location.pathname.split('/')[2];
    $.get(`/circles/${circleName}/api`).then(members => {
        let exportSets = new favSets();
        exportSets.sets[circleName] = new Set();
        exportSets.isActive[circleName] = true;
        members.forEach((member) => {
            exportSets.sets[circleName].add(member);
        });
        let elem = $(`<div style="text-align: center;">
    <a style="color: gray;" download="${`circles-${circleName}-${getTimeStamp()}.json`}" href="${getObjectURL(favSets.stringify(exportSets, false))}" target="_blank">
        お気に入り登録用ファイルをダウンロード
    </a>
</div>`);
        $("table").before(elem);
    });
}