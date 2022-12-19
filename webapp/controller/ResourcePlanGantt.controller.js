/* globals moment */
sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController",
	"sap/ui/core/mvc/OverrideExecution",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/base/util/deepClone",
	"sap/base/util/deepEqual",
	"com/evorait/evosuite/evoresource/model/models",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/gantt/misc/Utility",
	"sap/base/util/merge",
	"sap/ui/core/Popup"
], function (BaseController, OverrideExecution, formatter, deepClone, deepEqual, models, Fragment, Filter, FilterOperator,
	Utility, merge, Popup) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.ResourcePlanGantt", {

		metadata: {
			// extension can declare the public methods
			// in general methods that start with "_" are private
			methods: {
				onChangeTimeMode: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onInitializedSmartVariant: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onVisibleHorizonUpdate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onSearch: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onShapePress: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onShapeDoubleClick: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onPressSave: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				deleteSaveFunction: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				onPressCancel: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onPressChangeAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onPressDeleteAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onResourceGroupDrop: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				openShapeChangePopover: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onChangeResourceGroup: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onChangeDate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onPressToday: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onClickExpandCollapse: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onShowDemandPress: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onShapeDrop: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onShapeResize: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				changeShapeDate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onChangeDaySelection: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				onEveryLiveChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				onChangeRepeatMode: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				updateNewDataFromGanttFilterBar: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onDemandProceed: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				resetGanttFilterBarToPreviousData: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				validateUIDate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				openDemandDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				onDemandDialogClose: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				afterVariantLoad: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				beforeVariantFetch: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onGanttFilterOK: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				isGroupDeletable: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				isShiftDeletable: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onChangeEndDate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onShapeSelectionChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onPressDeleteMultiAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				openDeleteAssignmentListDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				validateForMultiDelete: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onMultiDemandProceed: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				oMultiDemandDialogClose: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				openMultiDemandListDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onDeleteListFilterSelect: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onDeleteAllAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onDeleteAssignmentDialogClose: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				closeMultiDemandDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				closeDeleteAssignmentDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				openAddNewResourceDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onPressCloseResourceDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				addNewResource: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onShapeContextMenu: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				openShapeContextMenu: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				handleShapeContextMenuPress: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				deleteRepeatingAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				editRepeatingAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onChangeSelectResource: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onPressCreateMultiAssignment: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				openMultiCreateAssignmentDialog: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				setMultiCreateData: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onConfirmMultiCreate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onCloseMultiCreate: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onMultiCreateResourceListChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onMultiCreateGroupChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onMultiCreateShiftChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				},
				onMultiCreateDateChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.After
				}
			}
		},

		oOriginData: null,
		oPlanningModel: null,
		_defaultView: "DAY",
		_treeTable: null,
		_previousView: "DAY",
		groupShiftContext: null,
		groupShiftContextForRepeat: null,
		editSeriesDate: false,
		_ganttChart: null,
		_smartFilterBar: null,
		_dateRangeFilter: null,
		_viewModeFilter: null,
		_sGanttViewMode: null,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourcePlanningMain
		 */
		onInit: function () {
			this._ganttChart = this.getView().byId("idResourcePlanGanttChartTable");
			this._treeTable = this.getView().byId("idResourcePlanGanttTreeTable");
			this._smartFilterBar = this.getView().byId("idPageResourcePlanningSmartFilterBar");
			this._dateRangeFilter = this.getView().byId("idFilterGanttPlanningDateRange");
			this._viewModeFilter = this.getView().byId("idFilterGanttPlanningMode");
			this._sGanttViewMode = formatter.getViewMapping(this._defaultView);

			//idPageResourcePlanningWrapper
			this._initialisePlanningModel();
		},

		/**
		 * Called when before rendering ui eleents.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourcePlanningMain
		 */
		onBeforeRendering: function () {},

		/* =========================================================== */
		/* Events                                                      */
		/* =========================================================== */

		/**
		 * When filterbar was initialized then get all filters and send backend request
		 * @param {object} oEvent - change event of filterbar
		 */
		onInitializedSmartVariant: function (oEvent) {
			var oSmartFilterBar = oEvent.getSource(),
				oSmartVariant = oSmartFilterBar.getSmartVariant(),
				oVariantText = oSmartVariant.oVariantText,
				oStartDate = null,
				oEndDate = null;
			this.getOwnerComponent().oSystemInfoProm.then(function (oResult) {
				if (oVariantText.getProperty("text") === "Standard") {
					oStartDate = moment(oResult.DEFAULT_DAILYVIEW_STARTDATE).startOf("day").toDate();
					oEndDate = moment(oResult.DEFAULT_DAILYVIEW_ENDDATE).endOf("day").subtract(999, 'milliseconds').toDate();
					this._setNewHorizon(oStartDate, oEndDate);
				}
				this._loadGanttData();
				this.updateNewDataFromGanttFilterBar();
			}.bind(this));
		},

		/**
		 * When user srolls horizontal inside gantt chart 
		 * save visible start and end date
		 * @param {object} oEvent - event when gantt chart visible view changes
		 */
		onVisibleHorizonUpdate: function (oEvent) {
			var mParams = oEvent.getParameters(),
				sStartTime = mParams.currentVisibleHorizon.getStartTime(),
				sEndTime = mParams.currentVisibleHorizon.getEndTime();

			this._visibileStartDate = moment(sStartTime, "YYYYMMDDHHmmss");
			this._visibileEndDate = moment(sEndTime, "YYYYMMDDHHmmss");
		},

		/**
		 * When Go button in filterbar was pressed then get all filters and send backend request
		 * @param {object} oEvent - change event of filterbar
		 */
		onSearch: function () {
			var oDateRangePicker = this.getView().byId("idFilterGanttPlanningDateRange"),
				oStartDate = moment(oDateRangePicker.getDateValue()).startOf("day").toDate(),
				oEndDate = moment(oDateRangePicker.getSecondDateValue()).endOf("day").subtract(999, 'milliseconds').toDate(),
				oModeSource = this._viewModeFilter,
				bChanges = this.oPlanningModel.getProperty("/hasChanges"),
				sKey = oModeSource.getSelectedItem().getProperty("key");
			this._getGanttScrollState(true);

			if (bChanges) {
				var sTitle = this.getResourceBundle().getText("tit.confirm"),
					sMsg = this.getResourceBundle().getText("msg.ganttReload");
				var successcallback = function () {
					this._loadGanttData();
					this.updateNewDataFromGanttFilterBar();
					if (this._previousView !== sKey) {
						this._setDateFilter(sKey);
					} else {
						this._setNewHorizon(oStartDate, oEndDate);
					}

				};
				var cancelcallback = function () {
					this.resetGanttFilterBarToPreviousData();
				};
				this.showConfirmDialog(sTitle, sMsg, successcallback.bind(this), cancelcallback.bind(this));
			} else {
				if (this._previousView !== sKey) {
					this._setDateFilter(sKey);
				} else {
					this._setNewHorizon(oStartDate, oEndDate);
				}
				this._loadGanttData();
				this.updateNewDataFromGanttFilterBar();
			}

		},
		/**
		 * Function called when shape is pressed
		 * @param {object} oEvent - Event object of the shape pressed
		 */
		onShapePress: function (oEvent) {
			var oShape = oEvent.getParameter("shape");
			if (oShape.sParentAggregationName === "shapes1") {
				oEvent.preventDefault(); //when background shape is single clicked, do nothing (no border set when selected)
			}
		},
		/**
		 * when shape was double pressed show popover with details of assignment
		 * or create new temporary assignment
		 * @param {object} oEvent - when shape in Gantt was selected
		 */
		onShapeDoubleClick: function (oEvent) {
			var mParams = oEvent.getParameters(),
				oShape = mParams.shape,
				isNew,
				oRowContext,
				sStartTime,
				sEndTime,
				oRowData,
				oPopoverData,
				oParentData;
			if (!mParams || !oShape) {
				return;
			}
			isNew = oShape['sParentAggregationName'] === 'shape1';
			oRowContext = mParams.rowSettings.getParent().getBindingContext("ganttPlanningModel");
			sStartTime = oShape.getTime();
			sEndTime = oShape.getEndTime();
			oRowData = oRowContext.getObject();
			if (oRowData.NodeType !== "RESOURCE") {
				oParentData = this._getParentResource(oRowData.ParentNodeId);
				oRowData.USER_TIMEZONE = oParentData.TIME_ZONE;
			}
			oPopoverData = {
				Guid: new Date().getTime(),
				sStartTime: sStartTime,
				sEndTime: sEndTime,
				oResourceObject: oRowData,
				bDragged: false,
				isNew: isNew,
				isEditable: true
			};

			this.openShapeChangePopover(mParams.shape, oPopoverData);
		},

		/**
		 * called when shape was dropped
		 * Calling 'changeShapeDate' function with shape detail
		 * @param {object} oEvent - when shape in Gantt was dropped
		 */
		onShapeDrop: function (oEvent) {
			this.changeShapeDate(oEvent);
		},
		/**
		 * called when shape was resized
		 * Calling 'changeShapeDate' function with shape detail
		 * @param {object} oEvent - when shape in Gantt was resized
		 */
		onShapeResize: function (oEvent) {
			this.changeShapeDate(oEvent);
		},
		/**
		 * Called after shape is dropped or resized
		 * This method will change the start and end date of assignment according to dropped or resized date.
		 * This method will validate if the date is valid and do backend validation. If validation fails reset the assignemnt to previoud date.
		 * @param {object} oEvent - when shape in Gantt was /dropped/resized
		 */
		changeShapeDate: function (oEvent) {
			var sShapeId,
				oShapeInfo,
				oTargetShape,
				oStartTime,
				oEndTime,
				oOldStartTime,
				oOldEndTime,
				sGuid,
				aFoundData = [],
				sOldDataPath,
				oOldData = [],
				oAssignment = {},
				oDraggedShapeDates,
				dateDifference;

			if (oEvent.getId() === 'shapeDrop') {
				sShapeId = oEvent.getParameter("lastDraggedShapeUid");
				oShapeInfo = Utility.parseUid(sShapeId);
				oTargetShape = oEvent.getParameter("targetShape");
				oDraggedShapeDates = oEvent.getParameter("draggedShapeDates")[sShapeId];
				dateDifference = moment(oDraggedShapeDates["endTime"]).diff(oDraggedShapeDates["time"]);
				oOldStartTime = oDraggedShapeDates["time"];
				oOldEndTime = oDraggedShapeDates["endTime"];
				oStartTime = oTargetShape ? oTargetShape.getProperty("time") : null;
				oEndTime = oStartTime ? new Date(moment(oStartTime).add(dateDifference)) : null;
			} else if (oEvent.getId() === 'shapeResize') {
				sShapeId = oEvent.getParameter("shapeUid");
				oShapeInfo = Utility.parseUid(sShapeId);
				oOldStartTime = moment(oEvent.getParameter("oldTime")[0]).startOf('day').toDate();
				oOldEndTime = moment(oEvent.getParameter("oldTime")[1]).endOf('day').subtract(999, 'milliseconds').toDate();
				oStartTime = moment(oEvent.getParameter("newTime")[0]).startOf('day').toDate();
				oEndTime = moment(oEvent.getParameter("newTime")[1]).endOf('day').subtract(999, 'milliseconds').toDate();
			}
			//validate if date valid
			if (!this.validateUIDate(oStartTime, oEndTime, oOldStartTime, oOldEndTime)) {
				return;
			}

			sGuid = oShapeInfo.shapeId;
			aFoundData = this._getChildrenDataByKey("Guid", sGuid, null);
			sOldDataPath = this._getChildDataByKey("Guid", sGuid, null);

			//validate if of Shift HR_SHIFT_FLAG is true
			if (sOldDataPath.oData.NODE_TYPE === "SHIFT" && sOldDataPath.oData.HR_SHIFT_FLAG) {
				return;
			}

			oOldData = deepClone(sOldDataPath.oData);
			if (aFoundData) {
				aFoundData.forEach(function (sPath) {
					oAssignment = this.getModel("ganttPlanningModel").getProperty(sPath);
					oAssignment.StartDate = oStartTime;
					oAssignment.EndDate = oEndTime;
					oAssignment.EffectiveStartDate = oStartTime;
					oAssignment.EffectiveEndDate = oEndTime;
					oAssignment.isChanging = true;
					oAssignment.IsSeries = false;
					oAssignment.SeriesRepeat = '';
				}.bind(this));
			}
			this.getModel("ganttPlanningModel").refresh();

			this.oPlanningModel.setProperty("/tempData/popover", oAssignment);
			this.oPlanningModel.setProperty("/tempData/oldPopoverData", oOldData);
			this._validateAssignment();
		},
		/**
		 * Called to open ShapeChangePopover
		 * @param {object} oTargetControl - Control where popover should open
		 * @param {object} oPopoverData - Data to be displayed in Popover
		 */
		openShapeChangePopover: function (oTargetControl, oPopoverData) {
			this.groupShiftContext = null;

			if (oTargetControl && this._sGanttViewMode.isFuture(oTargetControl.getEndTime())) {
				// create popover
				if (!this._oPlanningPopover) {
					Fragment.load({
						name: "com.evorait.evosuite.evoresource.view.fragments.ShapeChangePopover",
						controller: this
					}).then(function (pPopover) {
						this._oPlanningPopover = pPopover;
						this._setPopoverData(oTargetControl, oPopoverData);
						this.getView().addDependent(this._oPlanningPopover);
						this._oPlanningPopover.openBy(oTargetControl);
						//after popover gets opened check popover data for resource group color
						this._oPlanningPopover.attachAfterOpen(function () {
							var oData = this.oPlanningModel.getProperty("/tempData/popover");
							this._addResourceGroupColor(oData);
							this._validateForOpenPopover(oData);
						}.bind(this));
						//after popover gets closed remove popover data
						this._oPlanningPopover.attachAfterClose(function (oEvent) {
							this._afterPopoverClose(oEvent);
						}.bind(this));
					}.bind(this));
				} else {
					this._setPopoverData(oTargetControl, oPopoverData);
					this._oPlanningPopover.openBy(oTargetControl);
				}
			} else {
				this.showMessageToast(this.getResourceBundle().getText("xtxt.noPastAssignment"));
			}
		},

		/** Called to open AddNewResource Dialog
		 * @param {object} oTargetControl - Control where popover should open
		 * @param {object} oPopoverData - Data to be displayed in Dialog
		 * */

		openAddNewResourceDialog: function (oTargetControl, oPopoverData) {
			this.groupShiftContext = null;

			if (oTargetControl) {
				// create popover
				if (!this._oPlanningDialog) {
					Fragment.load({
						name: "com.evorait.evosuite.evoresource.view.fragments.AddNewResource",
						controller: this
					}).then(function (pPopover) {
						this._oPlanningDialog = pPopover;
						this._setPopoverData(oTargetControl, oPopoverData);
						this.getView().addDependent(this._oPlanningDialog);
						// this._oPlanningDialog.openBy(oTargetControl);
						this._oPlanningDialog.open();
						//after popover gets opened check popover data for resource group color
						this._oPlanningDialog.attachAfterOpen(function () {
							var oData = this.oPlanningModel.getProperty("/tempData/popover");
							this._addResourceGroupColorDialog(oData);
							this._validateForOpenPopover(oData);
						}.bind(this));
						//after popover gets closed remove popover data
						this._oPlanningDialog.attachAfterClose(function (oEvent) {
							this._afterPopoverClose(oEvent);
						}.bind(this));
					}.bind(this));
				} else {
					this._setPopoverData(oTargetControl, oPopoverData);
					this._oPlanningDialog.open();
				}
			} else {
				this.showMessageToast(this.getResourceBundle().getText("xtxt.noPastAssignment"));
			}
		},

		/** Called to close AddNewResource Dialog
		 * deleting the added item if the user is not saving it and closing the dialog
		 * */

		onPressCloseResourceDialog: function () {
			if (this._oPlanningDialog) {
				//on close of dialog, the newly added resource is deleted here
				var children = this.oPlanningModel.getProperty("/data/children");
				children.splice(children.length - 1, 1);
				this.oPlanningModel.refresh();
				this._oPlanningDialog.close();
			}
		},

		/**
		 *Called when new Resource is dropped onto the table
		 *@param oTargetControl - Control where popover should open
		 *@param oDraggedObj - Dragged object from the resource table 
		 **/

		addNewResource: function (oTargetControl, oDraggedObj) {
			var aChildren = this.oPlanningModel.getProperty("/data/children"),
				sFirstName = oDraggedObj.data.FIRSTNAME,
				sLastName = oDraggedObj.data.LASTNAME,
				sPernr = oDraggedObj.data.PERNR,
				sGUID = oDraggedObj.data.ResourceGuid,
				obj = {},
				iScrollTo;

			var nodeType = "RES_GANT";
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
						aProperty = aProperty.concat(oEntityType ? oEntityType.property : []);
					}
				}
				aProperty.forEach(function (property) {
					var isCreatable = property["sap:creatable"];
					obj[property.name] = "";
				});

				obj.ChildCount = 0;
				obj.Description = sFirstName + " " + sLastName + " (" + sPernr + ")";
				obj.ResourceGuid = sGUID;
				obj.StartDate = moment().startOf("days").toDate();
				obj.EndDate = moment().endOf("days").toDate();
				obj.PERNR = sPernr;
				obj.NodeId = sGUID;
				obj.NodeType = "RESOURCE";
				obj.children = [];
				aChildren.push(obj);
				//refreshing the model
				this.oPlanningModel.refresh();

				var oPopoverData = {
					Guid: new Date().getTime().toString(),
					sStartTime: obj.StartDate,
					sEndTime: obj.EndDate,
					oResourceObject: obj,
					bDragged: true
				};

				//Scroll to botton of the screen before adding so that it's visible while adding
				iScrollTo = this.getLengthOfAllChildren(aChildren);
				this.getView().getModel("viewModel").setProperty("/gantt/firstVisibleRow", iScrollTo);
				this._setGanttScrollState();

				this.openAddNewResourceDialog(oTargetControl, oPopoverData);
			}.bind(this));
		},

		/**
		 * Called when Resource drop is dropped in Gantt
		 * @param {object} oEvent
		 */
		onResourceGroupDrop: function (oEvent) {

			//add functionality - dragged from resource tab
			var sDraggedFrom = oEvent.getParameter("draggedControl").getBindingContext().getPath().split("(")[0];
			var oDroppedControl = oEvent.getParameter("droppedControl"),
				oContext = oDroppedControl.getBindingContext("ganttPlanningModel"),
				oObject = deepClone(oContext.getObject()),
				oDraggedObject = this.getView().getModel("viewModel").getProperty("/draggedData"),
				oBrowserEvent = oEvent.getParameter("browserEvent"),
				oDroppedTarget,
				sStartTime, sEndTime,
				oPopoverData,
				oParentData,
				aIgnoreProperty = ["__metadata", "NodeId", "ParentNodeId", "USER_TIMEZONE"];

			//added a new condition as the drop location is on table and not on gantt
			if (sDraggedFrom === "/ResourceSet") {
				oDroppedTarget = oEvent.getParameter("droppedControl");
				this.addNewResource(oDroppedTarget, oDraggedObject);
			} else {

				//ondrop of the the resourcegroup
				oDroppedTarget = sap.ui.getCore().byId(oBrowserEvent.toElement.id);
				sStartTime = oDroppedTarget.getTime();
				sEndTime = oDroppedTarget.getEndTime();

				if (oObject.NodeType !== "RESOURCE") {
					oParentData = this._getParentResource(oObject.ParentNodeId);
					oObject.USER_TIMEZONE = oParentData.TIME_ZONE;
				} else
					oObject.ParentNodeId = oObject.NodeId;

				oObject = this.copyObjectData(oObject, oDraggedObject.data, aIgnoreProperty);

				oPopoverData = {
					Guid: new Date().getTime(),
					sStartTime: sStartTime,
					sEndTime: sEndTime,
					oResourceObject: oObject,
					bDragged: true
				};
				this.openShapeChangePopover(oDroppedTarget, oPopoverData);
			}

		},
		/**
		 * Button event press save Gantt changes
		 * @param {object} oEvent
		 */
		onPressSave: function (oEvent) {
			var aUassignData = this.oPlanningModel.getProperty("/unAssignData"),
				sFunctionName = "DeleteDemandAssignment",
				aPromises = [];
			this._getGanttScrollState();
			if (aUassignData && aUassignData.length) {
				aUassignData.forEach(function (Guid) {
					aPromises.push(
						new Promise(function (resolve, reject) {
							var oParams = {
								AssignmentGUID: Guid
							};
							var successCallback = function (oData, oResponse) {
								if (oResponse && oResponse.headers && oResponse.headers["sap-message"]) {
									var sMessageBundle = JSON.parse(oResponse.headers["sap-message"]);
									if (sMessageBundle.severity !== "error") {
										resolve(oData, oResponse);
									}
								}
							}.bind(this);
							this.callFunctionImport(oParams, sFunctionName, "POST", successCallback);
						}.bind(this))
					);
				}.bind(this));
				Promise.all(aPromises).then(
					// aData - array of each oData by the success callbacks
					function (oData, oResponse) {
						this.deleteSaveFunction();
					}.bind(this)
				);
			} else {
				this.deleteSaveFunction();
			}
		},

		/**
		 * Delete functionality and create functionality
		 */
		deleteSaveFunction: function () {
			this.getModel().setDeferredGroups(["batchDelete"]);
			var mParam = {
				urlParameters: null,
				groupId: "batchDelete",
				success: this._deleteSuccess.bind(this),
				error: this._deleteFailed.bind(this)
			};
			this._prepareDeleteData(mParam).then(function (oData) {
				if (oData.length > 0) {
					this.getModel().submitChanges(mParam);
				} else {
					this.saveChanges(this._saveSuccess.bind(this), this._saveFailed.bind(this));
				}
			}.bind(this));
		},

		/**
		 * Button event to cancel all Gantt changes
		 * User has to confirm reset of changes
		 * @param {object} oEvent
		 */
		onPressCancel: function (oEvent) {
			var sTitle = this.getResourceBundle().getText("tit.confirmCancel"),
				sMsg = this.getResourceBundle().getText("msg.confirmCancel");
			var successFn = function () {
				this._getGanttScrollState();
				this._loadGanttData();
				this.getModel("viewModel").setProperty("/isResetEnabled", false);
			};
			this.showConfirmDialog(sTitle, sMsg, successFn.bind(this));
		},

		/**
		 * Change of shape assignment
		 * check if group or date range was changed
		 * when it was changed send validation request
		 * @param {object} oEvent - event of OK button press
		 */
		onPressChangeAssignment: function (oEvent) {
			var oSimpleformFileds = this.getView().getControlsByFieldGroupId("changeShapeInput"),
				oValidation = this.validateForm(oSimpleformFileds),
				oAssignmentData = this.oPlanningModel.getProperty("/tempData/popover");

			if (oValidation && oValidation.state === "success") {
				if (oAssignmentData.isNew) {
					if (oAssignmentData.isApplySeries === true) {
						oAssignmentData.isRepeating = true;
						oAssignmentData.isTemporary = false;
						this.editSeriesDate = true;
						this._removeAssignmentShape(oAssignmentData, true);
					} else {
						this._validateAssignment();
					}

				} else {
					if (oAssignmentData.isApplySeries === true) {
						oAssignmentData.isRepeating = true;
						oAssignmentData.isTemporary = false;
						this.editSeriesDate = true;
						this._removeAssignmentShape(oAssignmentData, true);
					} else {
						oAssignmentData.IsSeries = false;
						oAssignmentData.SeriesRepeat = "";
						this._validateAssignment();
					}
				}

			}
		},

		/**
		 * delete a shape inside Gantt
		 * user needs confirm deletion and when its not freshly created assignment 
		 * a validation request is send to backend
		 * @param {object} oEvent - event of delete button press
		 */
		onPressDeleteAssignment: function (oEvent) {
			var oData = this.oPlanningModel.getProperty("/tempData/popover"),
				sTitle = this.getResourceBundle().getText("tit.confirmDelete"),
				sMsg = this.getResourceBundle().getText("msg.comfirmDeleteMessage");
			var successcallback = function () {
				this._removeAssignmentShape(oData, true);
				if (this._oPlanningPopover) {
					this._oPlanningPopover.close();
				}
			};
			var cancelcallback = function () {};
			if (oData.isNew) {
				this._removeAssignmentShape(oData, true);
				this.getModel("viewModel").setProperty("/isResetEnabled", this.oPlanningModel.getProperty("/hasChanges"));
				if (this._oPlanningPopover) {
					this._oPlanningPopover.close();
				}
			} else {
				this.showConfirmDialog(sTitle, sMsg, successcallback.bind(this), cancelcallback.bind(this));
			}
		},

		/**
		 * On change resource group
		 * set the color code to shape
		 * @param {object} oEvent
		 */
		onChangeResourceGroup: function (oEvent) {
			var oSource = oEvent.getSource(),
				oSelectedItem = oSource.getSelectedItem(),
				oData = this.oPlanningModel.getProperty("/tempData/popover");

			this.groupShiftContext = oSelectedItem.getBindingContext("viewModel");

			oSource.setValueState(sap.ui.core.ValueState.None);
			//validate duplicate assignments
			if (this._validateDuplicateAsigment()) {
				return;
			}

			if (oData.isNew) {
				this.oPlanningModel.setProperty("/tempData/popover/RESOURCE_GROUP_COLOR", this.groupShiftContext.getProperty("ResourceGroupColor"));
				this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", this.groupShiftContext.getProperty("ResourceGroupDesc"));
				this.oPlanningModel.setProperty("/tempData/popover/ResourceGroupDesc", this.groupShiftContext.getProperty("ResourceGroupDesc"));

				if (oData.isApplySeries) {
					this.groupShiftContextForRepeat = this.groupShiftContext;
					this.groupShiftContext = null;
					oData.isRepeating = true; // for deleting series
					this._removeAssignmentShape(oData, true);
				} else {
					oData.IsSeries = false;
					oData.SeriesRepeat = "";
					this._removeAssignmentShape(oData, true);
					//add different resource group if it is not exist
					this._addSingleChildToParent(oData, false, false);
				}

				if (!oData.isTemporary && !this.bAddNewResource) {
					this._oPlanningPopover.close();
				}
			} else {
				if (oData.isApplySeries) {
					this.groupShiftContextForRepeat = this.groupShiftContext;
					this.groupShiftContext = null;
					oData.isRepeating = true; // for deleting series
				} else {
					oData.IsSeries = false;
					oData.SeriesRepeat = "";
				}
				this._removeAssignmentShape(oData, true);
				this._oPlanningPopover.close();
			}
		},

		/**
		 * On change shift
		 * update the shift data based on selection
		 * @param {object} oEvent
		 */
		onChangeShift: function (oEvent) {
			var oSource = oEvent.getSource(),
				oSelectedItem = oSource.getSelectedItem(),
				oSelContext = oSelectedItem.getBindingContext("viewModel"),
				oData = this.oPlanningModel.getProperty("/tempData/popover"),
				shiftData;

			this.groupShiftContext = oSelectedItem.getBindingContext("viewModel");

			oSource.setValueState(sap.ui.core.ValueState.None);
			//validate duplicate assignments
			if (this._validateDuplicateAsigment()) {
				return;
			}

			if (oData.isNew) {
				this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", this.groupShiftContext.getProperty("ScheduleIdDesc"));
				shiftData = oSelContext.getObject();
				oData = this.mergeObject(oData, shiftData);
				if (oData.isApplySeries) {
					this.groupShiftContextForRepeat = this.groupShiftContext;
					this.groupShiftContext = null;
					oData.isRepeating = true; // for deleting series
					this._removeAssignmentShape(oData, true);
				} else {
					oData.IsSeries = false;
					oData.SeriesRepeat = "";
					this._removeAssignmentShape(oData, true);
					//add different resource group if it is not exist
					this._addSingleChildToParent(oData, false, false);
				}

				if (!oData.isTemporary) {
					this._oPlanningPopover.close();
				}
			} else {
				if (oData.isApplySeries) {
					this.groupShiftContextForRepeat = this.groupShiftContext;
					this.groupShiftContext = null;
					oData.isRepeating = true; // for deleting series
				} else {
					oData.IsSeries = false;
					oData.SeriesRepeat = "";
				}
				this._removeAssignmentShape(oData, true);
				this._oPlanningPopover.close();
			}
		},

		/**
		 * change selected date to UTC date to make display valid date on the screen
		 * @param {object} oEvent
		 */
		onChangeDate: function (oEvent) {
			var oDateRange = oEvent.getSource(),
				oStartDate = oDateRange.getDateValue(),
				oEndDate = moment(oDateRange.getSecondDateValue()).subtract(999, "milliseconds").toDate(),
				oPopoverData = this.oPlanningModel.getProperty("/tempData/popover"),
				oOldPopoverData = this.oPlanningModel.getProperty("/tempData/oldPopoverData"),
				dStartDateDiff, oSeriesStartDate, sStartDateProp;
			this.oPlanningModel.setProperty("/tempData/popover/StartDate", oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/EffectiveStartDate", oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/EndDate", oEndDate);
			this.oPlanningModel.setProperty("/tempData/popover/EffectiveEndDate", oEndDate);

			//series date calculation
			if (oPopoverData.NODE_TYPE === "RES_GROUP") {
				sStartDateProp = "StartDate";
			} else if (oPopoverData.NODE_TYPE === "SHIFT") {
				sStartDateProp = "EffectiveStartDate";
			}
			dStartDateDiff = moment(oPopoverData[sStartDateProp]).diff(oOldPopoverData[sStartDateProp], "d");
			oSeriesStartDate = moment(formatter.convertFromUTCDate(oPopoverData["SERIES_START_DATE"], oPopoverData.isNew, oPopoverData.isChanging))
				.add(dStartDateDiff, "d").toDate();
			this.oPlanningModel.setProperty("/tempData/popover/SERIES_START_DATE", oSeriesStartDate);

			this.oPlanningModel.setProperty("/tempData/popover/isChanging", true);

			//validate for the overlapping
			if (this._validateDuplicateAsigment()) {
				return;
			}
			this.oPlanningModel.setProperty("/tempData/popover/isTemporary", true);
			this.oPlanningModel.setProperty("/tempData/popover/isRestChanges", true);
		},
		/**
		 * Called when end date is changed using End Date picker
		 * change selected date to UTC date to make display valid date on the screen
		 * @param {object} oEvent
		 */
		onChangeEndDate: function (oEvent) {
			var oDatePicker = oEvent.getSource(),
				oEndDate = moment(oDatePicker.getDateValue()).endOf('day').subtract(999, 'millisecond').toDate(),
				oStartDate = this.oPlanningModel.getProperty("/tempData/popover/StartDate");
			oStartDate = formatter.convertFromUTCDate(oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/StartDate", oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/EffectiveStartDate", oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/EndDate", oEndDate);
			this.oPlanningModel.setProperty("/tempData/popover/EffectiveEndDate", oEndDate);
			//validate for the overlapping
			if (this._validateDuplicateAsigment()) {
				return;
			}
			this.oPlanningModel.setProperty("/tempData/popover/isTemporary", true);
			this.oPlanningModel.setProperty("/tempData/popover/isChanging", true);
			this.oPlanningModel.setProperty("/tempData/popover/isRestChanges", true);
		},

		/**
		 * On click on today adjust the view of Gantt horizon
		 * @param {object} oEvent
		 */
		onPressToday: function (oEvent) {
			if (!this.oZoomStrategy) {
				this.oZoomStrategy = this._ganttChart.getAxisTimeStrategy();
			}
			this.changeGanttHorizonViewAt(this.getModel("viewModel"), this.oZoomStrategy.getZoomLevel(), this.oZoomStrategy);
		},

		/**
		 * On click on expand the tree nodes gets expand to level 1
		 * On click on collapse all the tree nodes will be collapsed to root
		 * @param {object} oEvent
		 */
		onClickExpandCollapse: function (oEvent) {
			var oButton = oEvent.getSource(),
				oCustomData = oButton.getCustomData();

			if (oCustomData[0].getValue() === "EXPAND" && this._treeTable) {
				this._treeTable.expandToLevel(1);
			} else {
				this._treeTable.collapseAll();
			}
		},

		/**
		 * Trigger when Demand link press navigate to EvoPlan
		 * @param {object} oEvent
		 */
		onShowDemandPress: function (oEvent) {
			var oSource = oEvent.getSource();
			this.openApp2AppPopover(oSource, "demandModel", "Orderid");
		},

		/**
		 * Change event for th repeat mode selection
		 * reset the repeat mode data each time selection gets changed
		 */
		onChangeRepeatMode: function (oEvent) {
			this.oPlanningModel.setProperty("/tempData/popover/SeriesEvery", "");
			this.oPlanningModel.setProperty("/tempData/popover/Days", []);
			this.oPlanningModel.setProperty("/tempData/popover/On", 0);
		},

		/**
		 * Live change event for the every repeat count field
		 * reset the value state if value inside the field
		 */
		onEveryLiveChange: function (oEvent) {
			var oSource = oEvent.getSource();
			if (oSource.getValue()) {
				oSource.setValueState("None");
			}
		},

		/**
		 * change event for the day selection combobox
		 * reset the value state if any item selection
		 */
		onChangeDaySelection: function (oEvent) {
			var oSource = oEvent.getSource();
			if (oSource.getSelectedKeys() && oSource.getSelectedKeys().length) {
				oSource.setValueState("None");
			}
		},

		/**
		 * change event for the assignment type selection combobox
		 * Based on the selection shape is getting create and pushed into json
		 * @param {object} oEvent
		 */
		onChangeAssignmentType: function (oEvent) {
			var newData = this.oPlanningModel.getProperty("/tempData/popover"),
				oldData = this.oPlanningModel.getProperty("/tempData/oldPopoverData"),
				shapeDescription;
			if (newData.NODE_TYPE === "RES_GROUP") {
				shapeDescription = newData["ResourceGroupDesc"] || this.getResourceBundle().getText("xtit.group");
			} else if (newData.NODE_TYPE === "SHIFT") {
				shapeDescription = newData["ScheduleIdDesc"] || this.getResourceBundle().getText("xtit.shift");
			}
			this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", shapeDescription);
			this._removeAssignmentShape(oldData, true);
			this.createNewTempAssignment(newData.StartDate, newData.EndDate, newData, false).then(function (oData) {
				this._addSingleChildToParent(newData, false, false);
			}.bind(this));
			this.oPlanningModel.setProperty("/tempData/oldPopoverData", deepClone(newData));
		},
		/**
		 * Update global variables with the filter value
		 * These values can be used to reset the filter bar with previous value
		 */
		updateNewDataFromGanttFilterBar: function () {
			this._previousView = this._viewModeFilter.getSelectedItem() ? this._viewModeFilter.getSelectedItem().getProperty("key") : "DAY";
			this._previousDateRange = {
				startDate: this._dateRangeFilter.getProperty("dateValue"),
				endDate: this._dateRangeFilter.getProperty("secondDateValue")
			};
			this._previousGanttFilter = this._smartFilterBar.getFilterData();
		},
		/**
		 * Reset the filter bar with the previous value stored in global variable
		 */
		resetGanttFilterBarToPreviousData: function () {
			this._smartFilterBar.setFilterData(this._previousGanttFilter, true);
			this._viewModeFilter.setSelectedKey(this._previousView);
			this._dateRangeFilter.setDateValue(this._previousDateRange["startDate"]);
			this._dateRangeFilter.setSecondDateValue(this._previousDateRange["endDate"]);
		},

		/**
		 * Validates date in the UI with multiple condition
		 * @param {object} oStartTime - changed start date of assignment
		 * @param {object} oEndTime - changed end date of assignment
		 * @param {object} oOldStartTime - old start date of assignment
		 * @param {object} oOldEndTime - old end date of assignment		 * 
		 */
		validateUIDate: function (oStartTime, oEndTime, oOldStartTime, oOldEndTime) {
			var bValidated = true;
			if (!oStartTime || !oEndTime) { //check if date object valid
				bValidated = false;
			}
			if (this._isDatePast(oOldStartTime) && this._isDatePast(oOldEndTime)) { //check if assignment start and end date is past
				bValidated = false;
			}
			if (!this._isDateSame(oOldStartTime, oStartTime)) { //check if start date changed
				if (this._isDatePast(oStartTime)) { // check start date is past
					bValidated = false;
				}
				if (this._isStartDateBeyondFilterDateRange(oStartTime)) {
					bValidated = false;
				}

			}
			if (!this._isDateSame(oOldEndTime, oEndTime)) { //check if end date changed
				if (this._isDatePast(oEndTime)) { //check if end date is past
					bValidated = false;
				}
				if (this._isEndDateBeyondFilterDateRange(oEndTime)) { //check end date is beyond filter range
					bValidated = false;
				}
			}
			if (this._isDatePast(oOldStartTime)) { //check if old end date is past
				if (!this._isDateSame(oOldStartTime, oStartTime)) { //check if end date changed
					bValidated = false;
				}
			}

			return bValidated;
		},
		/*
		 * Method called after variant is loaded
		 * @param {object} oEvent
		 */
		afterVariantLoad: function (oEvent) {
			var oSmartFilterBar = oEvent.getSource(),
				oSmartVariant = oSmartFilterBar.getSmartVariant(),
				oVariantText = oSmartVariant.oVariantText,
				CustomFilter = oSmartFilterBar.getControlConfiguration(),
				oVariantData = oSmartFilterBar.getFilterData(),
				oViewModelGanttData = this.getModel("viewModel").getProperty("/gantt"),
				oDefaultStartDate = null,
				oDefaultEndDate = null;
			CustomFilter.forEach(function (cFilter) {
				var sKey = cFilter.getKey(),
					oCustomControl = oSmartFilterBar.getControlByKey(sKey);
				if (oCustomControl) {
					var selectedValue = oVariantData._CUSTOM[sKey];
					if (sKey === 'StartDate') {
						oCustomControl.setDateValue(new Date(selectedValue));
						oCustomControl.setSecondDateValue(new Date(oVariantData._CUSTOM['EndDate']));
					}
					if (sKey === "Mode") {
						oCustomControl.setSelectedKey(selectedValue);
						this._previousView = selectedValue;
					}
				}
			}.bind(this));
			if (oVariantText.getProperty("text") !== "Standard") {
				oDefaultStartDate = oViewModelGanttData["defaultStartDate"];
				oDefaultEndDate = oViewModelGanttData["defaultEndDate"];
			}
			this._setDateFilter(this._previousView, oDefaultStartDate, oDefaultEndDate);
		},

		/*
		 * Method called before variant is fetched
		 * @param {object} oEvent
		 */
		beforeVariantFetch: function (oEvent) {
			var oSmartFilterBar = oEvent.getSource(),
				CustomFilter = oSmartFilterBar.getControlConfiguration(),
				oValues = {};
			CustomFilter.forEach(function (cFilter) {
				var sKey = cFilter.getKey(),
					oCustomControl = oSmartFilterBar.getControlByKey(sKey);
				if (oCustomControl) {
					if (sKey === 'StartDate') {
						oValues[sKey] = oCustomControl.getDateValue();
						oValues['EndDate'] = oCustomControl.getSecondDateValue();
					}
					if (sKey === "Mode") {
						oValues[sKey] = oCustomControl.getSelectedItem() ? oCustomControl.getSelectedItem().getKey() : "DAY";
					}
				}
			}.bind(this));
			oSmartFilterBar.setFilterData({
				_CUSTOM: oValues
			}, false);
		},

		/**
		 * Called when Filter button in clicked
		 * @param {object} oEvent - event of the filter button
		 * 
		 */
		onPressFilter: function (oEvent) {
			if (!this._oGanttFilterDialog) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.GanttFilter",
					controller: this
				}).then(function (dFilterDialog) {
					this._oGanttFilterDialog = dFilterDialog;
					this.getView().addDependent(this._oGanttFilterDialog);
					this._oGanttFilterDialog.open();
					//after popover gets opened check popover data for resource group color
					this._oGanttFilterDialog.attachAfterOpen(function (oEvent) {}.bind(this));

					//after popover gets closed remove popover data
					this._oGanttFilterDialog.attachAfterClose(function (oEvent) {}.bind(this));
				}.bind(this));
			} else {
				this._oGanttFilterDialog.open();
			}
		},

		/**
		 * Method called when OK is pressed on Setting Dialog of Gantt
		 * Update Gantt based on Gantt Setting data selected in dialog
		 * oParam {object} oEvent - Event
		 */
		onGanttFilterOK: function (oEvent) {
			var aPopupSet = this.getModel("viewModel").getProperty("/GanttSettingInformation"),
				oganttShapeVisibility = this.getModel("viewModel").getProperty("/GanttShapeVisibility");
			aPopupSet.forEach(function (oItem) {
				oganttShapeVisibility[oItem.Type] = oItem.DefaultFlag;
			});
			this.getModel("viewModel").setProperty("/GanttShapeVisibility", oganttShapeVisibility);
			this._oGanttFilterDialog.close();
		},

		/**
		 * Method to call open Demand Dialog
		 */
		openDemandDialog: function () {
			if (!this._oDemandDialog) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.DemandList",
					controller: this
				}).then(function (oDialog) {
					this._oDemandDialog = oDialog;
					this.getView().addDependent(this._oDemandDialog);
					this._oDemandDialog.open();
					this._oDemandDialog.attachAfterOpen(function () {
						var oTable = sap.ui.getCore().byId("idFragDemandListTable");
						oTable.removeSelections();
						var oAssignments = this.getModel("demandModel").getProperty("/data"),
							bVisibile = true;
						oAssignments.forEach(function (oItem) {
							if (!oItem.AllowUnassign && bVisibile) {
								bVisibile = false;
							}
						});
						this.getModel("viewModel").setProperty("/enableProceed", bVisibile);
					}.bind(this));

					this._oDemandDialog.attachAfterClose(function (oEvent) {}.bind(this));

				}.bind(this));
			} else {
				this._oDemandDialog.open();
			}
		},

		/**
		 * To Demand Dialog close
		 * reset the data if it is triggered from change assignment
		 * Reset the popover change default variables
		 */
		onDemandDialogClose: function (oEvent) {
			var oPopoverData = this.oPlanningModel.getProperty("/tempData/popover"),
				oFoundData = this._getChildrenDataByKey("Guid", oPopoverData.Guid, null),
				oOldAssignmentData = this.oPlanningModel.getProperty("/tempData/oldPopoverData");

			for (var i = 0; i < oFoundData.length; i++) {
				this.oPlanningModel.setProperty(oFoundData[i], oOldAssignmentData);
			}

			this._afterPopoverClose();
			this._oDemandDialog.close();
		},

		/**
		 * Called when all assignemnts are unassgned in the demand list
		 * Confirm dialog will open with option
		 * Prepare Unassign local data
		 * proceed further to remove/change assignment functionality
		 */
		onDemandProceed: function () {
			var sTitle = this.getResourceBundle().getText("tit.confirmChange"),
				sMsg = this.getResourceBundle().getText("msg.confirmMessage");
			var sType = this.getModel("demandModel").getProperty("/Type"),
				oData = this.oPlanningModel.getProperty("/tempData/popover");
			var successcallback = function () {
				//Prepare unassign data
				var aDemandData = this.getModel("demandModel").getProperty("/data"),
					aMarkedUnassign = this.oPlanningModel.getProperty("/unAssignData");

				aDemandData.forEach(function (oItem) {
					if (aMarkedUnassign.indexOf(oItem.Guid) < 0) {
						aMarkedUnassign.push(oItem.Guid);
					}
				});

				this._oDemandDialog.close();

				//Handle further ations
				if (sType === "Change") {
					this._changeAssignment(oData);
				} else if (sType === "Delete") {
					if (oData.isRepeating === true) {
						this.deleteRepeatingAssignment(oData);
					} else {
						this._manageDates(oData, this.groupShiftContext);
					}
				}
			};
			var cancelcallback = function () {};
			this.showConfirmDialog(sTitle, sMsg, successcallback.bind(this), cancelcallback.bind(this));
		},
		/*
		 * Function calls when shape is selected
		 * oParam {object} oEvent - Event
		 */
		onShapeSelectionChange: function (oEvent) {
			var oSource = oEvent.getSource(),
				aSelectedShapes = oSource.getSelectedShapeUid(),
				aFilteredShapes = [],
				aFilteredGuid = [],
				sShapePath, oShapeData, oParentData, sParentGuid;

			aSelectedShapes.forEach(function (shape, idx, aShape) {
				// filtering only assignments, no backgroundshape, no duplicate GUID
				sShapePath = Utility.parseUid(shape).shapeDataName;
				oShapeData = this.getModel("ganttPlanningModel").getProperty(sShapePath);
				if (
					oShapeData.hasOwnProperty("Guid") && // checks if not background shape
					aFilteredGuid.indexOf(oShapeData["Guid"]) === -1 && // avoid adding duplicate shape(guid)
					((oShapeData["NODE_TYPE"] === "RES_GROUP" && this.isGroupDeletable(oShapeData)) || (oShapeData["NODE_TYPE"] === "SHIFT" && this
						.isShiftDeletable(oShapeData))) // checks if start date is past
				) {
					sParentGuid = (oShapeData.PARENT_NODE_ID && oShapeData.PARENT_NODE_ID.split("//")[0]) ||
						(oShapeData.ParentNodeId && oShapeData.ParentNodeId.split("//")[0]);
					oParentData = this._getParentResource(sParentGuid);
					oShapeData["ResourceName"] = oParentData["Description"];
					aFilteredGuid.push(oShapeData["Guid"]);
					aFilteredShapes.push(oShapeData);
				}
			}, this);
			this.getModel("ganttPlanningModel").setProperty("/isShapeSelected", Boolean(aFilteredShapes.length));
			this.getModel("ganttPlanningModel").setProperty("/multiSelectedDataForDelete", aFilteredShapes);

		},
		/*
		 * Function calls Delete button on Gantt header pressed
		 * oParam {object} oEvent - Event
		 */
		onPressDeleteMultiAssignment: function (oEvent) {
			this.groupShiftContext = null; //assigining null - this.groupShiftContext is used to add new assignment in gantt after delete
			var aDeleteAssignmentList = this.getModel("ganttPlanningModel").getProperty("/multiSelectedDataForDelete"),
				aNoValidationDeleteList = [],
				aValidationDeleteList = [];

			aDeleteAssignmentList.forEach(function (oAssignment, idx) {
				if (oAssignment.isNew) { // if isNew=true no validation required
					aNoValidationDeleteList.push(oAssignment);
				} else if (oAssignment.NODE_TYPE === "SHIFT") { // if type is SHIFT then no validation required
					aNoValidationDeleteList.push(oAssignment);
				} else {
					aValidationDeleteList.push(oAssignment);
				}
			}, this);
			this.getModel("multiDeleteModel").setProperty("/deleteDataForValidation", aValidationDeleteList);
			this.getModel("multiDeleteModel").setProperty("/deleteDataForNoValidation", aNoValidationDeleteList);
			this.validateForMultiDelete();
		},
		/*
		 * Method to validate selected assignments for delete.
		 * Validating all group assignments in batch and consolidate the result, result will be shown in dialog
		 */
		validateForMultiDelete: function () {
			var aPromise = [],
				aDeleteForValidationList = this.getModel("multiDeleteModel").getProperty("/deleteDataForValidation"),
				aDeleteForNoValidationList = this.getModel("multiDeleteModel").getProperty("/deleteDataForNoValidation"),
				aFinalDeleteList = [];

			if (aDeleteForValidationList.length > 0) { //if any data for validation
				var createPromise = function (oAssignmentData) {
					return new Promise(function (resolve, reject) {
						var oParams = {
								Guid: oAssignmentData.Guid,
								ObjectId: oAssignmentData.NODE_ID,
								EndTimestamp: oAssignmentData.EndDate,
								StartTimestamp: oAssignmentData.StartDate,
								StartTimestampUtc: formatter.convertFromUTCDate(oAssignmentData.StartDate),
								EndTimestampUtc: formatter.convertFromUTCDate(oAssignmentData.EndDate),
								IsSeries: false
							},
							sFunctionName = "ValidateResourceAssignment",
							callbackfunction = function (oData) {
								resolve(oData);
							};

						this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);
					}.bind(this));
				}.bind(this);
				aDeleteForValidationList.forEach(function (oAssignmentData, idx) {
					aPromise.push(createPromise(oAssignmentData));
				}, this);

				Promise.all(aPromise).then(function (result) { // promise to call validation in batch
					var oData = [];
					result.forEach(function (oResult, idx) {
						oData = oData.concat(oResult.results);
					}.bind(this));
					if (oData.length > 0) { //if any demand assignment exist
						this.getModel("multiDeleteModel").setProperty("/demandList", oData);
						this.openMultiDemandListDialog();
					} else { //if no demand assignment exist
						aFinalDeleteList = aDeleteForValidationList.concat(aDeleteForNoValidationList);
						this.getModel("multiDeleteModel").setProperty("/deletableList", aFinalDeleteList);
						this.openDeleteAssignmentListDialog();
					}
				}.bind(this));
			} else { //if no data for validation
				aFinalDeleteList = aDeleteForNoValidationList;
				this.getModel("multiDeleteModel").setProperty("/deletableList", aFinalDeleteList);
				this.openDeleteAssignmentListDialog();
			}
		},
		/*
		 * Method to open MultiDemandList dialog
		 */
		openMultiDemandListDialog: function () {
			if (!this._oMultiDemandListDialog) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.MultiDemandList",
					controller: this
				}).then(function (oDialog) {
					this._oMultiDemandListDialog = oDialog;
					this.getView().addDependent(this._oMultiDemandListDialog);
					this._oMultiDemandListDialog.open();
					this._oMultiDemandListDialog.attachAfterOpen(function (oEvent) {}.bind(this));
					this._oMultiDemandListDialog.attachAfterClose(function (oEvent) {}.bind(this));
				}.bind(this));
			} else {
				this._oMultiDemandListDialog.open();
			}
		},
		/*
		 * Method will be called when Proceed button is pressed inside MultiDemandList dialog
		 * Segragate Assignment data into Deletable and Non-Deletable
		 * Displays DeleteAssignmentList dialog
		 */
		onMultiDemandProceed: function (oEvent) {
			var aDemandList = this.getModel("multiDeleteModel").getProperty("/demandList"),
				aDeleteList = this.getModel("ganttPlanningModel").getProperty("/multiSelectedDataForDelete"),
				aGroupNotToDelete = [],
				aUnassignmentGuidList = [],
				aUnassignmentList = [],
				aDeletableList = [],
				aNonDeletableList = [];

			//get all GroupAssignmentGuid which cannot be deleted -- ResAssGuid is GroupAssignmentGuid
			aDemandList.forEach(function (oDemand, idx) {
				if (oDemand.AllowUnassign === false && aGroupNotToDelete.indexOf(oDemand.ResAssGuid) === -1) {
					aGroupNotToDelete.push(oDemand.ResAssGuid);
				}
			}.bind(this));

			//Demand Unassignment
			aDemandList.forEach(function (oDemand, idx) {
				if (aGroupNotToDelete.indexOf(oDemand.ResAssGuid) === -1) {
					aUnassignmentGuidList.push(oDemand.Guid);
					aUnassignmentList.push(oDemand);

				}
			}.bind(this));
			this.getModel("ganttPlanningModel").setProperty("/tempUnassignData", aUnassignmentGuidList);
			this.getModel("multiDeleteModel").setProperty("/unassignData", aUnassignmentList);

			//Comparing with Group Guid and if exist in aGroupNotToDelete then push to "aNonDeletableList" else push to "aDeletableList"
			aDeleteList.forEach(function (oGroup, idx) {
				if (aGroupNotToDelete.indexOf(oGroup.Guid) === -1) {
					aDeletableList.push(oGroup);
				} else {
					aNonDeletableList.push(oGroup);
				}
			}.bind(this));
			this.getModel("multiDeleteModel").setProperty("/deletableList", aDeletableList);
			this.getModel("multiDeleteModel").setProperty("/nonDeletableList", aNonDeletableList);

			this.closeMultiDemandDialog();
			this.openDeleteAssignmentListDialog();
		},
		/*
		 * Method called when "Close" button pressed inside Multi Demand Dialog
		 */
		oMultiDemandDialogClose: function (oEvent) {
			this._oMultiDemandListDialog.close();
		},
		/*
		 * Method clears local data in json model and closes MultiDemand Dialog
		 */
		closeMultiDemandDialog: function () {
			this.getModel("multiDeleteModel").setProperty("/demandList", []);
			this._oMultiDemandListDialog.close();
		},
		/*
		 * Function to open Deleting assignment list dialog
		 */
		openDeleteAssignmentListDialog: function () {
			if (!this._oDeleteAssignmentListDialog) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.DeleteAssignmentList",
					controller: this
				}).then(function (oDialog) {
					this._oDeleteAssignmentListDialog = oDialog;
					this.getView().addDependent(this._oDeleteAssignmentListDialog);
					this._oDeleteAssignmentListDialog.open();
					this._oDeleteAssignmentListDialog.attachAfterOpen(function (oEvent) {
						oEvent.getSource().getContent()[0].setSelectedKey("deletable");
					}.bind(this));
					this._oDeleteAssignmentListDialog.attachAfterClose(function (oEvent) {}.bind(this));
				}.bind(this));
			} else {
				this._oDeleteAssignmentListDialog.open();
			}
		},
		/*
		 * Function called when "Delete All" button is pressed in Delete Assignment List Dialog
		 */
		onDeleteAllAssignment: function (oEvent) {
			var sTitle = this.getResourceBundle().getText("tit.multiDeleteconfirmChange"),
				sMsg = this.getResourceBundle().getText("msg.multiDeleteconfirmChange"),
				aTempUnassignmentList = this.getModel("ganttPlanningModel").getProperty("/tempUnassignData"),
				aUnAssignmentList = this.getModel("ganttPlanningModel").getProperty("/unAssignData");
			var successcallback = function () {
					var aChildren = this.oPlanningModel.getProperty("/data/children"),
						aFinalDeleteList = this.getModel("multiDeleteModel").getProperty("/deletableList");
					//deleting selected assignment
					aFinalDeleteList.forEach(function (oAssignmentData, idx) {
						if (oAssignmentData.isNew) { // local assignment not yet saved in database
							var callbackFn = function (oItem, oData, idx) {
								var aAssignments = [];
								if (oData.NODE_TYPE === "RES_GROUP" || oData.NODE_TYPE === "RESOURCE") {
									aAssignments = oItem.GanttHierarchyToResourceAssign ? (oItem.GanttHierarchyToResourceAssign.results ? oItem.GanttHierarchyToResourceAssign
										.results : []) : [];
								} else if (oData.NODE_TYPE === "SHIFT") {
									aAssignments = oItem.GanttHierarchyToShift ? (oItem.GanttHierarchyToShift.results ? oItem.GanttHierarchyToShift.results : []) : [];
								}
								aAssignments.forEach(function (oAssignItem, index) {
									if (oAssignItem.Guid === oData.Guid || oAssignItem.isTemporary === true) {
										this._markAsPlanningChange(oAssignItem, false);
										aAssignments.splice(index, 1);

									}
								}.bind(this));
							};
							aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignmentData);
							this.oPlanningModel.setProperty("/data/children", aChildren);
						} else { // assignment saved in database - non new assignment - saving delete call in planning mode
							this._manageDates(oAssignmentData);
						}
					}, this);

					//Saving Unassignment in planning mode
					aUnAssignmentList = aUnAssignmentList.concat(aTempUnassignmentList);
					this.getModel("ganttPlanningModel").setProperty("/unAssignData", aUnAssignmentList);

					//closing DeleteAssignment dialog
					this.closeDeleteAssignmentDialog();
				},
				cancelcallback = function () {};
			this.showConfirmDialog(sTitle, sMsg, successcallback.bind(this), cancelcallback.bind(this));
		},
		/*
		 * Function called when "Close" button is pressed in Delete Assignment List Dialog
		 */
		onDeleteAssignmentDialogClose: function (oEvent) {
			this.closeDeleteAssignmentDialog();
		},
		/*
		 * Method clears local data in json model, deselect shapes and closes DeleteAssignment Dialog
		 */
		closeDeleteAssignmentDialog: function () {
			this.getModel("ganttPlanningModel").setProperty("/tempUnassignData", []);
			this.getModel("ganttPlanningModel").setProperty("/multiSelectedDataForDelete", []);
			this.getModel("multiDeleteModel").setProperty("/deletableList", []);
			this.getModel("multiDeleteModel").setProperty("/nonDeletableList", []);
			this.getModel("multiDeleteModel").setProperty("/unassignData", []);
			this.getModel("ganttPlanningModel").setProperty("/isShapeSelected", false);
			this._ganttChart.getSelection().clear(true); //clears Gantt shape selection
			this._oDeleteAssignmentListDialog.close();
		},
		/*
		 * Creates a grouper and set to MulDemandList table
		 */
		getMultiDemandListGroup: function (oContext) {
			var sKey = oContext.getProperty("ResAssGuid"),
				sGroupName = oContext.getProperty("GroupDescription"),
				sResourceName = oContext.getProperty("ResourceDescription");
			return {
				key: sKey,
				text: sResourceName + "/" + sGroupName
			};
		},
		/*
		 * Sets header for the Grouper MultiDemandList table
		 */
		getMultiDemandListGroupHeader: function (oGroup) {
			return new sap.m.GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},
		/*
		 * Function called on right click of assignment
		 */
		onShapeContextMenu: function (oEvent) {
			var oParams = oEvent.getParameters(),
				oShape = oParams.shape,
				oContext = oShape && oShape.getBindingContext("ganttPlanningModel"),
				oAssignment = oContext && oContext.getObject();
			this.groupShiftContext = null;
			if (oShape && oShape.sParentAggregationName !== "shapes1") {
				this._setPopoverData(oShape, {});
				if (oAssignment && formatter.isPopoverDeleteButtonVisible(oAssignment.isTemporary, oAssignment.isEditable, oAssignment.isDeletable)) {
					this.openShapeContextMenu(oShape);
				}
			}
		},
		/*
		 * Function to open Shape Context Menu
		 * @param {object} - oShape - Shape Data
		 */
		openShapeContextMenu: function (oShape) {
			if (!this._oShapeContextMenu) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.ShapeContextMenu",
					controller: this
				}).then(function (oDialog) {
					this._oShapeContextMenu = oDialog;
					this.getView().addDependent(this._oShapeContextMenu);
					this._oShapeContextMenu.openBy(oShape, false, Popup.Dock.BeginTop, Popup.Dock.EndBottom);
				}.bind(this));
			} else {
				this._oShapeContextMenu.openBy(oShape, false, Popup.Dock.BeginTop, Popup.Dock.EndBottom);
			}
		},
		/*
		 * Function called when Shape Context menu pressed
		 * Setting "isRepeating" property based on the item press
		 */
		handleShapeContextMenuPress: function (oEvent) {
			var sKey = oEvent.getParameter("item").getProperty("key"),
				oData = this.oPlanningModel.getProperty("/tempData/popover");
			if (sKey === "OCCURENCE") {
				oData.isRepeating = false;
			} else if (sKey === "SERIES") {
				oData.isRepeating = true;
			}
			this.onPressDeleteAssignment();

		},
		/*
		 * Function called Resource selected from Gantt
		 * @param {object} - oEvent - Event parameter for checkbox
		 */
		onChangeSelectResource: function (oEvent) {
			var oSource = oEvent.getSource(),
				parent = oSource.getParent(),
				sPath = parent.getBindingContext("ganttPlanningModel").getPath(),
				oParams = oEvent.getParameters(),
				aSelectedResource = this.getModel("ganttPlanningModel").getProperty("/selectedResources");

			//Sets the property IsSelected manually
			this.getModel("ganttPlanningModel").setProperty(sPath + "/IsSelected", oParams.selected);

			if (oParams.selected) {
				aSelectedResource.push(sPath);

			} else if (aSelectedResource.indexOf(sPath) >= 0) {
				//removing the path from "aSelectedResource" when user unselect the checkbox
				aSelectedResource.splice(aSelectedResource.indexOf(sPath), 1);
			}
			
			if (aSelectedResource.length > 0) {
				this.getModel("ganttPlanningModel").setProperty("/isResourceSelected",true);
			}else{
				this.getModel("ganttPlanningModel").setProperty("/isResourceSelected",false);
			}
		},
		/*
		 * Function called when Multi Creat button is pressed
		 * @param {object} - oEvent - Event parameter for button press
		 */
		onPressCreateMultiAssignment: function (oEvent) {
			var oMultiCreateData = {
				StartDate: moment().startOf("day").toDate(),
				EndDate: moment().endOf("day").subtract(999, "milliseconds").toDate(),
				NODE_TYPE: "RES_GROUP",
				ResourceGroupGuid: "",
				TemplateId: "",
				isNew: true,
				IsSeries: false,
				SeriesRepeat: "",
				RESOURCE_GROUP_COLOR: "",
				DESCRIPTION: "",
				ResourceGroupDesc: "",
				SERIES_END_DATE: moment().endOf("day").toDate()
			},
			aSelectedResource = this.getModel("ganttPlanningModel").getProperty("/selectedResources");
			this.createNewTempAssignment(oMultiCreateData.StartDate, oMultiCreateData.EndDate, oMultiCreateData).then(function (oData) {
				var oResource = {},
					oGanttObject = {};
				oData.ResourceList = [];
				aSelectedResource.forEach(function (sPath) {
					oGanttObject = deepClone(this.getModel("ganttPlanningModel").getProperty(sPath));
					oResource = {
						NodeId:oGanttObject.NodeId,
						Description:oGanttObject.Description,
						ResourceGuid:oGanttObject.ResourceGuid,
						PERNR:oGanttObject.PERNR
					};
					oData.ResourceList.push(oResource);
				}.bind(this));
				this.openMultiCreateAssignmentDialog(oData);
			}.bind(this));
		},
		/*
		 * Function to open Multi Create Assignment Dialog
		 * @param {object} - oMultiCreateData - Default assignment information
		 */
		openMultiCreateAssignmentDialog: function (oMultiCreateData) {
			if (!this._oMultiCreateDialog) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.MultiCreateAssignment",
					controller: this
				}).then(function (pPopover) {
					this._oMultiCreateDialog = pPopover;
					this.getView().addDependent(this._oMultiCreateDialog);
					this.setMultiCreateData(oMultiCreateData);
					this._oMultiCreateDialog.open();
					//after popover gets opened check popover data for resource group color
					this._oMultiCreateDialog.attachAfterOpen(function (oEvent) {}.bind(this));
					//after popover gets closed remove popover data
					this._oMultiCreateDialog.attachAfterClose(function (oEvent) {
						this.getModel("ganttPlanningModel").setProperty("/multiCreateData/ResourceList", []);
					}.bind(this));

				}.bind(this));
			} else {
				this.setMultiCreateData(oMultiCreateData);
				this._oMultiCreateDialog.open();
			}
		},
		/*
		 * Function to set multi create information to "ganttPlanningModel"
		 * @param {object} - oMultiCreateData - Default assignment information
		 */
		setMultiCreateData: function (oMultiCreateData) {
			this.getModel("ganttPlanningModel").setProperty("/multiCreateData", oMultiCreateData);
		},
		/*
		 * Function called when "Create" button is clicked on MultiCreate Dialog
		 * @param {object} - oEvent - Event parameter for button press
		 */
		onConfirmMultiCreate: function (oEvent) {
			var oSimpleformFileds = this.getView().getControlsByFieldGroupId("multiCreateInput"),
				oValidation = this.validateForm(oSimpleformFileds),
				oResourceControl = sap.ui.getCore().byId("idResourceList"),
				oAssignmentData, oCloneAssignmentData, aResourceList, aAssigments, isResourceExist,
				aChildren = this.getModel("ganttPlanningModel").getProperty("/data/children"),
				oResourceData;

			if (oValidation && oValidation.state === "success") {
				aResourceList = oResourceControl.getTokens();
				oAssignmentData = this.getModel("ganttPlanningModel").getProperty("/multiCreateData");
				aResourceList.forEach(function (oResource) {
					oCloneAssignmentData = deepClone(oAssignmentData);
					oCloneAssignmentData.ResourceGuid = oResource.data('ResourceGuid');
					oCloneAssignmentData.PARENT_NODE_ID = oResource.data('ResourceGuid');
					oCloneAssignmentData.ParentNodeId = oResource.data('ResourceGuid');
					oCloneAssignmentData.NodeId = oResource.data('ResourceGuid');
					oCloneAssignmentData.isTemporary = false;
					this.oPlanningModel.setProperty("/tempData/popover", oCloneAssignmentData);
					oCloneAssignmentData.Guid = new Date().getTime().toString();

					//get groups assigned to the selected resource
					if (oCloneAssignmentData.NODE_TYPE === "RES_GROUP") {
						aAssigments = this._getResourceassigmentByKey("ResourceGuid", oCloneAssignmentData.ResourceGuid, oCloneAssignmentData.ResourceGroupGuid,
							oCloneAssignmentData);
					} else if (oCloneAssignmentData.NODE_TYPE === "SHIFT") {
						aAssigments = this._getResourceShiftByKey(oCloneAssignmentData.ParentNodeId, oCloneAssignmentData);
					}
					//validation for the existing assigments
					if (this._checkDuplicateAsigment(oCloneAssignmentData, aAssigments)) {
						if (oCloneAssignmentData.NODE_TYPE === "SHIFT" && !this._shiftValidation(oCloneAssignmentData)) {
							//checking if group is exist for the selected date
							return;
						}
						isResourceExist = aChildren.some(function (item) {
							return item.ResourceGuid === oCloneAssignmentData.ResourceGuid;
						}.bind(this));
						if (!isResourceExist) {
							oCloneAssignmentData.ChildCount = 0;
							oCloneAssignmentData.Description = oResource.getProperty("text");
							oCloneAssignmentData.PERNR = oResource.data('PERNR');
							oCloneAssignmentData.NodeType = "RESOURCE";
							oCloneAssignmentData.children = [];
							oResourceData = deepClone(oCloneAssignmentData);
							aChildren.push(oResourceData);
						}
						this._addSingleChildToParent(oCloneAssignmentData, false, false);
					}

				}.bind(this));
				this.onCloseMultiCreate();
			}
		},
		/*
		 * Function called when "Close" button is clicked on MultiCreate Dialog
		 * @param {object} - oEvent - Event parameter for button press
		 */
		onCloseMultiCreate: function () {
			if (this._oMultiCreateDialog) {
				this._oMultiCreateDialog.close();
			}
		},
		/*
		 * Function called MultiCreate Group changed
		 * @param {object} - oEvent - Event parameter
		 */
		onMultiCreateGroupChange: function (oEvent) {
			var oSource = oEvent.getSource(),
				oDataObject = oSource.getSelectedItem().getBindingContext("viewModel").getObject(),
				oMultiCreateData = this.getModel("ganttPlanningModel").getProperty("/multiCreateData");
			if (oSource.getSelectedKey()) {
				oSource.setValueState("None");
				oMultiCreateData.RESOURCE_GROUP_COLOR = oDataObject.ResourceGroupColor;
				oMultiCreateData.DESCRIPTION = oDataObject.ResourceGroupDesc;
				oMultiCreateData.ResourceGroupDesc = oDataObject.ResourceGroupDesc;
				oMultiCreateData.ResourceGroupDesc = oDataObject.ResourceGroupDesc;
				oMultiCreateData.TIME_ZONE = oDataObject.TIME_ZONE;
			}

		},
		/*
		 * Function called when MultiCreate Shift changed
		 * @param {object} - oEvent - Event parameter
		 */
		onMultiCreateShiftChange: function (oEvent) {
			var oSource = oEvent.getSource(),
				oDataObject = oSource.getSelectedItem().getBindingContext("viewModel").getObject(),
				oMultiCreateData = this.getModel("ganttPlanningModel").getProperty("/multiCreateData");
			if (oSource.getSelectedKey()) {
				oSource.setValueState("None");
				oMultiCreateData = this.mergeObject(oMultiCreateData, oDataObject);
				oMultiCreateData.EffectiveStartDate = oMultiCreateData.StartDate;
				oMultiCreateData.EffectiveEndDate = oMultiCreateData.EndDate;
			}
		},
		/*
		 * Function called when MultiCreate Date changed
		 * @param {object} - oEvent - Event parameter
		 */
		onMultiCreateDateChange: function (oEvent) {
			var oSource = oEvent.getSource(),
				oStartDate, oEndDate;
			if (oSource.getDateValue()) {
				oSource.setValueState("None");
				oStartDate = oSource.getDateValue();
				oEndDate = moment(oSource.getSecondDateValue()).subtract(999, "milliseconds").toDate();
				this.oPlanningModel.setProperty("/multiCreateData/StartDate", oStartDate);
				this.oPlanningModel.setProperty("/multiCreateData/EffectiveStartDate", oStartDate);
				this.oPlanningModel.setProperty("/multiCreateData/EndDate", oEndDate);
				this.oPlanningModel.setProperty("/multiCreateData/EffectiveEndDate", oEndDate);

			}
		},
		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Load the tree data and process the data to create assignments as child nodes
		 * 
		 */
		_loadGanttData: function () {
			this.getModel("viewModel").setProperty("/gantt/busy", true);
			this._initialisePlanningModel();
			this._getResourceData(0)
				.then(this._getResourceData.bind(this))
				.then(function () {
					//backup original data
					this.oOriginData = deepClone(this.oPlanningModel.getProperty("/"));
					this._setBackgroudShapes(this._sGanttViewMode);
					this._setGanttScrollState();
					this.getModel("viewModel").setProperty("/gantt/busy", false);
				}.bind(this));
		},

		/**
		 * get all filters from SmartFilterbar and read data with filters
		 * set result with deepClone to Json Model
		 * @param {object} iLevel - level of hierarchy if Gantt tree
		 * @returns {Promise}
		 */
		_getResourceData: function (iLevel) {
			return new Promise(function (resolve) {
				var oFilterBar = this._smartFilterBar,
					oDateRangePicker = this.getView().byId("idFilterGanttPlanningDateRange"),
					aFilters = oFilterBar.getFilters(),
					sUri = "/GanttResourceHierarchySet",
					mParams = {
						"$expand": "GanttHierarchyToResourceAssign,GanttHierarchyToShift"
					},
					oStartDate = formatter.convertToUTCDate(oDateRangePicker.getDateValue()),
					oEndDate = formatter.convertToUTCDate(oDateRangePicker.getSecondDateValue());

				if (iLevel > 0) {
					mParams = {};
				}

				aFilters.push(new Filter("HierarchyLevel", FilterOperator.EQ, iLevel));
				aFilters.push(new Filter("StartDate", FilterOperator.GE, oStartDate));
				aFilters.push(new Filter("EndDate", FilterOperator.LE, oEndDate));

				//sUri, aFilters, mUrlParams
				this.getOwnerComponent().readData(sUri, aFilters, mParams).then(function (oResult) {
					if (iLevel > 0) {
						this._addChildrenToParent(iLevel, oResult.results);
					} else {
						this.oPlanningModel.setProperty("/data/children", oResult.results);
					}
					resolve(iLevel + 1);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * when data was loaded then children needs added to right parent node
		 * @param iLevel
		 * @param oResData
		 */
		_addChildrenToParent: function (iLevel, oResData) {
			var aChildren = this.oPlanningModel.getProperty("/data/children"),
				aAssignments = [],
				aShift = [];
			var callbackFn = function (oItem) {
				oItem.children = [];
				aAssignments = [];
				aShift = [];
				oResData.forEach(function (oResItem) {
					aAssignments = [];
					if (oItem.NodeId === oResItem.ParentNodeId) {
						//add assignments to child resource group
						if (oItem.GanttHierarchyToResourceAssign && oItem.GanttHierarchyToResourceAssign.results.length > 0) {
							oItem.GanttHierarchyToResourceAssign.results.forEach(function (oAssignment, idx) {
								if (oAssignment.ResourceGroupGuid === oResItem.ResourceGroupGuid) {
									aAssignments.push(oAssignment);
								}
							});

						}
						oResItem.GanttHierarchyToResourceAssign.results = aAssignments.length > 0 ? aAssignments : [];
						// add shift data o children shift
						if (oResItem.NodeType === "SHIFT") {
							if (oItem.GanttHierarchyToShift && oItem.GanttHierarchyToShift.results.length > 0) {
								oItem.GanttHierarchyToShift.results.forEach(function (oAssignment, idx) {
									aShift.push(oAssignment);
								});

							}
							oResItem.GanttHierarchyToShift.results = aShift.length > 0 ? aShift : [];
						}

						oItem.children.push(oResItem);
					}
				});
			}.bind(this);
			aChildren = this._recurseChildren2Level(aChildren, iLevel, callbackFn);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},

		/**
		 * set a clickable shape for every cell in Gantt view
		 * @param {object} oViewMapping - from formatter.js view mapping with functions
		 */
		_setBackgroudShapes: function (oViewMapping) {
			if (!this.oZoomStrategy) {
				this.oZoomStrategy = this._ganttChart.getAxisTimeStrategy();
			}
			var oTimeHorizon = this.oZoomStrategy.getAggregation("totalHorizon"),
				sToday = new Date().setHours(0, 0, 0, 0),
				sStartTime = formatter.convertDate2String(new Date(sToday)),
				sEndTime = oTimeHorizon.getEndTime(),
				aChildren = this.oPlanningModel.getProperty("/data/children");

			if (typeof sStartTime === "string") {
				//default calculation for DAY view
				var oStartDate = formatter.convertString2Date(sStartTime),
					oEndDate = formatter.convertString2Date(sEndTime),
					difference = oViewMapping.bgDifferenceFn(oStartDate, oEndDate);

				var callbackFn = function (oItem, sTime) {
					var oDate = formatter.convertString2Date(sTime);
					oItem.bgTasks = [];
					for (var i = 0; i <= difference; i++) {
						oItem.bgTasks.push({
							id: oItem.NodeId + "BG" + i,
							startTime: oViewMapping.bgStartDateFn(oDate),
							endTime: oViewMapping.bgEndDateFn(oDate)
						});
					}
				};
				aChildren = this._recurseAllChildren(aChildren, callbackFn, sStartTime);
				this.oPlanningModel.setProperty("/data/children", aChildren);
			}
		},

		/**
		 * find path to object data inside gantt planning model
		 * add or remove this path to array of changedData
		 * 
		 * @param {object} oData - object what has changed
		 * @param {boolean} isNewChange - flag if it needs marked as change or remove from changes
		 */
		_markAsPlanningChange: function (oData, isNewChange) {
			var oFoundData = this._getChildDataByKey("Guid", oData.Guid, null),
				aChanges = this.oPlanningModel.getProperty("/changedData"),
				aDeleteData = this.oPlanningModel.getProperty("/deletedData");

			//object change needs added to "/changedData" array by path
			if (isNewChange) {
				if (oFoundData && oFoundData.oData && oFoundData.oData.Guid && aChanges.indexOf(oFoundData.oData.Guid) < 0) {
					aChanges.push(oFoundData.oData.Guid);
				}
			} else if (isNewChange === false) {
				//object change needs removed from "/changedData" array by path
				if (oFoundData && oFoundData.oData && oFoundData.oData.Guid && aChanges.indexOf(oFoundData.oData.Guid) >= 0) {
					aChanges.splice(aChanges.indexOf(oFoundData.oData.Guid), 1);
				}
			}
			this.oPlanningModel.setProperty("/hasChanges", (aChanges.length > 0 || aDeleteData.length > 0));
		},

		/**
		 * find path to object data inside gantt planning model
		 * add or remove this path to array of deletedData
		 * @param {object} oData - object what has changed
		 **/
		_markAsPlanningDelete: function (oData) {
			var oFoundData = this._getChildDataByKey("Guid", oData.Guid, null),
				aChanges = this.oPlanningModel.getProperty("/changedData"),
				aDeleteData = this.oPlanningModel.getProperty("/deletedData");

			//object change needs added to "/changedData" array by GUID
			if (oFoundData && oFoundData.oData && this._allowDeleteEntry(aDeleteData, oFoundData.oData.Guid)) {
				aDeleteData.push(oFoundData.oData);
			}

			this.oPlanningModel.setProperty("/hasChanges", (aChanges.length > 0 || aDeleteData.length > 0));
		},

		/**
		 * Validate the duplicate entry before prepare delete data preparation
		 */
		_allowDeleteEntry: function (aDeleteData, Guid) {
			var bValidate = true;
			aDeleteData.forEach(function (oItem) {
				if (oItem.Guid === Guid && bValidate) {
					bValidate = false;
				}
			});
			return bValidate;
		},

		/**
		 * create new temporary assignment when background shape was pressed
		 * when assignment shape was pressed get assignment data from row
		 * 
		 * @param {object} mParams - event parameters from shape press
		 */
		_setPopoverData: function (oTargetControl, oPopoverData) {
			var Guid = oPopoverData["Guid"],
				sStartTime = oPopoverData["sStartTime"],
				sEndTime = oPopoverData["sEndTime"],
				oResourceObject = oPopoverData["oResourceObject"],
				bDragged = oPopoverData["bDragged"],
				oContext = oTargetControl.getBindingContext("ganttPlanningModel"),
				oChildData, oAssignData;
			this.oPlanningModel.setProperty("/tempData/popover", {});
			if (oTargetControl.sParentAggregationName === "shapes1") {
				//its background shape
				this.createNewTempAssignment(sStartTime, sEndTime, oResourceObject, bDragged).then(function (oData) {
					this.oPlanningModel.setProperty("/tempData/popover", oData);
					this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oData));
					if (oData && oData.NODE_TYPE !== "RESOURCE") {
						oChildData = Object.assign(oData, {
							bgTasks: oPopoverData.oResourceObject.bgTasks
						});
						this._addSingleChildToParent(oChildData, false, false);
					} else {
						this._addNewAssignmentShape(oData);
					}
				}.bind(this));
			} else if (oTargetControl.sParentAggregationName === "rows" || oTargetControl.sParentAggregationName === "cells") {
				this.createNewTempAssignment(sStartTime, sEndTime, oResourceObject, bDragged).then(function (oData) {
					this.oPlanningModel.setProperty("/tempData/popover", oData);
					this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oData));
					this._addSingleChildToParent(oData, false, false);
				}.bind(this));
			} else if (oContext) {
				oAssignData = oContext.getObject();
				if (oAssignData.NODE_TYPE === "RES_GROUP") {
					//popover data adjustment with repeat mode
					oAssignData.isEditable = true;
					oAssignData.isDeletable = this.isGroupDeletable(oAssignData);
					oAssignData.minDate = this._getShapePopoverMinDate(oAssignData.isDeletable);
					oAssignData.maxDate = this._getShapePopoverMaxDate(oAssignData.EndDate);
					oAssignData.isApplySeries = false;
					this.oPlanningModel.setProperty("/tempData/popover", oAssignData);
					this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oAssignData));
				} else if (oAssignData.NODE_TYPE === "SHIFT") {
					//popover data adjustment with repeat mode
					oAssignData.isEditable = true;
					oAssignData.isEditable = !oAssignData.HR_SHIFT_FLAG;
					oAssignData.isDeletable = this.isShiftDeletable(oAssignData);
					oAssignData.minDate = this._getShapePopoverMinDate(oAssignData.isDeletable);
					oAssignData.maxDate = this._getShapePopoverMaxDate(oAssignData.EffectiveEndDate);
					oAssignData.StartDate = oAssignData.EffectiveStartDate;
					oAssignData.EndDate = oAssignData.EffectiveEndDate;
					oAssignData.isApplySeries = false;
					this.oPlanningModel.setProperty("/tempData/popover", oAssignData);
					this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oAssignData));
				}
			}

		},
		/*
		 * Checks if group assignment is deletable
		 * @param {object} oGroupData - Group assignment object
		 */
		isGroupDeletable: function (oGroupData) {
			var bValidate = true;
			if (this._isDatePast(oGroupData.StartDate)) {
				bValidate = false;
			}
			return bValidate;
		},
		/*
		 * Checks if shift assignment is deletable
		 * @param {object} oShiftData - Shift assignment object
		 */
		isShiftDeletable: function (oShiftData) {
			var bValidate = true;
			if (this._isDatePast(oShiftData.EffectiveStartDate)) {
				bValidate = false;
			}
			return bValidate;
		},
		/**
		 * Add new Resource Group under Resource in Gantt
		 * @param {object} oData - Resource Group data to be added under Resource if not exist
		 * @param {boolean} bAllowMarkChange - Value true will save the assignment in planning mode
		 * @param {boolean} bIsAddRepeatShape - If it is adding single or in series
		 * @param {boolean} bIsEditSeriesMode - If it is editing series
		 */
		_addSingleChildToParent: function (oData, bAllowMarkChange, bIsAddRepeatShape, bIsEditSeriesMode) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			this.getObjectFromEntity("GanttResourceHierarchySet", oData).then(function (oGanntObject) {
				oGanntObject["bgTasks"] = oData["bgTasks"];
				oGanntObject["Description"] = oData["DESCRIPTION"];
				oGanntObject["ChildCount"] = 0;
				oGanntObject["HierarchyLevel"] = 1;
				oGanntObject["NodeType"] = oData["NODE_TYPE"];
				oGanntObject["ParentNodeId"] = oData["PARENT_NODE_ID"].split("//")[0];
				oGanntObject["NodeId"] = oData["ParentNodeId"] + "//" + new Date().getTime();
				var callbackFn = function (oItem, oData) {
					if (oData.NodeType === "RES_GROUP" && !this._checkIfGroupExist(oItem, oData["ResourceGroupGuid"]) && oItem.NodeId === oData.ParentNodeId &&
						oItem.children) {
						this.getModel("viewModel").setProperty("/isResetEnabled", true);
						oItem.children.push(oData);
					}

					if (oData.NodeType === "SHIFT" && !this._checkIfShiftExist(oItem) && oItem.NodeId === oData.ParentNodeId && oItem.children) {
						oData["Description"] = this.getResourceBundle('i18n').getText("xtit.shift");
						this.getModel("viewModel").setProperty("/isResetEnabled", true);
						oItem.children.unshift(oData);
					}
				}.bind(this);
				aChildren = this._recurseAllChildren(aChildren, callbackFn, oGanntObject);
				this.oPlanningModel.setProperty("/data/children", aChildren);

				if (bIsAddRepeatShape) {
					this._repeatAssignments(oData, bIsEditSeriesMode);
				} else {
					this._addNewAssignmentShape(oData);
				}
				//Reset bgTasks when new resource added to the gantt
				this._setBackgroudShapes(this._sGanttViewMode);

				if (bAllowMarkChange && !oData.isNew) {
					var oFoundData = this._getChildDataByKey("Guid", oData.Guid, null),
						sPath = oFoundData.sPath;
					this.oPlanningModel.setProperty(sPath + "/isNew", true);
					this.oPlanningModel.setProperty(sPath + "/isTemporary", false);
					this.oPlanningModel.setProperty(sPath + "/PARENT_NODE_ID", "");
					this.oPlanningModel.setProperty(sPath + "/NODE_ID", "");
				}
				this._markAsPlanningChange(oData, true);
			}.bind(this));
		},

		/**
		 * Checks if Resource Group is already exist under Resource
		 * @param {object} aResourceData - Resource Group data to be added under Resource if not exist
		 * @param {object} sResourceGroupGuid - Resource guid to be checked inside aResourceData
		 */
		_checkIfGroupExist: function (aResourceData, sResourceGroupGuid) {
			if (aResourceData && aResourceData.children) {
				return aResourceData.children.some(function (oChild) {
					return oChild.ResourceGroupGuid === sResourceGroupGuid;
				});
			}
			return false;
		},

		/**
		 * Checks if shift is already exist under Resource
		 * @param {object} aResourceData - Resource data where need to check for shift
		 */
		_checkIfShiftExist: function (aResourceData) {
			if (aResourceData && aResourceData.children) {
				return aResourceData.children.some(function (oChild) {
					return oChild.NodeType === "SHIFT";
				});
			}
			return false;
		},

		/**
		 * add a freshly created assignment to json model into Gantt Chart
		 * @param {object} oAssignData - object of assignment based on entityType of assignment 
		 */
		_addNewAssignmentShape: function (oAssignData) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			var callbackFn = function (oItem, oData, idx) {
				if (oItem.NodeType === "RESOURCE") {
					if (oData.NODE_TYPE === "RESOURCE" || oData.NODE_TYPE === "RES_GROUP") {
						if (!oItem.GanttHierarchyToResourceAssign) {
							oItem.GanttHierarchyToResourceAssign = {
								results: []
							};
						}
						if (oItem.ResourceGuid && oItem.ResourceGuid === oData.ResourceGuid && !oItem.ResourceGroupGuid) {
							//add to resource itself
							if (this._getChildrenDataByKey("Guid", oData.Guid, null).length < 2) {
								oItem.GanttHierarchyToResourceAssign.results.push(oData);
							}
						} else if (oItem.ResourceGroupGuid && oItem.ResourceGroupGuid === oData.ResourceGroupGuid && oItem.ResourceGuid === oData.ResourceGuid) {
							//add to resource group
							if (this._getChildrenDataByKey("Guid", oData.Guid, null).length < 2) {
								oItem.GanttHierarchyToResourceAssign.results.push(oData);
							}
						}
					} else if (oData.NODE_TYPE === "SHIFT") {
						if (!oItem.GanttHierarchyToShift) {
							oItem.GanttHierarchyToShift = {
								results: []
							};
						}
						if (oItem.ResourceGuid && oItem.ResourceGuid === oData.ResourceGuid) {
							//add to resource itself
							if (this._getChildrenDataByKey("Guid", oData.Guid, null).length < 2) {
								oItem.GanttHierarchyToShift.results.push(oData);
							}
						}
					}

				} else if (oItem.NodeType === "RES_GROUP" && oData.NODE_TYPE === "RES_GROUP") {
					if (!oItem.GanttHierarchyToResourceAssign) {
						oItem.GanttHierarchyToResourceAssign = {
							results: []
						};
					}
					if (oItem.ResourceGuid && oItem.ResourceGuid === oData.ResourceGuid && !oItem.ResourceGroupGuid) {
						//add to resource itself
						if (this._getChildrenDataByKey("Guid", oData.Guid, null).length < 2) {
							oItem.GanttHierarchyToResourceAssign.results.push(oData);
						}
					} else if (oItem.ResourceGroupGuid && oItem.ResourceGroupGuid === oData.ResourceGroupGuid && oItem.ResourceGuid === oData.ResourceGuid) {
						//add to resource group
						if (this._getChildrenDataByKey("Guid", oData.Guid, null).length < 2) {
							oItem.GanttHierarchyToResourceAssign.results.push(oData);
						}
					}
				} else if (oItem.NodeType === "SHIFT" && oData.NODE_TYPE === "SHIFT") {
					// adding only if NodeType is Shift"
					if (!oItem.GanttHierarchyToShift) {
						oItem.GanttHierarchyToShift = {
							results: []
						};
					}
					if (oItem.ResourceGuid && oItem.ResourceGuid === oData.ResourceGuid) {
						//add to resource itself
						if (this._getChildrenDataByKey("Guid", oData.Guid, null).length < 2) {
							oItem.GanttHierarchyToShift.results.push(oData);
						}
					}
				}
			};
			aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignData);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},

		/**
		 * remove freshly created shape from gantt chart
		 * @param {object} oAssignData - object of assignment based on entityType of assignment 
		 * @param removeNew boolena value to ensure remove new assignment
		 */
		_removeAssignmentShape: function (oAssignData, removeNew) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			if (!oAssignData.isTemporary && !removeNew) {
				return;
			}
			if (oAssignData.isNew) {
				if (oAssignData.isRepeating) { //checking if it is delete series
					this.deleteRepeatingAssignment(oAssignData);
				} else {
					var callbackFn = function (oItem, oData, idx) {
						var aAssignments = [];
						if (oData.NODE_TYPE === "RES_GROUP" || oData.NODE_TYPE === "RESOURCE") {
							aAssignments = oItem.GanttHierarchyToResourceAssign ? (oItem.GanttHierarchyToResourceAssign.results ? oItem.GanttHierarchyToResourceAssign
								.results : []) : [];
						} else if (oData.NODE_TYPE === "SHIFT") {
							aAssignments = oItem.GanttHierarchyToShift ? (oItem.GanttHierarchyToShift.results ? oItem.GanttHierarchyToShift.results : []) : [];
						}
						aAssignments.forEach(function (oAssignItem, index) {
							if (oAssignItem.Guid === oData.Guid || oAssignItem.isTemporary === true) {
								this._markAsPlanningChange(oAssignItem, false);
								aAssignments.splice(index, 1);

							}
						}.bind(this));
					};
					aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignData);
					this.oPlanningModel.setProperty("/data/children", aChildren);
				}
			} else {
				this._validateForDelete(oAssignData);
			}

		},
		/**
		 * Validation of assignment on change
		 * @param {object} oAssignItem - Assignment to be validated
		 */
		_validateForChange: function (oAssignItem) {
			if (oAssignItem.NODE_TYPE === "RES_GROUP") {
				this._validateForResourceGroupChange(oAssignItem);
			} else if (oAssignItem.NODE_TYPE === "SHIFT") {
				this._validateForShiftChange(oAssignItem);
			}

			if (this._oPlanningPopover) {
				this._oPlanningPopover.close();
			}
		},
		/**
		 * Validation of Group assignment on change
		 * @param {object} oAssignItem - Assignment to be validated
		 */
		_validateForResourceGroupChange: function (oAssignItem) {
			var oParams, sFunctionName, oDemandModel, oPopoverData, bAssignmentCheck;
			oParams = {
				Guid: oAssignItem.Guid,
				ObjectId: oAssignItem.NODE_ID,
				EndTimestamp: formatter.convertToUTCDate(oAssignItem.EndDate),
				StartTimestamp: formatter.convertToUTCDate(oAssignItem.StartDate),
				EndTimestampUtc: oAssignItem.EndDate,
				StartTimestampUtc: oAssignItem.StartDate,
				IsSeries: oAssignItem.isRepeating ? true : false
			};
			sFunctionName = "ValidateResourceAssignment";
			oDemandModel = this.getModel("demandModel");
			oPopoverData = this.oPlanningModel.getProperty("/tempData/popover");
			bAssignmentCheck = this.getView().getModel("user").getProperty("/ENABLE_ASSIGNMENT_CHECK");
			var callbackfunction = function (oData) {
				if (oData.results.length > 0) {
					this.oPlanningModel.setProperty("/tempData/popover/isRestChanges", false);
					oDemandModel.setProperty("/data", this._checkMarkedUnassigned(oData.results));
					oDemandModel.setProperty("/Type", "Change");
					this.openDemandDialog();
				} else {
					this._changeAssignment(oPopoverData);
				}
				this.oPlanningModel.refresh();
			}.bind(this);
			if (bAssignmentCheck) {
				this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);
			} else {
				this._changeAssignment(oPopoverData);
			}
		},
		/**
		 * Validation of Shift assignment on change
		 * @param {object} oAssignItem - Assignment to be validated
		 */
		_validateForShiftChange: function (oAssignItem) {
			var oPopoverData = this.oPlanningModel.getProperty("/tempData/popover"),
				oFoundData = [],
				oOldAssignmentData = {};
			if (this._shiftValidation(oAssignItem)) {
				this._changeAssignment(oPopoverData);
			} else {
				oFoundData = this._getChildrenDataByKey("Guid", oPopoverData.Guid, null);
				oOldAssignmentData = this.oPlanningModel.getProperty("/tempData/oldPopoverData");
				this.showMessageToast(this.getResourceBundle().getText("yMsg.shiftvalidation"));
				for (var i = 0; i < oFoundData.length; i++) {
					this.oPlanningModel.setProperty(oFoundData[i], oOldAssignmentData);
				}
			}
		},

		/**
		 * Method will get call after validation is done, if validation pass, edited data will be stored in Gantt.
		 * @param {object} oAssignmentData - edited data
		 */
		_changeAssignment: function (oAssignmentData) {
			oAssignmentData.isTemporary = false;
			this._markAsPlanningChange(oAssignmentData, true);
			this._markAsPlanningDelete(oAssignmentData);
		},

		/**
		 * list if demands who are assigned to this time frame
		 */
		_validateForDelete: function (oAssignItem) {
			var oParams = {
					Guid: oAssignItem.Guid,
					ObjectId: oAssignItem.NODE_ID,
					EndTimestamp: oAssignItem.EndDate,
					StartTimestamp: oAssignItem.StartDate,
					StartTimestampUtc: formatter.convertFromUTCDate(oAssignItem.StartDate),
					EndTimestampUtc: formatter.convertFromUTCDate(oAssignItem.EndDate),
					IsSeries: oAssignItem.isRepeating ? true : false
				},
				sFunctionName = "ValidateResourceAssignment",
				oDemandModel = this.getModel("demandModel"),
				bAssignmentCheck = this.getView().getModel("user").getProperty("/ENABLE_ASSIGNMENT_CHECK");

			var callbackfunction = function (oDemandData) {
				if (oDemandData.results.length > 0) {
					this.oPlanningModel.setProperty("/tempData/popover/isRestChanges", false);
					oDemandModel.setProperty("/Type", "Delete");
					oDemandModel.setProperty("/data", this._checkMarkedUnassigned(oDemandData.results));
					this.openDemandDialog();
				} else {
					if (oAssignItem.isRepeating) { //if repeatative delete
						this.deleteRepeatingAssignment(oAssignItem);
					} else {
						this._manageDates(oAssignItem);
					}
				}
				this.oPlanningModel.refresh();
			}.bind(this);
			if (oAssignItem.NODE_TYPE !== "SHIFT" && bAssignmentCheck) {
				this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);
			} else {
				if (oAssignItem.isRepeating) { //if repeatative delete
					this.deleteRepeatingAssignment(oAssignItem);
				} else {
					this._manageDates(oAssignItem);
				}
			}
		},
		/**
		 * Delete repeatative assignment 
		 * @{param} oAssignmentData - Assignment Information
		 */
		deleteRepeatingAssignment: function (oAssignmentData) {
			var aAssignmentData = this._getChildrenDataByKey("SeriesGuid", oAssignmentData.SeriesGuid, null),
				aAssignment = [],
				oAssignItem,
				aChildren = this.oPlanningModel.getProperty("/data/children"),
				sStartDateProp,
				sEndDateProp,
				oFoundData = {};

			if (aAssignmentData.length) {
				aAssignmentData.forEach(function (sPath, idx) {
					oAssignItem = this.oPlanningModel.getProperty(sPath);
					if (oAssignItem.NODE_TYPE === "RES_GROUP") {
						sStartDateProp = "StartDate";
						sEndDateProp = "EndDate";
					} else if (oAssignItem.NODE_TYPE === "SHIFT") {
						sStartDateProp = "EffectiveStartDate";
						sEndDateProp = "EffectiveEndDate";
					}
					if (!this._isDatePast(oAssignItem[sStartDateProp])) {
						aAssignment.push(oAssignItem);
					}
				}.bind(this));
				if (oAssignmentData.isNew) {
					aAssignment.forEach(function (oAssignData, idx) {
						var callbackFn = function (oItem, oData, idx) {
							var aAssignments = [];
							if (oData.NODE_TYPE === "RES_GROUP" || oData.NODE_TYPE === "RESOURCE") {
								aAssignments = oItem.GanttHierarchyToResourceAssign ? (oItem.GanttHierarchyToResourceAssign.results ? oItem.GanttHierarchyToResourceAssign
									.results : []) : [];
							} else if (oData.NODE_TYPE === "SHIFT") {
								aAssignments = oItem.GanttHierarchyToShift ? (oItem.GanttHierarchyToShift.results ? oItem.GanttHierarchyToShift.results : []) : [];
							}
							aAssignments.forEach(function (oAssignment, index) {
								if (oAssignment.Guid === oData.Guid || oAssignment.isTemporary === true) {
									this._markAsPlanningChange(oAssignment, false);
									aAssignments.splice(index, 1);

								}
							}.bind(this));
						};
						aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignData);
						this.oPlanningModel.setProperty("/data/children", aChildren);
					}.bind(this));

				} else {
					oFoundData = this._getChildDataByKey("Guid", oAssignmentData.Guid, null);
					this.oPlanningModel.setProperty(oFoundData.sPath + "/isRepeating", true);
					this._markAsPlanningDelete(oAssignmentData); // mark planing one assignment for delete
					aAssignment.forEach(function (oAssignData, idx) {
						this._deleteAssignment(oAssignData, false);
					}.bind(this));
				}
			}

			if (this.groupShiftContextForRepeat || this.editSeriesDate) {
				this.editRepeatingAssignment(oAssignmentData);
			}
			if (this._oPlanningPopover) {
				this._oPlanningPopover.close();
			}
		},
		/**
		 * Create series assignment after deleting series assignment
		 * @{param} oAssignmentData - Assignment Information
		 */
		editRepeatingAssignment: function (oAssignmentData) {
			var oNewAssignmentData = deepClone(oAssignmentData),
				sStartDateProp,
				sEndDateProp;
			if (oAssignmentData.NODE_TYPE === "RES_GROUP") {
				sStartDateProp = "StartDate";
				sEndDateProp = "EndDate";
			} else if (oAssignmentData.NODE_TYPE === "SHIFT") {
				sStartDateProp = "EffectiveStartDate";
				sEndDateProp = "EffectiveEndDate";
			}
			if (this.groupShiftContextForRepeat) {
				if (oNewAssignmentData.NODE_TYPE === "RES_GROUP") {
					oNewAssignmentData.RESOURCE_GROUP_COLOR = this.groupShiftContextForRepeat.getProperty("ResourceGroupColor");
					oNewAssignmentData.DESCRIPTION = this.groupShiftContextForRepeat.getProperty("ResourceGroupDesc");
				} else if (oNewAssignmentData.NODE_TYPE === "SHIFT") {
					oNewAssignmentData.DESCRIPTION = this.groupShiftContextForRepeat.getProperty("ScheduleIdDesc");
					oNewAssignmentData.PARENT_NODE_ID = oNewAssignmentData.NodeId;
					oNewAssignmentData.ResourceGuid = oNewAssignmentData.ParentNodeId;
					var shiftData = this.groupShiftContextForRepeat.getObject();
					oNewAssignmentData = this.mergeObject(oNewAssignmentData, shiftData);
				}
				oNewAssignmentData.Guid = new Date().getTime().toString();
				oNewAssignmentData[sStartDateProp] = formatter.convertFromUTCDate(oNewAssignmentData[sStartDateProp], oNewAssignmentData.isNew,
					oNewAssignmentData.isChanging);
				oNewAssignmentData[sEndDateProp] = formatter.convertFromUTCDate(oNewAssignmentData[sEndDateProp], oNewAssignmentData.isNew,
					oNewAssignmentData
					.isChanging);
				oNewAssignmentData["SERIES_START_DATE"] = formatter.convertFromUTCDate(oNewAssignmentData["SERIES_START_DATE"], oNewAssignmentData
					.isNew,
					oNewAssignmentData
					.isChanging);
				oNewAssignmentData.isNew = true;
				this._addSingleChildToParent(oNewAssignmentData, false, true, true);
				this.groupShiftContextForRepeat = null;
			}
			if (this.editSeriesDate) {
				oNewAssignmentData.Guid = new Date().getTime().toString();
				oNewAssignmentData.isNew = true;
				if (oNewAssignmentData.NODE_TYPE === "SHIFT") {
					oNewAssignmentData.PARENT_NODE_ID = oNewAssignmentData.NodeId;
					oNewAssignmentData.ResourceGuid = oNewAssignmentData.ParentNodeId;
				}
				this._addSingleChildToParent(oNewAssignmentData, false, true, true);
				this.editSeriesDate = false;
			}
		},

		/**
		 * Manage Dates according to node type
		 * @{param} oAssignItem - assignment
		 */
		_manageDates: function (oAssignItem) {
			if (oAssignItem.NODE_TYPE === "RES_GROUP") {
				oAssignItem.StartDate = formatter.convertFromUTCDate(oAssignItem.StartDate);
				oAssignItem.EndDate = formatter.convertFromUTCDate(oAssignItem.EndDate);
			} else if (oAssignItem.NODE_TYPE === "SHIFT") {
				oAssignItem.EffectiveStartDate = formatter.convertFromUTCDate(oAssignItem.EffectiveStartDate);
				oAssignItem.EffectiveEndDate = formatter.convertFromUTCDate(oAssignItem.EffectiveEndDate);
			}
			this._deleteAssignment(oAssignItem, true);
		},

		/**
		 * Method will get call after validation is done, if validation pass, data will get delete from gantt.
		 * @param {object} oAssignmentData - deleted data
		 * @param {boolean} isPlanningRequired - indicates whether "DELETE" need to be recorded in planning mode
		 * 
		 */
		_deleteAssignment: function (oAssignmentData, isPlanningRequired) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			var callbackFn = function (oItem, oData, idx) {
				var aAssignments, shiftData;
				if (oData.NODE_TYPE === "RES_GROUP") {
					aAssignments = oItem.GanttHierarchyToResourceAssign ? (oItem.GanttHierarchyToResourceAssign.results ? oItem.GanttHierarchyToResourceAssign
						.results : []) : [];
				} else
				if (oData.NODE_TYPE === "SHIFT") {
					aAssignments = oItem.GanttHierarchyToShift ? (oItem.GanttHierarchyToShift.results ? oItem.GanttHierarchyToShift.results : []) : [];
				}

				aAssignments.forEach(function (oAssignItemData, index) {
					if (oAssignItemData.Guid === oData.Guid) {
						if (isPlanningRequired) {
							this._markAsPlanningDelete(oAssignItemData);
						}
						if (this.groupShiftContext) {
							if (oAssignItemData.NODE_TYPE === "RES_GROUP") {
								oAssignItemData.RESOURCE_GROUP_COLOR = this.groupShiftContext.getProperty("ResourceGroupColor");
								oAssignItemData.DESCRIPTION = this.groupShiftContext.getProperty("ResourceGroupDesc");
							} else if (oAssignItemData.NODE_TYPE === "SHIFT") {
								oAssignItemData.DESCRIPTION = this.groupShiftContext.getProperty("ScheduleIdDesc");
								oAssignItemData.PARENT_NODE_ID = oAssignItemData.NodeId;
								oAssignItemData.ResourceGuid = oAssignItemData.ParentNodeId;
								shiftData = this.groupShiftContext.getObject();
								oAssignItemData = this.mergeObject(oAssignItemData, shiftData);
							}

							this._addSingleChildToParent(oAssignItemData, true, false);
						}
						aAssignments.splice(index, 1);
					}
				}.bind(this));

			};
			aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignmentData);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},
		/**
		 * validated if popover can be visible or not
		 */
		_validateForOpenPopover: function (oData) {
			var bPopover = this.getView().getModel("user").getProperty("/ENABLE_PLANNING_POPOVER");
			if (oData.bDragged && !bPopover) {
				this.oPlanningModel.setProperty("/tempData/popover/bDragged", false);
				this.onPressChangeAssignment();
			}
		},

		/**
		 * To update resource group color based on selected resource group
		 * time out is to wait to load ResourceGroupSet data
		 */
		_addResourceGroupColor: function (oData) {
			if (oData.ResourceGroupGuid && oData.isNew) {
				var oGroupSelection = sap.ui.getCore().byId("idResourceGroupGroup");
				if (oGroupSelection && oGroupSelection.getSelectedItem()) {
					var sColor = oGroupSelection.getSelectedItem().getBindingContext("viewModel").getProperty("ResourceGroupColor");
					oData.RESOURCE_GROUP_COLOR = sColor;
					this.oPlanningModel.refresh();
				}
			}
		},
		/**
		 * To update resource group color based on selected resource group- Duplicate - used for Dialog as id is different
		 * time out is to wait to load ResourceGroupSet data
		 */
		_addResourceGroupColorDialog: function (oData) {
			if (oData.ResourceGroupGuid && oData.isNew) {
				var oGroupSelection = sap.ui.getCore().byId("idResourceGroupGroupDialog");
				if (oGroupSelection && oGroupSelection.getSelectedItem()) {
					var sColor = oGroupSelection.getSelectedItem().getBindingContext("viewModel").getProperty("ResourceGroupColor");
					oData.RESOURCE_GROUP_COLOR = sColor;
					this.oPlanningModel.refresh();
				}
			}
		},

		/**
		 * Validate assigment while create/update 
		 * Created repeated assignments
		 * Change of shape assignment
		 * check if group or date range was changed
		 * when it was changed send validation request
		 */
		_validateAssignment: function () {
			var oData = this.oPlanningModel.getProperty("/tempData/popover"),
				aChildren = this.oPlanningModel.getProperty("/data/children"),
				iScrollTo;
			//validation for the duplicates
			if (this._validateDuplicateAsigment()) {
				return;
			}

			if (!oData.SeriesRepeat || oData.SeriesRepeat === "N") {
				if (oData.isNew) {
					if (oData.NODE_TYPE === "SHIFT") {
						if (this._shiftValidation(oData)) {
							oData.isTemporary = false;
							this._markAsPlanningChange(oData, true);
						} else {
							if (!oData.isTemporary) {
								var oFoundData = this._getChildrenDataByKey("Guid", oData.Guid, null),
									oOldAssignmentData = this.oPlanningModel.getProperty("/tempData/oldPopoverData");
								for (var i = 0; i < oFoundData.length; i++) {
									this.oPlanningModel.setProperty(oFoundData[i], oOldAssignmentData);
								}
							}
							this.showMessageToast(this.getResourceBundle().getText("yMsg.shiftvalidation"));
						}
					} else {
						oData.isTemporary = false;
						this._markAsPlanningChange(oData, true);
					}
				} else {
					this.oPlanningModel.setProperty("/tempData/popover/isTemporary", false);
					//validate whether changes are happend or not
					if (this._setChangeIndicator(oData)) {
						this.oPlanningModel.setProperty("/tempData/popover/isRestChanges", false);
						this._validateForChange(oData);
					}
				}
			} else {
				//repeat assignement creation
				this._repeatAssignments(oData);
			}
			if (this._oPlanningPopover) {
				this._oPlanningPopover.close();
			}
			//added for closing dialog on ok for new resource creation and to scroll to the new added resource
			if (this._oPlanningDialog) {
				iScrollTo = this.getLengthOfAllChildren(aChildren);
				this.getView().getModel("viewModel").setProperty("/gantt/firstVisibleRow", iScrollTo);
				this._setGanttScrollState();
				this._oPlanningDialog.close();
			}
		},

		/**
		 * Method to set change indicator for the further usage
		 * @param {oData} popover data
		 */
		_setChangeIndicator: function (oData) {
			var oldPopoverData = this.oPlanningModel.getProperty("/tempData/oldPopoverData");
			if (!moment(oData.StartDate).isSame(oldPopoverData.StartDate) || !moment(oData.EndDate).isSame(oldPopoverData.EndDate)) {
				return true;
			}
			return false;
		},

		/**
		 * Set initial data to the planning model
		 */
		_initialisePlanningModel: function () {
			//idPageResourcePlanningWrapper
			this.oOriginData = {
				data: {
					children: []
				},
				tempData: {},
				changedData: [],
				hasChanges: false,
				deletedData: [],
				unAssignData: [],
				tempUnassignData: [],
				isShapeSelected: false,
				isResourceSelected: false,
				multiSelectedDataForDelete: [],
				isRepeatAssignmentAdded: false,
				multiCreateData: {},
				selectedResources:[]
			};
			this.oPlanningModel = this.getOwnerComponent().getModel("ganttPlanningModel");
			this.oPlanningModel.setData(deepClone(this.oOriginData));
		},

		/**
		 * When delete assignments are success look for the save function if any changed data is available 
		 * for the create or update
		 * @param {oResponse}  -response of delete success
		 */
		_deleteSuccess: function (oResponse) {
			this.saveChanges(this._saveSuccess.bind(this), this._saveFailed.bind(this));
		},

		/**
		 * when delete assignments failed
		 * @param {oError} --errors from delete failure
		 */
		_deleteFailed: function (oError) {
			this.getModel().resetChanges();
		},

		/**
		 * save the changed entries in the gantt
		 * refresh the gantt
		 */
		_saveSuccess: function (oResponse) {
			this.showMessageToast(this.getResourceBundle().getText("msg.successfullyupdated"));
			this.getModel().resetChanges();
			this._loadGanttData();
		},

		/**
		 * failed to save the gantt changed entry
		 */
		_saveFailed: function (oError) {
			this.getModel().resetChanges();
		},

		/**
		 * Handle afteclose popover close
		 * Set the changes if not validated
		 * reset the binding data after close the popover
		 * Reset the form validation after close the popover
		 */
		_afterPopoverClose: function (oEvent) {
			var oData = this.oPlanningModel.getProperty("/tempData/popover"),
				oOldAssignmentData = this.oPlanningModel.getProperty("/tempData/oldPopoverData");

			//enable the reset button based on changes
			if (!this.getModel("viewModel").getProperty("/isResetEnabled")) {
				this.getModel("viewModel").setProperty("/isResetEnabled", this.oPlanningModel.getProperty("/hasChanges"));
			}

			if (oData.isRestChanges) {
				if (!oData.isNew && oData.isTemporary && oOldAssignmentData && oOldAssignmentData.Guid) {
					var oFoundData = this._getChildrenDataByKey("Guid", oData.Guid, null);
					if (oFoundData && oFoundData.length === 2) {
						for (var i = 0; i < oFoundData.length; i++) {
							this.oPlanningModel.setProperty(oFoundData[i], oOldAssignmentData);
						}
						this.oPlanningModel.setProperty("/tempData/popover/isTemporary", false);
					}
				}
				this._removeAssignmentShape(oData);
				this.oPlanningModel.setProperty("/tempData/popover", {});
				this.oPlanningModel.setProperty("/tempData/oldPopoverData", {});
				this.reValidateForm(this.getView().getControlsByFieldGroupId("changeShapeInput"));
			}
		},

		/**
		 * Create repeated assignments
		 * Calculate the future assignments based on sented repeat mode
		 * @param {oData} Initial popover selection
		 */
		_repeatAssignments: function (oData, isEditMode) {
			var newData, iEvery = 0,
				dayCounter = 0,
				oDateProp = {
					startDateProp: null,
					endDateProp: null
				},
				oStartDate,
				oEndDate,
				iDateDiff = 0;

			if (oData.NODE_TYPE === "RES_GROUP") {
				oDateProp.startDateProp = "StartDate";
				oDateProp.endDateProp = "EndDate";
			} else if (oData.NODE_TYPE === "SHIFT") {
				oDateProp.startDateProp = "EffectiveStartDate";
				oDateProp.endDateProp = "EffectiveEndDate";
			}
			oData.SeriesGuid = new Date().getTime().toString();
			oStartDate = moment(oData[oDateProp.startDateProp]);
			oEndDate = moment(oData[oDateProp.endDateProp]);
			iDateDiff = moment(oEndDate).diff(oStartDate, 'd');
			if (oData.SeriesRepeat === "D") {
				oData.SeriesEvery = parseInt(oData.SeriesEvery, 10) < (iDateDiff + 1) ? (iDateDiff + 1).toString() : oData.SeriesEvery;
			}
			if (isEditMode) {
				oStartDate = oData.SERIES_START_DATE ? moment(formatter.convertFromUTCDate(oData.SERIES_START_DATE, oData.isNew, oData.isChanging)) :
					oStartDate;
				if (oData.SeriesRepeat === "W") {
					oData.SeriesWeeklyOn = oData.SeriesOn.split(",");
				}
				if (oData.SeriesRepeat === "M") {
					oData.SeriesMonthlyOn = oData.SeriesOn === "1" ? 0 : 1;
				}
			}
			do {
				if (oData.SeriesRepeat === "D") {
					newData = deepClone(oData);
					newData[oDateProp.startDateProp] = oStartDate.add(iEvery, 'days').toDate();

					this._validateAndPrepareNewAssignment(newData, oData, dayCounter, iDateDiff, null, oDateProp);
					oStartDate = moment(newData[oDateProp.startDateProp]);

				} else if (oData.SeriesRepeat === "W") {
					var week = oStartDate;
					for (var d = 0; d < oData.SeriesWeeklyOn.length; d++) {
						newData = deepClone(oData);
						newData[oDateProp.startDateProp] = moment(week).day(oData.SeriesWeeklyOn[d]).toDate();

						this._validateAndPrepareNewAssignment(newData, oData, dayCounter, iDateDiff, d, oDateProp);
					}
					oStartDate = moment(oStartDate.add(iEvery, 'weeks').startOf('weeks').toDate());

				} else if (oData.SeriesRepeat === "M") {
					newData = deepClone(oData);
					if (oData.SeriesMonthlyOn === 0) {
						newData[oDateProp.startDateProp] = oStartDate.add(iEvery, 'months').toDate();
					} else if (oData.SeriesMonthlyOn === 1) {
						var oStrDate = moment(oData[oDateProp.startDateProp]),
							iDay = oStrDate.day();
						newData[oDateProp.startDateProp] = oStartDate.add(iEvery, 'months').day(iDay).toDate();
					}

					this._validateAndPrepareNewAssignment(newData, oData, dayCounter, iDateDiff, null, oDateProp);
					oStartDate = moment(newData[oDateProp.startDateProp]);
				}

				dayCounter++;
				iEvery = parseInt(oData.SeriesEvery, 10);
			}
			while (oStartDate.isBefore(moment(oData.SERIES_END_DATE)));

			this.getModel("ganttPlanningModel").setProperty("/isRepeatAssignmentAdded", false);
		},

		/**
		 * validate the duplicate assignments
		 * Add new shape to gantt
		 * mark it to save
		 * @param {data} - data to be save fot he new assignment
		 * @param {oData} - date with popover selection
		 */
		_validateAndAddNewAssignment: function (data, oData) {
			var aAssigments = [];
			if (oData.NODE_TYPE === "RES_GROUP") {
				aAssigments = this._getResourceassigmentByKey("ResourceGuid", oData.ResourceGuid, oData.ResourceGroupGuid, oData);
			} else if (oData.NODE_TYPE === "SHIFT") {
				aAssigments = this._getResourceShiftByKey(oData.ParentNodeId, oData);
				if (!this._shiftValidation(data)) {
					this.showMessageToast(this.getResourceBundle().getText("yMsg.shiftvalidation"));
					return;
				}
			}
			//validation for the existing assigments
			if (this._checkDuplicateAsigment(data, aAssigments)) {
				this._addNewAssignmentShape(data);
				data.isTemporary = false;
				data.IsSeries = true;
				data.SERIES_END_DATE = formatter.convertToUTCDate(data.SERIES_END_DATE);
				if (data.SeriesRepeat === "W") {
					data.SeriesOn = data.SeriesWeeklyOn.join(",");
				} else if (data.SeriesRepeat === "M") {
					data.SeriesOn = data.SeriesMonthlyOn === 0 ? "1" : "2";
				}
				if (!this.getModel("ganttPlanningModel").getProperty("/isRepeatAssignmentAdded")) {
					this._markAsPlanningChange(data, true);
					this.getModel("ganttPlanningModel").setProperty("/isRepeatAssignmentAdded", true);
				}

			} else {
				//TODO message for the overlapping
			}
		},

		/**
		 * Biuld new Guid
		 * Validate startdate is less than repeat end date and greater than current date
		 * Calculate enddate for the new assignment
		 * call _validateAndAddNewAssignment
		 * @{param} newData - data for new assignment
		 * @{param} oData - popover data
		 * @param iCounter - integer indicator
		 * @param iDayIndex - integer days loop index
		 */
		_validateAndPrepareNewAssignment: function (newData, oData, iCounter, iDateDiff, iDayIndex, oDateProp) {
			newData.Guid = newData.Guid + iCounter;
			if (iDayIndex) {
				newData.Guid = newData.Guid + iCounter + iDayIndex;
			}
			newData[oDateProp.endDateProp] = moment(newData[oDateProp.startDateProp]).add(iDateDiff, 'd').endOf('day').toDate();

			if (!this._isDatePast(newData[oDateProp.startDateProp]) && moment(newData[oDateProp.startDateProp])
				.isSameOrBefore(moment(oData.SERIES_END_DATE))) {
				this._validateAndAddNewAssignment(newData, oData);
			}
		},

		/**
		 * Set start date and end date for smart filter accroding to mode selected and change gantt view
		 * @param {string} sKey - selected mode
		 * @param {object} oStartDate - start dae for the gantt - default date is start date maintained in config
		 * @param {object} oEndDate - end date for the gantt - default date is end date maintained in config
		 * @private
		 */
		_setDateFilter: function (sKey, oStartDate, oEndDate) {
			var newDateRange = formatter.getDefaultDates(sKey, this.getModel("user"));
			if (oStartDate) {
				newDateRange["StartDate"] = oStartDate;
			}
			if (oEndDate) {
				newDateRange["EndDate"] = oEndDate;
			}
			if (!this.oZoomStrategy) {
				this.oZoomStrategy = this._ganttChart.getAxisTimeStrategy();
			}
			this._setNewHorizon(moment(newDateRange.StartDate).startOf("day").toDate(), moment(newDateRange.EndDate).endOf("day").subtract(999,
				'milliseconds').toDate());
			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions(sKey));
			this._sGanttViewMode = formatter.getViewMapping(sKey);
			this._setBackgroudShapes(this._sGanttViewMode);
			this._previousView = sKey;

		},

		/**
		 * Validate marked unassigned assignments
		 * @{param] oResults - function import return assignments
		 */
		_checkMarkedUnassigned: function (oResults) {
			var aMarkedUnassign = this.oPlanningModel.getProperty("/unAssignData");
			oResults.forEach(function (oItem) {
				if (aMarkedUnassign && aMarkedUnassign.indexOf(oItem.Guid) < 0) {
					oItem.MarkedUnassign = false;
				} else {
					oItem.MarkedUnassign = true;
				}

			}.bind(this));
			return oResults;
		},
		/**
		 * Compares defaultEndDate with Assignment End Date, if defaultEndDate is before assignment end date, then max date is assignment end date, or viceversa
		 * @param {object} oAssignmentEndDate - End Date of Assignment
		 */
		_getShapePopoverMaxDate: function (oAssignmentEndDate) {
			var oMaxDate = moment(this.getModel("viewModel").getProperty("/gantt/defaultEndDate")).endOf("day").toDate();
			if (moment(oMaxDate).isBefore(oAssignmentEndDate)) {
				oAssignmentEndDate = formatter.convertFromUTCDate(oAssignmentEndDate);
				oMaxDate = moment(oAssignmentEndDate).endOf("day").toDate();
			}
			return oMaxDate;
		},
		/**
		 * Compares today's date with Assignment Start Date, if today's date is after assignment start date, then min date is assignment start date, or viceversa
		 * 
		 */
		_getShapePopoverMinDate: function (isDeletable) {
			if (isDeletable) {
				var oMinDate = moment().startOf("day").toDate();
				return oMinDate;
			}
			return null;
		},
		/**
		 * Gets scroll state for the Gantt and assign to "viewModel" -> "/gantt/firstVisibleRow"
		 * @param {boolean} isReset - if true then set firstVisibleRow of Gantt to 1
		 */
		_getGanttScrollState: function (isReset) {
			var firstVisibleRow = this._treeTable.getFirstVisibleRow();
			if (isReset) {
				this.getModel("viewModel").setProperty("/gantt/firstVisibleRow", 0);
				return 0;
			}
			this.getModel("viewModel").setProperty("/gantt/firstVisibleRow", firstVisibleRow);
			return firstVisibleRow;
		},
		/**
		 * Sets scroll state for the Gantt
		 */
		_setGanttScrollState: function () {
			var firstVisibleRow = this.getModel("viewModel").getProperty("/gantt/firstVisibleRow") || 0;
			this._treeTable.setFirstVisibleRow(firstVisibleRow);
			this.getModel("viewModel").setProperty("/gantt/firstVisibleRow", 0);
		},

		/**
		 * validate shift with resource group condition
		 * Shift should be betwwen group assignment range
		 * @param {oShiftData}
		 */
		_shiftValidation: function (oShiftData) {
			var bValidStart = false,
				bValidEnd = false,
				oEndDate = null,
				oStartDate = null,
				sDummyDate = null,
				oNodeData = this._getChildDataByKey("NodeId", oShiftData.ParentNodeId),
				bShiftValidationCheck = this.getModel("user").getProperty("/ENABLE_SHIFT_VALIDATION");

			//check if global config enabled, if not enabled then no validation check for shift creation against group for same date range	
			if (!bShiftValidationCheck) {
				return true;
			}

			if (oNodeData && oNodeData["oData"] && oNodeData["oData"].GanttHierarchyToResourceAssign) {
				var aResourceData = oNodeData["oData"].GanttHierarchyToResourceAssign;
				//sort array based on the date object
				aResourceData.results.sort(function (oItem1, oItem2) {
					return oItem1.StartDate - oItem2.StartDate;
				});

				for (var i = 0; i < aResourceData.results.length; i++) {
					oStartDate = formatter.convertFromUTCDate(aResourceData.results[i].StartDate, aResourceData.results[i].isNew, aResourceData.results[
						i].isChanging);
					oEndDate = formatter.convertFromUTCDate(aResourceData.results[i].EndDate, aResourceData.results[i].isNew, aResourceData.results[
						i].isChanging);
					//add missing seconds in the enddate
					if (oShiftData.SeriesRepeat && oShiftData.SeriesRepeat !== "NEVER") {
						oEndDate = moment(oEndDate).add(999, 'milliseconds').toDate();
					}

					if (!bValidStart && (moment(oShiftData.EffectiveStartDate).isSame(moment(oStartDate)) || moment(oShiftData.EffectiveStartDate).isBetween(
							moment(oStartDate), moment(oEndDate)))) {
						bValidStart = true;
					}

					if (!bValidEnd && moment(oShiftData.EffectiveEndDate).isSame(moment(oEndDate)) || moment(oShiftData.EffectiveEndDate).isBetween(
							moment(oStartDate), moment(oEndDate))) {
						if ((sDummyDate && sDummyDate.isSame(oStartDate)) || moment(oShiftData.EffectiveStartDate).isSame(moment(oStartDate)) || moment(
								oShiftData.EffectiveStartDate).isBetween(moment(oStartDate), moment(oEndDate)) && moment(oShiftData.EffectiveEndDate).isBetween(
								moment(oStartDate), moment(oEndDate)) || (moment(oShiftData.EffectiveStartDate).isSameOrAfter(moment(oStartDate)) &&
								moment(oShiftData.EffectiveEndDate).isSameOrBefore(moment(oEndDate)))) {
							bValidEnd = true;
						}
					}
					//validate previous group validation
					sDummyDate = oEndDate;
					sDummyDate = moment(sDummyDate).add(1, "seconds");
				}
			}
			return (bValidStart && bValidEnd);
		}
	});
});