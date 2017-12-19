	var kPProPrivateProjectMetadataURI	= "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";

		var namefield	= "Column.Intrinsic.Name";
		var tapename	= "Column.Intrinsic.TapeName";
		var desc		= "Column.PropertyText.Description";
		var logNote    	= "Column.Intrinsic.LogNote";
		var newField	= "ExampleFieldName";
        
        if (ExternalObject.AdobeXMPScript === undefined) {
					ExternalObject.AdobeXMPScript	= new ExternalObject('lib:AdobeXMPScript');
				}
            
var projectItem	= app.project.rootItem.children[3];
var projectMetadata		= projectItem.getProjectMetadata();
var xmp	= new XMPMeta(projectMetadata);
var obj	= xmp.dumpObject();
var tapename="Column.PropertyText.Comment";
xmp.setProperty(kPProPrivateProjectMetadataURI, tapename, 	"480 x 274 (1.0), アルファ");

var array	= [tapename];

var str = xmp.serialize();
projectItem.setProjectMetadata(str, array);

alert (str)