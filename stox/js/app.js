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
    q2 = (sel, ele) => {
        if (ele) {
            if (ele.contentDocument) ele = ele.contentDocument
            return ele.querySelector(sel)
        }
        return document.querySelector(sel)
    }
    /**
     * @param {{tag:string, dataid:string, id:string, class:string, attr:string, val:string, xpath:string}} query
     * @returns {[HTMLElement]}
     */
    q = (query, parent) => {
        if (!parent) parent = document
        if (query.xpath) return [...parent.querySelectorAll(query)]
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
        //console.log("parent, query, selector", parent, query, selector)
        if (selector != "") return [...parent.querySelectorAll(selector)]
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
     * @param {string | Function} selector
     * @param {HTMLElement} parent2 .
     * * Cuts and Pastes a Element from within ONE Element to Another Element
     */
    move = (parent1, selector, parent2) => {
        let ele = (() => {
            if (selector instanceof Function) return selector()
            return this.q(selector, parent1)
        })()
        if (ele) {
            parent2.appendChild(ele)
        }
    }
    /**
     * @param {{tag:string, dataid:string, id:string, class:string, attr:string, val:string, xpath:string}} query - Selector
     * @param {HTMLElement} ele - Optional Element on which QuerySelector will run
     * @param {number} to - Timeout
     * @returns {Promise<[HTMLElement]>}
     * @description - Returns a Promise of an Array of HTMLElements until it is loaded,
     * */
    qAsync = (query, ele, to = 30000) =>
        new Promise(async (eFound, searchEnded) => {
            let me = this
            let eachWaitTime = 1000,
                chkCt = to / eachWaitTime

            let search = new Promise((found, notfound) =>
                window.setTimeout(() => {
                    let elef
                    elef = me.q(query, ele)
                    if (elef) found(elef)
                }, eachWaitTime)
            )

            while (chkCt-- >= 0) {
                let elefs = await search
                if (elefs) {
                    eFound(elefs)
                    break
                }
            }

            if (chkCt <= 0) searchEnded(undefined)
        })
    /**
     * @param {{tag:string, dataid:string, id:string, class:string, attr:string, val:string, xpath:string}} query - Selector
     * @param {HTMLElement} ele - Optional Element on which QuerySelector will run
     * @param {number} to - Timeout
     * @returns {Promise<HTMLElement>}
     * @description - Returns a Promise of a HTMLElement until it is loaded,
     * */
    qAsync0 = async (query, ele, to = 30000) => (await this.qAsync(query, ele, to))[0]
    /**
     *
     * @returns {Promise} ms
     */
    wait = (ms = 1000) =>
        new Promise(resolve => {
            window.setTimeout(() => {
                resolve()
            }, ms)
        })
    /**
     * @param {Function} condFunction - returns boolean
     */
    waitUntilTrue = condFunction =>
        new Promise((resolve, reject) => {
            let waitCt = 500,
                done = condFunction()
            while (!done && waitCt-- > 0) {
                this.wait(100)
                done = condFunction()
            }
            if (done) resolve()
            else reject()
        })
    /**
     * @param {HTMLElement} ele
     */
    mouseFocus = ele => {
        ele.dispatchEvent(new MouseEvent("focus"))
    }
    /**
     * @param {HTMLTableElement} htmlTable
     * @returns {[{}]} - JSON representation of HTML Table
     */
    getHTMLTableDataAsJSON = async htmlTable => {
        let od = [],
            cols = [],
            hdrs = [...htmlTable.rows[0].cells],
            rows = [...htmlTable.rows].filter((v, i) => i > 0)
        hdrs.forEach(cell => cols.push(cell.textContent))
        rows.forEach(row => {
            let cells = [...row.cells]
            let json = {}
            cells.forEach((cell, cellIdx) => {
                let prop = cols[cellIdx]
                let babies = cell.childNodes
                json[prop] = {}
                babies.forEach(async (baby, i) => {
                    let txt = baby.textContent
                    if (txt != "") {
                        let nm = txt.replaceAll(",", "").replaceAll("%", "")
                        if (isNaN(nm)) json[prop][i] = txt
                        else {
                            if (txt.includes("%")) json[prop][i] = nm / 100.0
                            //`0.${nm * 100}` * 1
                            else json[prop][i] = nm * 1
                        }
                    }
                })
            })
            od.push(json)
        })
        return od
    }
}

let dom = new MiniDOM()

