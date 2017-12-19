var fileInfo = File("C:\\Users\\isiis\\Documents\\PProPluginProject\\JIMAKU_Panel\\Template.xml");
alert (fileInfo.path);
fileInfo.open ("r");
var text = fileInfo.read();

alert (replaceTemplate(text,"ああ","00:00:00.000","00:00:10","10%" ,"40.925925925925924%"));
fileInfo.close();

  var myFile=File("C:\\Users\\isiis\\Desktop\\run.xml");
  myFile.open ("w");
  var content="ABCDEF";
  myFile.write(content);
  myFile.close();

function replaceTemplate(template,text,begin,end,x,y){
        template=template.replace(/#text#/g , text) ;
        template=template.replace(/#begin#/g , begin) ;
        template=template.replace(/#end#/g , end) ;
        template=template.replace(/#X#/g , x) ;
        template=template.replace(/#Y#/g , y) ;
        return template;
	}