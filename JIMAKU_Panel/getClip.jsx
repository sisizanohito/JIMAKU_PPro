
var A = getClip(app.project.rootItem,"001_ONE.wav");
alert (A.name);

function getClip(root,name){
        for (var i=root.children.numItems-1;i>=0;i--){
                if(root.children[i].type==ProjectItemType.BIN){
                        target=getClip(root.children[i]);
                        if(target != 0){ return target;}
                 }
                if(root.children[i].type==ProjectItemType.CLIP){
                        if(root.children[i].name == name){ return target;}
                        return root.children[i];
                 }
            }
        return 0;
 }