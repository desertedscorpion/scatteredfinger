(function(express, all, spawn, request, open, mkdir, writeFile, readdir, join, defer){
    "use strict";
    var statics = function(){
	var deferred = defer();
	deferred.resolve([
	    "/usr/share/jenkins/webroot/WEB-INF/jenkins-cli.jar",
	    "/usr/share/jenkins/webroot/WEB-INF/remoting.jar",
	    "/usr/share/jenkins/webroot/WEB-INF/slave.jar",
	    "/usr/share/jenkins/webroot/WEB-INF/classes:localizer-1.9.jar"
	]);
	return deferred.promise;
    };
    return all([
	open("").then(function(zipFile){
	    return spawn("curl", ["--output", zipFile.path, "http://www.java2s.com/Code/JarDownload/localizer/localizer-1.9.jar.zip"]).then(function(){
		return mkdir("").then(function(directory){
		    return spawn("unzip", ["-d", directory, zipFile.path]).then(function(){
			return readdir(directory).map(function(file){
			    return join(directory,file);
			});
		    });
		});
	    });
	}),
	request("http://central.maven.org/maven2/commons-codec/commons-codec/1.9/commons-codec-1.9.jar").then(function(codec){
	    return open("temp").then(function(temp){
		return writeFile(temp.path,codec).then(function(){
		    return [temp.path];
		});
	    });
	}),
	statics()
    ]).then(function(fileNames){
	return [].concat.apply([], fileNames).join(":");
    }).then(function(fileNames){
	return express()
	    .get("/rest/api/0/status/health", function(request, response){
		return response.json({
		    status: true
		});
	    })
	    .get("/rest/api/0/jenkins/help", function(request, response){
		return spawn("java", ["-classpath", fileNames, "hudson.cli.CLI", "help"]).then(function(success){
		    return response.json({
			status: true,
			out: success.stdout,
			err: success.stderr
		    });
		}, function(rageguy){
		    return response.json({
			status: false,
			error: JSON.stringify(rageguy)
		    });
		});
	    })
	    .listen(28494)
	;
    }, function(rageguy){
	console.log("PROBLEM");
	console.log(rageguy);
    });
}(
    require("express"),
    require("q").all,
    require("child-process-promise").spawn,
    require("request-promise"),
    require("promise-temp").open,
    require("promise-temp").mkdir,
    require("fs-promise").writeFile,
    require("fs-promise").readdir,
    require("path").join,
    require("q").defer
));
