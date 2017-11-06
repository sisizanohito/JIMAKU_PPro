var first = app.project.rootItem.children[2];
var seq = app.project.activeSequence;
var aTrack1 = seq.audioTracks[2];
aTrack1.insertClip(first, '00;00;00;00');
