//var s = document.createElement('script'); s.src = 'https://dgaws-app01.github.io/stox/js/app.js'; document.head.appendChild(s);

// code goes here ...
var d = document
var b = d.body

b.innerHTML = ""

try {
    var stoxApp = {
        loadCSS: () => {
            let css = `@import url("https://fonts.googleapis.com/css2?family=Oxygen:wght@300&family=Titillium+Web:ital,wght@0,200;0,600;0,700;0,900;1,200;1,600;1,700&display=swap");

            * {
                font-family: "Titillium Web", sans-serif;
            }`
            let lnk = document.createElement("link")
            lnk.rel = "stylesheet"
            lnk.href = "https://dgaws-app01.github.io/stox/js/app.css" //URL.createObjectURL(new Blob([css]))
            document.head.appendChild(lnk)
        },
        draw: () => {
            let mainDiv = d.createElement("div")
            mainDiv.innerHTML = "Stox App Started !"
            b.appendChild(mainDiv)
            var f = fetch("https://www.indiainfoline.com/api/cmotapi.php?url=equity/market.svc/Sensex-Nifty-Ticker?responseType=json", {
                headers: {
                    accept: "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    pragma: "no-cache",
                    "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                },
                referrer: "https://www.indiainfoline.com/",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: null,
                method: "GET",
                mode: "cors",
                credentials: "include",
            })
            f.then(d =>
                d.json().then(j => {
                    b.innerText = JSON.stringify(j)
                })
            )
        },
    }

    stoxApp.loadCSS()
    stoxApp.draw()
} catch (er) {
    console.log(er)
}
