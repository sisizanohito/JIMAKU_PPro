var wnd= (this instanceof Panel) ? this : new Window('palette', 'Auto Slide Show', undefined, {resizeable: true});
var okBtn = wnd.add("button", [55, 100, 140, 135], "OK");
var cancelBtn = wnd.add("button", [155, 100, 240, 135], "Cancel");

if (winObj instanceof Window) {  
wnd.center();  
wnd.show();  
} else {  
wnd.layout.layout(true);  
wnd.layout.resize();  
}  

okBtn.onClick = function(){
    alert("OK !");
}
cancelBtn.onClick = function(){
    wnd.close();
}
