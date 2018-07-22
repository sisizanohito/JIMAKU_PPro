var JIMAKUparameter = function (name, videoTrack, audioTrack, x, y, fontSize, scale, edgePx, fontColor, backColor, edgeColor, fontAlpha,backAlpha,
	imageVideoTrack, imageX, imageY, imageScale, imageCheck, fadeInTime, fadeOutTime, showSpeed, captionAddTime, inverse) {
	this.name = name;
	this.videoTrack = videoTrack;
	this.audioTrack = audioTrack;
	this.x = x;
	this.y = y;
	this.fontSize = fontSize;
	this.scale = scale;
	this.edgePx = edgePx;
	this.fontColor = fontColor;
	this.backColor = backColor;
	this.edgeColor = edgeColor;
	this.fontAlpha = fontAlpha;
	this.backAlpha = backAlpha;
	this.imageVideoTrack = imageVideoTrack
	this.imageX = imageX;
	this.imageY = imageY;
	this.imageScale = imageScale;
	this.imageCheck = imageCheck;
	this.fadeInTime = fadeInTime;
	this.fadeOutTime = fadeOutTime;
	this.showSpeed = showSpeed;
	this.captionAddTime = captionAddTime;
	this.inverse = inverse;

	this.modelname = "";
}
var Preset = 0; // Presetの指定
var JIMAKUData = []; // 空の配列

//モデルタイプ
const Model_PSD = 0;
const Model_ZIP = 1;
const Model_KYARA = 2;
var Model = function (name, data, parameter) {
	this.name = name;
	this.data = data;
	this.parameter = parameter;
}
var ModelParameter = function (type) {
	this.type = type;
	this.ImageDB = {};
}
var ModelData = [];


var ModelTree = function (text) {
	this.text = text;
	this.children = [];
}
var TreeData;

var startTime = 0;
var endTime = 0;

var VOICEData = [];
var VOICE = function (data) {
	var cs = new CSInterface();
	this.savePath = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", VOICESavePath);
	this.actor = data;
}

