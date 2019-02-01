var b = app.project.activeSequence.videoTracks[1].clips[0];
var d = b.getMGTComponent();
var e= d.properties.getParamForDisplayName("ソーステキスト");
var c = e.getValue();

var a =JSON.parse(c);
a.fonteditinfo.fontEditValue = "MeiryoUI";
a.textEditValue = "こんにちは";
var f=JSON.stringify(a);
app.project.activeSequence.videoTracks[1].clips[0].components[2].properties[0].setValue(f);
