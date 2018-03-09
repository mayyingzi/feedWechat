/**
 * storage 管理
 */


const authMsg = 'AUTH_MSG';
const unitMsg = 'UNIT_MSG';
const unitSelected = 'UNIT_SELECTED';


/**
 * 用户信息，存到sessionStorage中
 */
export const setAuthSession = (data) => {
    sessionStorage.setItem(authMsg, JSON.stringify(data));
};

export const getAuthSession = () => {
    try {
        const result = JSON.parse(sessionStorage.getItem(authMsg));
        return result || {
            userName: null
        };
    } catch (err) {
        return {
            userName: null
        };
    }
};
// 存储组织对象到session
export const setUnitSession = (data) => {
    sessionStorage.setItem(unitMsg, JSON.stringify(data));
};

export const getUnitSession = () => {
    try {
        const result = JSON.parse(sessionStorage.getItem(unitMsg));
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
};

// 选中的对象存储到localStorage中
export const setUnitSelected = (data) => {
    localStorage.setItem(unitSelected, JSON.stringify(data));
};

export const getUnitSelected = () => {
    try {
        const result = JSON.parse(localStorage.getItem(unitSelected));
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
};

