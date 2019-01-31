function LoadModel() {
    console.log("ロード開始");
    ModelData = [];
    var cs = new CSInterface();
    var path = cs.getSystemPath(SystemPath.MY_DOCUMENTS)+ "/JIMAKU" + MODELPath;
    try {
        var list = FS.readdirSync(path);
        for (var i = 0; i < list.length; i++) {
            var modelPath = PATH.join(path, list[i]);
            if (isDir(modelPath)) {
                //console.log(list[i]);
                AddModel(list[i], modelPath);
            }
        }
    } catch (err) {
        console.error(err);
        console.error("モデル一覧の取得に失敗しました");
        return;
    }
    console.log("ロード完了");
    SetSelectModel();
    SetCurrentSelect();
    CreatModelTree();
    ShowImage(); //サムネの表示
}

function LoadJSON() {
    // CSInterfaceを使ってエクステンションのパスを取得
    var cs = new CSInterface();
    var path = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", JSONPath);

    var resultRead = window.cep.fs.readFile(path);
    if (0 == resultRead.err) { //成功
        JIMAKUData = JSON.parse(resultRead.data);
    } else { //失敗
        var callScript = '$._PPP_.updateEventPanel("' + "JIMAKUの初回起動" + '")';
        cs.evalScript(callScript);
        JIMAKUData.push(new JIMAKUparameter("---", 2, 2, 960, 900, 22, 50, 0, "#ffffff", "#000000", "#000000", 255, 255, 3, 960, 500, 100, true, 0.2, 0.2, 5, 0.5, false));
        SaveJSON(path, JIMAKUData);
    }

    var $row = $("#PresetTable tr:not(.inputButton):last");
    $row[0].cells[0].innerText = JIMAKUData[0].name; //1つ目に代入

    for (var i = 1; i < JIMAKUData.length; i++) { //2つ目以上のPreset名を設定
        var $row = $("#PresetTable tr:not(.inputButton):last");
        var $newRow = $row.clone(true);
        $newRow.insertAfter($row);
        $newRow[0].cells[0].innerText = JIMAKUData[i].name;

    }
    Preset = 0;
    SetOption(Preset);
}

function AddModel(name, modelPath) {
    var json = PATH.join(modelPath, ModelJSONPath);
    var resultRead = window.cep.fs.readFile(json);
    if (0 == resultRead.err) { //成功
        var parameter = JSON.parse(resultRead.data);
        var data;
        switch (parameter.type) {
            case Model_ZIP:
                data = LoadZip(modelPath);
                break;
            case Model_PSD:
                data = LoadPSD(modelPath);
                break;
            default:
                console.error("対応したファイルではありません");
                return;
                break;
        }
    }
    ModelData.push(new Model(name, data, parameter));
    console.log(name + "ロード完了");
}

//仮
function LoadZip(path) {
    var data = [];
    try {
        var list = FS.readdirSync(path);
        for (var i = 0; i < list.length; i++) {
            var FilePath = PATH.join(path, list[i]);
            if (isFile(FilePath)) {
                //console.log(list[i]);
                var extname = PATH.extname(list[i]);
                switch (extname) {
                    case ".png": //仮
                    case ".jpg": //仮
                        data.push(FilePath);
                        break;
                    default:
                        console.log("対応したファイルではありません");
                        break;
                }
            }
        }
    } catch (err) {
        console.error(err);
        console.error("モデルファイル一覧の取得に失敗しました(zip)");
        return;
    }

    return data;
}

