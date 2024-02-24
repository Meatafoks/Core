import { ComponentConstructor } from './ComponentConstructor';

export type FunctionReturning<T> = (...args: Array<any>) => T;

export type ComponentType<T = undefined> = ComponentConstructor<T> | FunctionReturning<T> | T;

export function isConstructor<T>(obj: any): obj is ComponentConstructor<T> {
    return typeof obj === 'function' && /^\s*class\s+/.test(obj.toString());
}

export function isFunctionReturning<T>(obj: any): obj is FunctionReturning<T> {
    return typeof obj === 'function' && !/^\s*class\s+/.test(obj.toString());
}
