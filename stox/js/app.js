//var s = document.createElement('script'); s.src = 'https://dgaws-app01.github.io/stox/js/app.js'; document.head.appendChild(s);

// code goes here ...
var d = document
var b = d.body
/** @param {{tag:string, dataid:string, id:string, class:string, attr:string, val:string, xpath:string}} query
 * @returns {[HTMLElement]}
 */
var q = query => {
    if (query.xpath) return document.querySelectorAll(query)
    let attrs = [
        { name: "data-id", value: query.dataid },
        { name: "id", value: query.id },
        { name: "class", value: query.class },
        { name: query.attr, value: query.val },
    ]
    let selector = ""
    selector = `${query.tag || ""}`
    attrs.forEach(qry => {
        if (qry.value) {
            let { op, vl } = (() => {
                let op = qry.value.substr(0, 2)
                let vlu = qry.value.substr(2, 200)
                if (op.includes("$") || op.includes("^") || op.includes("*")) return { op, vl: vlu }
                return { op: "=", vl: qry.value }
            })()
            selector = `${selector}[${qry.name}${op}"${vl}"]`
        }
    })
    if (selector != "") return document.querySelectorAll(selector)
}

var data = {
    nifty: {
        /** @type {[{strikePrice:number, ltp:number, priceChg:number, oi:number, oiChg:number, oiPrcnt:number, livedata : [{date_time:string, price:number, volume:number}] }]} */
        optionChain: [],
    },
    bankNifty: {
        /** @type {[{strikePrice:number, ltp:number, priceChg:number, oi:number, oiChg:number, oiPrcnt:number, livedata : [{date_time:string, price:number, volume:number}] }]} */
        optionChain: [],
    },
}

try {
    var stoxApp = {
        loadCSS: () => {
            let lnk = document.createElement("link")
            lnk.rel = "stylesheet"
            lnk.href = "https://dgaws-app01.github.io/stox/js/app.css"
            document.head.appendChild(lnk)
            alert("CSS loaded")
        },
        oldDrawFetch: () => {
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
        retrieveData: () => {
            let ele0 = selector => q({ dataid: selector })[0]

            let buttons = {
                selectNiftyOptionChain: ele0("optionChain_NSE_INDEX|Nifty 50"),
                selectBankNiftyOptionChain: ele0("optionChain_NSE_INDEX|Nifty Bank"),
                loadMoreLowerStrikes: ele0("loadMoreUpButton"),
            }

            /** @param {HTMLTableElement} htmlTable */
            let retrieveDataFromHTMLTable = htmlTable => {
                let rows = [...htmlTable.rows]
                let hdrs = [...rows[0].cells]
                let cols = hdrs.map(hdr => hdr.textContent)

                let data = rows
                    .map((row, rowI) => {
                        if (rowI > 0) {
                            let cells = [...row.cells]
                            let cellsData = {}
                            cells.forEach((cell, cellI) => {
                                let babies = [...cell.children]
                                cellsData[cols[cellI]] = babies.map(baby => baby.textContent).filter(baby => baby != "")
                            })
                            return { ...cellsData, "Strike Price": row.dataset.id.split("OCRow")[1] }
                        }
                    })
                    .filter(row => row != undefined)
                return data
            }
            /** @param {HTMLElement} optChainBtn
             *  @returns {callData : [], putData : []}
             */
            let getData = optChainBtn => {
                optChainBtn.click()
                for (var i = 0; i < 1000000; i++) {}
                buttons.loadMoreLowerStrikes.click()
                for (var i = 0; i < 1000000; i++) {}

                let ocTables = q({ tag: "table" })
                let callHTMLTable = ocTables[0]
                let putHTMLTable = ocTables[2]

                let callData = retrieveDataFromHTMLTable(callHTMLTable)
                let putData = retrieveDataFromHTMLTable(putHTMLTable)
                return { callData, putData }
            }

            let data = {
                nifty: getData(buttons.selectNiftyOptionChain),
                bankNifty: getData(buttons.selectBankNiftyOptionChain),
            }

            return data

            // Bank Nifty Current Data
        },
        draw: () => {
            let ui = {}

            // mainDiv
            {
                ui.mainDiv = d.createElement("div")
                ui.mainDiv.innerHTML = "Stox App Started !"
                ui.mainDiv.id = "mainDiv"
                //ui.mainDiv.classList.add("")
                b.appendChild(mainDiv)
            }
            // root
            {
                ui.root = document.querySelector("#root")
            }

            // open new nifty options window
            {
                var w = window.open("https://pro.upstox.com/option-chain/NSE_INDEX/Nifty%20Bank", "ww1", "status=1,toolbar=1,menubar=1")
            }

            alert("JS loaded")
        },
    }

    stoxApp.loadCSS()
    stoxApp.draw()
} catch (er) {
    console.log(er)
}
