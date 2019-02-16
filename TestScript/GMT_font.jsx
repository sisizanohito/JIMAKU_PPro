var a = app.project.activeSequence.videoTracks[2].clips[0];
var b = a.getMGTComponent();
var c= b.properties.getParamForDisplayName("ソーステキスト");
var d = c.getValue();

var e =JSON.parse(d);
e.fonteditinfo.fontEditValue = "MeiryoUI";
e.textEditValue = "こんにちは";
var f=JSON.stringify(e);
app.project.activeSequence.videoTracks[1].clips[0].components[2].properties[0].setValue(f);
