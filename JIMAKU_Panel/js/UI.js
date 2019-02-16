function SetOption(index) {
    document.getElementById('presetName').innerHTML = JIMAKUData[index].name;
    document.getElementById('video').value = JIMAKUData[index].videoTrack;
    document.getElementById('audio').value = JIMAKUData[index].audioTrack;
    document.getElementById('pos_x').value = JIMAKUData[index].x;
    document.getElementById('pos_y').value = JIMAKUData[index].y;
    document.getElementById('fontSize').value = JIMAKUData[index].fontSize;
    document.getElementById('scale').value = JIMAKUData[index].scale;
    document.getElementById('edgePx').value = JIMAKUData[index].edgePx;
    document.getElementById('fontColor').value = JIMAKUData[index].fontColor;
    document.getElementById('backColor').value = JIMAKUData[index].backColor;
    document.getElementById('edgeColor').value = JIMAKUData[index].edgeColor;
    document.getElementById('backAlpha').value = JIMAKUData[index].backAlpha;
    document.getElementById('FadeInTime').value = JIMAKUData[index].fadeInTime;
    document.getElementById('FadeOutTime').value = JIMAKUData[index].fadeOutTime;
    document.getElementById('ShowSpeed').value = JIMAKUData[index].showSpeed;
    document.getElementById('CaptionAddTime').value = JIMAKUData[index].captionAddTime;

    //非透過率の反映
    var num = Number(JIMAKUData[index].fontAlpha);
    $("#fontAlphaText")[0].innerHTML = Math.round(num / 255 * 100) + "%";
    var num = Number(JIMAKUData[index].backAlpha);
    $("#backAlphaText")[0].innerHTML = Math.round(num / 255 * 100) + "%";

    document.getElementById('Image_video').value = JIMAKUData[index].imageVideoTrack;
    document.getElementById('Image_pos_x').value = JIMAKUData[index].imageX;
    document.getElementById('Image_pos_y').value = JIMAKUData[index].imageY;
    document.getElementById('Image_scale').value = JIMAKUData[index].imageScale;
    var chk_status = JIMAKUData[index].imageCheck;
    if (!chk_status) {
        //チェックボックスをOFFにする（チェックを外す）
        $("#Image_check").prop("checked", false);
    } else {
        //チェックボックスをONにする（チェックする）
        $("#Image_check").prop("checked", true);
    }
    chk_status = JIMAKUData[index].inverse;
    if (!chk_status) {
        //チェックボックスをOFFにする（チェックを外す）
        $("#ImageInverse").prop("checked", false);
    } else {
        //チェックボックスをONにする（チェックする）
        $("#ImageInverse").prop("checked", true);
    }

    if(VOICEData.length != 0){
        $("#VoiceSelect").val(JIMAKUData[index].actor);
    }

    SetCurrentSelect(); //モデルリストを現在のプリセットに変更
    CreatModelTree();
    ShowImage();
    CreateVoiceUI();
}

function SaveOption(index) {
    JIMAKUData[index].name = document.getElementById('presetName').innerHTML;
    JIMAKUData[index].videoTrack = document.getElementById('video').value;
    JIMAKUData[index].audioTrack = document.getElementById('audio').value;
    JIMAKUData[index].x = document.getElementById('pos_x').value;
    JIMAKUData[index].y = document.getElementById('pos_y').value;
    JIMAKUData[index].fontSize = document.getElementById('fontSize').value;
    JIMAKUData[index].scale = document.getElementById('scale').value;
    JIMAKUData[index].edgePx = document.getElementById('edgePx').value;
    JIMAKUData[index].fontColor = document.getElementById('fontColor').value;
    JIMAKUData[index].backColor = document.getElementById('backColor').value;
    JIMAKUData[index].edgeColor = document.getElementById('edgeColor').value;
    JIMAKUData[index].fontAlpha = document.getElementById('fontAlpha').value;
    JIMAKUData[index].backAlpha = document.getElementById('backAlpha').value;
    JIMAKUData[index].fadeInTime = document.getElementById('FadeInTime').value;
    JIMAKUData[index].fadeOutTime = document.getElementById('FadeOutTime').value;
    JIMAKUData[index].showSpeed = document.getElementById('ShowSpeed').value;
    JIMAKUData[index].captionAddTime = document.getElementById('CaptionAddTime').value;

    JIMAKUData[index].imageVideoTrack = document.getElementById('Image_video').value;
    JIMAKUData[index].imageX = document.getElementById('Image_pos_x').value;
    JIMAKUData[index].imageY = document.getElementById('Image_pos_y').value;
    JIMAKUData[index].imageScale = document.getElementById('Image_scale').value;
    JIMAKUData[index].imageCheck = $("#Image_check").prop("checked");
    JIMAKUData[index].inverse = $("#ImageInverse").prop("checked");
}


