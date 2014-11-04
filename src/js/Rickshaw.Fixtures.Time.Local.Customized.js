/*
  HACK this file was created by intratec / thomas schwar, 2014-07
*/

Rickshaw.namespace('Rickshaw.Fixtures.Time.Local.Customized');

Rickshaw.Fixtures.Time.Local.Customized = function() {

	var self = this;

	this.months = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']; // short form German
	this.fullnamemonths = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']; // full text German
	this.days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']; //weekday names German

	this.units = [ // if less than three time units, it switches to the next smaller time unit
		{
			name: 'decade',
			seconds: 86400 * 365.25 * 10,
			formatter: function(d) { return (parseInt(d.getFullYear() / 10, 10) * 10) }
		}, {
			name: 'year',
			seconds: 86400 * 365.25,
			formatter: function(d) { return d.getFullYear() }
		}, {
			name: 'month',
			seconds: 86400 * 30.5,          				//  name of month + year
			formatter: function(d) { return '<p align=center>' + self.months[d.getMonth()] + '<br>' + d.getFullYear() + '</p>'}
		}, {
			name: 'week',
			seconds: 86400 * 7,								// day of month + full month name + year
			formatter: function(d) { return  '<p align=center>' + d.getDate() + '. ' + self.fullnamemonths[d.getMonth()] + '<br>' + d.getFullYear() + '</p>'}
		}, {
			name: 'day',
			seconds: 86400,									// name of weekday + day of month + name of month + year 
			formatter: function(d) { return '<p align=center>' + self.days[d.getDay()] + ', ' + d.getDate() + '. ' + self.months[d.getMonth()] + '<br>' + d.getFullYear() + '</p>'}
		}, {
			name: '6 hour',
			seconds: 3600 * 6,								// time [ 00:00:00 ] + name of weekday + day of month + name of month + year
			formatter: function(d) { return '<p align=center>' +   self.formatTimeCustom(d) + '<br>' + self.days[d.getDay()] + ', ' + d.getDate() + '. ' + self.months[d.getMonth()] + ' ' + d.getFullYear() + '</p>' }
		}, {
			name: 'hour',
			seconds: 3600,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: '15 minute',
			seconds: 60 * 15,
			formatter: function(d) { return self.formatTime(d) }
		}, {
			name: 'minute',
			seconds: 60,
			formatter: function(d) { return d.getMinutes() }
		}, {
			name: '15 second',
			seconds: 15,
			formatter: function(d) { return d.getSeconds() + 's' }
		}, {
			name: 'second',
			seconds: 1,
			formatter: function(d) { return d.getSeconds() + 's' }
		}, {
			name: 'decisecond',
			seconds: 1/10,
			formatter: function(d) { return d.getMilliseconds() + 'ms' }
		}, {
			name: 'centisecond',
			seconds: 1/100,
			formatter: function(d) { return d.getMilliseconds() + 'ms' }
		}
	];

	this.unit = function(unitName) {
		return this.units.filter( function(unit) { return unitName == unit.name } ).shift();
	};
	
	this.formatTimeCustom = function (d) {
		var std = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours() );
		var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes() );
		var sek = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
		
		var result = std + ':' + min;
		if (sek != '00') {
		    result += ':' + sek;
		}

		return result;
	};
/*
	this.formatDate = function(d) {
		return d3.time.format('%b %e')(d);
	};
*/
	this.formatTime = function(d) {
		return d.toString().match(/(\d+:\d+):/)[1];
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
