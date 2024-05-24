/**
 * @description 判斷是否為空
 * @param object/Array/string
 * @returns Boolean
 */
export const checkEmpty = obj => {
    if (obj === null || typeof obj === 'undefined') {
        return true;
    }
    if (Array.isArray(obj) || typeof obj === 'string') {
        return !obj.length;
    }
    if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }
    return false;
};
