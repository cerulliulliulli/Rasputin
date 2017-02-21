'use strict'
import { Role } from 'discord.js';
export default class Util
{
    public static existsInArray(array: Array<any>, item: string): boolean
    {
        if (array === null) return false;
        return Boolean(array.find(a => a.name === item));
    }

    public static isSpecificResult(array: Array<any>, item: string): boolean
    {
        if (array === null) return false;
        return Boolean(array.find(a => a.string === item));
    }

    public static doesRoleExist(array: Array<any>, item: Role): boolean
    {
        if (array === null) return false;
        return Boolean(array.find(a => a.id === item.id));
    }

    public static getSpecificRole(array: Array<any>, item: string): Role
    {
        return array.find(a => a.string === item).original[1];
    }

    public static getSpecificRoleName(array: Array<any>, item: string): string
    {
        return array.find(a => a.string === item).original.name;
    }

    public static getRoleToRemove(array: Array<any>, item: string): number
    {
        return array.findIndex(a => a.name === item);        
    }
}
