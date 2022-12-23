/* global moment:true */
sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/config/TimeHorizon"
], function (BaseController, Formatter, StepwiseZoomStrategy, TimeHorizon) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.BaseResourcePlanGanttController", {

		metadata: {
			methods: {
				createNewTempAssignment: {
					public: true,
					final: true
				},
				changeGanttHorizonViewAt: {
					public: true,
					final: true
				}
			}
		},
		
		formatter: Formatter,

		/**
		 * when background shape was pressed create temporary assignment
		 * for shape popover input fields and visibility inside Gantt chart
		 * 
		 * @param {object} oStartTime - start date of shape
		 * @param {object} oEndTime - end date of shape 
		 * @param {object} oRowData - row context data from Gantt row
		 */
		createNewTempAssignment: function (oStartTime, oEndTime, oRowData, bDragged) {
			return new Promise(function (resolve) {
				var obj = {
						minDate: new Date(),
						isTemporary: true,
						isNew: true,
						Guid: new Date().getTime(),
						SeriesRepeat: "N",
						Every: "",
						SeriesWeeklyOn: [],
						SeriesMonthlyOn: 0,
						SERIES_END_DATE: new Date(),
						IsSeries: false,
						isEditable: true,
						isDeletable: true,
						isRestChanges: true,
						maxDate: this.getModel("viewModel").getProperty("/gantt/defaultEndDate")
					},
					oDraggedData = this.getView().getModel("viewModel").getProperty("/draggedData"),
					nodeType;

				if (bDragged) {
					nodeType = oDraggedData.data.NodeType;
					if (nodeType === undefined) {
						if (this.bAddNewResource)
							nodeType = "RESOURCE";
					}
					//added the below condition as Guid is passing as int in POST and causing an issue
					if (nodeType === "RESOURCE")
						obj.Guid = obj.Guid.toString();
				} else {
					if (oRowData.NodeType) nodeType = oRowData.NodeType;
					else if (oRowData.NODE_TYPE) nodeType = oRowData.NODE_TYPE;
				}
				//collect all assignment properties who allowed for create
				this.getModel().getMetaModel().loaded().then(function () {
					var oMetaModel = this.getModel().getMetaModel(),
						oEntitySetList = this.getModel("templateProperties").getProperty("/EntitySet"),
						oEntitySet = oMetaModel.getODataEntitySet(oEntitySetList[nodeType]),
						oEntityType = oEntitySet ? oMetaModel.getODataEntityType(oEntitySet.entityType) : null,
						aProperty = oEntityType ? oEntityType.property : [];

					if (aProperty.length === 0) {
						for (var key in oEntitySetList) {
							oEntitySet = oMetaModel.getODataEntitySet(oEntitySetList[key]);
							oEntityType = oEntitySet ? oMetaModel.getODataEntityType(oEntitySet.entityType) : null;
							aProperty = aProperty.concat(oEntityType ? oEntityType.property : [])
						}
					}

					aProperty.forEach(function (property) {
						var isCreatable = property["sap:creatable"],
							defaultValue = {
								"Edm.String": "",
								"Edm.Byte": 0,
								"Edm.DateTime": null
							};
						obj[property.name] = defaultValue.hasOwnProperty(property.type) ? defaultValue[property.type] : null;
						if (oRowData.hasOwnProperty(property.name)) {
							obj[property.name] = oRowData[property.name];
						}
					});
					obj.SERIES_START_DATE = oStartTime;
					obj.SERIES_END_DATE = oEndTime;
					obj.StartDate = oStartTime;
					obj.EndDate = oEndTime;
					obj.EffectiveStartDate = oStartTime;
					obj.EffectiveEndDate = oEndTime;
					obj.NODE_TYPE = nodeType;
					obj.ResourceGroupGuid = oRowData.ResourceGroupGuid;
					obj.ResourceGuid = oRowData.ResourceGuid;
					obj.DESCRIPTION = oRowData.ResourceGroupDesc || oRowData.Description;
					obj.PARENT_NODE_ID = oRowData.NodeId;
					obj.bDragged = bDragged;
					obj.ParentNodeId = oRowData.ResourceGuid;
					obj.IsSeries = false;

					if (nodeType === "RESOURCE") {
						obj.NodeId = oRowData.NodeId;
						obj.TIME_ZONE = oRowData.TIME_ZONE;
						obj.DESCRIPTION = oRowData.ResourceGroupDesc || oRowData.Description;
						obj.RESOURCE_GROUP_COLOR = oRowData.ResourceGroupColor;
					}
					if (nodeType === "RES_GROUP") {
						obj.NodeId = oRowData.ParentNodeId;
						obj.DESCRIPTION = oRowData.ResourceGroupDesc || oRowData.Description;
						obj.RESOURCE_GROUP_COLOR = oRowData.ResourceGroupColor;
					} else if (nodeType === "SHIFT") {
						obj.NodeId = oRowData.ParentNodeId;
						obj.DESCRIPTION = oRowData.ScheduleIdDesc || oRowData.Description;
						obj.RESOURCE_GROUP_COLOR = oRowData.SHIFT_COLOR;
					}
					resolve(obj);
				}.bind(this));
			}.bind(this));
		},
		/**
		 * Change view horizon time at specified timestamp
		 * @param oModel {object} viewModel
		 * @param start {object} timestamp
		 * @param end {object} timestamp
		 */
		changeGanttHorizonViewAt: function (oModel, iZoomLevel, oAxisTimeStrategy) {
			var sStartDate, sEndDate;

			if (iZoomLevel >= 8) {
				sStartDate = moment().startOf("hour").toDate();
				sEndDate = moment().endOf("hour").add(1, "hour").toDate();
			} else {
				sStartDate = moment().startOf("day").subtract(1, "day").toDate();
				sEndDate = moment().endOf("day").add(1, "day").toDate();
			}
			oAxisTimeStrategy.setVisibleHorizon(new sap.gantt.config.TimeHorizon({
				startTime: sStartDate,
				endTime: sEndDate
			}));

		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		/**
		
		/**
		 * when start and end date is given then this values will be set as new default dates
		 * inside viewModel and a new total horizon is rendered for Gantt
		 * 
		 * @param {object} oStartDate - start date of gantt total horizon
		 * @param {object} oEndDate - end date of gantt total horizon
		 */
		_setNewHorizon: function (oStartDate, oEndDate) {
			if (oStartDate) {
				this.getModel("viewModel").setProperty("/gantt/defaultStartDate", oStartDate);
			} else {
				oStartDate = this.getModel("viewModel").getProperty("/gantt/defaultStartDate");
			}
			if (oEndDate) {
				this.getModel("viewModel").setProperty("/gantt/defaultEndDate", oEndDate);
			} else {
				oEndDate = this.getModel("viewModel").getProperty("/gantt/defaultEndDate");
			}
			this.oZoomStrategy = this._createGanttHorizon(oStartDate, oEndDate);
			this.oZoomStrategy.setTimeLineOption(Formatter.getTimeLineOptions(this._previousView));
			this._ganttChart.setAxisTimeStrategy(this.oZoomStrategy);
		},

		/**
		 * Creating Gantt Horizon for New Gant Layout
		 * @param {object} oStartDate - start date
		 * @param {object} oEndDate - end date
		 */
		_createGanttHorizon: function (oStartDate, oEndDate) {
			return new StepwiseZoomStrategy({
				visibleHorizon: new TimeHorizon({
					startTime: oStartDate,
					endTime: oEndDate
				}),
				totalHorizon: new TimeHorizon({
					startTime: oStartDate,
					endTime: oEndDate
				})
			});

		},
		/**
		 * reset the changes when overlapped with other assigmnment
		 * reset the original shape details if validation gets failed
		 */
		_resetChanges: function () {
			var oData = this.oPlanningModel.getProperty("/tempData/popover"),
				oldPopoverData = this.oPlanningModel.getProperty("/tempData/oldPopoverData"),
				oFoundData = this._getChildrenDataByKey("Guid", oData.Guid, null);

			// reset the original shape details if validation gets failed
			if (oData.Guid === oldPopoverData.Guid) {
				for (var i = 0; i < oFoundData.length; i++) {
					this.oPlanningModel.setProperty(oFoundData[i], oldPopoverData);
				}
			}
		},
		/*
		 * Returns true filter start date is after oStartDate, else false
		 * @param {object} oStartDate - Date
		 */
		_isStartDateBeyondFilterDateRange: function (oStartDate) {

			var startDate = this.getModel("viewModel").getProperty("/gantt/defaultStartDate"),
				bValidate = false;
			if (moment(startDate).startOf('day').isAfter(moment(oStartDate).startOf('day').toDate())) {
				bValidate = true;
			}
			return bValidate;

		},

		/*
		 * Returns true filter end date is before oEndDate, else false
		 * @param {object} oEndDate - Date
		 */
		_isEndDateBeyondFilterDateRange: function (oEndDate) {
			var endDate = this.getModel("viewModel").getProperty("/gantt/defaultEndDate"),
				bValidate = false;
			if (moment(endDate).endOf('day').isBefore(moment(oEndDate).endOf('day').toDate())) {
				bValidate = true;
			}
			return bValidate;
		},

		
	});
});