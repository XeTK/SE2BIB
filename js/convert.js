var numberOfItems = 0;
var jumpSize      = 0;
var percentageSu  = 0;
var percentageFa  = 0;

function convertToRef() {

	numberOfItems = 0;
	jumpSize      = 0;
	percentageSu  = 0;
	percentageFa  = 0;

	$("#ta-ref-outputs").val = "";
	$("#ta-ref-errors").val = "";

	var textArea = $('#ta-ref-inputs').val();

	var lines = textArea.split('\n');

	var refs = [];

	lines = lines.unique();

	numberOfItems = lines.length;

	jumpSize = 100 / numberOfItems;

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];

		urlToRef(line);
	}
}

function incrementPercentage(type) {

	var percentage = 0;

	if (type == 'danger') {
		percentageFa += jumpSize;
		percentage = percentageFa;
	} else {
		percentageSu += jumpSize;
		percentage = percentageSu;
	}

	$('.progress-bar-' + type).css('width', percentage+'%').attr('aria-valuenow', percentage);    
	$('.progress-bar-' + type).val = percentage + '%';
}

function urlToRef(url) {
	var rgx = /^(?:http[|s]:\/\/)?(.{0,30})\.com\/(\w{0,20})\/(\d{0,9})\/[\d\w\-]*/g;

	var groups = rgx.exec(url);

	var isSE = /(\w{0,30})\.stackexchange/g;

	var site = groups[1]

	var g = isSE.exec(site)

	if (g && g.length > 0) 
		site = g[1];
	
	var info = {
		"site" : site,
		"type" : groups[2],
		"id"   : groups[3],
		"url"  : url
	};

	restCall(info);
}

function restCall(info) {

	var address = "https://api.stackexchange.com/2.2/" + info.type + "/" + info.id;

	$.ajax(
		{
			url:  address,
			type: 'GET',
			async: true,
			data: {
				"site": info.site
			}
		}
	).done(
		function(data) {

			var obj = data.items[0];

			var cutDownObj = {
				"tags"     : obj.tags,
				"username" : obj.owner.display_name,
				"created"  : obj.creation_date,
				"url"      : obj.link,
				"title"    : obj.title,
				"site"     : info.site
			};

			var ref = objToRef(cutDownObj);

			$("#ta-ref-outputs").append(ref.ref + "\n\n");
			$("#ta-ref-cites").append(ref.cite + "\n");

			incrementPercentage('success');

		}
	).fail(
		function(data) {
			$("#ta-ref-errors").append(info.url + "\n");
			incrementPercentage('danger');
		}
	);
}

function objToRef(obj) {

	var monthNames = [
		"January", 
		"February", 
		"March", 
		"April", 
		"May", 
		"June",
  		"July", 
  		"August", 
  		"September", 
  		"October", 
  		"November", 
  		"December"
	];

/*	
	@webpage{bneupaane:AndroidEditText:2010:online,
		Author = {},
		Date-Added = {2015-04-14 13:28:41 +0000},
		Date-Modified = {},
		Keywords = {},
		Lastchecked = {},
		Title = {},
		Url = {},
		Year = {},
		Month = {},
		Bdsk-Url-1 = {}}

*/

	var simpleAuthor = obj.username.replace(/[^a-z0-9]/gi,'');
	var simpleTitle  = obj.title.replace(/[^a-z0-9]/gi,'');
	var createdDate  = new Date(Number(obj.created) * 1000);
	var currentDate  = new Date();

	var dateStr = createdDate.toString();
	var year    = createdDate.getFullYear();
	var month   = monthNames[createdDate.getMonth()];

	var tagLine = "";

	var tags = obj.tags;

	for (var i = 0; i < tags.length; i++) {
		tagLine += tags[i] + " ";
	}

	var refLine = simpleAuthor + ':' + simpleTitle + ':' + year + ':online'

	var str = "@webpage{" + refLine +",\n\
		Author = {" + obj.site + " User: " + obj.username + "},\n\
		Date-Added = {" + dateStr + "},\n\
		Date-Modified = {" + dateStr + "},\n\
		Keywords = {" + tagLine + "},\n\
		Lastchecked = {" + currentDate.toString() + "},\n\
		Title = {" + obj.title + "},\n\
		Url = {" + obj.url + "},\n\
		Year = {" + year + "},\n\
		Month = {" + month + "},\n\
		Bdsk-Url-1 = {" + obj.url + "}}"

	var ref = {
		"ref"  : str,
		"cite" : refLine
	}

	return ref;
}

$(document).ready(
	function() {

		$('#submit-button').click(
			function(e) {
				convertToRef();
			}
		)
	}
);

//http://codereview.stackexchange.com/questions/60128/removing-duplicates-from-an-array-quickly
Array.prototype.unique = function(mutate) {
    var unique = this.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) {
            accum.push(current);
        }
        return accum;
    }, []);

    if (mutate) {
        this.length = 0;
        for (var i = 0; i < unique.length; ++i) {
            this.push(unique[i]);
        }
        return this;
    }
    return unique;
}