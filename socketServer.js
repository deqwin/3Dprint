var WebSocketServer = require('ws').Server;
var fs = require('fs');
var path = require('path');
// 创建ws服务器
var ws = new WebSocketServer({
    port: 1234    // 监听的端口
});

var fileNameGroup = [];

var count = 0;
var timer = null;
var version = '';

ws.on('connection', function(socket){

    console.log('yes');

    socket.onmessage = function(body){
        //接收前台POST过来的base64
        var imgData = JSON.parse(body.data);    

        transImage(imgData, socket);
        fileNameGroup.push(imgData.fileName);

        count++;
        if(count == imgData.count){
            fs.writeFile(path.join(__dirname, 'info.txt'), Math.random() + '\r\n'+ fileNameGroup.join('\r\n'), function(err){
                if(err){
                    console.log('发生错误'+err);
                }else{
                    console.log("版本更新成功！");
                    socket.send('success');
                    fileNameGroup = [];
                    count = 0;
                }
            });
        }
        
    };

    if(!timer){
        timer = setInterval(function(){
            fs.readFile(path.join(__dirname, './Gcode/info.txt'), {encoding: 'utf8'}, function(err, data){
                if(err) return;

                if(version != data){
                    console.log('to send .gcode')
                    fs.readFile(path.join(__dirname, './Gcode/my.gcode'), {encoding: 'utf8'}, function(err_1, data_1){
                        socket.send(data_1);
                        version = data;
                    });
                }
            })
        }, 5000);
    }
});

function transImage(imgData, socket){
    //过滤data:URL
    var base64Data = imgData.data;
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile(path.join(__dirname, 'image', imgData.fileName), dataBuffer, function(err) {
        if(err){
            console.log('发生错误'+err);
        }else{
            console.log("保存成功！");
            socket.send('done');
        }
    });
}

console.log('listen at 1234...')