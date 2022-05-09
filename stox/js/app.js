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
            class MiniDOM {
                /** window */
                w = window
                /** document */
                me = document
                /** document.createElement */
                ce = document.createElement
                /** document.head.appendChild */
                hd = {
                    me: document.head,
                    ap: document.head.appendChild,
                    ldscrpt: url => {
                        let sc = document.createElement("script")
                        sc.src = url
                        document.head.appendChild(sc)
                    },
                    ldcss: url => {
                        let cs = document.createElement("link")
                        cs.rel = "stylesheet"
                        cs.href = url
                        document.head.appendChild(cs)
                    },
                }
                bd = {
                    me: document.body,
                    /** document.body.appendChild */
                    ap: document.body.appendChild,
                    /** * document.createElement
                     * * add default class
                     * * document.body.appendChild
                     * @returns {HTMLElement}*/
                    ceap: (tag, initClass) => {
                        let ne = document.createElement(tag)
                        if (!!initClass && initClass != "") {
                            ne.classList.add(initClass.split(" "))
                        }
                        document.body.appendChild(ne)
                        console.log(ne)
                        return ne
                    },
                }
                /**
                 * @param {string} sel - Selector
                 * @param {HTMLElement} ele - Optional Element on which QuerySelector will run
                 * @returns {[HTMLElement]} */
                qAll = (sel, ele) => {
                    if (ele) {
                        if (ele.contentDocument) ele = ele.contentDocument
                        return [...ele.querySelectorAll(sel)]
                    }
                    return [...document.querySelectorAll(sel)]
                }
                /**
                 * @param {string} sel - Selector
                 * @param {HTMLElement} ele - Optional Element on which QuerySelector will run
                 * @returns {HTMLElement} */
                q = (sel, ele) => {
                    if (ele) {
                        if (ele.contentDocument) ele = ele.contentDocument
                        return ele.querySelector(sel)
                    }
                    return document.querySelector(sel)
                }
                /**
                 * @param {HTMLElement} ele     - Element in which the new created element will be appended
                 * @param {string} tag          - New Element's TAG Name
                 * @param {string} initClass    - Classes to be applied for the new Element
                 * @param {string} initValue    - Initial Value / Innet HTML of the Element
                 * @returns {HTMLElement|HTMLDivElement|HTMLInputElement|HTMLTableElement}
                 * * document.createElement
                 * * add default class
                 * * document.body.appendChild                  *
                 * */
                ceap = (ele, tag, initClass, initValue) => {
                    let ne = document.createElement("div")
                    if (initClass != "") ne.classList.add(initClass.split(" "))
                    if (initValue) {
                        if (tag == "div" || tag == "button") ne.innerHTML = initValue
                        else if (tag == "input") ne.value = initValue
                        // TO BE IMPLEMENTED for other TAGs
                    }
                    ele.appendChild(ne)
                    return ne
                }
                /**
                 * @param {HTMLElement} ele - ELement for which Attribute value will be modified
                 * @param {string} atr  - Attribute Name
                 * @param {string|number} val
                 * @returns {string|number}
                 * - Returns only if NO "val" is provided,
                 * - DELETES the Attribute if val="null"
                 */
                attr = (ele, atr, val) => {
                    if (val) ele.setAttribute(atr, val)
                    else if (val === null) ele.removeAttribute(atr)
                    else return ele.getAttribute(atr)
                }
                /**
                 * @param {HTMLElement} ele - ELement for which Attribute value will be modified
                 * @param {[{attr:string, val:string}]} atrvs  - Attribute Name, Value Pair
                 * @returns {[{attr:string, val:string}]}
                 * - Returns only if NO "val" is provided,
                 * - DELETES the Attribute if val="null"
                 */
                attrs = (ele, atrvs) =>
                    atrvs.map(atrv => {
                        let { a, v } = atrv
                        return { attr: a, val: this.attr(ele, a, v) }
                    })
                /**
                 * @param {HTMLElement} parent1
                 * @param {string} selector
                 * @param {HTMLElement} parent2 .
                 * * Cuts and Pastes a Element from within ONE Element to Another Element
                 */
                move = (parent1, selector, parent2) => {
                    let ele = this.q(selector, parent1)
                    if (ele) {
                        parent2.appendChild(ele)
                    }
                }
            }
            let dom = new MiniDOM()
            let ui = {}

            // mainDiv
            {
                ui.mainDiv = dom.bd.ceap("div")
                ui.mainDiv.innerHTML = "Stox App Started !"
                ui.mainDiv.id = "mainDiv"
                //ui.mainDiv.classList.add("")
            }
            // root
            {
                ui.root = dom.q("#root")
            }

            // open new nifty options window
            {
            }

            alert("JS loaded")
        },
    }

    stoxApp.loadCSS()
    stoxApp.draw()
} catch (er) {
    console.log(er)
}
