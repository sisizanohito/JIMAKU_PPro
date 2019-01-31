function LoadPSD(path) {
    var data;
    try {
        var list = FS.readdirSync(path);
        for (var i = 0; i < list.length; i++) {
            var FilePath = PATH.join(path, list[i]);
            if (isFile(FilePath)) {
                //console.log(list[i]);
                var extname = PATH.extname(list[i]);
                switch (extname) {
                    case ".psd": //仮
                        var psd = PSD.fromFile(FilePath);
                        psd.parse();
                        data = psd;
                        break;
                    default:
                        console.log("対応したファイルではありません");
                        break;
                }
            }
        }
    } catch (err) {
        console.error(err);
        console.error("モデルファイル一覧の取得に失敗しました(PSD)");
        return;
    }
    return data;
}

function PSDSet() {
    var model = GetModel(JIMAKUData[Preset].modelname);
    if (!model) { //モデルが読み込めないなら
        return;
    }
    var psd = model.data;
    var root = psd.tree();
    var nodePath = $(this).val();
    var child = root.childrenAtPath(nodePath)[0];
    var layer = child.get("layer");

    if ($(this).is(':checked')) {
        layer.visible = true;
        layer.blendMode.visible = true;
        if ($(this).attr('type') === "radio") {
            var children = child.siblings();
            var split = nodePath.split("/");
            var nodeName = split[split.length - 1];
            children.forEach(function (node) {
                var name = node.get("name");
                var top = name.slice(0, 1); //先頭文字
                if(top !== "*"){return;}//*のみ処理する
                layer = node.get("layer");
                if (node.name === nodeName) {
                    layer.visible = true;
                    layer.blendMode.visible = true;
                } else {
                    layer.visible = false;
                    layer.blendMode.visible = false;
                }
            });
        }
    } else {
        layer.visible = false;
        layer.blendMode.visible = false;
    }

    ShowImage();
}


function CreateNode(name, radioID, groupFlag, value) {
    var $node;
    var model = GetModel(JIMAKUData[Preset].modelname);
    if (!model) { //モデルが読み込めないなら
        return;
    }
    var psd = model.data;
    var tree = psd.tree();
    var child = tree.childrenAtPath(value)[0];
    var layer = child.get("layer");
    var visible = layer.visible;

    if (groupFlag) { //type group
        $node = $("<div>", {
            name: name,
            "class": "TreeNode"
        });
    } else { //それ以外
        $node = $("<div>", {
            name: name,
            "class": "TreeLeaf"
        });
    }
    var top = name.slice(0, 1); //先頭文字
    var $input;
    switch (top) {
        case "*":
            name = name.slice(1);
            $input = $("<input>", {
                type: "radio",
                name: radioID,
                value: value
            });
            break;
        case "!":
            name = name.slice(1);
            $input = $("<input>", {
                type: "checkbox",
                value: value
            });
            $input.hide();
            break;
        default:
            $input = $("<input>", {
                type: "checkbox",
                value: value
            });
            break;
    }
    if(layer.clipped){
        name = "↓:"+name;
    }
    $input.on('change', PSDSet);
    var $label = $("<labl>", {
        text: name
    });
    if (visible) {
        $input.prop("checked", true);
    }
    $node.append($input);
    $node.append($label);
    return $node;
}


function SearchTree(node, index, splitPath, groupFlag) {
    if (splitPath.length > index) {
        var name = splitPath[index];
        var target = node.children('[name="' + name + '"]');
        var radioID = "";
        var value = "";
        for (var i = index; i >= 0; i--) {
            value = PATH.posix.join(splitPath[i], value);
        }
        for (var i = index-1; i >= 0; i--) {
            radioID = PATH.posix.join(splitPath[i], radioID);
        }
        if (target.length === 0) { //見つからなかった場合
            if (index === splitPath.length - 1) { //終端の場合
                target = CreateNode(name, radioID, groupFlag, value);
            } else { //途中の場合
                target = CreateNode(name, radioID, true, value);
            }
            node.append(target);
        }
        index++;
        SearchTree(target, index, splitPath, groupFlag);
    }
    return;
}

function CreatePSDTree() {
    var model = GetModel(JIMAKUData[Preset].modelname);
    if (!model) { //モデルが読み込めないなら
        return;
    }
    var psd = model.data;
    var root = psd.tree();
    DeepPSD(root, "");
}

function DeepPSD(node, name) {
    if (!node.isRoot()) { //ルートじゃなかったら
        name = name + "/" + node.get('name');
        CreateTreeElement(name, node.hasChildren());
    }
    if (node.hasChildren()) { //子を持っているなら
        var children = node.children();
        for (var i = 0; i < children.length; i++) {
            DeepPSD(children[i], name);
        }
    }
    return;
}

function CreateTreeElement(path, groupFlag) {
    var splitPath = path.split("/");
    splitPath.shift(); //先頭の空白を削除
    //console.log(splitPath);
    var root = $('#ImageTree');
    SearchTree(root, 0, splitPath, groupFlag);
    return;
}