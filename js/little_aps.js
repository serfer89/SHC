
function getWeather() {

    $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=Kyiv&appid=d01946c71f847270df726ba46cc786b6&mode=json&units=metric&cnt=7",function(result){
               
var result_html = "Погода 					сьогодні: <br><span>"+result.list[0].temp.day+" &#8451;</span><img  alt='"+result.list[0].weather[0].description+"' src=http://openweathermap.org/img/w/"+result.list[0].weather[0].icon+".png >";
var result_html_t = "Погода на 					завтра: <br><span>"+result.list[1].temp.day+" &#8451; </span><img  alt='"+result.list[1].weather[0].description+"' src=http://openweathermap.org/img/w/"+result.list[1].weather[0].icon+".png >";
$('#forecast').html(result_html);
$('#forecast_t').html(result_html_t);
});

}

function chartData(pointer)

{

var data_y = [];
var data_x = [];

    $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?q=Kyiv&appid=d01946c71f847270df726ba46cc786b6&mode=json&units=metric&cnt=7",function(result){

	for (i = 0; i < 4; i++) {
	var x = data_x.push(result.list[i].temp.max);
	var y = data_y.push(result.list[i].temp.min);
		}
	this.data_y = data_y;
	this.data_x = data_x;
});
switch (pointer)

{
	case "x":
 	 data = data_x; 
	break;
	case "y":
	 data = data_y; 
	break;
}

return data;

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

