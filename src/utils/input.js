// 输入的文字中包含中文
export const hasChineseChar = (char) => {
    const pattern = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!pattern.exec(char)) {
        return false;
    }
    return true;
};

// 只可输入数字和英文
export const isValidCode = (char) => {
    const pattern = /^[0-9a-zA-Z]{4}$/;
    if (!pattern.exec(char)) {
        return false;
    }
    return true;
};