var barElement;

function SetElement(event) {
    var csInterface = new CSInterface();
    barElement = $(event)[0];
    csInterface.evalScript('$._PPP_.JIMAKUColorPicker("' + barElement.value + '")', SetValue);
}

function SetValue(result) {
    //console.log(result)
    barElement.value = result;
}

function SetVideo() {
    var csInterface = new CSInterface();
    csInterface.evalScript('$._PPP_.getVideoTrackNum()', SetVideoOption);
}

function SetAudio() {
    var csInterface = new CSInterface();
    csInterface.evalScript('$._PPP_.getAudioTtackNum()', SetAudioOption);
}

function SetVideoOption(result) {
    var element = document.getElementById('video');
    var value = JIMAKUData[Preset].videoTrack;
    SetSelect(value, result, element);
    element = document.getElementById('Image_video');
    value = JIMAKUData[Preset].imageVideoTrack;
    SetSelect(value, result, element);
}

function SetAudioOption(result) {
    var element = document.getElementById('audio');
    var value = JIMAKUData[Preset].audioTrack;
    SetSelect(value, result, element);
}

function SetSelect(value,result, element) {
    var index = value;
    if (Number(index) > Number(result)) {
        index = result;
    }
    element.options.length = 0;
    for (var i = 1; i <= result; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", i);
        option.innerHTML = i;
        element.appendChild(option);
    }
    element.value = index;
}

function SetSelectModel() {
    var element = document.getElementById('Image_model');
    var index = element.value;
    if (Number(index) > ModelData.length) {
        index = ModelData.length;
    }
    element.options.length = 0;
    for (var i = 1; i <= ModelData.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", i);
        option.innerHTML = ModelData[i - 1].name;
        element.appendChild(option);
    }
    element.value = index;
}

function CreateVoiceContents(){
    if(VOICEData.length===0){
        return;
    }
    $("#voice-savepath").val(VOICEData.savePath);
    $("#VoiceSelect option").remove();
    var actors = VOICEData.actor.Data;
    for (var i in actors) {
        var key = actors[i].Key;
        $("#VoiceSelect").append($("<option>").val(key).text(key));
    }
    $("#VoiceSelect").val(JIMAKUData[Preset].actor);
    CreateVoiceUI();
}


function CreateVoiceUI(){
    var key = $("#VoiceSelect").val();
    if(VOICEData.length==0 || !key){
        return;
    }
    //var actors = VOICEData.actor.Data;
    var actor = JIMAKUData[Preset].voice;
    CreateVoiceElement(actor);
}


function CreatModelTree() {
    $('#ImageTree').empty(); //空にする
    var model = GetModel(JIMAKUData[Preset].modelname);
    if (!model) { //モデルが読み込めないなら
        return;
    }
    if (model.parameter.type === Model_PSD) {
        CreatePSDTree();
    }
}

function CreateVoiceElement(actor){
    var parameters = actor.Value.parameter;
    var $parameterArea = $("#voice-parameter");
    var $emotionArea = $("#voice-emotion");
    $parameterArea.empty();
    $emotionArea.empty();
    for (var i in parameters) {
        var result = parameters[i].Key.split('_')[0];
        if(result === "effect"){
            Addbar(parameters[i],$parameterArea);
        }else{
            Addbar(parameters[i],$emotionArea);
        }

    }

    function Addbar(parameter,$area){
        var $elem = $("<div></div>", {
            "class": "VoiceUI"
            //name:parameter.Key
        }).appendTo($area);
        $("<labl>", {
            text: parameter.Key.split('_')[1]
        }).appendTo($elem);
        $("<br>").appendTo($elem);
        var $bar = $("<input>", {
            type: 'range',
            id: parameter.Key,
            min:Number(parameter.Value.min),
            max:Number(parameter.Value.max),
            step:Number(parameter.Value.step),
            value:Number(parameter.Value.value),
        }).appendTo($elem);

        var $txt = $("<input>", {
            type: 'text',
            value: parameter.Value.value,
            max:parameter.Value.max,
            size:3,
            maxlength:10,
        }).appendTo($elem);

        $bar.on('input', function(event) {
            var value = $bar.val();
            $txt.val(value);
        });

        $txt.on('change', function(event) {
            var value = $txt.val();
            $bar.val(Number(value));
        });
    }
}

function removeChildren(x) {
    if (x.hasChildNodes()) {
        while (x.childNodes.length > 0) {
            x.removeChild(x.firstChild)
        }
    }
}

