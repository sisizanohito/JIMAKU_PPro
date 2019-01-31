
function ExportModel(result){
    if(result==="false"){
        ExportPNG(function (filepath) {
            var csInterface = new CSInterface();
            var model = GetModel(JIMAKUData[Preset].modelname);
            filepath = filepath.replace(/\\/g, "\\\\");
            csInterface.evalScript('$._PPP_.ImportImage("' + model.name + '","' + filepath + '")',insertModel);
        });
    }else{
        insertModel();
    }
}