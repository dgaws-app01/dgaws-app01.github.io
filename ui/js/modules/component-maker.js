let version = "1.0.20230527"

class ComponentConfiguration {
    /** @type{} */
    #propMap = new Map()
}
class ComponentDataHandler {
    #data
    #props = new Map()

    constructor() {

    }

    set data(v){
        
    }
}
class ComponentUIHandler {
    #shadowRoot
    #me

}

export class ComponentMaker {
    static get version() { return version }
    static make() {
        // 
    }
}