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

var ext_init = () => {
    tableau.extensions.initializeAsync().then(t=> {
        var dashboard = tableau.extensions.dashboardContent;
        logx_json(dashboard)
        logx("Initialized !")
    }).catch(c => 
        logx_err(c)
    )
}

document.onreadystatechange = (t, ev) => {
    if(document.readyState=="complete"){
        logx_json("Initializing Extension ...")
        ext_init()
    }    
}
