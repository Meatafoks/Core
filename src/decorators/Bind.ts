import { Binding } from './Binding';
import { MetadataUtils } from '../utils';

export function Bind(target: any, propertyName: string | symbol, index?: any) {
    const returnType = MetadataUtils.getClassMethodReturnType(target, propertyName);
    Binding(returnType)(target, propertyName, index);
}
