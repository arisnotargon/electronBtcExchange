function bianAjax() {
    if (typeof symbolMap[symbol.val()] !== 'undefined' && symbolMap[symbol.val()].bian !== 'undefined') {
        $.get('https://api.binance.com/api/v1/depth?symbol=' + symbolMap[symbol.val()].bian + '&limit=5', function (data) {
//                console.log(data);
//                console.log($('#bian tr:nth-child(2)')).html();
            $('#bian tr:nth-child(2)').html('<td colspan="4">' + new Date().toLocaleTimeString() + '</td>');
            $('#bian tr:nth-child(3)').html('<td>买价</td><td>买深</td><td>卖价</td><td>卖深</td>');
            for (let i = 0; i < 5; i++) {
                $('#bian tr:nth-child(' + (i + 4) + ')').html('<td>' + data.bids[i][0] + '</td><td>'
                    + data.bids[i][1]
                    + '</td><td>' + data.asks[i][0]
                    + '</td><td>' + data.asks[i][1] + '</td>');
            }
            bianAjax();
        })
    }
}