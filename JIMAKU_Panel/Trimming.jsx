var seq = app.project.activeSequence;
var now = seq.getPlayerPosition();
var vTrack = seq.videoTracks[3];

var VinClip = $._PPP_.getClipFromeSequence("1.png", vTrack);
var endTime =VinClip.end;
endTime.seconds = 50;

var startTime =VinClip.start;
startTime.seconds = 10;
VinClip.start = startTime;
VinClip.end = endTime;