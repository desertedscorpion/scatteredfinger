(function(express, all, open, request, writeFile, exec){
    "use strict";
    return all([
	request("http://www.java2s.com/Code/JarDownload/localizer/localizer-1.9.jar.zip"),
	request("http://central.maven.org/maven2/commons-codec/commons-codec/1.9/commons-codec-1.9.jar")
    ]).then(function(files){
	return all(files.map(function(file){
	    return open("temp").then(function(temp){
		return writeFile(temp.path,file).then(function(success){
		    console.log(temp.path)
		    return temp.path;
		});
	    });
	}));
    }).then(function(fileNames){
	return fileNames.map(function(fileName){
	    return console.log(fileName);
	});
	/*
	return express()
	    .get("/rest/api/0/status/health", function(request, response){
		return response.json({
		    status: "OK"
		});
	    })
	    .get("/rest/api/0/jenkins/help", function(request, response){
		return exec().then(function(success){
		}, function(rageguy){
		});
	    })
	    .listen(28494)
	;
	*/
    }, function(rageguy){
    });
}(
    require("express"),
    require("q").all,
    require("promise-temp").open,
    require("request-promise"),
    require("fs-promise").writeFile,
    require("child-process-promise").exec)
);
