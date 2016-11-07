import {DomainValue} from "../domain-property/domain-value";
import { Directive} from '@angular/core';
import { NgControl, AbstractControl, FormControlDirective } from '@angular/forms';

@Directive({
    selector: '[validate-domain]',
})
export class ValidateDomainDirective{
  constructor(private ngControl:NgControl){
    console.log("setting formcontrol", ngControl);
    this.setValidator(<FormControlDirective> ngControl);
  }

  private setValidator(formControl:FormControlDirective){
    formControl.control.setValidators([
      function(fc:AbstractControl):{[key: string]: any}{
          let domainValue:DomainValue<any> = formControl.model;
          if(!domainValue.isValid(formControl.value)){
            return {invalidDomainValue :true};
          }
          return null;
        }
      ]);
  }
}
