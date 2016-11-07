import {DomainValue} from "../domain-property/domain-value";
import {createConstructor} from '../shared/decorator-util';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgControl, AbstractControl, FormControlDirective  } from '@angular/forms';

const FORM_PROP_NAME = '__ngFormQueryList__';

function createValidator(validator:DomainValue<any>){
  return function(fc:AbstractControl):{[key: string]: any}{
        // if(!validator.isValid(fc.)){
        //   return {invalidDomainValue :true};
        // }
        return null;
  };
}

export function ValidateDomainValues(target:any){
  ViewChildren(NgControl)(target.prototype, FORM_PROP_NAME);

  return createConstructor(target, function(){
    let viewInit = this.ngAfterViewInit;
    this.ngAfterViewInit = function(){
      let ngControlList = this[FORM_PROP_NAME].toArray();
      for(let i in ngControlList){
        let formControl:FormControlDirective  = ngControlList[i];
        let domainConcept:DomainValue<any> = formControl.model;
        formControl.control.setValidators([createValidator(domainConcept)]);
      }
      viewInit.apply(this, arguments);
    }
  }, true)
}
