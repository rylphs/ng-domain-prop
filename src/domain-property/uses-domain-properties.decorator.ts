import {DomainValue} from "./domain-value";
import {} from "reflect-metadata";
import {DOMAIN_PROP_KEY} from './domain-property.decorator';
import {createConstructor} from '../shared/decorator-util';

export function UsesDomainProperties(targetConstructor: any) {
    var originalConstructor = targetConstructor;

    function setDomainValues(){
      let domainValues = Reflect.getMetadata(DOMAIN_PROP_KEY,
          originalConstructor.prototype);
      let target = this;

      for (let key in domainValues) {
        let type = domainValues[key];
        let instance:DomainValue<any> = new type(target[key]);
        Object.defineProperty(target, key, {
            get: function(){
              return instance;
            },
            set: function(v:any){
              instance.setValue(v);
            },
            enumerable: true,
            configurable: true
          });
      }
    }
    return createConstructor(originalConstructor, setDomainValues);
}
