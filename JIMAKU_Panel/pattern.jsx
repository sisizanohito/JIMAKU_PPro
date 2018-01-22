var path = app.project.path;
path =path .slice (4)
var pattern = /^(.*\\)/g;
var dir = path.match(pattern);