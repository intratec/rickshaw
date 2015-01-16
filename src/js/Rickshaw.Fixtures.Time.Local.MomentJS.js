/*
  author: intratec / thomas krenn, 2014-12
*/
Rickshaw.namespace('Rickshaw.Fixtures.Time.Local.MomentJS');

Rickshaw.Fixtures.Time.Local.MomentJS = function(timezoneProvider) {

    if (typeof timezoneProvider !== "function") {
        throw "You must pass a function that returns the current timezone (Rickshaw.Fixtures.Time.Local.MomentJS)";
    }

    this.createMomentUnix = function(x) {
        return moment.unix(x).tz(timezoneProvider());
    };

	var self = this;

	this.units = [ // if less than three time units, it switches to the next smaller time unit
		{
			name: 'decade',
			seconds: 86400 * 365.25 * 10,
			formatterX: function (x) { return (parseInt(self.createMomentUnix(x).year() / 10, 10) * 10) }
		}, {
			name: 'year',
			seconds: 86400 * 365.25,
			formatterX: function (x) { return self.createMomentUnix(x).year() }
		}, {
			name: 'month',
			seconds: 86400 * 30.5,          				//  name of month + year
			formatterX: function (x) { return '<p>' + self.createMomentUnix(x).format("MMM[<br/>]YYYY") + '</p>' }
		}, {
			name: 'week',
			seconds: 86400 * 7,								// day of month + full month name + year
			formatterX: function (x) { return '<p>' + self.createMomentUnix(x).format("ll") + '</p>' }
		}, {
			name: 'day',
			seconds: 86400,									// name of weekday + day of month + name of month + year 
			formatterX: function (x) { return '<p>' + self.createMomentUnix(x).format("ddd[<br/>]ll") + '</p>' }
		}, {
			name: '6 hour',
			seconds: 3600 * 6,								// time [ 00:00:00 ] + name of weekday + day of month + name of month + year
			formatterX: function (x) { return '<p>' + self.createMomentUnix(x).format("LT[<br/>]ll") + '</p>' }
		}, {
			name: 'hour',
			seconds: 3600,
			formatterX: function (x) { return self.createMomentUnix(x).format("LT") }
		}, {
			name: '15 minute',
			seconds: 60 * 15,
			formatterX: function (x) { return self.createMomentUnix(x).format("LT") }
		}, {
			name: 'minute',
			seconds: 60,
			formatterX: function (x) { return self.createMomentUnix(x).format("mm") }
		}, {
			name: '15 second',
			seconds: 15,
			formatterX: function (x) { return self.createMomentUnix(x).format("ss[s]") }
		}, {
			name: 'second',
			seconds: 1,
			formatterX: function (x) { return self.createMomentUnix(x).format("ss[s]") }
		}, {
			name: 'decisecond',
			seconds: 1/10,
			formatterX: function (x) { return self.createMomentUnix(x).format("SSS[ms]") }
		}, {
			name: 'centisecond',
			seconds: 1/100,
			formatterX: function (x) { return self.createMomentUnix(x).format("SSS[ms]") }
		}
	];

	this.unit = function(unitName) {
		return this.units.filter( function(unit) { return unitName == unit.name } ).shift();
	};
	
	this.ceil = function(time, unit) {

		var date, floor, year;

		if (unit.name == 'day') {

			var nearFuture = new Date((time + unit.seconds - 1) * 1000);

			var rounded = new Date(0);
			rounded.setMilliseconds(0);
			rounded.setSeconds(0);
			rounded.setMinutes(0);
			rounded.setHours(0);
			rounded.setDate(nearFuture.getDate());
			rounded.setMonth(nearFuture.getMonth());
			rounded.setFullYear(nearFuture.getFullYear());
			return rounded.getTime() / 1000;
		}

		if (unit.name == 'month') {

			date = new Date(time * 1000);

			floor = new Date(date.getFullYear(), date.getMonth()).getTime() / 1000;
			if (floor == time) return time;

			year = date.getFullYear();
			var month = date.getMonth();

			if (month == 11) {
				month = 0;
				year = year + 1;
			} else {
				month += 1;
			}

			return new Date(year, month).getTime() / 1000;
		}

		if (unit.name == 'year') {

			date = new Date(time * 1000);

			floor = new Date(date.getUTCFullYear(), 0).getTime() / 1000;
			if (floor == time) return time;

			year = date.getFullYear() + 1;

			return new Date(year, 0).getTime() / 1000;
		}

		return Math.ceil(time / unit.seconds) * unit.seconds;
	};
};
