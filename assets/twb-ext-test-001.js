var logx = (x) => {
    let logger = document.getElementById("logger")
    let tm_stmp = new Date( Date.now() + ( -1*(new Date().getTimezoneOffset())*60*1000) ).toISOString().split(".")[0].replace("T", " ▪ ")
    //let itxt = logger.innerText
    //itxt = `${logger.innerText}\n${Date.now()} ● ${x}`
    logger.innerText = `${logger.innerText}\n${tm_stmp} ● ${x}`
}

var logx_json = (x)=> {    
    logx(JSON.stringify(x))
  }

var logx_obj = (o)=> {
    let op = []
    Object.getOwnPropertyNames().forEach(p=> op.push(p))
    logx(op)
}

var logx_err = (m) => {
    logx(`-ERROR- ▪ ${m}`)
}

var obj_expand = (o, z, p0)=>{
    if(z==undefined)
        z = []
    for (let p in o){
        let v = o[p]
        let p1 = `${p0==undefined?"":p0+"."}${p}`
        zo = {}        
        zo[p1] = v
        z.push(zo)        
        if( ["String", "Number", "Date", "Boolean"].findIndex(t=> t==v?.constructor?.name) == -1 )
            obj_expand(v, z, p1)            
    }
    return z
}

var ext_init = () => {
    tableau.extensions.initializeAsync().then(function(){
        try{
            let dashboard = tableau.extensions.dashboardContent;
            logx("Initialized !")
            let dashboard2 = obj_expand(dashboard)            
            //logx_json(dashboard2)
            logx(dashboard2.length)
            
        }catch(ex1){
            logx_err(`Initialized but ... ${ex1}`)    
        }
    }, function(r){
        logx_err(r)
    })
}

document.onreadystatechange = (t, ev) => {
    if(document.readyState=="complete"){
        logx_json("Initializing Extension ...")
        ext_init()
    }    
}
