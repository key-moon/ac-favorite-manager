/**
 * ファイルに保存するためのURLを取得
 * @param {string} content
 */
export function getObjectURL(content) {
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, content], { type: "text/plain" });
    return window.URL.createObjectURL(blob);
}
