const PATH = require('path');
const PSD = require('psd');
const FS = require('fs');
const RMDIR = require('rmdir');
const FILECOPY = require('filecopy')
const JSONPath = "/JIMAKU.json";
const VOICEJSONPath = "/VOICE/VOICE.json";
const VOICESavePath = "/VOICE";
const ModelJSONPath = "/model.json";
const MODELPath = "/model";
const VOICEPath  = "/voice/Voice.exe";
const MKDIRP = require('mkdirp');
const EXEC = require('child_process').exec;


var JIMAKUparameter = function (name, videoTrack, audioTrack, x, y, fontSize, scale, edgePx, fontColor, backColor, edgeColor, fontAlpha,backAlpha,
                                imageVideoTrack, imageX, imageY, imageScale, imageCheck, fadeInTime, fadeOutTime, showSpeed, captionAddTime, inverse) {
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
    this.fontAlpha = fontAlpha;
    this.backAlpha = backAlpha;
    this.imageVideoTrack = imageVideoTrack
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageScale = imageScale;
    this.imageCheck = imageCheck;
    this.fadeInTime = fadeInTime;
    this.fadeOutTime = fadeOutTime;
    this.showSpeed = showSpeed;
    this.captionAddTime = captionAddTime;
    this.inverse = inverse;

    this.modelname = "";
    this.actor = "";
    this.voice;
}
var Preset = 0; // Presetの指定
var JIMAKUData = []; // 空の配列

//モデルタイプ
const Model_PSD = 0;
const Model_ZIP = 1;
const Model_KYARA = 2;
var Model = function (name, data, parameter) {
    this.name = name;
    this.data = data;
    this.parameter = parameter;
}
var ModelParameter = function (type) {
    this.type = type;
    this.ImageDB = {};
}
var ModelData = [];

var ModelTree = function (text) {
    this.text = text;
    this.children = [];
}
var TreeData=[];

var startTime = 0;
var endTime = 0;

var VOICEData = [];
var VOICE = function (data) {
    var cs = new CSInterface();
    this.savePath = PATH.join(cs.getSystemPath(SystemPath.MY_DOCUMENTS) ,"JIMAKU", VOICESavePath);
    this.actor = data;
}