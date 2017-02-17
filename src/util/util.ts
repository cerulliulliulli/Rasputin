'use strict'

export default class Util
{
    public static existsInArray(array: Array<any>, item: string): boolean
    {
        if (array === null)
            return false;

        let x: number = 0;
        while (x < array.length)
        {
            if (array[x].name === item)
                return true;
            x++;
        }
        return false;
    }
}
