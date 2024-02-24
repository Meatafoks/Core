import { Inject } from './Inject';

export function Autowire(target: any, propertyName: string | symbol | any, index?: any) {
    const classType = Reflect.getMetadata('design:type', target, propertyName);
    Inject(classType)(target, propertyName, index);
}
