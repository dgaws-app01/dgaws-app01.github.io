//var s = document.createElement('script'); s.src = 'https://dgaws-app01.github.io/stox/js/app.js'; document.head.appendChild(s);

alert(`${document.body.children.length} no of elements !`)
document.body.innerHTML = ""

var stoxApp = {
    loadCSS: () => {
        let css = `@import url("https://fonts.googleapis.com/css2?family=Oxygen:wght@300&family=Titillium+Web:ital,wght@0,200;0,600;0,700;0,900;1,200;1,600;1,700&display=swap");

        * {
            font-family: "Titillium Web", sans-serif;
        }`
        let lnk = document.createElement("link")
        lnk.rel = "stylesheet"
        lnk.href = URL.createObjectURL(new Blob([css]))
        document.head.appendChild(lnk)
    },
    draw: () => {
        let d = document
        let b = d.body
        let mainDiv = d.createElement("div")
        mainDiv.innerHTML = "Stox App Started !"
        b.appendChild(mainDiv)
    },
}

stoxApp.loadCSS()
stoxApp.draw()

