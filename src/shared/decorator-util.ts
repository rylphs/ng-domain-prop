// a utility function to generate instances of a class
function construct(fn:Function, constructor:Function, args:any) {
    var c: any = function() {
        fn.apply(this, args);
        return constructor.apply(this, args);
    }
    c.prototype = constructor.prototype;
    return new c();
}

export function createConstructor(baseConstructor:any, callback:any, copyMetadata: boolean = false) {
    var newConstructor: any = function(...args:any[]) {
        return construct(callback, baseConstructor, args);
    }
    newConstructor.prototype = baseConstructor.prototype; // copy prototype (fix intanceof)
    if (copyMetadata) {
        let metaData = Reflect.getMetadataKeys(baseConstructor);
        for (let i in metaData) {
            let key = metaData[i];
            let value = Reflect.getMetadata(key, baseConstructor)
            Reflect.defineMetadata(key, value, newConstructor);
        }
    }
    return newConstructor; // return new constructor (will override original)
}
