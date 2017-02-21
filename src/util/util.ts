'use strict'
export default class Util
{
    public static existsInArray(array: Array<any>, item: string): boolean
    {
        if (array === null) return false;
        return Boolean(array.find(a => a.name === item));
    }
}