function RemoveModel(modelname) {
    var i;
    for(i = 0;i<ModelData.length;i++){
        if(ModelData[i].name === modelname){
            ModelData.splice(i, 1);
        }
    }
}

function SavaVOICE(){
    Save();
}


function SetCurrentSelect() {
    var select = document.getElementById('Image_model');
    var name = JIMAKUData[Preset].modelname;
    if (name === "") {
        select.selectedIndex = -1;
        return;
    }

    var options = $('#Image_model').children(); //オプションを取得
    for (var i = 0; i < options.length; i++) {
        if (name === options.eq(i).text()) {
            $('#Image_model').val(i + 1);
            return;
        }
    }
}

function ShowImage() {
    var ImageArea = document.getElementById('ImageArea');
    ImageArea.innerHTML = "";
    var model = GetModel(JIMAKUData[Preset].modelname);

    if (!model) { //モデルが読み込めないならサムネを更新しない
        return;
    }
    switch (model.parameter.type) {
        case Model_KYARA:
        case Model_ZIP:
            ImageArea.innerHTML = '<img src="file://' + model.data[0] + '" class="Image">';
            break;
        case Model_PSD:
            ShowPSD(model.data.tree());
            break;
        default:
            console.error("ファイルが読み込めませんでした");
            break;
    }
}

//////////////////////////---------------------ボタン----------------------------------//////////////////////////
function Refresh() {
    SetVideo();
    SetAudio();
}

function DeleteModel(){
    var res = confirm("現在の[" + JIMAKUData[Preset].modelname + "]を削除しますか?");
    if (res == true) {
        var name = JIMAKUData[Preset].modelname;
        if (name === "") {
            return;
        }
        var options = $('#Image_model').children(); //オプションを取得
        for (var i = 0; i < options.length; i++) {
            if (name === options.eq(i).text()) {
                $('#Image_model').children('[value='+(i+1)+']').remove();
                break;
            }
        }

        var cs = new CSInterface();
        var model = GetModel(JIMAKUData[Preset].modelname);
        var dir = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS), "JIMAKU",MODELPath, model.name);
        if (PathExists(dir)) {
            RMDIR(dir, function (err, dirs, files) {
                console.log(dirs);
                console.log(files);
                console.log('削除完了');
            });
        }else{
            console.error("削除する対象がありません");
        }
        RemoveModel(name);
        JIMAKUData[Preset].modelname = "";
        Save();
        SetCurrentSelect();
        CreatModelTree();
        ShowImage();
    } else {
        // キャンセル
    }
}

function NewModel() {
    var filetypes = new Array();
    filetypes[0] = 'png';
    filetypes[1] = 'jpg';
    filetypes[1] = 'psd';
    var result = window.cep.fs.showOpenDialog(false, false, "SELECT PSD", "psd", filetypes);
    var path = result.data[0];
    if (PathExists(path)) { //モデルファイルをコピー
        var extname = PATH.extname(path);
        var basename = PATH.basename(path, extname);
        var cs = new CSInterface();
        var dir = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS),"JIMAKU" ,MODELPath, basename);
        if (PathExists(dir)) {
            var callScript = '$._PPP_.updateEventPanel("' + "同じファイル名はロードできません" + '")';
            cs.evalScript(callScript);
            ShowImage();
            return;
        }
        var copyPath = PATH.join(dir, PATH.basename(path));
        FILECOPY(path, copyPath, {
            mkdirp: true
        }).then(() => {
            var model_p = new ModelParameter(Model_ZIP);
            switch (extname) {
                case ".png": //仮
                case ".jpg": //仮
                case ".zip":
                    break;
                case ".psd":
                    model_p.type = Model_PSD;
                    break;
                default:
                    console.error("対応したファイルではありません");
                    return;
                    break;
            }
            var parameterPath = PATH.join(dir, ModelJSONPath);
            SaveJSON(parameterPath, model_p);
            AddModel(basename, dir);
            JIMAKUData[Preset].modelname = basename;
            SetSelectModel();
            SetCurrentSelect();
            CreatModelTree();
            ShowImage();
            Save();
        });
    }
}


function AddPreset() {
    var $row = $("#PresetTable tr:not(.inputButton):last");
    var $newRow = $row.clone(true);
    $newRow[0].cells[0].innerText = "---";
    $newRow.insertAfter($row);
    Preset = $("#PresetTable tr:not(.inputButton)").length - 1; //プリセットの合計-1
    JIMAKUData.push(new JIMAKUparameter("---", 2, 2, 960, 900, 22, 50, 0, "#ffffff", "#000000", "#000000", 255, 255, 3, 960, 500, 100, true, 0.2, 0.2, 5, 0.5, false));
    SetOption(Preset);
}