function Start() {
	onLoaded();
	CheckPreference();
	LoadJSON(); //プロパティのロード及び表示
	Refresh();
	LoadModel(); //モデルの読み込み
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


function importWave_MGT(event){
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
		csInterface.evalScript('$._PPP_.importWavCaptionMGT("' + extPath+ '",' + parameter + ')',function(result){
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

function ConvertFilePath(filepath){
	var csInterface = new CSInterface();
	var OSVersion = csInterface.getOSInformation();
	if (OSVersion.indexOf("Windows") >= 0) {
		var sep = '\\\\';
		filepath = filepath.replace(/\//g, sep);
	}
	return filepath;
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

function removeChildren(x) {
	if (x.hasChildNodes()) {
		while (x.childNodes.length > 0) {
			x.removeChild(x.firstChild)
		}
	}
}

function Refresh() {
	SetVideo();
	SetAudio();
}

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
	var num = Number(JIMAKUData[index].backAlpha);
	$("#backAlphaText")[0].innerHTML = Math.round(num / 255 * 100) + "%";
	var num = Number(JIMAKUData[index].fontAlpha);
	$("#backAlphaText")[0].innerHTML = Math.round(num / 255 * 100) + "%";

	document.getElementById('Image_video').value = JIMAKUData[index].imageVideoTrack;
	document.getElementById('Image_pos_x').value = JIMAKUData[index].imageX;
	document.getElementById('Image_pos_y').value = JIMAKUData[index].imageY;
	document.getElementById('Image_scale').value = JIMAKUData[index].imageScale;
	var chk_status = JIMAKUData[index].imageCheck;
	if (!chk_status) {
		//チェックボックスをOFFにする（チェックを外す）。
		$("#Image_check").prop("checked", false);
	} else {
		//チェックボックスをONにする（チェックする）。
		$("#Image_check").prop("checked", true);
	}
	chk_status = JIMAKUData[index].inverse;
	if (!chk_status) {
		//チェックボックスをOFFにする（チェックを外す）。
		$("#ImageInverse").prop("checked", false);
	} else {
		//チェックボックスをONにする（チェックする）。
		$("#ImageInverse").prop("checked", true);
	}

	SetCurrentSelect(); //モデルリストを現在のプリセットに変更
	CreatModelTree();
	ShowImage();
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

function Save() {
	// CSInterfaceを使ってエクステンションのパスを取得
	var cs = new CSInterface();
	var path = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", JSONPath);
	SaveOption(Preset);
	var presetTable = document.getElementById('PresetTable');
	presetTable.rows[Preset].cells[0].innerText = JIMAKUData[Preset].name;
	SaveJSON(path, JIMAKUData);

	var model = GetModel(JIMAKUData[Preset].modelname);
	if (!model) { //モデルが読み込めないならサムネを更新しない
		return;
	}
	var dir = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS),"JIMAKU" ,MODELPath, model.name,ModelJSONPath);
	SaveJSON(dir, model.parameter);
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

function mkdir(path) {  
	MKDIRP(path,function (err) {
		if (err) {
		 console.error(err)
		} else {
		 console.log('success')
		}
	});
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

//pngデータをBase64に変換
function toBase64(png) {
	var canvas, context, i, imageData, j, len, pixel, pixelData, ref;
	canvas = document.createElement('canvas');
	canvas.width = png.width;
	canvas.height = png.height;
	context = canvas.getContext('2d');
	imageData = context.getImageData(0, 0, png.width, png.height);
	pixelData = imageData.data;
	ref = png.data;
	for (i = j = 0, len = ref.length; j < len; i = ++j) {
		pixel = ref[i];
		pixelData[i] = pixel;
	}
	context.putImageData(imageData, 0, 0);
	return canvas.toDataURL('image/png');
}

var Loader = function(expectedCnt, callback){
	var cnt = 0;
	return function(){
	  if(++cnt == expectedCnt){ callback(); }
	}
  };

//mask画像と主に
function toBase64Mask(orign,mask,width,height) {
	var canvas, context, i, j, len, pixel, pixelData, ref;
	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext('2d');
	var imageData = new Image(orign.image.width(), orign.image.height());
	imageData.src =toBase64(orign.image.toPng()); ;
	var maskData = new Image(mask.image.width(), mask.image.height());
	maskData.src=toBase64(mask.image.toPng());

	var Data = new Image();
	Data.width = width;
	Data.height = height;
	monitorLoad.counter += 1;
	var imageObject = {image:Data, left:0, top:0, alpha:orign.opacity, blendMode:orign.blendingMode()};
	ImageList.push(imageObject);
	Data.addEventListener('load', function(){
		monitorLoad.counter -= 1;
	});
	//Data.name = node.get("name");	
	
	var loader = Loader(2, function(){ 
		context.drawImage(imageData, orign.left, orign.top);
		context.globalCompositeOperation = 'destination-in';
		context.drawImage(maskData, mask.left, mask.top);
		Data.src = canvas.toDataURL('image/png');
	});
	
	imageData.onload = loader;
	maskData.onload = loader;
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
	var result = window.cep.fs.showOpenDialog(false, false, "SELECT IMAGE", "", filetypes);
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
var isDir = function (filepath) {
	return PathExists(filepath) && FS.statSync(filepath).isDirectory();
};

var isFile = function (filepath) {
	return PathExists(filepath) && FS.statSync(filepath).isFile();
};

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

function LoadPSD(path) {
	var data;
	try {
		var list = FS.readdirSync(path);
		for (var i = 0; i < list.length; i++) {
			var FilePath = PATH.join(path, list[i]);
			if (isFile(FilePath)) {
				//console.log(list[i]);
				var extname = PATH.extname(list[i]);
				switch (extname) {
					case ".psd": //仮
						var psd = PSD.fromFile(FilePath);
						psd.parse();
						data = psd;
						break;
					default:
						console.log("対応したファイルではありません");
						break;
				}
			}
		}
	} catch (err) {
		console.error(err);
		console.error("モデルファイル一覧の取得に失敗しました(PSD)");
		return;
	}
	return data;
}

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

function RemoveModel(modelname) {
	var i;
	for(i = 0;i<ModelData.length;i++){
		if(ModelData[i].name === modelname){
			ModelData.splice(i, 1);
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
var createImage = function (context) {
	var image = new Image
	image.src = context.canvas.toDataURL();
	return image
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

	  var ImageList = [];
function ShowPSD(node) {
	ImageList = [];
	console.log(node.export());
	var width = node.root().get('width');
	var height = node.root().get('height');
	var canvas = addCanvas(width, height);
	monitorLoad.counter += 1;
	if($("#ImageInverse").prop("checked")){
		DrawPSD(node,"Inverse");
	}else{
		DrawPSD(node,"Root");
	}
	monitorLoad.counter -= 1;
}


// Decoding base-64 image
function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};

	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}

	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');

	return response;
}

function DrawPSD(node,name) {
	var layer = node.get("layer");
	var type = node.get("type");
	if (!node.isRoot()) { //ルートじゃないなら
		if (!layer.visible) return; //描画しない
	}
	if (node.hasChildren()) { //子を持っているなら
		var children = node.children();
		for (var i = children.length - 1; i >= 0; i--) {
			var new_name = name +'_'+ i.toString();
			DrawPSD(children[i],new_name);
		}
	} else if(type === "layer") { //レイヤーなら
		//console.log(name + " : " + node.get('type'));
		var width = node.root().get('width');
		var height = node.root().get('height');
		var layerWidth = layer.image.width();
		var layerHeight = layer.image.height();
		var canvas = $("#Layer0"); 
		canvas.attr('name', canvas.attr('name')+name+"#");
		var top = layer.top;
		var left = layer.left;
		var png = layer.image.toPng();
		if(layer.image.width() == 0 || layer.image.height() ==0){//空白画像
			return;
		}
		var dataUrl;
		var image = new Image();

		if(layer.clipped){
			var masknode = SearchMask(node);
			var masklayer = masknode.get("layer");
			if(!masklayer.visible || masklayer.image.width() == 0 || masklayer.image.height() ==0){//マスクが描画されていなと描画しない
				return;
			}
			var maskpng = masklayer.image.toPng();
			toBase64Mask(layer,masklayer,width,height);
			//console.log(node.get("name")+":mask->"+masknode.get("name"));
			return;
		}else{
			dataUrl=toBase64(png);
		}
		image.width = layerWidth;
		image.height = layerHeight;
		monitorLoad.counter += 1;
		var imageObject = {image:image, left:left, top:top, alpha:layer.opacity, blendMode:layer.blendingMode()};
		ImageList.push(imageObject);
		image.addEventListener('load', function(){
			monitorLoad.counter -= 1;
		});
		image.src = dataUrl;
		//image.name = node.get("name");	
	}
	return;
}

function SearchMask(node){
	if(!node.get("layer").clipped){//クリッピングじゃないやつ
		return node;
	}
	var next = node.nextSibling();
	if(next){//端でない限り
		return SearchMask(next);
	}
	return undefined;
}

function addCanvas(width, height) {
	var id = "Layer" + $("#ImageArea *").length.toString();
	$("#ImageArea").append(
		$('<canvas></canvas>')
		.addClass("Image")
		.attr('id', id)
		.attr('width', width)
		.attr('height', height)
		.attr('name', '')
	);
	var canvas = $("#" + id);
	if (!canvas || !canvas[0].getContext) {
		return null;
	}
	if($("#ImageInverse").prop("checked")){
		var ctx = canvas[0].getContext('2d');
		ctx.transform(-1, 0, 0, 1, width, 0);
	}
	return canvas;
}

function PathExists(path) {
	return (window.cep.fs.stat(path).err != window.cep.fs.ERR_NOT_FOUND) && (path != null) && (path != "");
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

function CreatePSDTree() {
	var model = GetModel(JIMAKUData[Preset].modelname);
	if (!model) { //モデルが読み込めないなら
		return;
	}
	var psd = model.data;
	var root = psd.tree();
	DeepPSD(root, "");
}

function DeepPSD(node, name) {
	if (!node.isRoot()) { //ルートじゃなかったら
		name = name + "/" + node.get('name');
		CreateTreeElement(name, node.hasChildren());
	}
	if (node.hasChildren()) { //子を持っているなら
		var children = node.children();
		for (var i = 0; i < children.length; i++) {
			DeepPSD(children[i], name);
		}
	}
	return;
}

function CreateTreeElement(path, groupFlag) {
	var splitPath = path.split("/");
	splitPath.shift(); //先頭の空白を削除
	//console.log(splitPath);
	var root = $('#ImageTree');
	SearchTree(root, 0, splitPath, groupFlag);
	return;
}

function SearchTree(node, index, splitPath, groupFlag) {
	if (splitPath.length > index) {
		var name = splitPath[index];
		var target = node.children('[name="' + name + '"]');
		var radioID = "";
		var value = "";
		for (var i = index; i >= 0; i--) {
			value = PATH.posix.join(splitPath[i], value);
		}
		for (var i = index-1; i >= 0; i--) {
			radioID = PATH.posix.join(splitPath[i], radioID);
		}
		if (target.length == 0) { //見つからなかった場合
			if (index == splitPath.length - 1) { //終端の場合
				target = CreateNode(name, radioID, groupFlag, value);
			} else { //途中の場合
				target = CreateNode(name, radioID, true, value);
			}
			node.append(target);
		}
		index++;
		SearchTree(target, index, splitPath, groupFlag);
	}
	return;
}

function CreateNode(name, radioID, groupFlag, value) {
	var $node;
	var model = GetModel(JIMAKUData[Preset].modelname);
	if (!model) { //モデルが読み込めないなら
		return;
	}
	var psd = model.data;
	var tree = psd.tree();
	var child = tree.childrenAtPath(value)[0];
	var layer = child.get("layer");
	var visible = layer.visible;

	if (groupFlag) { //type group
		$node = $("<div>", {
			name: name,
			"class": "TreeNode"
		});
	} else { //それ以外
		$node = $("<div>", {
			name: name,
			"class": "TreeLeaf"
		});
	}
	var top = name.slice(0, 1); //先頭文字
	var $input;
	switch (top) {
		case "*":
			name = name.slice(1);
			$input = $("<input>", {
				type: "radio",
				name: radioID,
				value: value
			});
			break;
		case "!":
			name = name.slice(1);
			$input = $("<input>", {
				type: "checkbox",
				value: value
			});
			$input.hide();
			break;
		default:
			$input = $("<input>", {
				type: "checkbox",
				value: value
			});
			break;
	}
	if(layer.clipped){
		name = "↓:"+name;
	}
	$input.on('change', PSDSet);
	var $label = $("<labl>", {
		text: name
	});
	if (visible) {
		$input.prop("checked", true);
	}
	$node.append($input);
	$node.append($label);
	return $node;
}

function PSDSet() {
	var model = GetModel(JIMAKUData[Preset].modelname);
	if (!model) { //モデルが読み込めないなら
		return;
	}
	var psd = model.data;
	var root = psd.tree();
	var nodePath = $(this).val();
	var child = root.childrenAtPath(nodePath)[0];
	var layer = child.get("layer");

	if ($(this).is(':checked')) {
		layer.visible = true;
		layer.blendMode.visible = true;
		if ($(this).attr('type') === "radio") {
			var children = child.siblings();
			var split = nodePath.split("/");
			var nodeName = split[split.length - 1];
			children.forEach(function (node) {
				var name = node.get("name");
				var top = name.slice(0, 1); //先頭文字
				if(top != "*"){return;}//*のみ処理する
				layer = node.get("layer");
				if (node.name === nodeName) {
					layer.visible = true;
					layer.blendMode.visible = true;
				} else {
					layer.visible = false;
					layer.blendMode.visible = false;
				}
			});
		}
	} else {
		layer.visible = false;
		layer.blendMode.visible = false;
	}

	ShowImage();
}

function GetSeikaCenter() {
	var cs = new CSInterface();
	var mainpath =cs.getSystemPath(SystemPath.EXTENSION);
	var voicePth =PATH.join(mainpath, VOICEPath);
	
	path = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", VOICEJSONPath);

	var resultRead = window.cep.fs.readFile(path);
	if (0 == resultRead.err) { //成功
		VOICEData = JSON.parse(resultRead.data);
		CreateVoiceContents();
	} else { //失敗
		var result = window.cep.process.createProcess(voicePth,'get'); 
		window.cep.process.stdout(result.data,function(value){
			var data = JSON.parse(value);
			VOICEData = new VOICE(data);
			SaveJSON(path, VOICEData);
			CreateVoiceContents();
		});

		window.cep.process.stderr(result.data,function(value){
			alert("seikacenterを起動してください");
		});
		
	}

	
}

function CreateVoiceContents(){
	if(!VOICEData){
		return;
	}
	$("#VoiceSelect option").remove();
	var actor = VOICEData.actor.Data;
	for (var i in actor) {
		var key = actor[i].Key;
		$("#VoiceSelect").append($("<option>").val(key).text(key));
	}
}

$(document).ready(function () {
	var elem = document.getElementsByClassName('range');
	var rangeValue = function (elem, target) {
		return function (evt) {
			var num = Number(elem.value);
			target.innerHTML = Math.round(num / 255 * 100) + "%";　　　
		}　
	}　
	for (var i = 0, max = elem.length; i < max; i++) {　　　
		bar = elem[i].getElementsByTagName('input')[0];　　　
		target = elem[i].getElementsByTagName('span')[1];　　　
		bar.addEventListener('input', rangeValue(bar, target));　
	}

	$("#PresetTable tr:not(.inputButton)").on('click', function () { //プリセットの切り替え
		Save(); //移動するため現状を保存
		var $tag_tr = $(this)[0];
		Preset = $tag_tr.rowIndex;
		SetOption(Preset);
	});

	$(".tab-pane").mCustomScrollbar({ //プリセットのスクロールバー
		autoHideScrollbar: true,
		theme: "dark"
	});

	$(".Presets").mCustomScrollbar({ //プリセットのスクロールバー
		autoHideScrollbar: true,
		theme: "dark"
	});

	$(".Tree").mCustomScrollbar({ //プリセットのスクロールバー
		autoHideScrollbar: true,
		theme: "dark"
	});



	var select = document.getElementById('Image_model');
	select.onchange = function () {
		// 選択されているoption要素を取得する
		var selectedItem = this.options[this.selectedIndex];
		JIMAKUData[Preset].modelname = selectedItem.innerHTML;
		CreatModelTree();
		ShowImage();
	}

	var dragDrop = require('drag-drop')

// You can pass in a DOM node or a selector string!
dragDrop('body', function (files, pos, fileList, directories) {
  console.log('Here are the dropped files', files)
  console.log('Dropped at coordinates', pos.x, pos.y)
  console.log('Here is the raw FileList object if you need it:', fileList)
  console.log('Here is the list of directories:', directories)


    console.log(files[0].name)
    console.log(files[0].size)
    console.log(files[0].type)
    console.log(files[0].lastModifiedData)
    console.log(files[0].fullPath) // not real full path due to browser security restrictions
	console.log(files[0].path) // in Electron, this contains the actual full path

})

	/*
	TreeData = new ModelTree("ルート");
	TreeData.children.push(new ModelTree("子1"));
	TreeData.children.push(new ModelTree("子2"));
	console.log("データツリー");
	console.log(TreeData);
	$('#tree1').jstree({"plugins" : ["checkbox","wholerow"],
						"core" : {'themes':{'stripes':true},
								  'data':TreeData,
								  multiple: false
								}
					});
	*/

});