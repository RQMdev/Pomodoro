describe("Functions", function(){

	it('getTimeRemaining() return a 1hour left object', function(){
		let result = {total: 3600000, days: 0, hours: 1, minutes: 0, seconds: 0};
		let testDate = new Date();
		testDate.setHours(testDate.getHours() + 1);
		expect(getTimeRemaining(testDate)).toEqual(result);
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