var app_stox = {
    data: {
        nifty: {
            /** @type {[{strikePrice:number, ltp:number, priceChg:number, oi:number, oiChg:number, oiPrcnt:number, livedata : [{date_time:string, price:number, volume:number}] }]} */
            optionChain: [],
            /** @type {{livedata : [{date_time:string, pcr : number, puts : number, calls : number}]}} */
            puctCallRatio: { livedata: [] },
        },
        bankNifty: {
            /** @type {[{strikePrice:number, ltp:number, priceChg:number, oi:number, oiChg:number, oiPrcnt:number, livedata : [{date_time:string, price:number, volume:number}] }]} */
            optionChain: [],
            /** @type {{livedata : [{date_time:string, pcr : number, puts : number, calls : number}]}} */
            puctCallRatio: { livedata: [] },
        },
        optDataCols: {
            AskPriceAndQty: "Ask Price & Qty.",
            BidPriceAndQty: "Bid Price & Qty.",
            IV: "IV",
            LTPAndChange: "LTP & Change",
            OIAndChange: "OI & Change",
            OIPercent: "OI Percent",
            Volume: "Volume",
            StrikePrice: "Strike Price",
        },
    },
    ui: {
        selectors: {
            root: { id: "root" },
            optionChainOpeners: {
                nifty50: { dataid: "optionChain_NSE_INDEX|Nifty 50" },
                niftyBank: { dataid: "optionChain_NSE_INDEX|Nifty Bank" },
            },
            optionChainTables: {
                allTables: { tag: "table" },
                strikePriceList: { dataid: "strikePriceList" },
                loadMoreButtons: {
                    up: { dataid: "loadMoreUpButton" },
                    down: { dataid: "loadMoreDownButton" },
                },
            },
        },
        components: {
            /** @type {HTMLDivElement} */
            mainDiv: undefined,
            /** @type {HTMLDivElement} */
            root: undefined,
            /** @type {[HTMLTableElement]} */
            nifty50OptionChain: undefined,
        },
        actions: {
            addMainDiv: () => {
                let mainDiv = dom.bd.ceap("div")
                mainDiv.innerHTML = "Stox App Started !"
                mainDiv.id = "mainDiv"
                return mainDiv
            },
            /** @returns {Promise<[HTMLDivElement]>} */
            searchRoot: async () => await dom.qAsync(app_stox.ui.selectors.root), //dom.q("#root"),

            /** @returns {Promise} */
            getOptionChainsData: async () => {
                let stepsPerSymbol = {
                    /** @returns {Promise<HTMLElement>} */
                    openOptionChainTables: async symbol => {
                        let showOptionChainBtn = await dom.qAsync0(app_stox.ui.selectors.optionChainOpeners[symbol])
                        if (showOptionChainBtn) {
                            showOptionChainBtn.click()
                            return showOptionChainBtn
                        }
                    },
                    /** @returns {Promise<[callsHTable:HTMLTableElement, strikePricesHTable:HTMLTableElement, putsHTable:HTMLTableElement]>} */
                    getExtendedHTables: async () => {
                        /** @type {[HTMLTableElement, HTMLTableElement, HTMLTableElement]} */
                        let [callsHTable, strikePricesHTable, putsHTable] = await dom.qAsync(app_stox.ui.selectors.optionChainTables.allTables)
                        await dom.wait(1000)
                        putsHTable.parentElement.scrollBy(0, -300)
                        //console.log(putsHTable.parentElement)

                        let loadMoreUpBtn = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.up)
                        if (loadMoreUpBtn) {
                            let beforeRowCount = putsHTable.rows.length
                            loadMoreUpBtn.click()
                            while (putsHTable.rows.length <= beforeRowCount) await dom.wait(200)
                        }

                        putsHTable.parentElement.scrollBy(0, 1500)
                        let loadMoreDownBtn = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.down, undefined, 2000)
                        if (loadMoreDownBtn) {
                            let beforeRowCount = putsHTable.rows.length
                            loadMoreDownBtn.click()
                            while (putsHTable.rows.length <= beforeRowCount) await dom.wait(200)
                        }

                        return [callsHTable, strikePricesHTable, putsHTable]
                    },
                    /**
                     * @param {HTMLTableElement} strikePricesHTable
                     * @param {{calls : [], puts : []}} optRawData
                     * @returns {Promise<{calls : [], puts : [], symbPrice: number}>}
                     */
                    populateStrikePrices: async (strikePricesHTable, optRawData) => {
                        let rows = [...strikePricesHTable.rows]
                        rows.forEach((row, rowIdx) => {
                            if (rowIdx > 0) {
                                let rowIdx2 = rowIdx - 1
                                let cells = [...row.cells]
                                cells.forEach((cell, cellIdx) => {
                                    let stkprc = cell.textContent
                                    let stkprcn = cell.textContent.replace(",", "") * 1
                                    let stkfnl
                                    stkfnl = isNaN(stkprcn) ? (optRawData.symbPrice = `${stkprc.replace("Spot ", "").replace(",", "")}` * 1) : stkprcn
                                    optRawData.calls[rowIdx2]["Strike Price"] = stkfnl //cell.textContent.replace(",", "") * 1
                                    optRawData.puts[rowIdx2]["Strike Price"] = stkfnl //cell.textContent.replace(",", "") * 1
                                })
                            }
                        })
                        return optRawData
                    },
                    /**
                     * @param {{calls : [], puts : [], symbPrice: number, symbol:string}} optRawData
                     * @param {{low:number, high:number, distance:number}} criteria
                     */
                    populatePCR: async (optRawData, criteria = { distance: 15 }) => {
                        let noOfITM = 0,
                            noOfOTM = -1 // ITM = In the money, OTM = Over the money
                        let colNms = app_stox.data.optDataCols
                        for (; noOfITM < optRawData.calls.length; noOfITM++) if (optRawData.calls[noOfITM][colNms.StrikePrice] > optRawData.symbPrice) break
                        noOfITM--
                        noOfOTM = optRawData.calls.length - noOfITM - 1 // Symbol Price is a row

                        let totCallVol = 0,
                            totPutVol = 0,
                            callITMRange = {
                                low: noOfITM - criteria.distance < 0 ? 0 : noOfITM - criteria.distance,
                                high: noOfITM - 1,
                            },
                            callOTMRange = {
                                low: noOfITM + 1,
                                high: noOfOTM + criteria.distance > optRawData.calls.length ? optRawData.calls.length - 1 : noOfOTM + criteria.distance,
                            }

                        console.log(optRawData, noOfITM, noOfOTM, criteria, callITMRange, callOTMRange)

                        //lowArrIdx =
                        // optRawData.calls.forEach((call, callIdx)=> {
                        //     let v
                        //     if(criteria.distance)
                        //         if(criteria.distance <= callIdx)
                        //             v = call[colNms.Volume]
                        //     else v = call[colNms.Volume]
                        //     totCallVol = totCallVol + isNaN(v)? 0 : v
                        // })
                    },
                }
                /**
                 * @param {string} symbol
                 * @returns {{symbol: string, currentPrice:number,
                 *              optionsData : [{strikePrice : number,
                 *                              call : { oi:{value:number, change:number, percent:number}, volume:{value:number}, price:{value:number, change:number} },
                 *                              put : { oi:{value:number, change:number, percent:number}, volume:{value:number}, price:{value:number, change:number} }
                 *                            }]
                 *          }}
                 */
                let getIndexOptionsData = async symbol => {
                    if (await stepsPerSymbol.openOptionChainTables(symbol)) {
                        let [callsHTable, strikePricesHTable, putsHTable] = await stepsPerSymbol.getExtendedHTables()
                        let optRawData = {
                            calls: await dom.getHTMLTableDataAsJSON(callsHTable), // getHTMLTableDataAsJSON(callsHTable),
                            puts: await dom.getHTMLTableDataAsJSON(putsHTable), //getHTMLTableDataAsJSON(putsHTable),
                        }

                        let optDataWithStkPrc = await stepsPerSymbol.populateStrikePrices(strikePricesHTable, optRawData)
                        optDataWithStkPrc.symbol = symbol
                        let optDataWithPCR = await stepsPerSymbol.populatePCR(optDataWithStkPrc)
                        //console.log(optDataWithStkPrc)
                    }
                }

                let nifty50 = await getIndexOptionsData("nifty50")
                let niftyBank = await getIndexOptionsData("niftyBank")
            },
        },
    },
}

try {
    var stoxApp = {
        loadCSS: () => {
            let lnk = document.createElement("link")
            lnk.rel = "stylesheet"
            lnk.href = "https://dgaws-app01.github.io/stox/js/app.css"
            document.head.appendChild(lnk)
            //alert("CSS loaded")
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
        process: async () => {
            app_stox.ui.components.mainDiv = app_stox.ui.actions.addMainDiv()
            app_stox.ui.components.root = await app_stox.ui.actions.searchRoot()
            app_stox.ui.components.nifty50OptionChain = await app_stox.ui.actions.getOptionChainsData()

            //console.log(app_stox.ui.components.nifty50OptionChain)

            // open new nifty options window
            {
            }

            //alert("JS loaded")
        },
    }

    stoxApp.loadCSS()
    stoxApp.process()
} catch (er) {
    console.log(er)
}

console.clear()
