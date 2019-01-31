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

//pngデータをBase64に変換
function toBase64(png) {
    var canvas, context, i, imageData, j, len, pixel, pixelData, ref;
    canvas = document.createElement('canvas');
    canvas.width = png.width;
    canvas.height = png.height;
    context = canvas.getContext('2d');
    imageData = context.getImageData(0, 0, png.width, png.height);
    pixelData = imageData.data;
    ref = png.data;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
        pixel = ref[i];
        pixelData[i] = pixel;
    }
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
}



var Loader = function(expectedCnt, callback){
    var cnt = 0;
    return function(){
        if(++cnt == expectedCnt){ callback(); }
    }
};

//mask画像と主に
function toBase64Mask(orign,mask,width,height) {
    var canvas, context, i, j, len, pixel, pixelData, ref;
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    var imageData = new Image(orign.image.width(), orign.image.height());
    imageData.src =toBase64(orign.image.toPng()); ;
    var maskData = new Image(mask.image.width(), mask.image.height());
    maskData.src=toBase64(mask.image.toPng());

    var Data = new Image();
    Data.width = width;
    Data.height = height;
    monitorLoad.counter += 1;
    var imageObject = {image:Data, left:0, top:0, alpha:orign.opacity, blendMode:orign.blendingMode()};
    ImageList.push(imageObject);
    Data.addEventListener('load', function(){
        monitorLoad.counter -= 1;
    });
    //Data.name = node.get("name");

    var loader = Loader(2, function(){
        context.drawImage(imageData, orign.left, orign.top);
        context.globalCompositeOperation = 'destination-in';
        context.drawImage(maskData, mask.left, mask.top);
        Data.src = canvas.toDataURL('image/png');
    });

    imageData.onload = loader;
    maskData.onload = loader;
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


var ImageList = [];
function ShowPSD(node) {
    ImageList = [];
    console.log(node.export());
    var width = node.root().get('width');
    var height = node.root().get('height');
    var canvas = addCanvas(width, height);
    monitorLoad.counter += 1;
    if($("#ImageInverse").prop("checked")){
        DrawPSD(node,"Inverse");
    }else{
        DrawPSD(node,"Root");
    }
    monitorLoad.counter -= 1;
}


// Decoding base-64 image
function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}

function DrawPSD(node,name) {
    var layer = node.get("layer");
    var type = node.get("type");
    if (!node.isRoot()) { //ルートじゃないなら
        if (!layer.visible) return; //描画しない
    }
    if (node.hasChildren()) { //子を持っているなら
        var children = node.children();
        for (var i = children.length - 1; i >= 0; i--) {
            var new_name = name +'_'+ i.toString();
            DrawPSD(children[i],new_name);
        }
    } else if(type === "layer") { //レイヤーなら
        //console.log(name + " : " + node.get('type'));
        var width = node.root().get('width');
        var height = node.root().get('height');
        var layerWidth = layer.image.width();
        var layerHeight = layer.image.height();
        var canvas = $("#Layer0");
        canvas.attr('name', canvas.attr('name')+name+"#");
        var top = layer.top;
        var left = layer.left;
        var png = layer.image.toPng();
        if(layer.image.width() == 0 || layer.image.height() ==0){//空白画像
            return;
        }
        var dataUrl;
        var image = new Image();

        if(layer.clipped){
            var masknode = SearchMask(node);
            var masklayer = masknode.get("layer");
            if(!masklayer.visible || masklayer.image.width() == 0 || masklayer.image.height() ==0){//マスクが描画されていなと描画しない
                return;
            }
            var maskpng = masklayer.image.toPng();
            toBase64Mask(layer,masklayer,width,height);
            //console.log(node.get("name")+":mask->"+masknode.get("name"));
            return;
        }else{
            dataUrl=toBase64(png);
        }
        image.width = layerWidth;
        image.height = layerHeight;
        monitorLoad.counter += 1;
        var imageObject = {image:image, left:left, top:top, alpha:layer.opacity, blendMode:layer.blendingMode()};
        ImageList.push(imageObject);
        image.addEventListener('load', function(){
            monitorLoad.counter -= 1;
        });
        image.src = dataUrl;
        //image.name = node.get("name");
    }
    return;
}

function SearchMask(node){
    if(!node.get("layer").clipped){//クリッピングじゃないやつ
        return node;
    }
    var next = node.nextSibling();
    if(next){//端でない限り
        return SearchMask(next);
    }
    return undefined;
}

function addCanvas(width, height) {
    var id = "Layer" + $("#ImageArea *").length.toString();
    $("#ImageArea").append(
        $('<canvas></canvas>')
            .addClass("Image")
            .attr('id', id)
            .attr('width', width)
            .attr('height', height)
            .attr('name', '')
    );
    var canvas = $("#" + id);
    if (!canvas || !canvas[0].getContext) {
        return null;
    }
    if($("#ImageInverse").prop("checked")){
        var ctx = canvas[0].getContext('2d');
        ctx.transform(-1, 0, 0, 1, width, 0);
    }
    return canvas;
}
