import {favSets} from "./favs";

export default function () {
    storeFavs = () => {
        setLS('favmanager-favSets', favSets.stringify(favmanager_favSets));
        setLS('fav', setToArray(favSet));
    };

    reloadFavs = () => {
        favmanager_favSets = favSets.parse(getLS('favmanager-favSets') || []);
        favSet = favmanager_favSets.favSet;
    };

    toggleFav = (val) => {
        reloadFavs();
        let res;
        if (favSet.has(val)) {
            favmanager_favSets.sets.default.delete(val);
            favmanager_favSets.sets.blacklist.add(val);
            res = false;
        } else {
            favmanager_favSets.sets.default.add(val);
            favmanager_favSets.sets.blacklist.delete(val);
            res = true;
        }
        favSet = favmanager_favSets.favSet;
        storeFavs();
        return res; // has val now
    };
}