

function get_controllers(id, name){
	$("#room_label").html('<h4>'+name+'</h4>');
  socket.emit('choose_controllers', {
    room_id: id
  });

}

function toggler(){
var theToggle = document.getElementById('toggle');

// based on Todd Motto functions
// http://toddmotto.com/labs/reusable-js/

// hasClass
function hasClass(elem, className) {
	return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}
// addClass
function addClass(elem, className) {
    if (!hasClass(elem, className)) {
    	elem.className += ' ' + className;
    }
}
// removeClass
function removeClass(elem, className) {
	var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
	if (hasClass(elem, className)) {
        while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
            newClass = newClass.replace(' ' + className + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}
// toggleClass
function toggleClass(elem, className) {
	var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0 ) {
            newClass = newClass.replace( " " + className + " " , " " );
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}



theToggle.onclick = function() {
   toggleClass(this, 'on');
   return false;
}
}

function weather_chart()
{
var data_y = [];
var data_x = [];
var data_d = [];
    $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=Kyiv&appid=d01946c71f847270df726ba46cc786b6&mode=json&units=metric&cnt=7",function(result){

	for (i = 0; i < 4; i++) {
	var x = data_x.push(result.list[i].temp.max);
	var y = data_y.push(result.list[i].temp.min);
	cdate = new Date(result.list[i].dt*1000);
	cmonth = cdate.getMonth()+1;
	cday = cdate.getDate();
	if (cday<10){cday = "0"+cday};
	if (cmonth<10){cmonth = "0"+cmonth};
	cdate = cday+"."+cmonth;

	var d = data_d.push(cdate);

		}









var lineChartData = {labels : data_d,
						datasets : [
							{
								fillColor : "rgba(220,220,220,0.5)",
								strokeColor : "rgba(220,220,220,1)",
								pointColor : "rgba(220,220,220,1)",
								pointStrokeColor : "#fff",

data : data_x
							},
							{
								fillColor : "rgba(151,187,205,0.5)",
								strokeColor : "rgba(151,187,205,1)",
								pointColor : "rgba(151,187,205,1)",
								pointStrokeColor : "#fff",
								data : data_y
							}
						]
						
					}
			
				var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData);
				});

}




function getWeather() {

    $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=Kyiv&appid=d01946c71f847270df726ba46cc786b6&mode=json&units=metric&cnt=7",function(result){
               
var result_html = "Погода 					сьогодні: <br><span>"+result.list[0].temp.day.toFixed(1)+" &#8451;</span><img  alt='"+result.list[0].weather[0].description+"' src=http://openweathermap.org/img/w/"+result.list[0].weather[0].icon+".png >";
var result_html_t = "Погода на 					завтра: <br><span>"+result.list[1].temp.day.toFixed(1)+" &#8451; </span><img  alt='"+result.list[1].weather[0].description+"' src=http://openweathermap.org/img/w/"+result.list[1].weather[0].icon+".png >";
$('#forecast').html(result_html);
$('#forecast_t').html(result_html_t);
});

}


function gettMonth(month)
{

if (month==null){
var today = new Date();
var month = today.getMonth()+1;
switch (month) {
  case 1:
	var month = "Січень";
    break;
  case 2:
	var month = "Лютий";
    break;
  case 3:
	var month = "Березень";
    break;
  case 4:
	var month = "Квітень";
    break;
  case 5:
	var month = "Травень";
    break;
  case 6:
	var month = "Червень";
    break;
  case 7:
	var month = "Липень";
    break;
  case 8:
	var month = "Серпень";
    break;
  case 9:
	var month = "Вересень";
    break;
  case 10:
	var month = "Жовтень";
    break;
  case 11:
	var month = "Листопад";
    break;
  case 12:
	var month = "Грудень";
    break;
};
document.getElementById('cMonth').innerHTML += month;
}

else {return(month)};

}

function gettDay()
{
var today = new Date();
var day = today.getDate();
if (day<10) {day = '0'+day;}
document.getElementById('cDay').innerHTML += day;
return(day);

}
