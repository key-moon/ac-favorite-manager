
export class favSets{
    constructor(){
        this.sets = {};
        this.isActive = {};
    }

    initialize(){
        this.sets = {default:new Set(),blacklist:new Set()};
        this.isActive = {default:true,blacklist:true};
    }

    createNewSet(key){
        if (typeof(key) !== "string") throw new Error(`set名 ${JSON.stringify(key)} は文字列型ではありません`);
        if (this.sets[key]) throw new Error(`set名 ${key} は既に存在しています`);
        this.sets[key] = new Set();
        this.isActive[key] = true;
    }

    setActive(key, activeness){
        if (typeof(key) !== "string") throw new Error(`set名 ${JSON.stringify(key)} は文字列型ではありません`);
        if (favSets.isActivenessFixed(key)) throw Error(`set ${key} の有効値は変更できません`);
        if (!this.isActive.hasOwnProperty(key)) throw Error(`set名 ${key} は存在していません`);
        this.isActive[key] = !!(activeness);
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
                this.sets[key] = newSets.sets[key];
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
            if (!elem.hasOwnProperty("name")) throw new Error(`key "name" がオブジェクト ${JSON.stringify(elem)} に存在しません`);
            if (!elem.hasOwnProperty("users")) throw new Error(`key "users" がオブジェクト ${JSON.stringify(elem)} に存在しません`);
            if (typeof(elem.name) !== "string") throw new Error(`key "name" の値 (${JSON.stringify(elem.name)}) は文字列型でありません`);
            if (!Array.isArray(elem.users)) throw new Error(`key "users" の値 (${JSON.stringify(elem.users)}) は配列ではありません`);

            sets.sets[elem.name] = arrayToSet(elem.users);
            sets.isActive[elem.name] = elem.hasOwnProperty("isActive") ? !!(elem.isActive) : true;
        });
        return sets;
    }

    static isActivenessFixed(key){
        return key === "default" || key === "blacklist";
    }
}
