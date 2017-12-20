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