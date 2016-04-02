(function(express){
    "use strict";
    return express()
	.get("/rest/api/0/status", function(request, response){
	    return response.json({
		status: "OK"
	    });
	})
	.listen(28494)
    ;
}(require("express")));
