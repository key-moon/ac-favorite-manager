import dropdownElement from "./html/dropdownElement.html";
import modal from "./html/modal.html";
import globalFavSets from "./globalFavSets";
import {favSets} from "../favs";
import {getObjectURL} from "../files";
import * as $ from "jquery";
import getTimeStamp from "../getTimeStamp";

const modalNode = $(modal);
const dropdownNode = $(dropdownElement);

const setSelectSelector = $("#fav-manager-set-select", modalNode);
const usersTableSelector = $("#fav-manager-users-table", modalNode);
const setNameInputSelector = $("#fav-manager-add-set-input", modalNode);
const addSetButtonSelector = $("#fav-manager-add-set-button", modalNode);
const userNameInputSelector = $("#fav-manager-add-user-input", modalNode);
const addUserButtonSelector = $("#fav-manager-add-user-button", modalNode)
const setDeleteButtonSelector = $("#fav-manager-set-delete-button", modalNode);
const selectImportFileButtonSelector = $("#fav-manager-select-import-file-button", modalNode);
const toggleSetActivenessButtonSelector = $("#fav-manager-toggle-set-activeness-button", modalNode);

function getSelectedSet() {
    return setSelectSelector.val();
}

function setSelectedSet(value) {
    setSelectSelector.val(value);
}

function updateSelector() {
    const selected = getSelectedSet();
    setSelectSelector.empty();
    for (const key in globalFavSets.isActive){
        setSelectSelector.append(`<option value="${E(key)}">${E(key)}${globalFavSets.isActive[key] ? "" : "(無効)"}</option>`);
    }
    setSelectedSet(selected);
}

function updateTable() {
    usersTableSelector.empty();
    appendRow();
    globalFavSets.sets[getSelectedSet()].forEach((user) => {
        if (usersTableSelector[0].lastElementChild.children.length === 3)
            appendRow();
        $(usersTableSelector[0].lastElementChild).append(
            `<td class="col-sm-4"><span>${E(user)}</span><a class="fav-manager-user-delete-button pull-right" name="${E(user)}" style="cursor : pointer; user-select: none;">×</a></td>`
        );
    });
    while (usersTableSelector[0].lastElementChild.children.length < 3){
        $(usersTableSelector[0].lastElementChild).append('<td class="col-sm-4"></td>');
    }
    function appendRow() {
        usersTableSelector.append("<tr></tr>");
    }
}

function updateDownloadLink() {
    const setExportElem = $("#fav-manager-set-export-button", modalNode)[0];
    const key = getSelectedSet();
    let exportSets = new favSets();
    exportSets.sets[key] = globalFavSets.sets[key];
    exportSets.isActive[key] = true;
    setExportElem.download = `favset-${key}-${getTimeStamp()}.json`;
    setExportElem.href = getObjectURL(favSets.stringify(exportSets, false));

    const allExportElem = $("#fav-manager-export-all-button", modalNode)[0];
    allExportElem.download = `all-favsets-${getTimeStamp()}.json`;
    allExportElem.href = getObjectURL(favSets.stringify(globalFavSets));
}

function updateView() {
    console.log(globalFavSets);
    const selectedSet = getSelectedSet();
    toggleSetActivenessButtonSelector.text(globalFavSets.isActive[selectedSet] ? "無効にする" : "有効にする");
    setDeleteButtonSelector.text(favSets.isSpecialSet(selectedSet) ? "クリア" : "セット削除");
    toggleSetActivenessButtonSelector.prop("disabled", selectedSet === "blacklist");
    updateDownloadLink();
    updateSelector();
    updateTable();
}

window.addEventListener("storage", event => {
    if (event.key !== 'favmanager-favSets') return;
    reloadFavs();
    updateView();
});

export default function(){
    $("body").prepend(modalNode);
    $(".navbar-right .dropdown-menu .divider:nth-last-child(2)").before(dropdownNode);
    setSelectSelector.change(updateView);
    setDeleteButtonSelector.click(() => {
        const key = getSelectedSet();
        if (favSets.isSpecialSet(key)) {
            globalFavSets.sets[key] = new Set();
        }
        else{
            delete globalFavSets.sets[key];
            delete globalFavSets.isActive[key];
            updateSelector();
            setSelectedSet("default");
        }
        storeFavs();
        updateView();
    });
    usersTableSelector.on("click", ".fav-manager-user-delete-button", (event) => {
        const key = getSelectedSet();
        const userName = event.target.getAttribute("name");
        globalFavSets.sets[key].delete(userName);
        storeFavs();
        updateView();
    });
    setNameInputSelector.keypress(e => {
         if (e.which === 13) addSetButtonSelector.click();
    });
    addSetButtonSelector.click(() => {
        const newSetName = setNameInputSelector.val().trim();
        if (newSetName) {
            globalFavSets.createNewSet(newSetName);
            updateSelector();
            setSelectedSet(newSetName);
        }
        setNameInputSelector.val("");
        storeFavs();
        updateView();
    });
    userNameInputSelector.keypress(e => {
        if (e.which === 13) addUserButtonSelector.click();
    });
    addUserButtonSelector.click(() => {
        globalFavSets.sets[getSelectedSet()].add(userNameInputSelector.val().trim());
        userNameInputSelector.val("");
        storeFavs();
        updateView();
    });
    toggleSetActivenessButtonSelector.click(() => {
        const selectedSet = getSelectedSet();
        globalFavSets.setActive(selectedSet, !globalFavSets.isActive[selectedSet]);
        storeFavs();
        updateView();
    });
    selectImportFileButtonSelector.change((event) => {
        let files = event.target.files;
        let reader = new FileReader();
        reader.onload = (readerEvent) => {
            try{
                let parsedSets = favSets.parse(readerEvent.target.result);
                globalFavSets.mergeWith(parsedSets);
                updateSelector();
                setSelectedSet(Object.keys(parsedSets.sets)[0]);
                storeFavs();
                updateView();
            }
            catch (e){
                alert("failed to load");
            }
        };
        for (let i = 0; i < files.length; i++){
            reader.readAsText(files[i]);
        }
    });
    $("#fav-manager-dropdown-button", dropdownNode).click(updateView);
    modalNode.ready(updateView);
}
