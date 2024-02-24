import { Inject } from './Inject';

export function Value(name: string) {
    return (target: any, propertyName: string | symbol | any, index?: any) => {
        Inject(name)(target, propertyName, index);
    };
}