function Save() {
    // CSInterfaceを使ってエクステンションのパスを取得
    var cs = new CSInterface();
    var path = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", JSONPath);
    SaveOption(Preset);
    var presetTable = document.getElementById('PresetTable');
    presetTable.rows[Preset].cells[0].innerText = JIMAKUData[Preset].name;
    SaveJSON(path, JIMAKUData);

    if(VOICEData.length !=0){
        path = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", VOICEJSONPath);
        SaveJSON(path, VOICEData);
    }

    var model = GetModel(JIMAKUData[Preset].modelname);
    if (!model) { //モデルが読み込めないならサムネを更新しない
        return;
    }
    var dir = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS),"JIMAKU" ,MODELPath, model.name,ModelJSONPath);
    SaveJSON(dir, model.parameter);
}

//プリセット削除
function DeletePreset() {
    var res = confirm("現在の[" + JIMAKUData[Preset].name + "]を削除しますか?");
    if (res == true) {
        // OKなら削除
        var $rows = $("#PresetTable tr:not(.inputButton)");
        $rows.eq(Preset).remove(); //プリセット名を行ごと削除
        JIMAKUData.splice(Preset, 1);
        var max = $rows.length - 2; //削除で-1 lengthで-1
        if (max < Preset) Preset = max;
        SetOption(Preset);
        Save();
    } else {
        // キャンセル

    }
}

function setVOICESavePath(){
    if(VOICEData.length==0){
        alert("VOICEを開始してください")
        return;
    }
    var path = window.cep.fs.showOpenDialog(false, true, "choose save folder", VOICEData.savePath);
    if (path.err == 0) {
        if (path.data[0] !== undefined) {
            console.log(path.data[0]);
            VOICEData.savePath = path.data[0];
            $("#voice-savepath").val(VOICEData.savePath);
            Save();
        } else {
            console.log("cancelled");
        }
    } else {
        console.log(path.err);
    }

}

function PlayVIOCE(){
    var key = $("#VoiceSelect").val();
    if(VOICEData.length==0 || !key){
        return;
    }
    SaveActor();
    $text = $("#voice-text").val();
    var actor = JIMAKUData[Preset].voice;
    $text = $text.replace(/\n/g, "<br>");
    if($text===""){
        return;
    }
    SendVOICE(actor,$text,false);
}

function PlaySaveVIOCE(){
    var key = $("#VoiceSelect").val();
    if(VOICEData.length==0 || !key){
        return;
    }
    SaveActor();
    $text = $("#voice-text").val();
    $text = $text.replace(/\n/g, "<br>");
    if($text===""){
        return;
    }
    var actor = JIMAKUData[Preset].voice;
    SendVOICE(actor,$text,true);
}

function DeleteVoiceActor(){
    var key = $("#VoiceSelect").val();
    if(VOICEData.length==0 || !key){
        return;
    }
    var res = confirm("現在の[" + key + "]を削除しますか?");
    if (res == true) {
        var actors = VOICEData.actor.Data;
        for (var i in actors) {
            if(actors[i].Key===key){
                actors.splice(i, 1);
                JIMAKUData[Preset].actor = "";
                SavaVOICE();
                CreateVoiceContents();
                return;
            }
        }
    } else {
        // キャンセル

    }
}


function RefreshVOICE(){
    if(VOICEData.length===0){
        return;
    }
    var cs = new CSInterface();
    var mainpath =cs.getSystemPath(SystemPath.EXTENSION);
    var voicePth =PATH.join(mainpath, VOICEPath);
    var result = window.cep.process.createProcess(voicePth,'get');
    CatchStdout(result,"",function(value){
        console.log("終了");
        console.log(value);
        var data = JSON.parse(value || "null");
        VOICEData.actor = data;
        SavaVOICE();
        CreateVoiceContents();
    });

    window.cep.process.stderr(result.data,function(value){
        alert("seikacenterを起動してください");
    });
}


function GetSeikaCenter() {
    var cs = new CSInterface();
    var mainpath =cs.getSystemPath(SystemPath.EXTENSION);
    var voicePth =PATH.join(mainpath, VOICEPath);

    var path = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", VOICEJSONPath);

    var resultRead = window.cep.fs.readFile(path);
    if (0 === resultRead.err) { //成功
        VOICEData = JSON.parse(resultRead.data);
        CreateVoiceContents();
    } else { //失敗
        var result = window.cep.process.createProcess(voicePth,'get');
        CatchStdout(result,"",function(value){
            console.log("終了");
            console.log(value);
            var data = JSON.parse(value || "null");
            VOICEData = new VOICE(data);
            SavaVOICE();
            CreateVoiceContents();
        });

        window.cep.process.stderr(result.data,function(value){
            alert("seikacenterを起動してください");
        });
    }
}