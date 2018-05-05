var seq = app.project.activeSequence;
var now = seq.getPlayerPosition();
var vTrack = seq.videoTracks[2];
var VinClip = $._PPP_.getClipFromeSequence("00_ONE_うわぁ.xml", vTrack);
seq.setPlayerPosition(VinClip.end.ticks)