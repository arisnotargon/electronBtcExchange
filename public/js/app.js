//定义ui比价容器
checkLsit = {};

//定义后台比价容器
logDataCheckObj = {};

//交易对-交易所映射
symbolMap = {
    'ethbtc': {
        'huobi': 'ethbtc',
        'bian': 'ETHBTC',
        'okex': 'eth_btc',
        'cex': 'eth_btc'
    },
    'eosbtc': {
        'huobi': 'eosbtc',
        'bian': 'EOSBTC',
        'okex': 'eos_btc',
        'cex': 'eos_btc'
    },
    'iotbtc': {
        'bian': 'IOTABTC',
        'okex': 'iota_btc'
    },
    'ioteos': {},
    'eoseth': {
        'bian': 'EOSETH',
        'huobi': 'eoseth',
        'okex': 'eos_eth',
        'cex': 'eos_eth'
    },
    'bchbtc': {
        'huobi': 'bchbtc',
        'bian': 'BCCBTC',
        'okex': 'bcc_btc'
    },
    'bcheth': {
        'bian': 'BCCETH'
    }
};

//交易所和请求url的映射
exchangeUrlMap = {
    'bian': 'https://api.binance.com/api/v1/depth?limit=5&symbol=',
    'huobi': 'https://api.huobi.pro/market/depth?type=step1&symbol=',
    'okex': 'https://www.okex.com/api/v1/depth.do?symbol=',
    'cex': 'http://api.cex.com/api/v1/depth.do?symbol=',
};

