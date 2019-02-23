
var A = getClip(app.project.rootItem,"Fade(word)");
A.setScaleToFrameSize();
alert (A.getOutPoint().seconds);
function getClip(root,name){
        for (var i=root.children.numItems-1;i>=0;i--){
                if(root.children[i].type==ProjectItemType.BIN){
                        target=getClip(root.children[i],name);
                        if(target != 0){ return target;}
                 }
                if(root.children[i].type==ProjectItemType.CLIP){
                        if(root.children[i].name == name){ return root.children[i];}
                 }
            }
        return 0;
 }