

//jsonファイルに保存
//path 絶対パス
//data jsonで保存するもの
function SaveJSON(path, data) {
    var JSONData = JSON.stringify(data, null, '    ');
    var result = window.cep.fs.writeFile(path, JSONData);
    if (0 == result.err) {
        //alert("出力成功");
    } else {
        console.log("保存失敗");
    }
}

function ExportPNG(callback){
    var model = GetModel(JIMAKUData[Preset].modelname);
    if (!model) { //モデルが読み込めないなら
        return;
    }
    var cs = new CSInterface();

    var canvas = $("#Layer0");
    var ImageID = canvas.attr('name');
    var img = canvas[0].toDataURL('image/png');
    var imageBuffer = decodeBase64Image(img);

    var ImageDB = model.parameter.ImageDB;

    var filepath = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS),"JIMAKU" , MODELPath, model.name ,ImageDB[ImageID]+".png");
    FS.writeFile(filepath, imageBuffer.data,
        function () {
            console.log(filepath+"保存終了");
            callback(filepath);
        });
}

function ExportModel(result){
    if(result==="false"){
        ExportPNG(function (filepath) {
            var csInterface = new CSInterface();
            var model = GetModel(JIMAKUData[Preset].modelname);
            filepath = filepath.replace(/\\/g, "\\\\");
            csInterface.evalScript('$._PPP_.ImportImage("' + model.name + '","' + filepath + '")',insertModel);
        });
    }else{
        insertModel();
    }
}

function insertModel(){
    var canvas = $("#Layer0");
    var model = GetModel(JIMAKUData[Preset].modelname);
    var ImageID = canvas.attr('name');
    var ImageDB = model.parameter.ImageDB;
    var clipName = ImageDB[ImageID]+".png"
    var videoTrack = 	$("#Image_video").val();
    var x = $("#Image_pos_x").val();
    var y = $("#Image_pos_y").val();
    var scale =$("#Image_scale").val();
    var model = GetModel(JIMAKUData[Preset].modelname);

    var parameter =  '"'+model.name+'","'+clipName + '",' + (Number(videoTrack) - 1) + ','  + x + ',' + y + ',' +
        scale +','+startTime+','+endTime;

    var csInterface = new CSInterface();
    csInterface.evalScript('$._PPP_.InsertImage(' + parameter + ')');
}


function SendVOICE(actor,text,saveFlag){
    var cs = new CSInterface();
    var mainpath =cs.getSystemPath(SystemPath.EXTENSION);
    var voicePth =PATH.join(mainpath, VOICEPath);
    var name = actor.Key;
    var effects ="";
    var emotions ="";

    var parameters = actor.Value.parameter;
    for (var i in parameters) {
        var result = parameters[i].Key.split('_')[0];
        if(result === "effect"){
            effects=effects+` -effect="${parameters[i].Key.split('_')[1]},${parameters[i].Value.value}"`
        }else if(result === "emotion"){
            emotions=emotions+` -emotion="${parameters[i].Key.split('_')[1]},${parameters[i].Value.value}"`
        }else{
            console.error("未確認のパラメータ"+result)
        }
    }
    var command=`"${voicePth}" talk "${name}" "${text}"${effects}${emotions}`;
    if(saveFlag){
        SaveVOICEwave(command);
    }else{
        //console.log(command);
        EXEC(command, (err, stdout, stderr) => {
            if (err) {
                SendPrMessage("SeikaCenterとの連携に失敗しました");
                console.log(err);
            }
        });
    }

}

function SaveVOICEwave(command){
    var cs = new CSInterface();
    var savepath =VOICEData.savePath;
    if(!PathExists(savepath)){
        alert("保存先のフォルダが存在しません:"+savepath)
        return;
    }
    cs.evalScript('$._PPP_.getProjectName()',function(result){
        var path = PATH.join(savepath, PATH.basename(result, PATH.extname(result)),Preset.toString());
        var wavepath = "";
        if(!PathExists(path)){
            mkdir(path,function(){
                SaveVOICEwave(command);
            });
            return;
        }
        var res = window.cep.fs.readdir(path);
        if (res.err == 0) {
            var len = parseInt(res.data.length/2);
            var num = ( ("000") + len ).substr(-4);
            var pre = ( ("0") + Preset ).substr(-2);
            var name = $("#VoiceSelect").val();
            wavepath=PATH.join(path,`${num}_${pre}_${name}.wav`);
            command=command+` -o="${wavepath}"`;//追加
        } else {
            alert("保存フォルダが生成できませんでした");
            console.log(res.err);
            return;
        }
        console.log(command);
        EXEC(command, (err, stdout, stderr) => {
            if (err) {
                SendPrMessage("SeikaCenterとの連携に失敗しました");
                console.log(err);
                return;
            }
            importWave_MGT(wavepath);
        });
    });
}