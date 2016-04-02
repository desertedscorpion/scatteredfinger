(function(express, mkdir, creaexec){
    "use strict";
    return mkdir().then(function(success){
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
    }, function(rageguy){
    });
}(
    require("express"),
    require("promise-temp").mkdir,
    require("child-process-promise").exec)
);
