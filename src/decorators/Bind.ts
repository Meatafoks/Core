import { Binding } from './Binding';

export function Bind(target: any, propertyName: string | symbol, index?: any) {
    const returnType = Reflect.getMetadata('design:returntype', target, propertyName);
    Binding(returnType)(target, propertyName, index);
}
