var logx = (x) => {
    let logger = document.getElementById("logger")
    logger.innerText = x
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
    logx_json(ev)
}
alert("2024-10-25 17:10")
