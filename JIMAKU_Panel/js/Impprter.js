
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