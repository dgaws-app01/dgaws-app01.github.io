var logx = (x) => {
    let logger = document.getElementById("logger")
    logger.innerText = x
}

var log_test_as_json = (x)=> {    
    logx(JSON.stringify(x))
  }

var log_test_obj = (o)=> {
    let op = []
    Object.getOwnPropertyNames().forEach(p=> op.push(p))
    logx(op)
}

document.onreadystatechange(rev=> {
    logx(rev)
})

alert("2024-10-25 17:07")
