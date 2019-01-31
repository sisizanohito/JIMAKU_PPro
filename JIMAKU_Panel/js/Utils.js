
function ConvertFilePath(filepath){
    if(filepath===""||filepath==null){
        return filepath;
    }
    var csInterface = new CSInterface();
    var OSVersion = csInterface.getOSInformation();
    if (OSVersion.indexOf("Windows") >= 0) {
        console.log(filepath);
        var sep = '\\\\';
        filepath = filepath.replace(/\/|\\/g, sep);
        console.log(filepath);
    }
    return filepath;
}