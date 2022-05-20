//var s = document.createElement('script'); s.src = 'https://dgaws-app01.github.io/stox/js/app2.js'; document.head.appendChild(s);

// Code Goes Here ...
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
     * @param {{tag:string, dataid:string, datarole:string, dataname:string, id:string, class:string, attr:string, val:string, xpath:string}} query
     * @returns {[HTMLElement]}
     */
    q = (query, parent) => {
        if (!parent) parent = document
        if (query.xpath) return [...parent.querySelectorAll(query.xpath)]
        let attrs = [
            { name: "data-id", value: query.dataid },
            { name: "data-role", value: query.datarole },
            { name: "data-name", value: query.dataname },
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
        let ne = document.createElement(tag)
        if (initClass != undefined && initClass != "") ne.classList.add(initClass.split(" "))
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
     * @param {{tag:string, dataid:string, datarole:string, dataname:string,  id:string, class:string, attr:string, val:string, xpath:string}} query - Selector
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
     * @param {{tag:string, dataid:string, datarole:string, dataname:string, id:string, class:string, attr:string, val:string, xpath:string}} query - Selector
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

class OptionDataClass {
    /**
     * @param {{date_time:{numeric : number, text: string}, symbol: string, spotPrice:number, otmDistance : number,
     *                      strikePriceRanges : {itm : {call : {low:number, high:number}, put: {low:number, high:number} },
     *                                          otm : {call : {low:number, high:number}, put: {low:number, high:number} },
     *                                          pcr : {low : number, spot : number,  high : number} } ,
     *                      pcr : { volumeRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
     *                              oiRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
     *                              volumeRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
     *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
     *                                     overall : { call : number, put:number, percentage: {call : number, put:number} } },
     *                              oiRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
     *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
     *                                     overall : { call : number, put:number, percentage: {call : number, put:number}} }},
     *                      chains : {calls : [], puts : []}}} d
     */
    constructor(d) {
        /** @type {{numeric : number, text: string}} */
        this.date_time = d.date_time
        /** @type {string} */
        this.symbol = d.symbol
        /** @type {number} */
        this.spotPrice = d.spotPrice
        /** @type {number} */
        this.otmDistance = d.otmDistance
        /** @type {{itm : {call : {low:number, high:number}, put: {low:number, high:number} },
         *                                          otm : {call : {low:number, high:number}, put: {low:number, high:number} },
         *                                          pcr : {low : number, spot : number,  high : number}}} */
        this.strikePriceRanges = d.strikePriceRanges
        /** @type {{ volumeRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
         *                              oiRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
         *                              volumeRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
         *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
         *                                     overall : { call : number, put:number, percentage: {call : number, put:number} } },
         *                              oiRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
         *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
         *                                     overall : { call : number, put:number, percentage: {call : number, put:number}} }}} */
        this.pcr = d.pcr
        /** @type {{calls : [{"Ask Price & Qty" : [], "Bid Price & Qty" : [], "IV" : [], "LTP & Change": [], "OI & Change" : [], "OI Percent": [], "Strike Price" : number, "Volume" : []}],
         *           puts : [{"Ask Price & Qty" : [], "Bid Price & Qty" : [], "IV" : [], "LTP & Change": [], "OI & Change" : [], "OI Percent": [], "Strike Price" : number, "Volume" : []}]}} */
        this.chains = d.chains
    }
}

var app_stox = {
    data: {
        /** @type {[OptionDataClass]]} */
        nifty50: [],
        /** @type {[OptionDataClass]} */
        niftyBank: [],
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
                chartOpenerButton: { dataid: "^=scripChart_" },
                chartIframe: { tag: "iframe" },
                iframes: {
                    allIframesInsideMainDiv: { xpath: `#mainDiv > iframe` },
                    layoutTop: { class: "*=layout__area--top" },
                    layoutLeft: { class: `layout__area--left` },
                    minutesButton: { xpath: `[class*="apply-common-tooltip"][data-role="button"]` },
                    dropDownMenuInner: { xpath: `[data-name="menu-inner"]` },
                    minute_3_dataMenu: { xpath: `[data-value="3"]` },
                },
            },
            symbols: {
                nifty50: "nifty50",
                niftyBank: "niftyBank",
            },
            nseCharts: {
                nifty50: { id: "NSE_INDEX-Nifty 50" },
                niftyBank: { id: "NSE_INDEX-Nifty Bank" },
            },
        },
        components: {
            /** @type {HTMLDivElement} */
            mainDiv: undefined,
            /** @type {HTMLDivElement} */
            nseChartsDiv: undefined,
            /** @type {HTMLDivElement} */
            optChartsDivMenu: undefined,
            /** @type {HTMLDivElement} */
            optChartsDiv: undefined,
            /** @type {HTMLDivElement} */
            optChartsCallsDiv: undefined,
            /** @type {HTMLDivElement} */
            optChartsPutsDiv: undefined,
            /** @type {HTMLDivElement} */
            root: undefined,
            /** @type {Promise<[HTMLTableElement,HTMLTableElement,HTMLTableElement]>} */
            nifty50OptionChainTables: () => dom.qAsync(app_stox.ui.selectors.optionChainTables.allTables),
            /** @type {[{windowName:string, window:Window}]} */
            windows: [{ windowName: "chartWindow" }],
            buttons: {
                nifty50: {
                    showOptionChainBtn: () => dom.qAsync0(app_stox.ui.selectors.optionChainOpeners.nifty50),
                },
                niftyBank: {
                    showOptionChainBtn: () => dom.qAsync0(app_stox.ui.selectors.optionChainOpeners.niftyBank),
                },
                loadMoreButtons: {
                    up: () => dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.up),
                    down: () => dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.down, undefined, 2000),
                },
                /** @param {HTMLTableRowElement} optionHTable */
                chartOpenerButton: optionHTableRow => dom.qAsync0(app_stox.ui.selectors.optionChainTables.chartOpenerButton, optionHTableRow),
            },
            appMenus: {
                /** @type {HTMLButtonElement} */
                reload: undefined,
                /** @type {HTMLButtonElement} */
                selectNifty50Charts: undefined,
                /** @type {HTMLButtonElement} */
                selectNiftyBankCharts: undefined,
                /** @type {HTMLButtonElement} */
                loadOptionCharts: undefined,
            },
            iframes: {
                /** @returns {Promise<HTMLIFrameElement>} */
                chart: async () => {
                    /** @type {HTMLIFrameElement} */
                    let ifrm = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.chartIframe)
                    if (ifrm.name.includes("tradingview")) {
                        return ifrm
                    }
                },
                /** @returns {Promise<[HTMLIFrameElement]>} */
                allIframesInsideMainDiv: async () => await dom.qAsync(app_stox.ui.selectors.optionChainTables.iframes.allIframesInsideMainDiv),
                /**
                 * @param {HTMLIFrameElement} ifrm
                 * @returns {Promise<HTMLElement>} */
                minutesDropdown_Option_3_Minute: async ifrm => {
                    let ddc = ifrm.contentDocument
                    let wtct = 30
                    let ltop = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.layoutTop, ddc)
                    let mBut = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.minutesButton, ltop)
                    await dom.wait(500)
                    mBut.click()
                    await dom.wait(50)
                    let ddim = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.dropDownMenuInner, ddc)
                    await dom.wait(50)
                    let min3opt = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.minute_3_dataMenu, ddim)
                    return min3opt
                },
                /**
                 * @param {HTMLIFrameElement} ifrm
                 * @returns {Promise<HTMLElement>} */
                layoutAreaTop: async ifrm => {
                    let ddc = ifrm.contentDocument
                    //let wtct = 30
                    let ly = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.layoutTop, ddc)
                },
                /**
                 * @param {HTMLIFrameElement} ifrm
                 * @returns {Promise<HTMLElement>} */
                layoutAreaLeft: async ifrm => {
                    let ddc = ifrm.contentDocument
                    //let wtct = 30
                    let ly = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.layoutLeft, ddc)
                    return ly
                },
            },
        },
        actions: {
            _001_initialization: {
                addMainDiv: async () => {
                    let cmps = app_stox.ui.components

                    let defineStructure = await (async () => {
                        cmps.mainDiv = dom.bd.ceap("div")
                        cmps.nseChartsDiv = dom.ceap(cmps.mainDiv, "div")
                        cmps.optChartsDivMenu = dom.ceap(cmps.mainDiv, "div")
                        cmps.optChartsDiv = dom.ceap(cmps.mainDiv, "div")
                        cmps.optChartsCallsDiv = dom.ceap(cmps.optChartsDiv, "div")
                        cmps.optChartsPutsDiv = dom.ceap(cmps.optChartsDiv, "div")

                        cmps.mainDiv.id = "mainDiv"
                        cmps.nseChartsDiv.id = "nseChartsDiv"
                        cmps.optChartsDivMenu.id = "optionChartMenuDiv"
                        cmps.optChartsDiv.id = "optionChartDiv"
                        cmps.optChartsCallsDiv.id = "optionChartCallsDiv"
                        cmps.optChartsPutsDiv.id = "optionChartPutsDiv"
                    })()

                    let format = await (async () => {
                        let formatChartsDivMenu = await (async ele => {})(cmps.optChartsDivMenu)

                        let formatChartCallsAndPutsDiv = await (async divs => {
                            for (const div of divs) {
                                div.classList.add("optChartHolder")
                            }
                        })([cmps.optChartsCallsDiv, cmps.optChartsPutsDiv])
                    })()

                    //return mainDiv
                },
                /** @returns {Promise<[HTMLDivElement]>} */
                getRoot: async () => await dom.qAsync(app_stox.ui.selectors.root), //dom.q("#root"),
            },
            _002_optionsDataGathering: {
                /** @returns {Promise} */
                getOptionChainsData: async () => {
                    let stepsPerSymbol = {
                        /** @returns {Promise<HTMLElement>} */
                        openOptionChainTables: async symbol => {
                            let showOptionChainBtn = await app_stox.ui.components.buttons[symbol].showOptionChainBtn()
                            if (showOptionChainBtn) showOptionChainBtn.click()
                            return showOptionChainBtn
                        },
                        /** @returns {Promise<[callsHTable:HTMLTableElement, strikePricesHTable:HTMLTableElement, putsHTable:HTMLTableElement]>} */
                        getExtendedHTables: async () => {
                            /** @type {[HTMLTableElement, HTMLTableElement, HTMLTableElement]} */
                            let [callsHTable, strikePricesHTable, putsHTable] = await app_stox.ui.components.nifty50OptionChainTables() //await dom.qAsync(app_stox.ui.selectors.optionChainTables.allTables)
                            await dom.wait(1000)

                            putsHTable.parentElement.scrollBy(0, -300)
                            let loadMoreUpBtn = await app_stox.ui.components.buttons.loadMoreButtons.up() //await dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.up)
                            let beforeRowCount = putsHTable.rows.length
                            if (loadMoreUpBtn) loadMoreUpBtn.click()
                            while (putsHTable.rows.length <= beforeRowCount) await dom.wait(200)

                            putsHTable.parentElement.scrollBy(0, 1500)
                            let loadMoreDownBtn = await app_stox.ui.components.buttons.loadMoreButtons.down() // await dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.down, undefined, 2000)
                            if (loadMoreDownBtn) {
                                let beforeRowCountDwn = putsHTable.rows.length
                                loadMoreDownBtn.click()
                                while (putsHTable.rows.length <= beforeRowCountDwn) await dom.wait(200)
                            }

                            return [callsHTable, strikePricesHTable, putsHTable]
                        },
                        /**
                         * @param {HTMLTableElement} strikePricesHTable
                         * @param {{calls : [], puts : []}} optRawData
                         * @returns {Promise<{calls : [], puts : [], symbPrice: number, symbol : string}>}
                         */
                        getStrikePrices: async (strikePricesHTable, optRawData, symbol) => {
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
                            optRawData.symbol = symbol
                            return optRawData
                        },
                        /**
                         * @param {{calls : [], puts : [], symbPrice: number, symbol:string}} optRawData
                         * @param {{strikePrice : {low:number, high:number}, distance:number}} criteria
                         * @returns {Promise<{calls : [], puts : [], spotPrice: number, symbol:string,
                         *              otmDistance : number,
                         *              pcr : {strikePriceRange : {low : number, spot : number,  high : number},
                         *                      callITMRange : {low : number, high : number},
                         *                      callOTMRange : {low : number, high : number},
                         *                      volumeRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
                         *                      oiRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
                         *                      volumeRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     overall : { call : number, put:number, percentage: {call : number, put:number} } },
                         *                      oiRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     overall : { call : number, put:number, percentage: {call : number, put:number}} }}}>}
                         *
                         */
                        getPCR: async (optRawData, criteria = { distance: 4 }) => {
                            let noOfITM = 0,
                                noOfOTM = -1 // ITM = In the money, OTM = Over the money
                            let colNms = app_stox.data.optDataCols
                            for (; noOfITM < optRawData.calls.length; noOfITM++) if (optRawData.calls[noOfITM][colNms.StrikePrice] > optRawData.symbPrice) break
                            noOfITM--
                            noOfOTM = optRawData.calls.length - noOfITM - 1 // Symbol Price is a row

                            if (criteria.distance > optRawData.calls.length - (noOfITM + 1)) criteria.distance = optRawData.calls.length - (noOfITM + 1)

                            let values = {
                                volume: {
                                    overall: { call: 0, put: 0, percentage: { call: 0, put: 0 } },
                                    callITM: { call: 0, put: 0, percentage: { call: 0, put: 0 } },
                                    callOTM: { call: 0, put: 0, percentage: { call: 0, put: 0 } },
                                    strikePriceWise: [{ strikePrice: 0, call: 0, put: 0, percentage: { call: 0, put: 0 } }],
                                },
                                oi: {
                                    overall: { call: 0, put: 0, percentage: { call: 0, put: 0 } },
                                    callITM: { call: 0, put: 0, percentage: { call: 0, put: 0 } },
                                    callOTM: { call: 0, put: 0, percentage: { call: 0, put: 0 } },
                                    strikePriceWise: [{ strikePrice: 0, call: 0, put: 0, percentage: { call: 0, put: 0 } }],
                                },
                            }

                            let totCallVol = 0,
                                totPutVol = 0,
                                pcrRange = {
                                    callITMRange: {
                                        low: noOfITM - criteria.distance < 0 ? 0 : noOfITM - criteria.distance,
                                        high: noOfITM - 1,
                                    },
                                    callOTMRange: {
                                        low: noOfITM + 1,
                                        high: noOfITM + criteria.distance > optRawData.calls.length ? optRawData.calls.length - 1 : noOfITM + criteria.distance,
                                    },
                                }
                            pcrStrikePriceRange = {
                                low: optRawData.calls[pcrRange.callITMRange.low][colNms.StrikePrice],
                                spot: optRawData.symbPrice,
                                high: optRawData.calls[pcrRange.callOTMRange.high][colNms.StrikePrice],
                            }

                            let toNum = v => (isNaN(v * 1) ? 0 : v * 1)

                            Object.keys(pcrRange).forEach(key => {
                                let rng = pcrRange[key]
                                for (let i = rng.low; i <= rng.high; i++) {
                                    let cvv = toNum(optRawData.calls[i][colNms.Volume][0]),
                                        pvv = toNum(optRawData.puts[i][colNms.Volume][0]),
                                        coiv = toNum(optRawData.calls[i][colNms.OIAndChange][0]),
                                        poiv = toNum(optRawData.puts[i][colNms.OIAndChange][0]),
                                        totv = cvv + pvv,
                                        totoi = coiv + poiv,
                                        itmotmarr = ["callITM", "callOTM"]

                                    values.volume.overall.call += cvv
                                    values.volume.overall.put += pvv
                                    values.oi.overall.call += coiv
                                    values.oi.overall.put += poiv

                                    itmotmarr.forEach(itmotm => {
                                        if (key.includes(itmotm)) {
                                            values.volume[itmotm].call += cvv
                                            values.volume[itmotm].put += pvv
                                            values.oi[itmotm].call += coiv
                                            values.oi[itmotm].put += poiv
                                        }
                                    })

                                    values.volume.strikePriceWise.push({
                                        strikePrice: optRawData.calls[i][colNms.StrikePrice],
                                        call: cvv,
                                        put: pvv,
                                        percentage: {
                                            call: (cvv / totv) * 10000 * 0.0001,
                                            put: (pvv / totv) * 10000 * 0.0001,
                                        },
                                    })

                                    values.oi.strikePriceWise.push({
                                        strikePrice: optRawData.calls[i][colNms.StrikePrice],
                                        call: coiv,
                                        put: poiv,
                                        percentage: {
                                            call: (coiv / totoi) * 10000 * 0.0001,
                                            put: (poiv / totoi) * 10000 * 0.0001,
                                        },
                                    })
                                }
                            })

                            let volois = ["volume", "oi"],
                                itmotms = ["callITM", "callOTM", "overall"]

                            volois.forEach(voloi => {
                                itmotms.forEach(itmotm => {
                                    values[voloi][itmotm].percentage.call = (values[voloi][itmotm].call / (values[voloi][itmotm].call + values[voloi][itmotm].put)) * 10000 * 0.0001
                                    values[voloi][itmotm].percentage.put = 1 - values[voloi][itmotm].percentage.call
                                })
                            })

                            return {
                                symbol: optRawData.symbol,
                                spotPrice: optRawData.symbPrice,
                                otmDistance: criteria.distance,
                                calls: optRawData.calls,
                                puts: optRawData.puts,
                                pcr: {
                                    strikePriceRange: pcrStrikePriceRange,
                                    callITMRange: pcrRange.callITMRange,
                                    callOTMRange: pcrRange.callOTMRange,

                                    totalVolume: {
                                        calls: totCallVol,
                                        puts: totPutVol,
                                    },
                                    volumeRatioList: values.volume.strikePriceWise,
                                    oiRatioList: values.oi.strikePriceWise,
                                    volumeRatio: {
                                        callITM: values.volume.callITM,
                                        callOTM: values.volume.callOTM,
                                        overall: values.volume.overall,
                                    },
                                    oiRatio: {
                                        callITM: values.oi.callITM,
                                        callOTM: values.oi.callOTM,
                                        overall: values.oi.overall,
                                    },
                                    //value: totPutVol / totCallVol, // * 10000 * 0.0001,
                                },
                            }
                            //console.log({ optRawData, noOfITM, noOfOTM, criteria, pcrRange, pcrStrikePriceRange, totPutVol, totCallVol, pcr: Math.round((totPutVol / totCallVol) * 10000) * 0.01 })
                        },
                        /**
                         * @param {{calls : [], puts : [], spotPrice: number, symbol:string,
                         *              otmDistance : number,
                         *              pcr : {strikePriceRange : {low : number, spot : number,  high : number},
                         *                      callITMRange : {low : number, high : number},
                         *                      callOTMRange : {low : number, high : number},
                         *                      volumeRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
                         *                      oiRatioList : [{strikePrice : number, call : number, put:number, percentage: {call : number, put:number}}],
                         *                      volumeRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     overall : { call : number, put:number, percentage: {call : number, put:number} } },
                         *                      oiRatio : {callITM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     callOTM : { call : number, put:number, percentage: {call : number, put:number} },
                         *                                     overall : { call : number, put:number, percentage: {call : number, put:number}} }}}} getPCROutput
                         * @returns {Promise<OptionDataClass>}>}
                         */
                        finalize: async getPCROutput => {
                            let rtv = {
                                symbol: getPCROutput.symbol,
                                spotPrice: getPCROutput.spotPrice,
                                date_time: {
                                    numeric: Date.now(),
                                    text: new Date().toISOString(),
                                },
                                otmDistance: getPCROutput.otmDistance,
                                strikePriceRanges: {
                                    itm: {
                                        call: {
                                            low: getPCROutput.calls[getPCROutput.pcr.callITMRange.high][app_stox.data.optDataCols.StrikePrice],
                                            high: getPCROutput.calls[getPCROutput.pcr.callITMRange.low][app_stox.data.optDataCols.StrikePrice],
                                        },
                                        put: {
                                            low: getPCROutput.calls[getPCROutput.pcr.callOTMRange.low][app_stox.data.optDataCols.StrikePrice],
                                            high: getPCROutput.calls[getPCROutput.pcr.callOTMRange.high][app_stox.data.optDataCols.StrikePrice],
                                        },
                                    },
                                    otm: {
                                        call: {
                                            low: getPCROutput.calls[getPCROutput.pcr.callOTMRange.high][app_stox.data.optDataCols.StrikePrice],
                                            high: getPCROutput.calls[getPCROutput.pcr.callOTMRange.low][app_stox.data.optDataCols.StrikePrice],
                                        },
                                        put: {
                                            low: getPCROutput.calls[getPCROutput.pcr.callITMRange.low][app_stox.data.optDataCols.StrikePrice],
                                            high: getPCROutput.calls[getPCROutput.pcr.callITMRange.high][app_stox.data.optDataCols.StrikePrice],
                                        },
                                    },
                                    pcr: {
                                        low: getPCROutput.pcr.strikePriceRange.low,
                                        spot: getPCROutput.pcr.strikePriceRange.spot,
                                        high: getPCROutput.pcr.strikePriceRange.high,
                                    },
                                },
                                pcr: {
                                    oiRatioList: getPCROutput.pcr.oiRatioList,
                                    oiRatio: getPCROutput.pcr.oiRatio,
                                    volumeRatioList: getPCROutput.pcr.volumeRatioList,
                                    volumeRatio: getPCROutput.pcr.volumeRatio,
                                },
                                chains: {
                                    calls: getPCROutput.calls.filter(
                                        (c, i) => (i <= getPCROutput.pcr.callITMRange.high ? getPCROutput.pcr.callITMRange.high - i : i - (getPCROutput.pcr.callITMRange.high + 2)) < 11
                                    ),
                                    puts: getPCROutput.puts.filter(
                                        (c, i) => (i <= getPCROutput.pcr.callITMRange.high ? getPCROutput.pcr.callITMRange.high - i : i - (getPCROutput.pcr.callITMRange.high + 2)) < 11
                                    ),
                                },
                            }

                            return new OptionDataClass(rtv)
                        },
                        /**
                         * @param {OptionDataClass} finalizeOutput
                         */
                        populateAppData: async finalizeOutput => {
                            app_stox.data[finalizeOutput.symbol].push(finalizeOutput)
                        },
                    }
                    /**
                     * @param {string} symbol
                     * @returns {OptionDataClass}
                     */
                    let getIndexOptionsData = async symbol => {
                        if (await stepsPerSymbol.openOptionChainTables(symbol)) {
                            let [callsHTable, strikePricesHTable, putsHTable] = await stepsPerSymbol.getExtendedHTables()
                            let optRawData = {
                                calls: await dom.getHTMLTableDataAsJSON(callsHTable), // getHTMLTableDataAsJSON(callsHTable),
                                puts: await dom.getHTMLTableDataAsJSON(putsHTable), //getHTMLTableDataAsJSON(putsHTable),
                            }

                            let optDataWithStkPrc = await stepsPerSymbol.getStrikePrices(strikePricesHTable, optRawData, symbol)
                            let getPCRoutput = await stepsPerSymbol.getPCR(optDataWithStkPrc)

                            let finalizedParsedData = await stepsPerSymbol.finalize(getPCRoutput)
                            await stepsPerSymbol.populateAppData(finalizedParsedData)

                            return finalizedParsedData
                        }
                    }

                    let nifty50 = await getIndexOptionsData(app_stox.ui.selectors.symbols.nifty50)
                    let niftyBank = await getIndexOptionsData(app_stox.ui.selectors.symbols.niftyBank)
                    console.log("Option Chain data retrieved ", app_stox.data)
                    //app_stox.ui.components.mainDiv.textContent = `%-ge = ${nifty50.pcr.oiRatio.callOTM.percentage.call}`

                    //await stepsPerSymbol.populateAppData([nifty50, niftyBank])
                },
            },
            _old_003_chartBuildUp: {
                _01_createNewWindows: async () => {
                    app_stox.ui.components.windows.forEach(w => {
                        //w.window = window.open("pro.upstox.com", w.windowName)
                    })
                },
                /**
                 * @param {string} symbol
                 * @param {number} distanceFromSpot
                 * @param {{low : number, high : number}} priceRange
                 * @returns {Promise<[{strikePrice: number, optionType:string}]>}
                 */
                _02_01_generateStrikePriceList: async (symbol, distanceFromSpot, priceRange) => {
                    let lst = []
                    let d = app_stox.data[symbol][app_stox.data[symbol].length - 1], // app_stox.data.nifty50[app_stox.data.nifty50.length - 1], //
                        sp = d.spotPrice,
                        cc = d.chains.calls,
                        ditm = 0,
                        dotm = 0
                    if (distanceFromSpot) {
                        let spidx = cc.map((c, i) => {
                            if (!c.Volume[0]) return { index: i }
                        })[0].index
                        cc.forEach((c, i) => {
                            if (spidx - i < distanceFromSpot) lst.push(c["Strike Price"])
                            else if (i - spidx < distanceFromSpot) lst.push(c["Strike Price"])
                        })
                    } else if (priceRange) {
                        Object.keys(d.chains)
                            .reverse()
                            .forEach(cc => {
                                d.chains[cc].forEach(c => {
                                    if (c["LTP & Change"][0] >= priceRange.low && c["LTP & Change"][0] <= priceRange.high) lst.push({ strikePrice: c["Strike Price"], optionType: cc })
                                })
                            })
                    }
                    return lst
                },
                /**
                 *  @param {string} symbol
                 *  @param {{strikePrice: number, optionType:string}} strikePrice
                 */
                _02_02_01_getChartForAStrikePrice: async (symbol, strikePrice, optionName) => {
                    //if (app_stox.ui.components.buttons[symbol].showOptionChainBtn) app_stox.ui.components.buttons[symbol].showOptionChainBtn.click()
                    let btn = await app_stox.ui.components.buttons.nifty50.showOptionChainBtn()
                    if (btn) btn.click()

                    /** @type {[HTMLTableElement, HTMLTableElement, HTMLTableElement]} */
                    let [callsHTable, strikePricesHTable, putsHTable] = await app_stox.ui.components.nifty50OptionChainTables() //await dom.qAsync(app_stox.ui.selectors.optionChainTables.allTables)
                    await dom.wait(1000)
                    let optTbls = {
                        calls: callsHTable,
                        puts: putsHTable,
                    }

                    putsHTable.parentElement.scrollBy(0, -300)
                    let loadMoreUpBtn = await app_stox.ui.components.buttons.loadMoreButtons.up() //await dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.up)
                    if (loadMoreUpBtn) loadMoreUpBtn.click()
                    let beforeRowCount = putsHTable.rows.length
                    while (putsHTable.rows.length <= beforeRowCount) await dom.wait(200)

                    // if (loadMoreUpBtn) {
                    //     let beforeRowCount = putsHTable.rows.length
                    //     loadMoreUpBtn.click()
                    //     while (putsHTable.rows.length <= beforeRowCount) await dom.wait(200)
                    // }

                    putsHTable.parentElement.scrollBy(0, 1500)
                    let loadMoreDownBtn = await app_stox.ui.components.buttons.loadMoreButtons.down() //await dom.qAsync0(app_stox.ui.selectors.optionChainTables.loadMoreButtons.down, undefined, 2000)
                    if (loadMoreDownBtn) {
                        let beforeRowCount = putsHTable.rows.length
                        loadMoreDownBtn.click()
                        while (putsHTable.rows.length <= beforeRowCount) await dom.wait(200)
                    }

                    /** @type {{index : number, price : number, btn: HTMLElement}} */
                    let openerButton = { index: -1, price: -1, btn: undefined }
                    let rows = [...strikePricesHTable.rows]

                    rows.forEach((row, rowI) => {
                        if (row.cells.length) {
                            if ((row.cells[0].textContent + "").replaceAll(",", "") * 1 == strikePrice.strikePrice) {
                                //strikeIndexList.push({ index: rowI, price })
                                openerButton = {
                                    index: rowI,
                                    price: strikePrice.strikePrice,
                                }
                            }
                        }
                    })
                    openerButton.btn = await app_stox.ui.components.buttons.chartOpenerButton(optTbls[strikePrice.optionType].rows[openerButton.index])
                    if (openerButton.btn) openerButton.btn.click()

                    await dom.wait(1000)
                    let ifrm = await app_stox.ui.components.iframes.chart()
                    console.log(ifrm)
                    return ifrm
                },
                /**
                 * @param {HTMLIFrameElement} ifrm
                 */
                _02_02_02_moveChart: async ifrm => {
                    app_stox.ui.components.mainDiv.appendChild(ifrm)
                    // let min3but = await app_stox.ui.components.iframes.minutesDropdown_Option_3_Minute(ifrm2)
                    // min3but.click()
                    //await dom.wait(1500)
                },
                _02_02_03_formatAllIframes: async () => {
                    let ifrms = await app_stox.ui.components.iframes.allIframesInsideMainDiv()
                    ifrms.forEach(async ifrm => {
                        let min3Opt = await app_stox.ui.components.iframes.minutesDropdown_Option_3_Minute(ifrm)
                        min3Opt.click()
                        let lyt = await app_stox.ui.components.iframes.layoutAreaTop(ifrm)
                        let lyl = await app_stox.ui.components.iframes.layoutAreaLeft(ifrm)
                        lyt.remove()
                        lyl.remove()
                    })
                },
                _02_loadChartsToChartWindow: async () => {
                    let cbu = app_stox.ui.actions._003_chartBuildUp
                    await cbu._01_createNewWindows()

                    let i = 0
                    let symbols = Object.keys(app_stox.ui.selectors.symbols)
                    while (i < symbols.length) {
                        let symbol = symbols[i] //app_stox.ui.selectors.symbols.nifty50
                        let strkPrcLst = await cbu._02_01_generateStrikePriceList(symbol, undefined, { low: 20, high: 50 })
                        let j = 0
                        while (j < strkPrcLst.length) {
                            let chart = await cbu._02_02_01_getChartForAStrikePrice(symbol, strkPrcLst[j])
                            await cbu._02_02_02_moveChart(chart)
                            j++
                        }

                        i++
                    }
                    await cbu._02_02_03_formatAllIframes()
                    //app_stox.ui.components.windows[0].window.document.body.appendChild(app_stox.ui.components.mainDiv)

                    console.log(strkPrcLst)
                },
            },
            _003_chartBuildUp: {
                /**
                 * @param {{low : number, high:number}} priceRange
                 */
                _03_buildChart: async priceRange => {
                    let sels = app_stox.ui.selectors
                    let menus = app_stox.ui.components.appMenus
                    let cmpnts = app_stox.ui.components

                    let nses = ["nifty50", "niftyBank"]
                    let nseChartDiv = app_stox.ui.components.nseChartsDiv
                    let appMenuDiv = app_stox.ui.components.optChartsDivMenu

                    // Show NSE Index Charts
                    {
                        for (const nse of nses) {
                            {
                                //let nse = "nifty50"
                                // Drawing NSE Charts
                                {
                                    // Click on Option CHain Button to enable new chart functionality from UpStox
                                    let nseOptOpnr = await dom.qAsync0(sels.optionChainOpeners[nse])
                                    nseOptOpnr.click()
                                    await dom.wait(1000)
                                    // Find NSE Chart's button
                                    let nsebtn = await dom.qAsync0(sels.nseCharts[nse]) //await app_stox.ui.components.buttons.nifty50.showOptionChainBtn()
                                    nsebtn.click()
                                    await dom.wait(1000)
                                }
                                {
                                    // Get NSE chart | Append it to mainDiv
                                    /** @type {HTMLIFrameElement} */
                                    let nseifrm = await dom.qAsync0({ tag: "iframe" })
                                    nseChartDiv.appendChild(nseifrm)
                                    await dom.wait(3000)
                                    let nseDoc = nseifrm.contentDocument

                                    // Format NSE Chart
                                    {
                                        let removeNSEHeader = await (async () => {
                                            nseifrm.classList.add("nseChartFormat")
                                            let noWrapper = await dom.qAsync0({ class: "^=noWrapWrapper-" }, nseDoc)
                                            noWrapper.remove()
                                        })()

                                        let selectDateRangeTo1Day = await (async () => {
                                            let dtRngBtn = (await dom.qAsync0({ class: "^=dateRangeWrapper" }, nseDoc)).children[0].children[0]
                                            dtRngBtn.click()
                                            await dom.wait(500)
                                            let mnu = await dom.qAsync0({ dataname: "menu-inner" }, nseDoc)
                                            let mnu1dy = mnu.children[mnu.children.length - 1]
                                            mnu1dy.click()
                                        })()
                                    }

                                    // let lytop = await dom.qAsync0(app_stox.ui.selectors.optionChainTables.iframes.layoutTop, nseifrm.contentDocument)
                                    // let btnMinPrnt = (await dom.qAsync({ class: "^=group-" }, lytop))[1]
                                    // let btnmin = await dom.qAsync0({ datarole: "button" }, btnMinPrnt)
                                    // btnmin.click()
                                }
                            }
                        }
                    }

                    // Define App Menu
                    {
                        let addMenu = async caption => {
                            let itm = dom.ceap(appMenuDiv, "button", "appMenuItem", caption)
                            return itm
                        }
                        menus.reload = await addMenu("Reload")
                        menus.selectNifty50Charts = await addMenu("Open Nifty-50 Options")
                        menus.selectNiftyBankCharts = await addMenu("Open Bank Nifty Options")
                        menus.loadOptionCharts = await addMenu("Load Option Charts ...")

                        // Define Menu Handlers
                        {
                            // Reload Menu
                            {
                                menus.reload.onclick = () => {}
                            }

                            // Nifty 50 Charts Menu
                            {
                                menus.selectNifty50Charts.onclick = async () => {
                                    let openOptionTable = await (async () => {
                                        let nseOptOpnr = await dom.qAsync0(sels.optionChainOpeners.nifty50)
                                        nseOptOpnr.click()
                                        await dom.wait(2000)
                                    })()
                                    let addExtractCheckBoxesToStrikePrice = await (async () => {
                                        let tbls = await dom.qAsync({ tag: "table" })
                                        let extendTable = await (async () => {
                                            let pushTable = tbls[2]
                                            pushTable.parentElement.scrollBy(0, -300)
                                            let ldMrUpBtn = await cmpnts.buttons.loadMoreButtons.up()
                                            ldMrUpBtn.click()
                                            await dom.wait(3000)
                                        })()

                                        /** @type {HTMLTableElement} */
                                        let tbl = tbls[1]
                                        /** @type {[HTMLTableRowElement]} */
                                        let rows = [...tbl.rows]
                                        for (const row of rows) {
                                            if (row.rowIndex > 0) {
                                                let inp = document.createElement("input")
                                                inp.type = "checkbox"
                                                row.childNodes[0].childNodes[0].appendChild(inp)
                                                inp.style.margin = "3px"
                                                inp.style.padding = "3px"
                                                row.childNodes[0].childNodes[0].style.display = "inline-flex"
                                            }
                                        }
                                    })()
                                }
                            }

                            // Bank Nifty Charts Menu
                            {
                            }

                            // Load Option Charts Menu
                            {
                                menus.loadOptionCharts.onclick = async () => {
                                    let strikes = []
                                    strikes = await (async () => {
                                        let tbls = await dom.qAsync({ tag: "table" })
                                        /** @type {HTMLTableElement} */
                                        let strikeTbl = tbls[1]
                                        /** @type {[HTMLTableRowElement]} */
                                        let rows = [...strikeTbl.rows]
                                        console.log(strikeTbl, rows)
                                        for (const row in rows) {
                                            if (row.rowIndex > 0) {
                                                /** @type {HTMLInputElement} */
                                                let inp = row.childNodes[0]?.childNodes[0]?.childNodes[1]
                                                console.log(inp.checked)
                                            }
                                        }
                                    })()
                                }
                            }
                        }
                    }

                    // Copy Other Charts
                    {
                        // Open Call & Put Option Chain Table
                        {
                            // let openOptionTable = await (async () => {
                            //     //let nseOptOpnr = await dom.qAsync0(sels.optionChainOpeners[nse])
                            //     //nseOptOpnr.click()
                            //     //await dom.wait(2000)
                            // })()
                            // let addExtractCheckBoxesToStrikePrice = await (async () => {
                            //     let tbls = await dom.qAsync({ tag: "table" })
                            //     /** @type {HTMLTableElement} */
                            //     let tbl = tbls[1]
                            //     /** @type {[HTMLTableRowElement]} */
                            //     let rows = [...tbl.rows]
                            //     for (const row of rows) {
                            //         if (row.rowIndex > 0) {
                            //             let inp = document.createElement("input")
                            //             inp.type = "checkbox"
                            //             row.childNodes[0].childNodes[0].appendChild(inp)
                            //             row.childNodes[0].childNodes[0].style.display = "inline-flex"
                            //         }
                            //     }
                            // })()
                        }
                    }
                },
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
            await app_stox.ui.actions._001_initialization.addMainDiv()
            app_stox.ui.components.root = await app_stox.ui.actions._001_initialization.getRoot()
            //await app_stox.ui.actions._002_optionsDataGathering.getOptionChainsData()

            //await app_stox.ui.actions._003_chartBuildUp._02_loadChartsToChartWindow()

            await app_stox.ui.actions._003_chartBuildUp._03_buildChart({ low: 15, high: 40 })

            // open new nifty options window
            {
            }

            //alert("JS loaded")
        },
    } //

    stoxApp.loadCSS()
    stoxApp.process()
} catch (er) {
    alert(er)
    //console.log(er)
}

console.clear()
//window.setTimeout(()=>{console.clear()}, 5000)
