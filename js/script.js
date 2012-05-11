table = $('#main-table');

$(document).ready(function() {
	$.fn.dataTableExt.oStdClasses.sSortAsc  = "header headerSortDown";
	$.fn.dataTableExt.oStdClasses.sSortDesc  = "header headerSortUp";

    $('#main-table').dataTable({
        "bPaginate": false,
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
            nRow.className='fade in';
            return nRow;
        }
    });

    $("#filter").keyup( function () {
        table.fnFilter(this.value);
    } );

});


function filenameToYear(filename) {
    year = filename.match(/\d{4}/);
    return year;
}
function filenameToTitle(filename) {
    filename = filename.replace(/(\[|\(|dvd|brrip|bdrip|tvrip|r5).*/i, '')
            .replace(/\d{4}/i,'').replace(/[\.\s]/g, '+');
    return filename;
}
function filenameToUrl(filename) {
    var url = 'http://www.imdbapi.com/?';
    var year = filenameToYear(filename);
    if (year) {
        url = url + 'y=' + year + '&';
    }
    var title = 't=' + filenameToTitle(filename);
    url = url + title + '&callback=?';
    return url;
}
function getMovieInfo(file) {
    $.getJSON(file['url'], function(data){
		if (data["Response"]!="Parse Error"){
			table.dataTable().
			fnAddData( ['<a class="title" href="http://www.imdb.com/title/'+data.ID+'/" title="'+file["name"]+'">'+data.Title+'</a>',
				data.Year, data.Genre, data.Director, data.Actors, data.imdbRating,
				'<a class="close" href="#" onclick="deleteRecord(this)">&times;</a>'] );
		} else {
			var error = $('<div class="alert-message error hide fade in" data-alert="alert">\
				<a class="close" href="#">&times;</a>\
				<p>Oh snap! Info for <strong>'+file['name']+'</strong> couldn\'t be found.</p>\
				</div>');
            error.appendTo('#message-box');
            error.fadeIn();
		}
    });
}
function handleDrop(event) {
	$('#drop-box').hide();
	$('#main-table_wrapper').fadeIn();
    $('#filter').fadeIn();
    var files = event.dataTransfer.files;
    timeout = 0;
    for (var i = 0, f; f = files[i]; i++) {
        f['url'] = filenameToUrl(f.name);
		console.log(f['url']);
        getMovieInfo(f);
    }
    event.stopPropagation();
    return false;
}

function handleDragEnter(event) {
    $('#drop-box').addClass('dragover');
	event.stopPropagation();
    return false;
}

function handleDragLeave(event) {
    $('#drop-box').removeClass('dragover');
	event.stopPropagation();
    return false
}

function deleteRecord(obj){
    var toRemove = obj.parentNode.parentNode
	table.fnDeleteRow(toRemove, function(){
        $(toRemove).fadeOut('fast', function(){
            table.fnDraw();
        });
    },
    false);
}