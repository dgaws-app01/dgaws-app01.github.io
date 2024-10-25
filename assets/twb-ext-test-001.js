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

document.onreadystatechange = (t, ev) => {
    logx_json(document.readyState)
}
