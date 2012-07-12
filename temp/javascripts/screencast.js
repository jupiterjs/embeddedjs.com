function $(id){ return document.getElementById(id) }

function loadTeam(teamAbbr) {
	close_box()
    var feedUrl = teams[teamAbbr].url;
	window._loadedTeam = teamAbbr;
	var query = new google.gdata.calendar.CalendarEventQuery(feedUrl);
	query.setOrderBy('starttime');
	query.setSortOrder('ascending');
	query.setMaxResults(100);
	
	/*var callback = function(data) {
		var columns = split_into_columns(data.feed.getEntries(), 4)
		var html = "<img src='http://www.nba.com/media/"+_loadedTeam+"_50px_full.gif' alt="+teams[_loadedTeam].name+" />";
		html += "<h6>"+teams[_loadedTeam].name+"</h6>";
		html += "<div id='events_container'>";
		for (var c = 0; c < columns.length; c++) {
			html += "<div>";
			for(var r=0; r < columns[c].length; r ++ ){
				var entry = columns[c][r];
				var start_date = entry.getTimes()[0].getStartTime().getDate();
				html += "<p class='"+(start_date > new Date() ? 'future' : '')+"'>";
				html += "<label>"+start_date.toShortDateString()+"</label>";
				html += "<span>"+start_date.toShortTimeString()+"</span>";
				html += "<a href='"+entry.getHtmlLink().getHref()+"'>"+entry.getTitle().getText().substring(4)+"</a>";
				html += "</p>";
			}
			html += "</div>";
		}
		html += "</div>";
		$('calendar_content').innerHTML = html;
	}*/
	
	var callback = new EJS({url: 'templates/calendar.ejs'}).update('calendar_content');
	
    new google.gdata.calendar.CalendarService().getEventsFeed(query, callback, handleError);

	$('calendar').style.display = 'block';
	$('instructions').style.visibility = 'hidden';
}
function pad_number(num) { return (num <= 9 ? "0" + num : num) }


function handleError(e) {
  alert("There was an error!");
  alert(e.cause ? e.cause.statusText : e.message);
}

function close_box() {
	$('calendar').style.display = 'none';
	$('calendar_content').innerHTML = 'loading...';
	$('instructions').style.visibility = 'visible'
}
function split_into_columns(array, columns){
	var cols = [], last = 0;
	for(var c = 0; c < columns; c++){
		var next = last+parseInt( array.length / columns) + (array.length % columns > c ? 1 : 0) 
		cols.push(array.slice(last, next ) )
		last = next;
	}
	return cols
}
Date.prototype.toShortTimeString = function(){
	var result = this.toLocaleTimeString();
	return result.replace(/:.. /,' ' )
}
Date.prototype.toShortDateString = function(){
	return ''+(this.getMonth()+1)+'.'+pad_number( this.getDate() )
}


EJS.Helpers.prototype.link_to_entry = function(entry){
	var title = entry.getTitle().getText().substring(4)
	return this.link_to(title, entry.getHtmlLink().getHref())
}