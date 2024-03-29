/* globals moment */
sap.ui.define([
	"sap/gantt/library",
	"sap/ui/core/format/DateFormat",
	"sap/gantt/misc/Format"
], function (GanttLibrary, DateFormat, Format) {
	"use strict";

	var TimeUnit = GanttLibrary.config.TimeUnit;
	var oViewMapping = {
		DAY: {
			timeLine: "OneDay",
			beginDate: moment().startOf("isoWeek").toDate(),
			endDate: moment().endOf("isoWeek").toDate(),
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
			beginDate: moment().startOf("month").toDate(),
			endDate: moment().endOf("month").toDate(),
			bgDifferenceFn: function (oStartDate, oEndDate) {
				return oEndDate.diff(oStartDate, 'weeks');
			},
			bgStartDateFn: function (oDate) {
				return oDate.format("YYYYMMDD000000");
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
					moment(date).isBetween(moment(today).startOf("day"), moment(today).endOf("day"));
			}
		},
		MONTH: {
			timeLine: "OneMonth",
			beginDate: moment().startOf("month").subtract(1, "months").toDate(),
			endDate: moment().endOf("month").add(2, "months").endOf("month").toDate(),
			bgDifferenceFn: function (oStartDate, oEndDate) {
				return oEndDate.diff(oStartDate, 'months');
			},
			bgStartDateFn: function (oDate) {
				return oDate.format("YYYYMMDD000000");
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
					moment(date).isBetween(moment(today).startOf("day"), moment(today).endOf("day"));
			}
		}
	};
	var oTimeLineOptions = {
		"OneDay": {
			innerInterval: {
				unit: TimeUnit.day,
				span: 1,
				range: 90
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
				range: 150
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
				range: 175
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

	/**
	 * get current day string and occurence of the day in the month
	 * oData popover data
	 */
	var getCurrentDayString = function (sStartDate, oResourceBundle) {
		var oDate = moment(new Date(sStartDate)),
			nthOfMoth = Math.ceil(oDate.date() / 7);
		var sDay, snthMonth;

		sDay = oDate.format("dddd");

		if (nthOfMoth === 1) {
			snthMonth = oResourceBundle.getText("xlbl.first");
		} else if (nthOfMoth === 2) {
			snthMonth = oResourceBundle.getText("xlbl.second");
		} else if (nthOfMoth === 3) {
			snthMonth = oResourceBundle.getText("xlbl.third");
		} else if (nthOfMoth === 4) {
			snthMonth = oResourceBundle.getText("xlbl.fourth");
		} else if (nthOfMoth === 5) {
			snthMonth = oResourceBundle.getText("xlbl.fifth");
		}

		return {
			"snthMonth": snthMonth,
			"sDay": sDay
		};
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
		 * convert a date to string
		 * @param {object} sDate - Date object
		 * @returns {string} - Date in format "YYYYMMDDHHMMSS"
		 */
		convertDate2String: function (sDate) {
			return moment(sDate).format("YYYYMMDDHHmmss");
		},

		/**
		 * to get utc date object
		 */

		convertFromUTCDate: function (oDate, isNew, isChanging) {
			if (!oDate) {
				return null;
			}
			var offsetMs = new Date(oDate).getTimezoneOffset() * 60 * 1000;
			if (isNew || isChanging) {
				return oDate;
			}
			return new Date(oDate.getTime() + offsetMs);
		},

		convertToUTCDate: function (oDate) {
			if (!oDate) {
				return null;
			}
			var offsetMs = new Date(oDate).getTimezoneOffset() * 60 * 1000;
			return new Date(oDate.getTime() - offsetMs);
		},

		/**
		 * Get UTC date format from the timestapm
		 */
		fnTimeConverter: function (sTimestamp) {
			var oDate = Format.abapTimestampToDate(sTimestamp);
			return oDate;
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
		},

		/**
		 * format date in format yyyy-MM-dd HH-mm
		 * @param date
		 * @returns {string} formatted date string
		 */
		dateWithTime: function (date) {
			var d = new Date(date);
			var oDateFormat = DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd HH.MM a"
			});
			var dateString = oDateFormat.format(d);
			return dateString;
		},

		/**
		 * Darken or lighten a Hex  code color by percent
		 * example lighten: shadeColor("#63C6FF",40)
		 * example darken: shadeColor("#63C6FF",-40)
		 * @param color
		 * @param percent
		 */
		shadeColor: function (color, percent) {
			color = color || "#ffffff";
			var R = parseInt(color.substring(1, 3), 16),
				G = parseInt(color.substring(3, 5), 16),
				B = parseInt(color.substring(5, 7), 16);

			R = parseInt(R * (100 + parseInt(percent)) / 100);
			G = parseInt(G * (100 + parseInt(percent)) / 100);
			B = parseInt(B * (100 + parseInt(percent)) / 100);

			R = R < 255 ? R : 255;
			G = G < 255 ? G : 255;
			B = B < 255 ? B : 255;

			var RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
			var GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
			var BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);
			return "#" + RR + GG + BB;
		},

		/**
		 * To get description for the repeat selection
		 * repeatModeSelection repeat selected mode
		 */
		repaetModeDescription: function (repeatModeSelection) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (!repeatModeSelection || repeatModeSelection === "N") {
				return "";
			}
			if (repeatModeSelection === "D") {
				return "day(s)";
			} else if (repeatModeSelection === "W") {
				return "week(s)";
			} else if (repeatModeSelection === "M") {
				return "month(s)";
			}
			return "";
		},

		/**
		 * Validate the changeshape popover repeat fileds
		 * oPopOverData popover data
		 */
		validateVisibilityEvery: function (oPopOverData) {
			if (oPopOverData && oPopOverData.SeriesRepeat && oPopOverData.SeriesRepeat !== "N" && oPopOverData.isNew) {
				return true;
			}
			return false;
		},

		/**
		 * get formatted string of following format
		 * Day XX
		 * oData popovr data
		 */
		getDay: function (sStartDate) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (!sStartDate) {
				return "";
			}
			var sDay = new Date(sStartDate).getDate().toString();
			var iDay = sDay.length < 2 ? "0" + sDay : sDay;
			return oResourceBundle.getText("xdsr.Day", iDay);
		},

		/**
		 * get formatted string of the following format
		 * The XX th weekday 
		 * oData popover data
		 */
		getDays: function (sStartDate) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (!sStartDate) {
				return "";
			}

			var oDaysCalculated = getCurrentDayString(sStartDate, oResourceBundle);
			return oResourceBundle.getText("xdsr.occurence", [oDaysCalculated.snthMonth, oDaysCalculated.sDay]);
		},

		/**
		 * visibility of every input box
		 */
		everyAndEndDateVisibility: function (Repeat, isTemporary, isNew) {
			if (isNew && Repeat && isTemporary && Repeat !== "N") {
				return true;
			}

			return false;
		},

		/**
		 * Validate the field based on the repeat mode
		 */
		requiredValidate: function (Repeat) {
			if (Repeat && Repeat !== "N") {
				return true;
			}
			return false;
		},

		/**
		 * Validate the field based on the week mode
		 */
		weekModeValidation: function (isNew, isTemporary, Repeat) {
			if (isNew && isTemporary && Repeat && Repeat === "W") {
				return true;
			}
			return false;
		},

		/**
		 * Validate the field based on the month mode
		 */
		monthModeValidation: function (isNew, isTemporary, Repeat) {
			if (isNew && isTemporary && Repeat && Repeat === "M") {
				return true;
			}
			return false;
		},

		/**
		 * Creates key combination of ScheduleId and TemplateId
		 * @param {string} sScheduleId - ScheduleId of Shift
		 * @param {string} sTemplateId - TemplateId of Shift
		 * 
		 */
		getShiftKey: function (sScheduleId, sTemplateId) {
			return sScheduleId + sTemplateId;
		},

		/**
		 * Sets assignment tye combo editable based on parameter
		 * @param {boolean} bIsNew - isNew parameter of shape
		 * @param {boolean} bIsTemporary - isTemporary parameter of shape
		 * 
		 */
		setAssignmentTypeEditable: function (bIsNew, bIsTemporary) {
			if (bIsNew && bIsTemporary) {
				return true;
			}
			return false;
		},

		/**
		 * Sets shape popover editable based on parameter
		 * @param {boolean} bEditable - isEditable parameter of shape
		 * 
		 */
		setShapePopoverEditable: function (bEditable) {
			if (bEditable === undefined) {
				return true;
			}
			return bEditable;
		},

		/**
		 * Get default dates for selected mode
		 */
		getDefaultDates: function (sSelectkey, userModel) {
			switch (sSelectkey) {
			case "DAY":
				return this.getDatesfromModel(userModel, "DAILYVIEW", sSelectkey);
			case "WEEK":
				return this.getDatesfromModel(userModel, "WEEKLYVIEW", sSelectkey);
			case "MONTH":
				return this.getDatesfromModel(userModel, "MONTHLYVIEW", sSelectkey);
			default:
				return {
					"StartDate": userModel.getProperty("/DEFAULT_GANTT_START_DATE"),
					"EndDate": userModel.getProperty("/DEFAULT_GANTT_END_DATE")
				};
			}
		},

		getDatesfromModel: function (userModel, dateParams, sSelectKey) {
			var sStartDate, sEndDate;
			sStartDate = userModel.getProperty("/DEFAULT_" + dateParams + "_STARTDATE") || oViewMapping[sSelectKey].beginDate;
			sEndDate = userModel.getProperty("/DEFAULT_" + dateParams + "_ENDDATE") || oViewMapping[sSelectKey].endDate;
			return {
				"StartDate": sStartDate,
				"EndDate": sEndDate
			};
		},

		/**
		 * Unassign button visibility
		 */
		unAssignButtonVisibility: function (bAllowAssign, bMarked) {
			if (bAllowAssign && !bMarked) {
				return true;
			}
			return false;
		},
		/*
		 * Sets Delete button visisbility
		 * @param {boolean} isTemporary
		 * @param {boolean} isEditable
		 * @param {boolean} isDeletable
		 *
		 */
		isPopoverDeleteButtonVisible: function (isTemporary, isEditable, isDeletable) {
			var bValidate = true;
			if (isTemporary) {
				bValidate = false;
				return bValidate;
			}
			if (!isEditable) {
				bValidate = false;
				return bValidate;
			}
			if (!isDeletable) {
				bValidate = false;
				return bValidate;
			}
			return bValidate;
		},
		/*
		 * Sets Group change combo box enable status
		 * @param {boolean} isDeletable
		 *
		 */
		isPopoverGroupChangeEnable: function (isDeletable) {
			var bValidate = true;
			if (!isDeletable) {
				bValidate = false;
				return bValidate;
			}
			return bValidate;
		},
		/*
		 * Sets Shift change combo box enable status
		 * @param {boolean} isDeletable
		 *
		 */
		isPopoverShiftChangeEnable: function (isDeletable) {
			var bValidate = true;
			if (!isDeletable) {
				bValidate = false;
				return bValidate;
			}
			return bValidate;
		},
		/*
		 * Sets Date Range Selection enable status
		 * @param {boolean} isDeletable
		 *
		 */
		isPopoverDateRangeEditable: function (isDeletable) {
			var bValidate = true;
			if (!isDeletable) {
				bValidate = false;
				return bValidate;
			}
			return bValidate;
		},
		/*
		 * Sets End date picker enable status
		 * @param {boolean} isDeletable
		 *
		 */
		isPopoverEndDatePickerVisible: function (isDeletable) {
			var bValidate = false;
			if (!isDeletable) {
				bValidate = true;
				return bValidate;
			}
			return bValidate;
		},
		/*
		 * Returns minimun date ifor the End Date Picker of SHapeChangePopover
		 * @param {boolean} isDeletable
		 *
		 */
		getMinDateForEndDate: function (isDeletable) {
			if (!isDeletable) {
				return moment().startOf("day").toDate();
			}
			return null;
		},
		/*
		 * Returns converted to UTC date in dd-MMM-yyyy format
		 * @param {string} sNodeType
		 * @param {date} sGroupDate
		 * @param {date} sShiftDesc
		 * @param {boolean} isNew
		 * @param {boolean} isNew
		 *
		 */
		getDeleteObjectDate: function (sNodeType, sGroupDate, sShiftDesc, isNew, isChanging) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "dd-MMM-yyyy"
				}),
				oDate = {
					"RES_GROUP": sGroupDate,
					"SHIFT": sShiftDesc
				}[sNodeType],
				oConvertedDate = this.formatter.convertFromUTCDate(oDate, isNew, isChanging),
				oFormattedDate = dateFormat.format(oConvertedDate);

			return oFormattedDate;
		},
		/*
		 * Returns text based on assignment type
		 * @param {string} sNodeType
		 *
		 */
		getAssignmentTypeText: function (sNodeType) {
			return {
				"RES_GROUP": this.getResourceBundle('i18n').getText("xtxt.group"),
				"SHIFT": this.getResourceBundle('i18n').getText("xtxt.shift")
			}[sNodeType];
		},
		/*
		 * Returns if shape is selectable or not, if end date is past, then not selectable
		 * @param {date} oEndDate
		 *
		 */
		getShapeSelectable: function (oEndDate) {
			var oConvertedDate = this.formatter.convertFromUTCDate(oEndDate);
			return !(moment(oConvertedDate).isBefore(moment().startOf('day').toDate()));
		},
		/*
		 * Returns gantt shape selection model - Single or Multiple based on global config
		 * @param {boolean} isMultiDeletable
		 *
		 */
		getGanttSelectionMode: function (isMultiDeletable) {
			var sSelectionMode = "Single";
			if (isMultiDeletable) {
				sSelectionMode = "MultiWithKeyboard";
			}
			return sSelectionMode;
		},
		/*
		 * Returns boolean for the visibility of "Apply to Series" check box
		 * @param {boolean} isSeries
		 *
		 */
		isSeriesCheckVisible: function (isSeries) {
			return isSeries;
		},
		/*
		 * Returns boolean for the visibility of "Repeat mode" field
		 * @param {boolean} isNew
		 * @param {boolean} isTemporary
		 *
		 */
		repeatModeVisible: function (isNew, isTemporary) {
			if (isNew && isTemporary) {
				return true;
			}
			return false;
		},
		/*
		 * Returns boolean for the visibility of Checkbox for Resource
		 * @param {string} sNodeType
		 */
		isMainResource: function(sNodeType) {
			return sNodeType === "RESOURCE";
		}
	};

});