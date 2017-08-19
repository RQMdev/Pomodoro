const MS_IN_SEC = 1000,
			SEC_IN_MIN = 60,
			MIN_IN_HOURS = 60,
			HOURS_IN_DAYS = 24;

var deadline, t, seconds, minutes, hours, days, timeInterval, timeLeft;
var isRunning = false;
var isPaused = false;
var notificationTitle = 'Thank You !';
var notificationBody = 'You can click on this notification to launch the next step.';

minutes = $('.work').val();
seconds = '00';
$('#minutes').html(('0' + minutes).slice(-2));
$('#seconds').html(('0' + seconds).slice(-2));

if (!('Notification' in window)){
	alert('This browser don\'t support Desktop Notifications.');
} else if (Notification.permission !== 'denied'){
	Notification.requestPermission(function(permission){
		Notification.permission = permission;
	});
}

/*
Fonction qui va calculer la différence en milliseconde entre le temps actuel et la deadline,
et retourner un object comprenants ce temps et les correspondances en Jours/Heures/Minutes/Secondes.
*/
function getTimeRemaining(endtime){
	t = Date.parse(endtime) - Date.parse(new Date());
	seconds = Math.floor( (t/MS_IN_SEC) % SEC_IN_MIN );
	minutes = Math.floor( (t/MS_IN_SEC/SEC_IN_MIN) % MIN_IN_HOURS );
	hours = Math.floor( (t/(MS_IN_SEC*SEC_IN_MIN*MIN_IN_HOURS)) % HOURS_IN_DAYS );
	days = Math.floor( t/(MS_IN_SEC*SEC_IN_MIN*MIN_IN_HOURS*HOURS_IN_DAYS) );
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds,
	};
}

/*
Fonction qui lance le minuteur et son actualisation régulière.
la sous fonction updateClock gérant l'actualisation.
*/
function initializeClock(endtime){

	function updateClock(){
		var t = getTimeRemaining(endtime);
		$('#minutes').html(('0' + t.minutes).slice(-2));
		$('#seconds').html(('0' + t.seconds).slice(-2));
		$('title').html(('0' + t.minutes).slice(-2)+' : '+('0' + t.seconds).slice(-2)+' Pomodoro');

		if (t.total <= 0){

			var audio = new Audio('assets/audio/alert.wav');
			audio.play();

			if ($('#time-line div:first').hasClass('work-wrapper')){
				notificationTitle = 'Break!';
			} else {
				notificationTitle = 'Work!';
			}

			var notification = new Notification(notificationTitle, {body: notificationBody});
			notification.onclick = function(){
				start();
				notification.close();
			}
			clearInterval(timeInterval);
			isRunning = false;
			$('#start').val('START');
			$('#time-line div:first').remove();
		}
	}

	updateClock();
	timeInterval = setInterval(updateClock, 500);
}

function start(){
	if ( $('#time-line').children().length == 0 && !isRunning){
		alert('You have to drag and drop at least one time section between WORK, BREAK and LONG BREAK into the time-line.')
	} else if (!isRunning){
		var timer = $('#time-line div:first input').val() * SEC_IN_MIN * MS_IN_SEC;
		deadline = new Date(Date.parse(new Date()) + timer);
		initializeClock(deadline);
		isRunning = true;
		$('#start').val('STOP');

	} else if (isRunning){
		clearInterval(timeInterval);
		isRunning = false;
		isPaused = false;
		$('#minutes').html(('0' + $('.work').val()).slice(-2));
		$('#seconds').html('00');
		$('title').html(('0' + $('.work').val()).slice(-2)+' : 00 Pomodoro');
		$('#start').val('START');
		$('#pause').val('PAUSE');
	}
}
$('#start').click(start);


function pause(){

	if (!isPaused && isRunning){
		timeLeft = getTimeRemaining(deadline);
		clearInterval(timeInterval);
		isPaused = true;
		$('#pause').val('PLAY');

	} else if (isPaused && isRunning){
		deadline = new Date(Date.parse(new Date()) + timeLeft.total);
		initializeClock(deadline);
		isPaused = false;
		$('#pause').val('PAUSE');
	}
}
$('#pause').click(pause);

function refresh(){

	$('.delete').click(function(){

		if ( this.parentNode.classList.contains('inTimeLine')){
			this.parentNode.remove();

		}
	});
}

$(document).keydown(function(e){
	switch(e.which){
		case 13: start();
			break;

		case 32: pause();
			break;

		default: return;
	}
});

/*
Gestion du dispositif de Drag and Drop ( Glisser-déposer ).
*/
var dndHandler = {

	draggedElement: null,

	applyDragEvents: function(element){

		var dndHandler = this;
		element.draggable = true;

		element.addEventListener('dragstart', function(e){
			dndHandler.draggedElement = e.target;
			e.dataTransfer.setData('text/plain', '');
		});
	},

	applyDropEvents: function(dropper){

		var dndHandler = this;

		dropper.addEventListener('dragover', function(e){
			e.preventDefault();
			this.className = 'dropper drop_hover';
		});

		dropper.addEventListener('dragleave', function(){
			this.className = 'dropper';
		});

		dropper.addEventListener('drop', function(e){

			var target = e.target,
					draggedElement = dndHandler.draggedElement,
					clonedElement = draggedElement.cloneNode(true);

			while (target.className.indexOf('dropper') == -1){
				target = target.parentNode;
			}

			target.className = 'dropper';
			clonedElement.classList.add('inTimeLine');
			clonedElement.classList.remove('draggable');
			clonedElement.draggable = false;
			clonedElement = target.appendChild(clonedElement);

			refresh();
			// dndHandler.applyDragEvents(clonedElement);
		});
	}
};

var elements = $('.draggable'),
		elementsLen = elements.length;

for (var i = 0; i < elementsLen; i++){
	dndHandler.applyDragEvents(elements[i]);
}

var droppers = $('.dropper');
		droppersLen = droppers.length;

for (var i = 0; i < droppersLen; i++){
	dndHandler.applyDropEvents(droppers[i]);
}



// var inTimeLine = $('inTimeLine');
// 		inTimeLineLen = inTimeLine.length;
//
// for (var i = 0; i < inTimeLineLen; i++){
// 	inTimeLine[i].draggable = false;
// }
