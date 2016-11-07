export abstract class DomainValue<PRIMITIVE_TYPE>{
  protected value:PRIMITIVE_TYPE;

  constructor(value:PRIMITIVE_TYPE){
    this.setValue(value);
  }

  private getPrimitiveFrom(value:any):PRIMITIVE_TYPE {
    if(value instanceof DomainValue){
      return value.getValue();
    }
    else if(typeof value === 'string') {
      return this.primitiveToPrimitive(this.stringToPrimitive(value));
    }
    else {
      return this.primitiveToPrimitive(value);
    }
  }

  protected getInvalidValue(){
    return this.value;
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
    return this.value === this.getPrimitiveFrom(value);
  }

  public setValue(value:any){
    this.value = this.getPrimitiveFrom(value);
  }

  public getValue(){
    if(!this.isValid(this.value.toString())) return this.getInvalidValue();
    return this.value;
  }

  public valueOf():PRIMITIVE_TYPE {
    return this.value;
  }

  public isValid(value:string):boolean{
    return true;
  }

  public toString(){
    return this.primitiveToString(this.value);
  }
}
