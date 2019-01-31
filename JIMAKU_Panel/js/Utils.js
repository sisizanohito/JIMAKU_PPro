function SaveActor(){
    var key = $("#VoiceSelect").val();
    if(VOICEData.length===0 || !key){
        return;
    }
    var parameters = JIMAKUData[Preset].voice.Value.parameter;
    for (var j in parameters) {
        var $ele = $("#"+parameters[j].Key);
        parameters[j].Value.value =Number($ele.val());
    }
}

function ConvertFilePath(filepath){
    if(filepath===""||filepath==null){
        return filepath;
    }
    var csInterface = new CSInterface();
    var OSVersion = csInterface.getOSInformation();
    if (OSVersion.indexOf("Windows") >= 0) {
        console.log(filepath);
        var sep = '\\\\';
        filepath = filepath.replace(/\/|\\/g, sep);
        console.log(filepath);
    }
    return filepath;
}

function SendPrMessage(message){
    var callScript = '$._PPP_.updateEventPanel("' + message + '")';
    var cs = new CSInterface();
    cs.evalScript(callScript);
}


function CheckPreference(){
    var cs = new CSInterface();
    var mainpath =PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS), "JIMAKU");
    var modelpath =PATH.join(mainpath, MODELPath);
    var voicepath =PATH.join(mainpath, VOICESavePath);
    //console.log(mainpath);
    console.log(modelpath);
    if(!PathExists(mainpath)){
        mkdir(modelpath);
    }else{
        console.log("JIMAKUファルダはすでにあります");
    }
    if(!PathExists(voicepath)){
        mkdir(voicepath);
    }else{
        console.log("VOICEファルダはすでにあります");
    }
}

function mkdir(path,callback) {
    MKDIRP(path,function (err) {
        if (err) {
            console.error(err)
        } else {
            console.log('success');
            if(callback){
                callback();
            }
        }
    });
}

function CatchStdout(result, str, callback){
    window.cep.process.stdout(result.data,function(value){
        var isrun = cep.process.isRunning(result.data);
        if(isrun.data === false){
            callback(str+value);
        }else{
            CatchStdout(result, str+value, callback);
        }
    });
}


//imageがロードされる前に描画するのを防ぐフラグ
//セマフォのように動作させる
var monitorLoad = (function (Object, Number) {
    var sample = Object.create(null),
        counter = 0;

    Object.defineProperty(sample, 'counter', {
        set: function set (value) {
            value = Number(value);
            //console.log(counter + ' -> ' + value);
            counter = value;
            if(counter==0){
                var canvas = $("#Layer0");
                var ctx = canvas[0].getContext('2d');
                ImageList.forEach(function( value ) {
                    switch( value.blendMode ) {
                        case 'normal':
                            ctx.globalCompositeOperation = "source-over";
                            break;

                        case 'multiply':
                            ctx.globalCompositeOperation = "multiply";
                            break;

                        default:
                            console.error(value.blendMode+"は実装されていない描画モードです");
                            ctx.globalCompositeOperation = "source-over";
                            break;
                    }
                    ctx.globalAlpha = value.alpha/255;
                    ctx.drawImage(value.image, value.left, value.top);
                });
            }
        },
        get: function get () {
            return counter;
        }
    });

    return sample;
}(Object, Number));

function GetModel(modelname) {
    var model = ModelData.find(function (element) {
        return modelname === element.name;
    });

    if (!model) { //モデルが読み込めないならサムネを更新しない
        console.log("モデルが読み込めません");
        return;
    }
    return model;
}

function PathExists(path) {
    return (window.cep.fs.stat(path).err !== window.cep.fs.ERR_NOT_FOUND) && (path != null) && (path != "");
}

const isDir = function (filepath) {
    return PathExists(filepath) && FS.statSync(filepath).isDirectory();
};

const isFile = function (filepath) {
    return PathExists(filepath) && FS.statSync(filepath).isFile();
};

var createImage = function (context) {
    var image = new Image
    image.src = context.canvas.toDataURL();
    return image
}