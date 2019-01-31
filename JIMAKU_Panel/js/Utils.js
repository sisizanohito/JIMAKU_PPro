
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

const isDir = function (filepath) {
    return PathExists(filepath) && FS.statSync(filepath).isDirectory();
};

const isFile = function (filepath) {
    return PathExists(filepath) && FS.statSync(filepath).isFile();
};