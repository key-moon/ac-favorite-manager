import * as $ from "jquery";
import dropdownElement from "./html/dropdownElement.html";
import modal from "./html/modal.html";


export default function(){
    $("body").prepend($(modal));
    $(".navbar-right .dropdown-menu .divider:nth-last-child(2)").before($(dropdownElement));
}
