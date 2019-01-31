
function Start() {
	onLoaded();
	CheckPreference();
	LoadJSON(); //プロパティのロード及び表示
	Refresh();
	LoadModel(); //モデルの読み込み
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
	return (window.cep.fs.stat(path).err !== window.cep.fs.ERR_NOT_FOUND) && (path != null) && (path != "");
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

function SavaVOICE(){
	Save();
}

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
		SaveActor();
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
	
	select = document.getElementById('VoiceSelect');
	select.onchange = function () {
		// 選択されているoption要素を取得する
		var selectedItem = this.options[this.selectedIndex];
		JIMAKUData[Preset].actor = selectedItem.innerHTML;
		var key = JIMAKUData[Preset].actor;
		var actors = VOICEData.actor.Data;
		for (var i in actors) {
			if(actors[i].Key===key){
				JIMAKUData[Preset].voice=JSON.parse(JSON.stringify(actors[i], null, '    '));
				CreateVoiceUI();
				return;
			}
		}
	}

	var dragDrop = require('drag-drop');

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

	if("audio/wav"===files[0].type){
		importWave_MGT(files[0].path);
	}
})
});