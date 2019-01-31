
var barElement;

function SetElement(event) {
    var csInterface = new CSInterface();
    barElement = $(event)[0];
    csInterface.evalScript('$._PPP_.JIMAKUColorPicker("' + barElement.value + '")', SetValue);
}

function SetValue(result) {
    //console.log(result)
    barElement.value = result;
}

function SetVideo() {
    var csInterface = new CSInterface();
    csInterface.evalScript('$._PPP_.getVideoTrackNum()', SetVideoOption);
}

function SetAudio() {
    var csInterface = new CSInterface();
    csInterface.evalScript('$._PPP_.getAudioTtackNum()', SetAudioOption);
}

function SetVideoOption(result) {
    var element = document.getElementById('video');
    var value = JIMAKUData[Preset].videoTrack;
    SetSelect(value, result, element);
    element = document.getElementById('Image_video');
    value = JIMAKUData[Preset].imageVideoTrack;
    SetSelect(value, result, element);
}

function SetAudioOption(result) {
    var element = document.getElementById('audio');
    var value = JIMAKUData[Preset].audioTrack;
    SetSelect(value, result, element);
}

function SetSelect(value,result, element) {
    var index = value;
    if (Number(index) > Number(result)) {
        index = result;
    }
    element.options.length = 0;
    for (var i = 1; i <= result; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", i);
        option.innerHTML = i;
        element.appendChild(option);
    }
    element.value = index;
}

function SetSelectModel() {
    var element = document.getElementById('Image_model');
    var index = element.value;
    if (Number(index) > ModelData.length) {
        index = ModelData.length;
    }
    element.options.length = 0;
    for (var i = 1; i <= ModelData.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", i);
        option.innerHTML = ModelData[i - 1].name;
        element.appendChild(option);
    }
    element.value = index;
}

function removeChildren(x) {
    if (x.hasChildNodes()) {
        while (x.childNodes.length > 0) {
            x.removeChild(x.firstChild)
        }
    }
}

