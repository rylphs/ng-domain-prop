export abstract class DomainValue<PRIMITIVE_TYPE>{
  protected value:PRIMITIVE_TYPE = null;

  constructor(value:PRIMITIVE_TYPE){
    this.setValue(value);
  }

  private getPrimitiveFrom(value:any):any {
    if(value instanceof DomainValue){
      return value.getValue();
    }
    else if(typeof value === 'string') {
      if(!this.isValid(value)) return value;
      return this.primitiveToPrimitive(this.stringToPrimitive(value));
    }
    else {
      return this.primitiveToPrimitive(value);
    }
  }

  protected getInvalidValue():string{
    return this.value.toString();
  }

  protected getNullValue():string{
    return '';
  }

  protected primitiveToPrimitive(value:PRIMITIVE_TYPE):PRIMITIVE_TYPE{
    return value;
  }

  protected stringToPrimitive(value:string):PRIMITIVE_TYPE {
    return <any> value;
  }

  protected primitiveToString(value:PRIMITIVE_TYPE):string {
    return value.toString();
  }

  public equals(value:any):boolean{
    if(value === null || value === undefined) return this.value === value;
    return this.value === this.getPrimitiveFrom(value);
  }

  public setValue(value:any){
    this.value = value === null || value === undefined || value === ''?
      value : this.getPrimitiveFrom(value);
  }

  public getValue(){
    return this.value;
  }

  public valueOf():PRIMITIVE_TYPE {
    return this.value;
  }

  public isValid(value:string):boolean{
    return true;
  }

  public toString(){
    let value:any = this.value;
    if(value === undefined || value === null)
      return this.getNullValue();
    if(value === '') return this.isValid('') ? this.getNullValue() : this.getInvalidValue();

    value = this.primitiveToString(value);
    if(!this.isValid(value)) return this.getInvalidValue();
    return value;
  }
}
