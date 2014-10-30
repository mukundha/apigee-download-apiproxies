var request=require('request');
var async = require('async');
var config = require('./config');
var fs = require('fs');

var urlbase = config.scheme + "://" +config.user + ":" + config.password + '@' + config.host + ":"+ config.port + "/v1/o/" + config.org ;
var auth = "Basic " + new Buffer(config.user + ":" + config.password).toString("base64");
//GET all apis

request( {url: urlbase + '/apis', headers: {Authorization: auth}}, function(err,response,apis){
    async.each( JSON.parse(apis), function(api,cb){
        //console.log(urlbase + '/apis/' + api + '/revisions');
        request({url: urlbase + '/apis/' + api + '/revisions', headers: {Authorization:auth}} , function(revErr, revisionResponse, revisions){
            console.log(api);
            console.log(revisions);
            var rev = JSON.parse(revisions);
            request({url:urlbase+'/apis/'+api+'/revisions/'+rev[rev.length-1] +'?format=bundle'}).pipe(fs.createWriteStream('data/'+api + '_rev' + rev[rev.length-1] +'.zip'));
        });
        
    },function(err){
        if(!err)
            console.log("All APIs backed up");
        else
            console.log("Backup have failed");
    })
});

console.log(urlbase);