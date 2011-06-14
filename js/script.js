function filenameToYear(filename) {
    year = filename.match(/\d{4}/);
    return year;
}
function filenameToTitle(filename) {
    filename = filename.replace(/(\d{4}|\[|\(|dvd).*/i, '');
    filename = filename.replace(/[\.\s]/g, '+');
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
    console.log(url);
    return url;
}
function getMovieInfo(url) {
    $.getJSON(url, function(data){
        $('#main_table').dataTable().
        fnAddData( ['<a href="http://www.imdb.com/title/'+data.ID+'/">'+data.Title+'</a>',
            data.Year, data.Genre, data.Director, data.Actors, data.Rating] );
    });
}
function handleDrop(event) {
    $(event.target).removeClass('dragover');
    var files = event.dataTransfer.files;
    console.log(files);
    timeout = 0;
    for (var i = 0, f; f = files[i]; i++) {
        var url = filenameToUrl(f.name);
        getMovieInfo(url);
    }
    event.stopPropagation();
    return false;
}


$(document).ready(function() {
    $('#main_table').dataTable({
        "bPaginate": false,
        "bLengthChange": false,
        "bProcessing": true
    });
});