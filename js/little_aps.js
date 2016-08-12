function gettMonth()
{
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
return(month);

}

function gettDay()
{
var today = new Date();
var day = today.getDate();
if (day<10) {day = '0'+day;}
document.getElementById('cDay').innerHTML += day;
return(day);

}

