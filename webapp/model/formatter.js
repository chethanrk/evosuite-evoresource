/* globals moment */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/format/DateFormat"
], function (GanttLibrary, DateFormat) {
	"use strict";

	var TimeUnit = GanttLibrary.config.TimeUnit;
	var oViewMapping = {
		DAY: {
			timeLine: "OneDay",
			bgDifferenceFn: function (oStartDate, oEndDate) {
				return oEndDate.diff(oStartDate, "days");
			},
			bgStartDateFn: function (oDate) {
				//start of day
				return oDate.format("YYYYMMDD000000");
			},
			bgEndDateFn: function (oDate) {
				//end of day
				var sEnd = oDate.format("YYYYMMDD235959");
				oDate.add(1, "days");
				return sEnd;
			},
			isFuture: function (date) {
				if (!date) {
					return false;
				}
				return moment(date).isSameOrAfter(moment().format("YYYY-MM-DD"));
			}
		},
		WEEK: {
			timeLine: "OneWeek",
			bgDifferenceFn: function (oStartDate, oEndDate) {
				return oEndDate.diff(oStartDate, 'weeks');
			},
			bgStartDateFn: function (oDate) {
				//monday of this week
				return oDate.day(1).format("YYYYMMDD000000");
			},
			bgEndDateFn: function (oDate) {
				//sunday of week
				var sEnd = oDate.day(7).format("YYYYMMDD235959");
				oDate.add(1, "days");
				return sEnd;
			},
			isFuture: function (date) {
				var today = moment().format("YYYY-MM-DD");
				if (!date) {
					return false;
				}
				//shape startDate is today or later or week start date or between start and end of week
				return moment(date).isSameOrAfter(today) ||
					moment(date).isSame(moment(today).day(1)) ||
					moment(date).isBetween(moment(today).day(1), moment(today).day(7));
			}
		},
		MONTH: {
			timeLine: "OneMonth",
			bgDifferenceFn: function (oStartDate, oEndDate) {
				return oEndDate.diff(oStartDate, 'months');
			},
			bgStartDateFn: function (oDate) {
				//first day of month
				return oDate.startOf("month").format("YYYYMMDD000000");
			},
			bgEndDateFn: function (oDate) {
				//last day of month
				var sEnd = oDate.endOf("month").format("YYYYMMDD235959");
				oDate.add(1, "days");
				return sEnd;
			},
			isFuture: function (date) {
				var today = moment().format("YYYY-MM-DD");
				if (!date) {
					return false;
				}
				//shape startDate is today or later or month start date or between start and end of month
				return moment(date).isSameOrAfter(today) ||
					moment(date).isSame(moment(today).startOf("month")) ||
					moment(date).isBetween(moment(today).startOf("month"), moment(today).endOf("month"));
			}
		}
	};
	var oTimeLineOptions = {
		"OneDay": {
			innerInterval: {
				unit: TimeUnit.day,
				span: 1,
				range: 60
			},
			largeInterval: {
				unit: TimeUnit.week,
				span: 1,
				pattern: "ww | LLL YYYY"
			},
			smallInterval: {
				unit: TimeUnit.day,
				span: 1,
				pattern: "EEE dd"
			}
		},
		"OneWeek": {
			innerInterval: {
				unit: TimeUnit.week,
				span: 1,
				range: 60
			},
			largeInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLLL YYYY"
			},
			smallInterval: {
				unit: TimeUnit.week,
				span: 1,
				pattern: "ww"
			}
		},
		"OneMonth": {
			innerInterval: {
				unit: TimeUnit.month,
				span: 1,
				range: 100
			},
			largeInterval: {
				unit: TimeUnit.year,
				span: 1,
				format: "YYYY"
			},
			smallInterval: {
				unit: TimeUnit.month,
				span: 1,
				pattern: "LLL"
			}
		}
	};

	return {

		/**
		 * get view mode mapping from filter to Gantt time settings
		 */
		getViewMapping: function (sKey) {
			return oViewMapping[sKey] || oViewMapping;
		},

		/**
		 * get gantt zoom timeline options
		 * @param {string} sKey - key from dropdown
		 * @returns {object} Zoom time interval for Gantt
		 */
		getTimeLineOptions: function (sKey) {
			if (oViewMapping[sKey]) {
				return oTimeLineOptions[oViewMapping[sKey].timeLine];
			} else {
				return oTimeLineOptions;
			}
		},

		/**
		 * converty a date string to a moment object
		 * @param {string} sDate - date string in format YYYYMMDD
		 * @returns {object} moment date
		 */
		convertString2Date: function (sDate) {
			return moment(sDate.substr(0, 4) + "-" + sDate.substring(4, 6) + "-" + sDate.substring(6, 8));
		},

		/**
		 * format date in format yyyy-MM-dd
		 * @param date
		 * @returns {string} formatted date string
		 */
		date: function (date) {
			var d = new Date(date);
			var oDateFormat = DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var dateString = oDateFormat.format(d);
			return dateString;
		}
	};

});