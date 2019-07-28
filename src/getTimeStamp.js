function padNumber(n) {
    const padZero = "00"+n;
    return padZero.substring(padZero.length - 2);
}

export default function(){
    const now = new Date();
    return `${now.getFullYear()}${padNumber(now.getMonth())}${padNumber(now.getDate())}-${padNumber(now.getHours())}${padNumber(now.getMinutes())}${padNumber(now.getSeconds())}`;
}