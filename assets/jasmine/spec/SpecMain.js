describe("Functions", function(){
	let minutes;

	beforeEach(function(){
		// jasmine.getFixtures().fixturesPath = './';
		// loadFixtures('index.html');
	});

	it('getTimeRemaining() return a 1hour left object', function(){
		let result = {total: 3600000, days: 0, hours: 1, minutes: 0, seconds: 0};
		let testDate = new Date();
		testDate.setHours(testDate.getHours() + 1);
		expect(getTimeRemaining(testDate)).toEqual(result);
	});

	describe("DOM Manipulation", function(){
		it("initializeClockDisplay call", function(){
			loadFixtures('index.html');
			initializeClockDisplay();
			expect(minutes).toEqual('25');
			expect(seconds).toEqual('00');
		});
	});

	describe("Notification", function(){

		beforeEach(function(){
			spyOn(Notification, 'requestPermission');
			spyOn(window, 'alert');
		});

		it("requestPermission() call Notification.requestPermission", function(){
			requestNotificationPermission();
			expect(Notification.requestPermission).toHaveBeenCalled();
		});

		it("requestPermission() tell Browser don\'t support", function(){
			delete window.Notification;
			requestNotificationPermission();
			expect(window.alert).toHaveBeenCalled();
		});
	});
});

describe("Drag'N'Drop Handler", function(){
	let dndHandler;

});
