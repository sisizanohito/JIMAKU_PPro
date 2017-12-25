var first = app.project.rootItem.children[1];
var seq = app.project.activeSequence;
var aTrack1 = seq.audioTracks[2];
var vTrack1 = seq.videoTracks[1];
var clip1 = vTrack1.clips[0];
var vTrack3 = seq.videoTracks[2];
var clip3 = vTrack3.clips[0];
var com1 = clip3.components[0];
var com2 = clip3.components[1];
var pro= com2.properties[0];
pro.setValue([1.0,1.2]);
alert (pro.getValue())

var clipFat = getClipFromeSequence("001_ONE.wav");
var time=clipFat.duration;
//alert (time.seconds)

var fileInfo = File("C:\\Users\\isiis\\Documents\\PProPluginProject\\JIMAKU_Panel\\Template.xml");
//alert (fileInfo.path);
fileInfo.open ("r");
var text = fileInfo.read();

//alert (replaceTemplate(text,"ああ","00:00:00.000",toHms(time.seconds),"10%" ,"40.925925925925924%"));
fileInfo.close();

function replaceTemplate(template,text,begin,end,x,y){
        template=template.replace(/#text#/g , text) ;
        template=template.replace(/#begin#/g , begin) ;
        template=template.replace(/#end#/g , end) ;
        template=template.replace(/#X#/g , x) ;
        template=template.replace(/#Y#/g , y) ;
        return template;
	}

function getClipFromeSequence(name){
    var seq = app.project.activeSequence;
    var  audio= seq.audioTracks[2];
    for (var i=audio.clips.numItems-1;i>=0;i--){
        var clip =audio.clips[i];
        if(clip.name == name){ return clip; } 
    }
    return 0;
}

function toHms(t) {
	var hms = "";
	var h = t / 3600 | 0;
	var m = t % 3600 / 60 | 0;
	var s = t % 60;

		hms = padZero(h) + ":" + padZero(m) + ":" + padZero(s.toFixed(3)) + ":";

	return hms;

	function padZero(v) {
		if (v < 10) {
			return "0" + v;
		} else {
			return v;
		}
	}
}

