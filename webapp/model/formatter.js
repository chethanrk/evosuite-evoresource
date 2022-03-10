sap.ui.define([
	"sap/gantt/library"
], function (GanttLibrary) {
	"use strict";

	var TimeUnit = GanttLibrary.config.TimeUnit;
	var oTimeLineOptions = {
		DAY: {
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
		WEEK: {
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
		MONTH: {
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
		 * get gantt zoom timeline options
		 * @param {string} sKey - key from dropdown
		 * @returns {object} Zoom time interval for Gantt
		 */
		getTimeLineOptions: function (sKey) {
			return oTimeLineOptions[sKey] || oTimeLineOptions;
		}
	};

});