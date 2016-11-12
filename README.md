# ng-domain-prop
The ng-domain-prop, is an angular library that allows to work with domain specific types as inputs. It allows to work with the domain type much like they were javascript primitive types.

```javascript
	Class CommaNumber extends DomainValue<number>{
		//...Validation and conversion stuff
	}

	@UsesDomainValues
	Class MyDomainClass {
	@DomainProperty(CommaNumber) value:any = 5; //CommaNumber type behave much like a number although is really a CommaNumber object.

		addSomeValue(ammount:number){
			this.value = '3,6'; //set attribute from string;
			this.value += number;  //Its possible to do math with the property.
		}
	}

	@Component({
		template: `<input [(ngMpodel)]='value' />`
	})
	export class MyComponent{
		private value:CommaNumber; //input from user will be converted as defined in the domain type
	}
```

It also allows to configure angular forms to use form validation based on DomainTypes:

```javascript
	@Component({
		template: `<input validate-domain [(ngMpodel)]='value' />`
	})
	export class MyComponent{
		private value:MyDomainType; /*the input will be validated by the domain class.*/
	}
```

##Usage:

First, the domain specific type must extends the DomainValue class:
```javascript
	abstract class DomainValue<PRIMITIVE_TYPE>{
		protected value:PRIMITIVE_TYPE;
		constructor(value:PRIMITIVE_TYPE));
		public equals(value:any):boolean;
		public setValue(value:any);
		public getValue();
		public valueOf():PRIMITIVE_TYPE;
		public isValid(value:string):boolean;
		protected primitiveTomPrimitive(value:PRIMITIVE_TYPE):PRIMITIVE_TYPE;
		protected abstract stringToPrimitive(value:string):PRIMITIVE_TYPE;
		primitiveToString():string;
	}
```

All the methods have a default implementation and you can override the following methods:

```javascript
	/**
	* Gets the string value and convert to the apropriate primitive value. Implement in case some conversion is needed.
 	* @param {string} value - The string value to be converted.
 	*/
	protected stringToPrimitive(value:string):PRIMITIVE_TYPE;

	/**
        * Returns the apropriate string representation of the value. Ovewrite in case you the to convert the primitive value before is shown
	* @param {value::PRIMITIVE_TYPE} value - The primitive value to be converted.
        */
	primitiveToString(value::PRIMITIVE_TYPE):string;

	/**
        * Convert a primitive value before set the value. Implement in case you need to do some conversion on a primitive value.
        * @param {value::PRIMITIVE_TYPE} value - The primitive value to be converted.
        */
	primitiveToPrimitive(value:PRIMITIVE_TYPE):PRIMITIVE_TYPE //Gets the value from a primitive value, implement the method in case

	/**
        * Determine whether a value is valid or not. Implement if you want the use validation in angular forms
        * @param {value::string} value - The string value to be validated.
        */
	isValid(value:string):boolean;
```

Obs: The other methods are part of the public API or are used by the class itself, so I don't recommend overriding them.

####Example Implementation:

```javascript
import {DomainValue} from 'ng-domain-prop/ng-domain-prop';

export class CommaNumber extends DomainValue<number>{

  /*You can use primitiveToPrimitive to do some conversion. E.g: Decimal digit truncation*/
	primitiveToPrimitive(value:number)number {
		return Math.floor(value*100)/100;
	}

  /*Converts from '00,00' to a valid javascript number */
  protected stringToPrimitivevalue:string):number {
    return parseFloat(value.replace(/,/, '.'));
  }

  /*Converts from number in the format 00.00 to a string in the format '00,00'*/
  public primitiveToString(value:number):string {
     return ("" + value).replace(/\./, ',');
  }

  /*Valid for inputs in the format '00,00'*/
  public isValid(value:string):boolean{
    return /^[0-9]+(,[0-9]+)?$/.test(value);
  }
}
```


Second, the class containing the domaintype should be correctelly decorated:

```javascript
	import {UsesDomainProperties, DomainProperty} from 'ng-domain-prop/ng-domain-prop';

	@UsesDomainValues //Tells the lib to configure domain type attributes
	Class MyDomainClass {
		/*Defines that the attribute should be treated as a domain type*/
		@DomainProperty(CommaNumber) value:number = 5;
	}
```
`@UsesDomainValues` works setting attributes decorated with `@DomainProperty` as a property accessor that returns a `DomainValue` object (`CommaNumber` in this case) and that accept setting its value from its primitive type, string or event from another `DomainValue` (`CommaNumber`) object.
Notice that although `value` is a `CommaNumber` object I used the `number` type for it. I did it to trick typescript so I can do some math on it. E.g:

```javascript
this.value += 7;
```
This is possible because `CommaNumber` extends the `DomainValue` class that implements `valueOf()` method, wich returns its primitive value (in this case is a `number`). The downside is that if you want to use some `CommaNumber` method in you class typescript will complain. You could also define `value` with the `any` type so you can both use it in primitive operation and use any method, but in this case you'd loose type checking. There is an open issue on typescript github to allow wrapped values to work as primitives ([Issue 2631](https://github.com/Microsoft/TypeScript/issues/2361)), but until now (version 2.0.9) the issue is not implemented yet.

Finnaly, if you want to use validation the input to be validated must have the 'validate-domain' directive:

```javascript
	import { ValidateDomainDirective } from 'ng-domain-prop/ng-domain-prop';

	@Component({
		template: `<input validate-domain validate-domain [(ngMpodel)]='myClass.value' />`
	})
	export class MyComponent{
		private myClass:MyDomainClass; //the input will be validated by the domain class.
	}
```

The `validate-domain` directive works by setting a custom validator on the input `NgControl` that calls the `isValid()` method on the model attribute (`ngModel`). So it also requires that you import the angular2 forms module in the module you want to use it:

```javascript
import { FormsModule } from '@angular/forms';
...
@NgModule({
	imports: [
    BrowserModule,
  ...
```
