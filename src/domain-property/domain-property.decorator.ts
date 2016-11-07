import {} from "reflect-metadata";
import {DomainValue} from "./domain-value";

export const DOMAIN_PROP_KEY = 'domain-values';

export function DomainProperty(type:{new(a:any): DomainValue<any>}){
  return function(target:any, key:string){
    let domainProperties = Reflect.getMetadata(DOMAIN_PROP_KEY, target) || {};
    domainProperties[key] = type;
    Reflect.defineMetadata(DOMAIN_PROP_KEY, domainProperties, target);
  }
}