function importWave(event) {
    var videoTrack = 	$("#video")[0].value;
    var audioTrack = $("#audio")[0].value;
    var x = $("#pos_x")[0].val();
    var y = $("#pos_y")[0].val();
    var fontSize = $("#fontSize")[0].val;
    var scale =$("#scale")[0].val;
    var edgePx = $("#edgePx")[0].val;
    var fontColor = $("#fontColor")[0].value;
    var backColor = $("#backColor")[0].value;
    var edgeColor = $("#edgeColor")[0].value;
    var fontAlpha = 255;
    var backAlpha = $("#backAlpha")[0].value;
    fontColor = fontColor + ("0" + Number(fontAlpha).toString(16)).slice(-2);
    backColor = backColor + ("0" + Number(backAlpha).toString(16)).slice(-2);
    edgeColor = edgeColor + ("0" + Number(255).toString(16)).slice(-2);
    var parameter = Preset + ',' + (Number(videoTrack) - 1) + ',' + (Number(audioTrack) - 1) + ',' + x + ',' + y + ',"' + backColor +
        '","' + fontColor + '","' + edgeColor + '",' + fontSize + ',' + scale + ',' + edgePx;

    var csInterface = new CSInterface();
    var extPath = csInterface.getSystemPath(SystemPath.EXTENSION );
    var OSVersion = csInterface.getOSInformation();

    if (extPath !== null) {
        extPath = extPath + '/Template.xml';
        if (OSVersion.indexOf("Windows") >= 0) {
            var sep = '\\\\';
            extPath = extPath.replace(/\//g, sep);
        }
        csInterface.evalScript('$._PPP_.importWavCaption("' + extPath + '",' + parameter + ')');
    }

}


function importWave_MGT(wavpath){
    var videoTrack = 	$("#video").val();
    var audioTrack = $("#audio").val();
    var x = $("#pos_x").val();
    var y = $("#pos_y").val();
    var fontSize = $("#fontSize").val();
    var scale =$("#scale").val();
    var edgePx = $("#edgePx").val();
    var fontColor = $("#fontColor").val();
    var backColor = $("#backColor").val();
    var edgeColor = $("#edgeColor").val();
    var fontAlpha = $("#fontAlpha").val();
    var backAlpha = $("#backAlpha").val();
    var fadeInTime = $("#FadeInTime").val();
    var fadeOutTime = $("#FadeOutTime").val();
    var showSpeed = $("#ShowSpeed").val();
    var captionAddTime = $("#CaptionAddTime").val();

    var parameter = Preset + ',' + (Number(videoTrack) - 1) + ',' + (Number(audioTrack) - 1) + ',' + x + ',' + y + ',"' + backColor +
        '","' + fontColor + '","' + edgeColor + '",' + fontSize + ',' + scale + ',' + edgePx+','+fontAlpha+','+backAlpha+',"'+$("#Image_check").prop("checked")+'",'+
        fadeInTime+','+fadeOutTime+','+showSpeed+','+captionAddTime;

    var csInterface = new CSInterface();
    var extPath = csInterface.getSystemPath(SystemPath.EXTENSION );

    if (extPath !== null) {
        extPath = extPath + '/MGT/Fade(word).mogrt';
        extPath=ConvertFilePath(extPath);
        wavpath = ConvertFilePath(wavpath);
        csInterface.evalScript('$._PPP_.importWavCaptionMGT("' +wavpath+'","'+ extPath+ '",' + parameter + ')',function(result){
            if(result ==="undefined"){
                return;
            }
            var sTime = result.split(",");
            startTime = sTime[0];
            endTime = sTime[1];
            if($("#Image_check").prop("checked")){//立ち絵を出力
                var model = GetModel(JIMAKUData[Preset].modelname);
                if(!model){return;}
                var canvas = $("#Layer0");
                var ImageID = canvas.attr('name');
                var ImageDB = model.parameter.ImageDB;
                if(ImageDB[ImageID]==undefined){
                    var count = 0;
                    for (var i in ImageDB) {
                        if (ImageDB.hasOwnProperty(i)) count++;
                    }
                    ImageDB[ImageID] = count;
                }
                model.parameter.ImageDB = ImageDB;
                Save();

                csInterface.evalScript('$._PPP_.checkImage("' + model.name + '","' + ImageDB[ImageID]+".png" + '")',ExportModel);
            }
        });

    }
}