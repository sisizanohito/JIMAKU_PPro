$._PPP_={

	getVersionInfo : function() {
		return 'PPro ' + app.version + 'x' + app.build;
	},

	getUserName : function() {
		var	homeDir		= new File('~/');
		var	userName	= homeDir.displayName;
		homeDir.close();
		return userName;
	},

	keepPanelLoaded : function() {
		app.setExtensionPersistent("name.sisiza.JIMAKU", 0); // 0, while testing (to enable rapid reload); 1 for "Never unload me, even when not visible."
	},

	updateGrowingFile : function() {
		var numItems	= app.project.rootItem.children.numItems;
		for (var i = 0; i < numItems; i++){
			var currentItem = app.project.rootItem.children[i];
			if (currentItem){
				currentItem.refreshMedia();
			}
		}
	},

	getSep : function() {
		if (Folder.fs == 'Macintosh') {
			return '/';
		} else {
			return '\\';
		}
	},

	searchForBinWithName : function (nameToFind) {
		// deep-search a folder by name in project
		var deepSearchBin = function(inFolder) {
		  if (inFolder && inFolder.name === nameToFind && inFolder.type === 2) {
		    return inFolder;
		  } else {
		    for (var i = 0; i < inFolder.children.numItems; i++) {
		      if (inFolder.children[i] && inFolder.children[i].type === 2) {
		        var foundBin = deepSearchBin(inFolder.children[i]);
		        if (foundBin) return foundBin;
		      }
		    }
		  }
		  return undefined;
		};
		return deepSearchBin(app.project.rootItem);
	},


	updateEventPanel : function(message) {
		app.setSDKEventMessage(message, 'info');
		//app.setSDKEventMessage('Here is some information.', 'info');
		//app.setSDKEventMessage('Here is a warning.', 'warning');
		//app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.
	},

	message : function (msg) {
		$.writeln(msg);	 // Using '$' object will invoke ExtendScript Toolkit, if installed.
	},
	
	getPPPInsertionBin : function () {
		var nameToFind = "JIMAKU";

		var targetBin	= $._PPP_.searchForBinWithName(nameToFind);

		if (targetBin === 0) {
			// If panel can't find the target bin, it creates it.
			app.project.rootItem.createBin(nameToFind);
			targetBin	= $._PPP_.searchForBinWithName(nameToFind);
		}
		if (targetBin) {
			targetBin.select();
			return targetBin;
		}
	},

	getClip : function(root,name){
			for (var i=root.children.numItems-1;i>=0;i--){
					if(root.children[i].type==ProjectItemType.BIN){
							target=$._PPP_.getClip(root.children[i],name);
							if(target != 0){ return target;}
					}
					if(root.children[i].type==ProjectItemType.CLIP){
							if(root.children[i].name == name){ 
								return root.children[i];
							}
					}
				}
			return 0;
	},

	getClipFromeSequence : function(name,Track){
		for (var i=Track.clips.numItems-1;i>=0;i--){
			var clip =Track.clips[i];
			if(clip.name == name){ 
				return clip; 
				} 
		}
		return 0;
	},
	replaceTemplate : function(template,text,begin,end,x,y,bColor,fColor,size){
		template=template.replace(/#text#/g , text) ;
        template=template.replace(/#begin#/g , begin) ;
        template=template.replace(/#end#/g , end) ;
        template=template.replace(/#X#/g , x) ;
        template=template.replace(/#Y#/g , y) ;
		template=template.replace(/#backgroundColor#/g , bColor) ;
		template=template.replace(/#fontColor#/g , fColor) ;
		template=template.replace(/#size#/g , size) ;
        return template;
	},

	toHms : function(t) {
		var hms = "";
		var h = t / 3600 | 0;
		var m = t % 3600 / 60 | 0;
		var s = t % 60;

			hms = $._PPP_.padZero(h) + ":" + $._PPP_.padZero(m) + ":" + $._PPP_.padZero(s.toFixed(3));

		return hms;
	},

	padZero : function(v) {
			if (v < 10) {
				return "0" + v;
			} else {
				return v;
			}
	},

	TransPath : function(path) {
			var sep = '\\\\';
			path = path.replace(/\//g, sep);
			return path;
	},

	importWav : function(tmpPath,videoTrack,soundTrack,x,y,bColor,fColor,size,scale) {
		if (app.project) {
			var fileOrFilesToImport	= File.openDialog (	"音声を選んでください", 	// title
														"*.wav", 							// filter available files? 
														true); 						// allow multiple?

			// New in 11.1; you can determine which bin will be targeted, before importing.

			var currentTargetBin = app.project.getInsertionBin();

			if (currentTargetBin.nodeId === app.project.rootItem.nodeId){
				// If we're here, then the target bin is the root of the project.
			}
			if (fileOrFilesToImport) {
				// Of course, panels are welcome to override that default insertion bin behavior... :)
				var targetBin = $._PPP_.getPPPInsertionBin();
				if (targetBin) {
					targetBin.select();
					// We have an array of File objects; importFiles() takes an array of paths.
					var importThese = [];
					var importJimaku = [];
					var exportText = [];
					var fileInfo = File(tmpPath);
					fileInfo.open ("r");
					var template = fileInfo.read();
					fileInfo.close();
					if (importThese){
						for (var i = 0; i < fileOrFilesToImport.length; i++) {
							importThese[i] = fileOrFilesToImport[i].fsName;
							var fs = importThese[i].split('.');
							fs[fs.length -1]="txt";
							var importText = fs.join(".");
							fs[fs.length -1]="xml";
							exportText[i] = fs.join(".");
							var ftext = File(importText);
							ftext.open ("r");
							importJimaku[i] = ftext.read();														
							ftext.close();
						}
						app.project.importFiles(importThese, 
												1,				// suppress warnings 
												targetBin,
												0);				// import as numbered stills


					}
					var seq = app.project.activeSequence;
					var now = seq.getPlayerPosition();
					var aTrack = seq.audioTracks[soundTrack];
					var vTrack = seq.videoTracks[videoTrack];
					for (var i = 0; i < importThese.length; i++) {
							var file_name = importThese[i].substring(importThese[i].lastIndexOf('\\')+1, importThese[i].length);
							var targetClip=$._PPP_.getClip(app.project.rootItem,file_name);
							aTrack.insertClip(targetClip, now);
							
							var AinClip=$._PPP_.getClipFromeSequence(file_name,aTrack);
							var dtime= $._PPP_.toHms(AinClip.duration.seconds);
							var myFile= File(exportText[i]);
							myFile.encoding = "UTF-8";
							myFile.open ("w");
							var content=$._PPP_.replaceTemplate(template,importJimaku[i],"00:00:00.000",dtime,0 ,0,bColor,fColor,size);
							myFile.write(content);
							myFile.close();
							app.project.importFiles(exportText, 
												0,				// suppress warnings 
												targetBin,
												0);				// import as numbered stills
							file_name = exportText[i].substring(exportText[i].lastIndexOf('\\')+1, exportText[i].length);
							var targetClip=$._PPP_.getClip(app.project.rootItem,file_name);
							vTrack.insertClip(targetClip, now);
							var VinClip=$._PPP_.getClipFromeSequence(file_name,vTrack);
							var motion = VinClip.components[1];
							var motionPosition= motion.properties[0];
							var motionSize= motion.properties[1];
							motionPosition.setValue([x,y]);
							motionSize.setValue(scale);
					}
				} else {
					$._PPP_.updateEventPanel("Could not find or create target bin.");
				}
			} 
		}
	},
	
	JIMAKUColorPicker : function() {
		var hexToRGB = function(hex) {
		var r = hex >> 16;
		var g = hex >> 8 & 0xFF;
		var b = hex & 0xFF;
		return [r, g, b];
		};

		var color_decimal = $.colorPicker();
		var color_hexadecimal =color_decimal.toString(16);
		var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
		var color_fixHex = "#"+ ("0" + Number(color_rgb[0]).toString(16)).slice(-2) + ("0" + Number(color_rgb[1]).toString(16)).slice(-2) +("0" + Number(color_rgb[2]).toString(16)).slice(-2);
		return color_fixHex;
		//var color_that_ae_add_solid_understands = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255];
	},
};
