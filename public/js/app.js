function bianAjax() {
  /**
  币安api:content-type:application/json,不用转json
  */
  if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].bian !== 'undefined') {
    $.get('https://api.binance.com/api/v1/depth?symbol=' + symbolMap[symbol.val()].bian + '&limit=5', function(data) {
      //                console.log(data);
      //                console.log($('#bian tr:nth-child(2)')).html();
      $('#bian tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
      $('#bian tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
      for (let i = 0; i < 5; i++) {
        $('#bian tr:nth-child(' + (i + 4) + ')').html('<td>' + data.bids[i][0] + '</td><td>' +
          data.bids[i][1] +
          '</td><td>' + data.asks[i][0] +
          '</td><td>' + data.asks[i][1] + '</td>');
      }
      bianAjax();
    })
  }
}

function huobiAjax() {
  /**
  火币api的返回格式:text,要转json

  */
  if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].huobi !== 'undefined') {
    $.get('https://api.huobi.pro/market/depth?symbol=' + symbolMap[symbol.val()].huobi + '&type=step1', function(data) {
      data = JSON.parse(data);
      if (typeof data.tick !== 'undefined') {
        $('#huobi tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
        $('#huobi tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
        for (var i = 0; i < 5; i++) {
          $('#huobi tr:nth-child(' + (i + 4) + ')').html('<td>' + data.tick.bids[i][0] + '</td><td>' + data.tick.bids[i][1] + '</td><td>' + data.tick.asks[i][0] + '</td><td>' + data.tick.asks[i][1] + '</td>');
        }
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
    $.get('https://www.okex.com/api/v1/depth.do?symbol=' + symbolMap[symbol.val()].okex, function(data) {
      data = JSON.parse(data);
      if (typeof data.asks !== 'undefined') {
        $('#okex tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
        $('#okex tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
        for (var i = 0; i < 5; i++) {
          $('#okex tr:nth-child(' + (i + 4) + ')').html('<td>' + data.bids[i][0] + '</td><td>' + data.bids[i][1] + '</td><td>' + data.asks[data.asks.length - i - 1][0] + '</td><td>' + data.asks[data.asks.length - i - 1][0] + '</td>');
        }
      }

      okexAjax();
    });
  }
}
