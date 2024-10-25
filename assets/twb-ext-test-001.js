var logx = (x) => {
    let logger = document.getElementById("logger")
    //let itxt = logger.innerText
    //itxt = `${logger.innerText}\n${Date.now()} ● ${x}`
    logger.innerText = `${logger.innerText}\n${Date.now()} ● ${x}`
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
