import {favSets} from "../favs";
import globalFavSets from "./globalFavSets";


export default function () {
    storeFavs = () => {
        setLS('favmanager-favSets', favSets.stringify(globalFavSets));
        setLS('fav', setToArray(favSet = globalFavSets.favSet));
    };

    reloadFavs = () => {
        globalFavSets.initialize();
        globalFavSets.mergeWith(favSets.parse(getLS('favmanager-favSets') || "[]"));
        favSet = globalFavSets.favSet;
    };

    toggleFav = (val) => {
        reloadFavs();
        let res;
        if (favSet.has(val)) {
            globalFavSets.sets.default.delete(val);
            globalFavSets.sets.blacklist.add(val);
            res = false;
        } else {
            globalFavSets.sets.default.add(val);
            globalFavSets.sets.blacklist.delete(val);
            res = true;
        }
        favSet = globalFavSets.favSet;
        storeFavs();
        return res; // has val now
    };


    //migration
    if (!getLS('favmanager-favSets')) {
        getLS('fav').forEach((user) => {
            globalFavSets.sets.default.add(user);
        });
        storeFavs();
    }
    else{
        reloadFavs();
    }
}