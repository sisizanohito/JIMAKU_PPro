//#include "PPro_API_Constants.jsx"

$._PPP_ = {

	getVersionInfo: function () {
		return 'PPro ' + app.version + 'x' + app.build;
	},

	getUserName: function () {
		var homeDir = new File('~/');
		var userName = homeDir.displayName;
		homeDir.close();
		return userName;
	},

	getProjectName: function () {
		return app.project.name;
	},

	keepPanelLoaded: function () {
		app.setExtensionPersistent("name.sisiza.JIMAKU", 0); // 0, while testing (to enable rapid reload); 1 for "Never unload me, even when not visible."
	},

	updateGrowingFile: function () {
		var numItems = app.project.rootItem.children.numItems;
		for (var i = 0; i < numItems; i++) {
			var currentItem = app.project.rootItem.children[i];
			if (currentItem) {
				currentItem.refreshMedia();
			}
		}
	},

	getSep: function () {
		if (Folder.fs == 'Macintosh') {
			return '/';
		} else {
			return '\\';
		}
	},
	hexToRgb : function(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	},

	updateEventPanel: function (message) {
		//$.writeln(message);
		app.setSDKEventMessage(message, 'info');
		//app.setSDKEventMessage('Here is some information.', 'info');
		//app.setSDKEventMessage('Here is a warning.', 'warning');
		//app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.
	},

	message: function (msg) {
		$.writeln(msg); // Using '$' object will invoke ExtendScript Toolkit, if installed.
	},

	getAudioTtackNum: function () {
		var Num = app.project.activeSequence.audioTracks.numTracks;
		return Num;
	},

	getVideoTrackNum: function () {
		var Num = app.project.activeSequence.videoTracks.numTracks;
		return Num;
	},

	getProjectPath: function () {
		var path = app.project.path;
		path = path.slice(4);
		var pattern = /^(.*\\)/g;
		var dir = path.match(pattern);
		$.writeln(dir);
		return dir;
	},

	getDeepBin: function (path, mkFlag) {
		var spath = path.split("/");
		var root = app.project.rootItem;
		for (var i = 0; i < spath.length; i++) {
			root = $._PPP_.getPPPInsertionBin(spath[i], root, mkFlag);
			if (!root) {
				return root;
			}
		}
		return root;
	},

	getPPPInsertionBin: function (nameToFind, root, mkFlag) {

		var targetBin = $._PPP_.searchForBinWithName(nameToFind, root);

		if (targetBin === undefined && mkFlag === true) {
			// If panel can't find the target bin, it creates it.
			root.createBin(nameToFind);
			targetBin = $._PPP_.searchForBinWithName(nameToFind, root);
		}
		return targetBin;
	},

	searchForBinWithName: function (nameToFind, root) {
		// deep-search a folder by name in project
		var deepSearchBin = function (inFolder) {
			for (var i = 0; i < inFolder.children.numItems; i++) {
				if (inFolder.children[i] && inFolder.children[i].type === 2 && inFolder.children[i].name === nameToFind) {
					return inFolder.children[i];
				}
			}

			return undefined;
		};
		return deepSearchBin(root);
	},

	getClip: function (root, name) {
		for (var i = root.children.numItems - 1; i >= 0; i--) {
			if (root.children[i].type == ProjectItemType.BIN) {
				target = $._PPP_.getClip(root.children[i], name);
				if (target != 0) {
					return target;
				}
			}
			if (root.children[i].type == ProjectItemType.CLIP) {
				if (root.children[i].name == name) {
					return root.children[i];
				}
			}
		}
		return 0;
	},

	getClipFromeSequence: function (name, Track) {
		for (var i = Track.clips.numItems - 1; i >= 0; i--) {
			var clip = Track.clips[i];
			if (clip.name == name) {
				var seq = app.project.activeSequence;
				var now = seq.getPlayerPosition();
				if( Number(clip.end.seconds)  >= Number(now.seconds-0.01) && Number(clip.start.seconds)  <= Number(now.seconds+0.01) ){
					return clip;
				}
				
			}
		}
		return 0;
	},
	replaceTemplate: function (template, text, begin, end, x, y, bColor, fColor, eColor, size, edgePx) {
		template = template.replace(/#text#/g, text);
		template = template.replace(/#begin#/g, begin);
		template = template.replace(/#end#/g, end);
		template = template.replace(/#X#/g, x);
		template = template.replace(/#Y#/g, y);
		template = template.replace(/#backgroundColor#/g, bColor);
		template = template.replace(/#fontColor#/g, fColor);
		template = template.replace(/#edgeColor#/g, eColor);
		template = template.replace(/#size#/g, size);
		template = template.replace(/#edgePx#/g, edgePx);
		return template;
	},

	toHms: function (t) {
		var hms = "";
		var h = t / 3600 | 0;
		var m = t % 3600 / 60 | 0;
		var s = t % 60;

		hms = $._PPP_.padZero(h) + ":" + $._PPP_.padZero(m) + ":" + $._PPP_.padZero(s.toFixed(3));

		return hms;
	},

	padZero: function (v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	},

	TransPath: function (path) {
		var sep = '\\\\';
		path = path.replace(/\//g, sep);
		return path;
	},

	importResources: function (targetBin) {

		var fileOrFilesToImport = File.openDialog("音声を選んでください", // title
			"*.wav", // filter available files? 
			false); // allow multiple?
		if (fileOrFilesToImport) {
			// Of course, panels are welcome to override that default insertion bin behavior... :)

			if (targetBin) {
				targetBin.select();
				// We have an array of File objects; importFiles() takes an array of paths.
				var data = {
					importThese: [],
					importJimaku: [],
					exportText: [],
				};
				data.importThese = fileOrFilesToImport.fsName;
				var fs = data.importThese.split('.');
				fs[fs.length - 1] = "txt";
				var importText = fs.join(".");
				fs[fs.length - 1] = "xml";
				data.exportText = fs.join(".");
				var ftext = File(importText);
				ftext.open("r");
				data.importJimaku = ftext.read();
				ftext.close();
				app.project.importFiles([data.importThese],
					1, // suppress warnings 
					targetBin,
					0); // import as numbered stills

				return data;
			} else {
				$._PPP_.updateEventPanel("Could not find or create target bin.");
				return undefined;
			}
		}
		return undefined;
	},

	importWavCaption: function (tmpPath, Preset, videoTrack, soundTrack, x, y, bColor, fColor, eColor, size, scale, edgePx) {
		if (app.project) {
			var targetBin = $._PPP_.getDeepBin("JIMAKU/"+Preset+"/voices&captions",true);
			var dataA = $._PPP_.importResources(targetBin);
			if (targetBin && dataA) {
				var seq = app.project.activeSequence;
				var now = seq.getPlayerPosition();
				var aTrack = seq.audioTracks[soundTrack];
				var vTrack = seq.videoTracks[videoTrack];

				var file_name = dataA.importThese.substring(dataA.importThese.lastIndexOf('\\') + 1, dataA.importThese.length);
				var targetClip = $._PPP_.getClip(targetBin, file_name);
				aTrack.insertClip(targetClip, now);

				var AinClip = $._PPP_.getClipFromeSequence(file_name, aTrack);
				var dtime = $._PPP_.toHms(AinClip.duration.seconds);

				var fileInfo = File(tmpPath);
				fileInfo.open("r");
				var template = fileInfo.read();
				fileInfo.close();

				var myFile = File(dataA.exportText);
				myFile.encoding = "UTF-8";
				myFile.open("w");
				var content = $._PPP_.replaceTemplate(template, dataA.importJimaku, "00:00:00.000", dtime, 0, 0, bColor, fColor, eColor, size, edgePx);
				myFile.write(content);
				myFile.close();
				app.project.importFiles([dataA.exportText],
					0, // suppress warnings 
					targetBin,
					0); // import as numbered stills

				file_name = dataA.exportText.substring(dataA.exportText.lastIndexOf('\\') + 1, dataA.exportText.length);
				var targetClip = $._PPP_.getClip(app.project.rootItem, file_name);
				vTrack.insertClip(targetClip, now);
				var VinClip = $._PPP_.getClipFromeSequence(file_name, vTrack);
				var motion = VinClip.components[1];
				var motionPosition = motion.properties[0];
				var motionSize = motion.properties[1];
				motionPosition.setValue([x/seq.frameSizeHorizontal, y/seq.frameSizeVertical]);
				motionSize.setValue(scale);
				seq.setPlayerPosition(VinClip.end.ticks);
			} else {
				$._PPP_.updateEventPanel("import Cancel");
			}
		}
	},

	/**
	 * @return {string}
	 */
	JIMAKUColorPicker: function (value) {
		var hexToRGB = function (hex) {
			var r = hex >> 16;
			var g = hex >> 8 & 0xFF;
			var b = hex & 0xFF;
			return [r, g, b];
		};
		var color_decimal = $.colorPicker(parseInt(value.slice(1), 16));
		if (color_decimal === -1) { //Cancel
			color_decimal = parseInt(value.slice(1), 16);
		}
		var color_hexadecimal = color_decimal.toString(16);
		var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
		return "#" + ("0" + Number(color_rgb[0]).toString(16)).slice(-2) + ("0" + Number(color_rgb[1]).toString(16)).slice(-2) + ("0" + Number(color_rgb[2]).toString(16)).slice(-2);
	},

	importWavCaptionMGT: function(wavPath,mogrtToImport , Preset, videoTrack, soundTrack, x, y, bColor, fColor, eColor, fontSize, scale, edgePx, fontAlpha, backAlpha, imageFlag, fadeInTime, fadeOutTime, showSpeed, captionAddTime){
		if (app.project) {
			var targetBin = $._PPP_.getDeepBin("JIMAKU/"+Preset+"/voices&captions",true);
			var dataA;
			if(wavPath===""){
				dataA = $._PPP_.importWav(targetBin);
			}else{
				dataA = $._PPP_.importWavpath(targetBin,wavPath);
			}
			
			if (dataA) {
				var mgtBin = $._PPP_.getDeepBin(MGT_BIN,true);
				var mgtClip = $._PPP_.getClip(mgtBin, "Fade(word)");
				if(mgtClip){
                    mgtClip.setOutPoint(0.1);
				}
				var mgt = $._PPP_.importMoGRT(mogrtToImport,videoTrack,soundTrack);
				if(!mgt){
					return;
				}
				var seq = app.project.activeSequence;
				var now = seq.getPlayerPosition();
				var aTrack = seq.audioTracks[soundTrack];
				var vTrack = seq.videoTracks[videoTrack];
				//inser Audio
				var file_name = dataA.importThese.substring(dataA.importThese.lastIndexOf('\\') + 1, dataA.importThese.length);
				var targetClip = $._PPP_.getClip(targetBin, file_name);
				aTrack.insertClip(targetClip, now);

				var AinClip = $._PPP_.getClipFromeSequence(file_name, aTrack);

				var moComp = mgt.getMGTComponent();
				mgt.name =dataA.importJimaku;
				if (moComp){
					var params			= 	moComp.properties;
					$._PPP_.setMGTColor(params,MGT_FONT_RGB,$._PPP_.hexToRgb(fColor),false);
					$._PPP_.setMGTColor(params,MGT_BACK_RGB,$._PPP_.hexToRgb(bColor),false);
					$._PPP_.setMGTColor(params,MGT_LINE_RGB,$._PPP_.hexToRgb(eColor),true);

					$._PPP_.setMGTText(params,MGT_TEXR,fontSize,dataA.importJimaku);//set text
					$._PPP_.setMGTParameter(params,MGT_SCALE,scale);//set scale
					$._PPP_.setMGTParameter(params,MGT_EDGE_SCALE,edgePx);//set edge px
					//$._PPP_.setMGTParameter(params,MGT_BACK_SCALE,bgScale);//set back scale
					$._PPP_.setMGTParameter(params,MGT_FONT_ALPHA,(fontAlpha/255)*100);//set font alpha
					$._PPP_.setMGTParameter(params,MGT_BACK_ALPHA,(backAlpha/255)*100);//set back alpha

					$._PPP_.setMGTParameter(params,MGT_SHOW_TIME,AinClip.duration.seconds+captionAddTime);//set show duration
					$._PPP_.setMGTParameter(params,MGT_FADEIN_TIME,fadeInTime);
					$._PPP_.setMGTParameter(params,MGT_FADEOUT_TIME,fadeOutTime);
					$._PPP_.setMGTParameter(params,MGT_SHOW_SPEED,showSpeed);
				}

				//Trim MGT
				var starttime = AinClip.start;
				var endtime = AinClip.end;
				endtime.seconds += captionAddTime;
				mgt.end = endtime;
				var motion = mgt.components[1];
				var motionPosition = motion.properties[0];
				var motionSize = motion.properties[1];
				motionPosition.setValue([x/seq.frameSizeHorizontal, y/seq.frameSizeVertical]);
				//motionSize.setValue(scale);
				if(imageFlag === "false"){
					endtime.seconds += 0.01;
					seq.setPlayerPosition(endtime.ticks);
				}
				return [mgt.start.ticks,mgt.end.ticks]
			} else {
				$._PPP_.updateEventPanel("import Cancel");
				
			}
		}
		return undefined;
	},
	

	importMoGRT: function (mogrtToImport,videoTrack,soundTrack) {
		var activeSeq = app.project.activeSequence;
		if (activeSeq) {
			if (mogrtToImport){
				var mgtBin = $._PPP_.getDeepBin(MGT_BIN,true);
				var mgtClip = $._PPP_.getClip(mgtBin, "Fade(word)");
				var targetTime		= activeSeq.getPlayerPosition();
				var vidTrackOffset  = videoTrack;
				var audTrackOffset	= soundTrack;
				var newTrackItem;
				
				if(mgtClip){
					var seq = app.project.activeSequence;
					var vTrack = seq.videoTracks[videoTrack];
					vTrack.insertClip(mgtClip,  targetTime);
					newTrackItem = $._PPP_.getClipFromeSequence("Fade(word)", vTrack);
				}else{
					newTrackItem 	= activeSeq.importMGT(	mogrtToImport, 
															targetTime.ticks, 
															vidTrackOffset,
															audTrackOffset);
				}

				
				
				if (newTrackItem){
					return newTrackItem;
				}
			} else {
				app.setSDKEventMessage('Unable to import ' + mogrtToImport + '.', 'error');  
			}
		} 
	},

	setMGTParameter:function(params,name,value){
		var srcTextParam =	params.getParamForDisplayName(name);
		if (srcTextParam){
			srcTextParam.setValue(value);
		}
	},

	setMGTText:function(params,name,fontSize,text){
		var TJSON = '{"fonteditinfo":{"capPropFontEdit":true,"capPropFontFauxStyleEdit":true,"capPropFontSizeEdit":true,"fontEditValue":"MeiryoUI","fontFSAllCapsValue":false,"fontFSBoldValue":false,"fontFSItalicValue":false,"fontFSSmallCapsValue":false,"fontSizeEditValue":180},"textEditValue":""}';
		var srcTextParam =	params.getParamForDisplayName(name);
		if (srcTextParam){
			var textJSON =JSON.parse(TJSON);
			//var textJSON =JSON.parse(srcTextParam.getValue());
			//textJSON.fonteditinfo.fontEditValue = "MeiryoUI";
			textJSON.textEditValue = text;
			textJSON.fonteditinfo.fontSizeEditValue = fontSize;
			srcTextParam.setValue(JSON.stringify(textJSON));
			//srcTextParam.setValue(value);
		}
	},

	setMGTColor:function(params,name,value,update){
		var srcTextParam =	params.getParamForDisplayName(name);
		if (srcTextParam){
			srcTextParam.setColorValue(1,value.r,value.g,value.b,update);
		}
	},

	importWav: function (targetBin) {
		var fileOrFilesToImport = File.openDialog("音声を選んでください", // title
			"*.wav", // filter available files? 
			false); // allow multiple?
		if (fileOrFilesToImport) {
			if (targetBin) {
				targetBin.select();
				var data = {
					importThese: [],
					importJimaku: [],
				};
				data.importThese = fileOrFilesToImport.fsName;
				var fs = data.importThese.split('.');
				fs[fs.length - 1] = "txt";
				var importText = fs.join(".");
				var ftext = File(importText);
				ftext.open("r");
				data.importJimaku = ftext.read();
				ftext.close();
				app.project.importFiles([data.importThese],
					1, // suppress warnings 
					targetBin,
					0); // import as numbered stills
				return data;
			} else {
				$._PPP_.updateEventPanel("Could not find or create target bin.");
				return undefined;
			}
		}
		return undefined;
	},

	importWavpath: function (targetBin,path) {
		var fileOrFilesToImport = path;
		if (fileOrFilesToImport) {
			if (targetBin) {
				targetBin.select();
				var data = {
					importThese: [],
					importJimaku: [],
				};
				data.importThese = fileOrFilesToImport;
				var fs = data.importThese.split('.');
				fs[fs.length - 1] = "txt";
				var importText = fs.join(".");
				var ftext = File(importText);
				ftext.open("r");
				data.importJimaku = ftext.read();
				ftext.close();
				app.project.importFiles([data.importThese],
					1, // suppress warnings 
					targetBin,
					0); // import as numbered stills
				return data;
			} else {
				$._PPP_.updateEventPanel("Could not find or create target bin.");
				return undefined;
			}
		}
		return undefined;
	},

	checkImage: function (model_name,file_name) {
		if (app.project) {
			var targetBin = $._PPP_.getDeepBin("JIMAKU/model/"+model_name,true);
			if (targetBin) {
				var clip =$._PPP_.getClip(targetBin, file_name);
				if(!clip){
					return false;
				}else{
					return true;
				}
			}
		}
		return false;
	},

	ImportImage: function(model_name,file_path){
		if (app.project) {
			var targetBin = $._PPP_.getDeepBin("JIMAKU/model/"+model_name,true);
			if (targetBin) {
				app.project.importFiles([file_path],
					1, // suppress warnings 
					targetBin,
					0); // import as numbered stills
			}
		}
	},

	InsertImage: function(model_name,clipName , videoTrack, x, y, scale,startTime,endTime){
		if (app.project) {
			var targetBin = $._PPP_.getDeepBin("JIMAKU/model/"+model_name,true);
			if (targetBin) {
				
				var seq = app.project.activeSequence;
				var now = seq.getPlayerPosition();
				var vTrack = seq.videoTracks[videoTrack];
				//insert
				var targetClip = $._PPP_.getClip(targetBin, clipName);
				targetClip.setOutPoint(0.05);
				now.ticks = String(startTime);
				vTrack.insertClip(targetClip, now);
				
				//Trim MGT
				var VinClip = $._PPP_.getClipFromeSequence(clipName, vTrack);
				VinClip.name = model_name+clipName;
				var Vendtime = VinClip.end;
				Vendtime.ticks =  String(endTime);
				VinClip.end = Vendtime;

				var motion = VinClip.components[1];
				var motionPosition = motion.properties[0];
				var motionSize = motion.properties[1];
				motionPosition.setValue([x/seq.frameSizeHorizontal, y/seq.frameSizeVertical]);
				motionSize.setValue(scale);
				Vendtime.seconds += 0.01;
				seq.setPlayerPosition(Vendtime.ticks);
			} else {
				$._PPP_.updateEventPanel("import Cancel");
			}
		}
	}
};