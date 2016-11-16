import {DomainValue} from "./domain-value";
import {} from "reflect-metadata";
import {DOMAIN_PROP_KEY} from './domain-property.decorator';
import {createConstructor} from '../shared/decorator-util';

export function UsesDomainProperties(targetConstructor: any) {
    var originalConstructor = targetConstructor;

    function setDomainValues(){
      console.warn("You don't need @UsesDomainProperties decorator anymore and its use has been deprecated!");
    }
    return createConstructor(originalConstructor, setDomainValues, true);
}
