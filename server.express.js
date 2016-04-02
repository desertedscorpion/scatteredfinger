(function(express, all, open, request, writeFile, exec, Parse, Readable, defer, createWriteStream){
    "use strict";
    var unzip = function(zip){
	var deferred = defer();
	/*
	var s = new Readable();
	s.push(zip);
	s.push(null);
	s.pipe(Parse()).on("entry", function(entry, error){
	    if(error){
		return deferred.reject(error);
	    }else{
		return deferred.resolve(entry);
	    }
	});
	*/
	deferred.resolve({
	    pipe: function(){
	    }
	});
	return deferred.promise;
    };
    var pipe = function(entry,path){
	var deferred = defer();
	entry.pipe(createWriteStream(path));
	deferred.resolve(path);
	return deferred.promise;
    };
    return all([
	request("http://www.java2s.com/Code/JarDownload/localizer/localizer-1.9.jar.zip").then(function(localizer){
	    return unzip(localizer).then(function(entry){
		return open("temp").then(function(temp){
		    return pipe(entry,temp.path);
		});
	    });
	}),
	request("http://central.maven.org/maven2/commons-codec/commons-codec/1.9/commons-codec-1.9.jar").then(function(codec){
	    return open("temp").then(function(temp){
		return writeFile(codec,temp.path).then(function(){
		    return temp.path;
		});
	    });
	})
    ]).then(function(fileNames){
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
    require("child-process-promise").exec,
    require("unzip").Parse,
    require("stream").Readable,
    require("q").defer,
    require("fs-promise").createWriteStream
));
