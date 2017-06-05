var WebSocketServer = require('ws').Server;
var fs = require('fs');
// 创建ws服务器
var ws = new WebSocketServer({
    port: 1234    // 监听的端口
});

ws.on('connection', function(socket){
    console.log('yes');
    socket.onmessage = function(body){
        //接收前台POST过来的base64
        console.log(!!body)
        var imgDataGroup = JSON.parse(body.data);

        imgDataGroup.forEach(function(element) {
            transImage(element);
        });

        console.log('success');
        socket.send('success');
        
    }
});

function transImage(imgData){
    //过滤data:URL
    var base64Data = imgData.data;
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(imgData.fileName, dataBuffer, function(err) {
        if(err){
            console.log('发生错误'+err);
        }else{
            console.log("保存成功！");
        }
    });
}

console.log('listen at 1234...')