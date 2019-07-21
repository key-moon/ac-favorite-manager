
export class favSets{
    constructor(){
        this.sets = {default:new Set(),blacklist:new Set()};
        this.isActive = {default:true,blacklist:false};
    }

    setActive(key, activeness){
        if (key === "default" || key === "blacklist") throw Error(`activeness of ${key} is fixed`);
        if (!this.isActive.hasOwnProperty(key)) throw Error(`key ${key} is not found in favSets`);
        this.isActive[key] = activeness;
    }

    mergeWith(newSets){
        for (const key in newSets.sets){
            if (this.sets.hasOwnProperty(key)) {
                newSets.sets[key].forEach((user) => {
                    this.sets[key].add(user);
                });
                this.isActive[key] |= newSets.isActive[key];
            }
            else{
                this.sets[key] = newSets.key;
                this.isActive[key] = newSets.isActive[key];
            }
        }
    }

    //defaultは常に有効、blacklistは常に無効
    get favSet() {
        let a = [];
        for (const key in this.isActive){
            if (!this.isActive[key]) continue;
            a.push(...this.sets[key]);
        }
        let set = new Set(a);
        this.sets["blacklist"].forEach((user) => {
            set.delete(user);
        });
        return set;
    }

    /**
     * favSetsをJSON化する
     * @param {favSets} favSets
     * @param {boolean} containActivenessData
     * @return {string}
     */
    static stringify(favSets, containActivenessData = true){
        let res = [];
        for (const key in favSets.isActive){
            let data = {name: key, users: setToArray(favSets.sets[key])};
            if (containActivenessData) data.isActive = favSets.isActive[key];
            res.push(data);
        }
        return JSON.stringify(res);
    }

    /**
     * JSONからfavSetsを復元する
     * @param {string} json
     * @return {favSets}
     */
    static parse(json){
        let sets = new favSets();
        JSON.parse(json).forEach((elem) => {
            if (!elem.hasOwnProperty("name")) throw new Error(`key "name" not found in ${JSON.stringify(elem)}`);
            if (!elem.hasOwnProperty("users")) throw new Error(`key "users" not found in ${JSON.stringify(elem)}`);
            if (!Array.isArray(elem.users)) throw new Error(`Value of key "users"(${JSON.stringify(elem.users)}) is not an array`);

            sets.sets[elem.name] = arrayToSet(elem.users);
            sets.isActive[elem.name] = elem.hasOwnProperty("isActive") ? elem.isActive : true;
        });
        return sets;
    }
}
