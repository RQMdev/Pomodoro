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

function requestNotificationPermission(){
	if (!('Notification' in window)){
		return alert('This browser don\'t support Desktop Notifications.');
	} else if (Notification.permission !== 'denied'){
		return Notification.requestPermission(function(permission){
			Notification.permission = permission;
		});
	}
}
requestNotificationPermission();

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
			$('#start').removeClass('fa-stop');
			$('#start').addClass('fa-play');
			$('.animation').removeClass('animate');
			$('#time-line div:first').remove();
			if ($('#time-line').children().length == 1){
				$('#time-line span').css('opacity', '1');
			} else {
				$('#time-line span').css('opacity', '0');
			}
		}
	}

	updateClock();
	timeInterval = setInterval(updateClock, 500);
}

function start(){
	if ( $('#time-line').children().length == 1 && !isRunning){
		if (Notification.permission === 'denied'){
			alert('You have to drag and drop at least one time section into the time-line.')
		} else {
			var notification = new Notification("Schedule!", {body:'You have to drag and drop at least one time section into the time-line.'});
		}
	} else if (!isRunning){
		var timer = $('#time-line div:first input').val() * SEC_IN_MIN * MS_IN_SEC;
		deadline = new Date(Date.parse(new Date()) + timer);
		initializeClock(deadline);
		isRunning = true;
		$('#start').removeClass('fa-play');
		$('#start').addClass('fa-stop');
		var currentColor = $('#time-line div:first').css('background-color').slice(4, -1);

		$('.animation').css('background-color', 'rgba('+ currentColor +', 0.1)');
		$('.animation').css('animation-duration', timer +'ms');
		$('.animation').addClass('animate');

	} else if (isRunning){
		clearInterval(timeInterval);
		isRunning = false;
		isPaused = false;
		if ( $('#time-line').children().length == 0 ){
			$('#minutes').html(('0' + $('.work').val()).slice(-2));
			$('#seconds').html('00');
		} else {
			$('#minutes').html(('0' + $('#time-line div:first input').val()).slice(-2));
			$('#seconds').html('00');
		}
		$('title').html(('0' + $('#time-line div:first input').val()).slice(-2)+' : 00 Pomodoro');
		$('#start').removeClass('fa-stop');
		$('#start').addClass('fa-play');
		$('#pause').removeClass('fa-play');
		$('#pause').addClass('fa-pause');
		$('.animation').removeClass('animate');
	}
}
/* Appel la fonction Start sur un click de l'element #Start */
$('#start').click(start);


function pause(){

	function pauseAnimation(){
		$('.animation').css('-webkit-animation-play-state', function(i, v){
			return v === 'paused' ? 'running' : 'paused';
		});
	}

	if (!isPaused && isRunning){
		timeLeft = getTimeRemaining(deadline);
		clearInterval(timeInterval);
		isPaused = true;
		$('#pause').removeClass('fa-pause');
		$('#pause').addClass('fa-play');
		pauseAnimation();

	} else if (isPaused && isRunning){
		deadline = new Date(Date.parse(new Date()) + timeLeft.total);
		initializeClock(deadline);
		isPaused = false;
		$('#pause').removeClass('fa-play');
		$('#pause').addClass('fa-pause');
		pauseAnimation();
	}
}
$('#pause').click(pause);

function refresh(){
	if ($('#time-line').children().length == 1){
		$('#time-line span').css('opacity', '1');
	} else {
		$('#time-line span').css('opacity', '0');
	}

	$('.delete').click(function(){

		if ( this.parentNode.classList.contains('in-time-line')){
			this.parentNode.remove();
		}
		if ($('#time-line').children().length == 1){
			$('#time-line span').css('opacity', '1');
		} else {
			$('#time-line span').css('opacity', '0');
		}
	});
}
refresh();


function sectionTimeUp(){
	sectionTime = parseInt($(this).parent().siblings('input').val()) + 1;
	if (sectionTime < 61){
		$(this).parent().siblings('input').val(('0'+ sectionTime).slice(-2));
	}
}
$('.fa-angle-up').click(sectionTimeUp);


function sectionTimeDown(){
	sectionTime = parseInt($(this).parent().siblings('input').val()) - 1;
	if (sectionTime > 0){
		$(this).parent().siblings('input').val(('0'+ sectionTime).slice(-2));
	}
}
$('.fa-angle-down').click(sectionTimeDown);

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
			clonedElement.classList.add('in-time-line');
			clonedElement.classList.remove('draggable');
			clonedElement.classList.remove('bound');
			clonedElement.draggable = false;
			clonedElement = target.appendChild(clonedElement);
			$(clonedElement).find('.fa-angle-up').click(sectionTimeUp);

			$(clonedElement).find('.fa-angle-down').click(sectionTimeDown);

			$(clonedElement).find('.fa-angle-down')


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
