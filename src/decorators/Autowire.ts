import { Inject } from './Inject';
import { MetadataUtils } from '../utils';

export function Autowire(target: any, propertyName: string | symbol | any, index?: any) {
    const classType = MetadataUtils.getClassPropertyType(target, propertyName);
    Inject(classType)(target, propertyName, index);
}
