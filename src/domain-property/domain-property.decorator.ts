import {} from "reflect-metadata";
import {DomainValue} from "./domain-value";

export const DOMAIN_PROP_KEY = 'domain-values';

export function DomainProperty(type:{new(a:any): DomainValue<any>}):any{

  function createDescriptor(instance:DomainValue<any>):any{
    return {
        get: function() {
            return instance;
        },
        set: function(v: any) {
            instance.setValue(v);
        },
        enumerable: true,
        configurable: true
    };
  }

  return function(target:any, key:string):any{
    return {
        get: function():any {
            return null;
        },
        set: function(v: any) {
          let descriptor = createDescriptor(new type(v))
          Object.defineProperty(this, key, descriptor);
        },
        enumerable: true,
        configurable: true
    }
  }
}
