var JSONPath = "/JIMAKU.json";
		var JIMAKUparameter = function (name, videoTrack, audioTrack, x, y, fontSize, scale, edgePx, fontColor, backColor,
			edgeColor, backAlpha) {
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
			this.backAlpha = backAlpha;
		}
		var Preset = 0; // Presetの指定
		var JIMAKUData = []; // 空の配列


		function importWave(event) {
			var elem = $(event).parents("div");
			var videoTrack = elem[0].getElementsByTagName('select')[0].value;
			var audioTrack = elem[0].getElementsByTagName('select')[1].value;
			var x = elem[0].getElementsByTagName('input')[1].value;
			var y = elem[0].getElementsByTagName('input')[2].value;
			var fontSize = elem[0].getElementsByTagName('input')[3].value;
			var scale = elem[0].getElementsByTagName('input')[4].value;
			var edgePx = elem[0].getElementsByTagName('input')[5].value;
			var fontColor = elem[0].getElementsByTagName('input')[6].value;
			var backColor = elem[0].getElementsByTagName('input')[7].value;
			var edgeColor = elem[0].getElementsByTagName('input')[8].value;
			var fontAlpha = 255;
			var backAlpha = elem[0].getElementsByTagName('input')[9].value;
			fontColor = fontColor + ("0" + Number(fontAlpha).toString(16)).slice(-2);
			backColor = backColor + ("0" + Number(backAlpha).toString(16)).slice(-2);
			edgeColor = edgeColor + ("0" + Number(255).toString(16)).slice(-2);
			var parameter = (Number(videoTrack) - 1) + ',' + (Number(audioTrack) - 1) + ',' + x + ',' + y + ',"' + backColor +
				'","' + fontColor + '","' + edgeColor + '",' + fontSize + ',' + scale + ',' + edgePx;

			var csInterface = new CSInterface();
			var extPath = csInterface.getSystemPath(SystemPath.EXTENSION);
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

		var barElement;

		function SetElement(event) {
			var csInterface = new CSInterface();
			barElement = $(event)[0];
			csInterface.evalScript('$._PPP_.JIMAKUColorPicker("' + barElement.value + '")', SetValue);
		}

		function SetValue(result) {
			console.log(result)
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
			SetSelect(result, element);
		}

		function SetAudioOption(result) {
			var element = document.getElementById('audio');
			SetSelect(result, element);
		}

		function SetSelect(result, element) {
			var index = element.value;
			if (index > result) {
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
			document.getElementById('pos:x').value = JIMAKUData[index].x;
			document.getElementById('pos:y').value = JIMAKUData[index].y;
			document.getElementById('fontSize').value = JIMAKUData[index].fontSize;
			document.getElementById('scale').value = JIMAKUData[index].scale;
			document.getElementById('edgePx').value = JIMAKUData[index].edgePx;
			document.getElementById('fontColor').value = JIMAKUData[index].fontColor;
			document.getElementById('backColor').value = JIMAKUData[index].backColor;
			document.getElementById('edgeColor').value = JIMAKUData[index].edgeColor;
			document.getElementById('backAlpha').value = JIMAKUData[index].backAlpha;
			//非透過率の反映
			var num = Number(JIMAKUData[index].backAlpha);
			$("#backAlphaText")[0].innerHTML = Math.round(num / 255 * 100) + "%";　
		}

		function SaveOption(index) {
			JIMAKUData[index].name = document.getElementById('presetName').innerHTML;
			JIMAKUData[index].videoTrack = document.getElementById('video').value;
			JIMAKUData[index].audioTrack = document.getElementById('audio').value;
			JIMAKUData[index].x = document.getElementById('pos:x').value;
			JIMAKUData[index].y = document.getElementById('pos:y').value;
			JIMAKUData[index].fontSize = document.getElementById('fontSize').value;
			JIMAKUData[index].scale = document.getElementById('scale').value;
			JIMAKUData[index].edgePx = document.getElementById('edgePx').value;
			JIMAKUData[index].fontColor = document.getElementById('fontColor').value;
			JIMAKUData[index].backColor = document.getElementById('backColor').value;
			JIMAKUData[index].edgeColor = document.getElementById('edgeColor').value;
			JIMAKUData[index].backAlpha = document.getElementById('backAlpha').value;
		}

		function SaveJSON() {
			// CSInterfaceを使ってエクステンションのパスを取得
			var cs = new CSInterface();
			var path = cs.getSystemPath(SystemPath.EXTENSION) + JSONPath;

			var JSONData = JSON.stringify(JIMAKUData, null, '    ');
			var result = window.cep.fs.writeFile(path, JSONData);
			if (0 == result.err) {
				//alert("出力成功");
			} else {
				alert("保存失敗");
			}
		}

		function LoadJSON() {
			// CSInterfaceを使ってエクステンションのパスを取得
			var cs = new CSInterface();
			var path = cs.getSystemPath(SystemPath.EXTENSION) + JSONPath;

			var resultRead = window.cep.fs.readFile(path);
			if (0 == resultRead.err) { //成功
				JIMAKUData = JSON.parse(resultRead.data);
			} else { //失敗
				var callScript = '$._PPP_.updateEventPanel("' + "JIMAKUの初回起動" + '")';
				cs.evalScript(callScript);
				JIMAKUData.push(new JIMAKUparameter("---", 3, 3, 0.5, 0.5, 22, 260, 0, "#000000", "#000000", "#000000", 255));
				SaveJSON();
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
			SaveOption(Preset);
			var presetTable = document.getElementById('PresetTable');
			presetTable.rows[Preset].cells[0].innerText = JIMAKUData[Preset].name;
			SaveJSON();
		}

		function Start() {
			onLoaded();
			LoadJSON();
			Refresh();
		}

		function AddPreset() {
			var $row = $("#PresetTable tr:not(.inputButton):last");
			var $newRow = $row.clone(true);
			$newRow[0].cells[0].innerText = "---";
			$newRow.insertAfter($row);
			Preset = $("#PresetTable tr:not(.inputButton)").length - 1; //プリセットの合計-1
			JIMAKUData.push(new JIMAKUparameter("---", 3, 3, 0.5, 0.5, 22, 260, 0, "#000000", "#000000", "#000000", 255));
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



			$(".Presets").mCustomScrollbar({ //プリセットのスクロールバー
				autoHideScrollbar: true,
				theme: "dark"
			});

		});