function bianAjax() {
    /**
     币安api:content-type:application/json,不用转json
     */
    if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].bian !== 'undefined') {
        $.get('https://api.binance.com/api/v1/depth?symbol=' + symbolMap[symbol.val()].bian + '&limit=5', function (data) {
            let tempList = {
                'name': '币安'
            };
            $('#bian tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
            $('#bian tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
            for (let i = 0; i < 5; i++) {
                $('#bian tr:nth-child(' + (i + 4) + ')').html('<td>' + data.bids[i][0] + '</td><td>' +
                    data.bids[i][1] + '</td><td>' + data.asks[i][0] + '</td><td>' + data.asks[i][1] + '</td>');

                //
                if (typeof tempList.minSell === 'undefined' && data.asks[i][1] >= depthThreshold) {
                    tempList.minSell = data.asks[i][0];
                }
                if (typeof tempList.maxBuy === 'undefined' && data.bids[i][i] >= depthThreshold) {
                    tempList.maxBuy = data.bids[i][0];
                }
            }
            checkLsit.bian = tempList;
            checkPrice();
            bianAjax();
        })
    }
}

function huobiAjax() {
    /**
     火币api的返回格式:text,要转json

     */
    if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].huobi !== 'undefined') {
        $.get('https://api.huobi.pro/market/depth?symbol=' + symbolMap[symbol.val()].huobi + '&type=step1', function (data) {
            data = JSON.parse(data);
            if (typeof data.tick !== 'undefined') {
                $('#huobi tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
                $('#huobi tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
                let tempList = {
                    'name': '火币'
                };
                for (var i = 0; i < 5; i++) {
                    $('#huobi tr:nth-child(' + (i + 4) + ')').html('<td>' + data.tick.bids[i][0] + '</td><td>' + data.tick.bids[i][1] + '</td><td>' + data.tick.asks[i][0] + '</td><td>' + data.tick.asks[i][1] + '</td>');
                    if (typeof tempList.minSell === 'undefined' && data.tick.asks[i][1] >= depthThreshold) {
                        tempList.minSell = data.tick.asks[i][0];
                    }
                    if (typeof tempList.maxBuy === 'undefined' && data.tick.bids[i][1] >= depthThreshold) {
                        tempList.maxBuy = data.tick.bids[i][0];
                    }
                }
                checkLsit.huobi = tempList;
                checkPrice();
            }
            huobiAjax();
        });
    }
}

function okexAjax() {
    /**
     *okex的返回结构:contentType:text/html,需要转json
     *{
   *  asks:{
   *    [价格,深度]   卖家要价从高到低,要从最后一个开始取
   *  },
   *  bids:{
   *    [价格,深度]   买加出价从高到低,从第一个开始取
   *  }
   *}
     */
    if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].okex !== 'undefined') {
        $.get('https://www.okex.com/api/v1/depth.do?symbol=' + symbolMap[symbol.val()].okex, function (data) {
            data = JSON.parse(data);
            if (typeof data.asks !== 'undefined') {
                let tempList = {
                    'name': 'OKEX'
                };
                $('#okex tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
                $('#okex tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
                for (var i = 0; i < 5; i++) {
                    $('#okex tr:nth-child(' + (i + 4) + ')').html('<td>' + data.bids[i][0] + '</td><td>' + data.bids[i][1] + '</td><td>' + data.asks[data.asks.length - i - 1][0] + '</td><td>' + data.asks[data.asks.length - i - 1][1] + '</td>');
                    if (typeof tempList.minSell === 'undefined' && data.asks[data.asks.length - i - 1][1] >= depthThreshold) {
                        tempList.minSell = data.asks[data.asks.length - i - 1][0];
                    }
                    if (typeof tempList.maxBuy === 'undefined' && data.bids[i][1] >= depthThreshold) {
                        tempList.maxBuy = data.bids[i][0];
                    }
                }
                checkLsit.okex = tempList;
                checkPrice();
            }
            okexAjax();
        });
    }
}

function cexAjax() {
    /**
     * cex返回值类型text/html,需要转json
     *{
     *  asks:"[]",//卖价从低到高顺序取
     *  bids:"[]"//买价从高到低顺序取
     * }
     * asks,bids都是字符串,要转成数组用
     */
    if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].cex !== 'undefined') {
        $.get('http://api.cex.com/api/v1/depth.do?symbol=' + symbolMap[symbol.val()].cex, function (data) {
            data = JSON.parse(data);
            let asksArr = [];
            let bidsArr = [];
            if (typeof data.asks !== 'undefined') {
                asksArr = eval('[' + data.asks + ']');
                bidsArr = eval('[' + data.bids + ']');
                let tempList = {
                    'name': 'CEX'
                };
                $('#cex tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
                $('#cex tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
                for (let i = 0; i < 5; i++) {
                    $('#cex tr:nth-child(' + (i + 4) + ')').html('<td>' + bidsArr[i][0] + '</td><td>' + bidsArr[i][1] + '</td><td>' + asksArr[i][0] + '</td><td>' + asksArr[i][1] + '</td>');
                    if (typeof tempList.minSell === 'undefined' && asksArr[i][1] >= depthThreshold) {
                        tempList.minSell = asksArr[i][0];
                    }
                    if (typeof tempList.maxBuy === 'undefined' && bidsArr[i][1] >= depthThreshold) {
                        tempList.maxBuy = bidsArr[i][0];
                    }
                }
                checkLsit.cex = tempList;
                checkPrice();
            }
            cexAjax();
        });
    }
}

//比价函数
function checkPrice() {
    //有两个以上对象时就比较价格
    alertString = '';
    if (Object.getOwnPropertyNames(checkLsit).length > 1) {
        $.each(checkLsit, function (key, val) {
            let tempOutKey = key;
            let tempOutVal = val;
            $.each(checkLsit, function (inKey, inVal) {
                if (inKey !== tempOutKey) {
                    if (
                        typeof tempOutVal.maxBuy !== 'undefined'
                        && typeof inVal.minSell !== 'undefined'
                        && ((tempOutVal.maxBuy - inVal.minSell) >= priceThreshold * inVal.minSell)
                    ) {
                        alertString += '<p><span style="background-color: deeppink;color: #93FF93">' + inVal.name
                            + '出售价</span>对<span style="background-color: mistyrose;color: navy">' + tempOutVal.name + '购买价</span></p>'
                    }
                    if (
                        typeof inVal.maxBuy !== 'undefined'
                        && typeof tempOutVal.minSell !== 'undefined'
                        && ((inVal.maxBuy - tempOutVal.minSell) >= priceThreshold * tempOutVal.minSell)
                    ) {
                        alertString += '<p><span style="background-color: deeppink;color: #93FF93">' + tempOutVal.name
                            + '出售价</span>对<span style="background-color: mistyrose;color: navy">' + inVal.name + '购买价</span></p>'
                    }
                }
            })
        })
    }
    $('#alert-content').html(alertString);
}

/**
 * 异步递归获取数据对象
 * 定时器操作,每秒比价一次,达到价差阈值请求入库
 * symbolKey是交易对名常量,symbol是交易对请求参数,这里没用到
 */
function priceLog() {
    $.each(symbolMap, function (symbolKey, exchangeSymbol) {
        $.each(exchangeSymbol, function (exchange, symbol) {
            switch (exchange) {
                case 'huobi':
                    huobiLogDataBuilder(symbolKey);
                    break;
                case 'bian':
                    bianLogDataBuilder(symbolKey);
                    break;
                case 'cex':
                    cexLogDataBuilder(symbolKey);
                    break;
                case 'okex':
                    okexLogDataBuilder(symbolKey);
                    break;
            }
        });
    });
    setInterval(function () {
        $.each(logDataCheckObj, function (symbol, info) {
            $.each(info, function (outExchange, outPrice) {
                $.each(info, function (innerExchange, innerPrice) {
                    if (
                        outExchange !== innerExchange
                        && typeof outPrice.buyPrice !== 'undefined'
                        && typeof innerPrice.sellPrice !== 'undefined'
                        && (outPrice.buyPrice - innerPrice.sellPrice)/innerPrice.sellPrice >= 0.01
                    ) {
                        //post请求记录接口

                    }
                })
            });

        })
    }, 1000);
}

/**
 输入交易所和币种返回请求url
 */
function getExchangeQueryUrl(exchange, symbol) {
    let reUrl = null;
    if (typeof symbolMap[symbol] !== 'undefined' && typeof symbolMap[symbol][exchange] !== 'undefined' && typeof exchangeUrlMap[exchange] !== 'undefined') {
        reUrl = exchangeUrlMap[exchange] + symbolMap[symbol][exchange];
    }

    return reUrl;
}

function bianLogDataBuilder(symbol) {
    let url = getExchangeQueryUrl('bian', symbol);
    $.get(url, function (data) {
        if (typeof data.bids !== 'undefined') {
            if (typeof logDataCheckObj[symbol] === 'undefined') {
                logDataCheckObj[symbol] = {};
            }
            logDataCheckObj[symbol].bian = {
                'buyPrice': data.bids[0][0],
                'buyDepth': data.bids[0][1],
                'sellPrice': data.asks[0][0],
                'sellDepth': data.asks[0][1],
                'time': (new Date()).toLocaleTimeString()
            }
        }
        bianLogDataBuilder(symbol);
    });
}

function huobiLogDataBuilder(symbol) {
    let url = getExchangeQueryUrl('huobi', symbol);
    $.get(url, function (data) {
        data = JSON.parse(data);
        if (typeof data.tick !== 'undefined') {
            if (typeof logDataCheckObj[symbol] === 'undefined') {
                logDataCheckObj[symbol] = {};
            }
            logDataCheckObj[symbol].huobi = {
                'buyPrice': data.tick.bids[0][0],
                'buyDepth': data.tick.bids[0][1],
                'sellPrice': data.tick.asks[0][0],
                'sellDepth': data.tick.asks[0][1],
                'time': (new Date()).toLocaleTimeString()
            };
        }
        huobiLogDataBuilder(symbol);
    });
}

function cexLogDataBuilder(symbol) {
    let url = getExchangeQueryUrl('cex', symbol);
    $.get(url, function (data) {
        data = JSON.parse(data);
        if (typeof data.bids !== 'undefined') {
            if (typeof logDataCheckObj[symbol] === 'undefined') {
                logDataCheckObj[symbol] = {};
            }
            let asksArr = eval('[' + data.asks + ']');
            let bidsArr = eval('[' + data.bids + ']');
            logDataCheckObj[symbol].cex = {
                'buyPrice': bidsArr[0][0],
                'buyDepth': bidsArr[0][1],
                'sellPrice': asksArr[0][0],
                'sellDepth': asksArr[0][1],
                'time': (new Date()).toLocaleTimeString()
            };
        }
        cexLogDataBuilder(symbol);
    });
}

function okexLogDataBuilder(symbol) {
    let url = getExchangeQueryUrl('okex', symbol);
    $.get(url, function (data) {
        data = JSON.parse(data);
        if (typeof data.asks !== 'undefined') {
            if (typeof logDataCheckObj[symbol] === 'undefined') {
                logDataCheckObj[symbol] = {};
            }
            logDataCheckObj[symbol].okex = {
                'buyPrice': data.bids[0][0],
                'buyDepth': data.bids[0][1],
                'sellPrice': data.asks[data.asks.length - 1][0],
                'sellDepth': data.asks[data.asks.length - 1][1],
                'time': (new Date()).toLocaleTimeString()
            };
        }
        okexLogDataBuilder(symbol)
    });
}