var a =JSON.parse(app.project.activeSequence.videoTracks[2].clips[0].components[2].properties[0].getValue());
a.fonteditinfo.fontEditValue = "MeiryoUI";
a.textEditValue = "こんにちは";
var b=JSON.stringify(a);
app.project.activeSequence.videoTracks[2].clips[0].components[2].properties[0].setValue(b);