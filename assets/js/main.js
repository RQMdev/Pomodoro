var deadline, t, seconds, minutes, hours, days, timeInterval, timeLeft;
var isRunning = false;
var isPaused = false;
minutes = $('#work').val();
seconds = '00';
$('#minutes').html(('0' + minutes).slice(-2));
$('#seconds').html(('0' + seconds).slice(-2));

function getTimeRemaining(endtime){
	t = Date.parse(endtime) - Date.parse(new Date());
	seconds = Math.floor( (t/1000) % 60 );
	minutes = Math.floor( (t/1000/60) % 60 );
	hours = Math.floor( (t/(1000*60*60)) % 24 );
	days = Math.floor( t/(1000*60*60*24) );
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds,
	};
}

function initializeClock(endtime){

	function updateClock(){
		var t = getTimeRemaining(endtime);
		$('#minutes').html(('0' + t.minutes).slice(-2));
		$('#seconds').html(('0' + t.seconds).slice(-2));
		if (t.total <= 0){
			clearInterval(timeInterval);
			isRunning = false;
		}
	}

	updateClock();
	timeInterval = setInterval(updateClock, 500);
}

$('#start').click(function(){
	if (!isRunning){
		var timer = $('#work').val() * 60 * 1000;
		deadline = new Date(Date.parse(new Date()) + timer);

		initializeClock(deadline);
		isRunning = true;
		$('#start').val('STOP');
	} else if (isRunning){
		clearInterval(timeInterval);
		isRunning = false;
		isPaused = false;
		$('#minutes').html(('0' + $('#work').val()).slice(-2));
		$('#seconds').html('00');
		$('#start').val('START');
		$('#pause').val('PAUSE');

	}
});

$('#pause').click(function(){
	if (!isPaused){
		timeLeft = getTimeRemaining(deadline);
		clearInterval(timeInterval);
		isPaused = true;
		$('#pause').val('PLAY');
	} else if (isPaused){
		deadline = new Date(Date.parse(new Date()) + timeLeft.total);
		initializeClock(deadline);
		isPaused = false;
		$('#pause').val('PAUSE');
	}
});
