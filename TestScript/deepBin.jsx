getDeepBin("JIMAKU/sound/A",true)

function getDeepBin(path,mkFlag){
    
    var spath = path.split("/");
    var root = app.project.rootItem;
     for (var i = 0; i < spath.length; i++) {
        root=getPPPInsertionBin(spath[i],root,mkFlag);
        if(!root){ return root; }
 }
return root;
    }

function getPPPInsertionBin (nameToFind,root,mkFlag) {
          
		var targetBin = searchForBinWithName(nameToFind,root);

		if (targetBin === undefined && mkFlag === true) {
			// If panel can't find the target bin, it creates it.
			root.createBin(nameToFind);
			targetBin = searchForBinWithName(nameToFind,root);
		}
    return targetBin;
	}

function searchForBinWithName (nameToFind,root) {
		// deep-search a folder by name in project
		var deepSearchBin = function (inFolder) {
			for (var i = 0; i < inFolder.children.numItems; i++) {
					if (inFolder.children[i] && inFolder.children[i].type === 2 &&  inFolder.children[i].name === nameToFind) {
						return inFolder.children[i];
					}
				}
			
			return undefined;
		};
		return deepSearchBin(root);
	}