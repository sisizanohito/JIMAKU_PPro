function Start() {
	onLoaded();
	CheckPreference();
	LoadJSON(); //プロパティのロード及び表示
	Refresh();
	LoadModel(); //モデルの読み込み
}

$(document).ready(function () {
	var elem = document.getElementsByClassName('range');
	var rangeValue = function (elem, target) {
		return function (evt) {
			var num = Number(elem.value);
			target.innerHTML = Math.round(num / 255 * 100) + "%";　　　
		}　
	};
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