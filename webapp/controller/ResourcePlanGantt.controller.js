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
	"sap/m/MessageBox",
	"sap/gantt/misc/Utility",
	"sap/base/util/merge"
], function (BaseController, OverrideExecution, formatter, deepClone, deepEqual, models, Fragment, Filter, FilterOperator,
	MessageBox, Utility, merge) {
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
				onPressSave: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
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
				onDemandSelectionChange: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				},
				onDemandUnassign: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Instead
				}
			}
		},

		oOriginData: null,
		oPlanningModel: null,
		_defaultView: "DAY",
		_treeTable: null,
		_previousView: "DAY",

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourcePlanningMain
		 */
		onInit: function () {
			this._treeTable = this.getView().byId("idResourcePlanGanttTreeTable");
			this.oZoomStrategy = this.getView().byId("idResourcePlanGanttZoom");
			this.oZoomStrategy.setTimeLineOptions(formatter.getTimeLineOptions());
			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions(this._defaultView));
			this._sGanttViewMode = formatter.getViewMapping(this._defaultView);

			//idPageResourcePlanningWrapper
			this._initialisePlanningModel();

			this.getOwnerComponent().oSystemInfoProm.then(function (oResult) {
				this._setNewHorizon(oResult.DEFAULT_DAILYVIEW_STARTDATE, oResult.DEFAULT_DAILYVIEW_ENDDATE);
			}.bind(this));
		},

		/* =========================================================== */
		/* Events                                                      */
		/* =========================================================== */

		/**
		 * Set new time line options for Gantt time horizon
		 * @param {object} oEvent - change event of filter view mode
		 */
		onChangeTimeMode: function (oEvent) {
			var mParam = oEvent.getParameters(),
				sKey = mParam.selectedItem.getKey(),
				bChanges = this.oPlanningModel.getProperty("/hasChanges"),
				oSource = oEvent.getSource();
			if (bChanges) {
				var sTitle = this.getResourceBundle().getText("tit.confirmChange"),
					sMsg = this.getResourceBundle().getText("msg.modeChange");
				var successcallback = function () {
					this._loadGanttData();
					this._setDateFilter(sKey);
				};
				var cancelcallback = function () {
					oSource.setSelectedKey(this._previousView);
				};
				this.showConfirmDialog(sTitle, sMsg, successcallback.bind(this), cancelcallback.bind(this));
			} else {
				this._setDateFilter(sKey);
				this._previousView = sKey;
			}
		},

		/**
		 * When filterbar was initialized then get all filters and send backend request
		 * @param {object} oEvent - change event of filterbar
		 */
		onInitializedSmartVariant: function (oEvent) {
			this._loadGanttData();
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
				oStartDate = oDateRangePicker.getDateValue(),
				oEndDate = oDateRangePicker.getSecondDateValue();

			this._setNewHorizon(oStartDate, oEndDate);
			this._loadGanttData();
		},

		/**
		 * when shape was double pressed show popover with details of assignment
		 * or create new temporary assignment
		 * @param {object} oEvent - when shape in Gantt was selected
		 */
		onShapePress: function (oEvent) {
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
				oStartTime = oTargetShape ? oTargetShape.getProperty("time") : null;
				oEndTime = oStartTime ? new Date(moment(oStartTime).add(dateDifference)) : null;
			} else if (oEvent.getId() === 'shapeResize') {
				sShapeId = oEvent.getParameter("shapeUid");
				oShapeInfo = Utility.parseUid(sShapeId);
				oStartTime = moment(oEvent.getParameter("newTime")[0]).startOf('day').toDate();
				oEndTime = moment(oEvent.getParameter("newTime")[1]).endOf('day').toDate();
			}
			//validate if date is past
			if (!oStartTime || !oEndTime || this._isDatePast(oStartTime) || this._isDatePast(oEndTime)) {
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
			if (oTargetControl && this._sGanttViewMode.isFuture(oTargetControl.getTime())) {
				// create popover
				if (!this._oPlanningPopover) {
					Fragment.load({
						name: "com.evorait.evosuite.evoresource.view.fragments.ShapeChangePopover",
						controller: this
					}).then(function (pPopover) {
						this._oPlanningPopover = pPopover;
						this.getView().addDependent(this._oPlanningPopover);
						this._oPlanningPopover.openBy(oTargetControl);
						this._setPopoverData(oTargetControl, oPopoverData);

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
					this._oPlanningPopover.openBy(oTargetControl);
					this._setPopoverData(oTargetControl, oPopoverData);
				}
			} else {
				this.showMessageToast(this.getResourceBundle().getText("xtxt.noPastAssignment"));
			}
		},

		/**
		 * Called when Resource drop is dropped in Gantt
		 * @param {object} oEvent
		 */
		onResourceGroupDrop: function (oEvent) {
			//ondrop of the the resourcegroup
			var oDroppedControl = oEvent.getParameter("droppedControl"),
				oContext = oDroppedControl.getBindingContext("ganttPlanningModel"),
				oObject = deepClone(oContext.getObject()),
				oDraggedObject = this.getView().getModel("viewModel").getProperty("/draggedData"),
				oBrowserEvent = oEvent.getParameter("browserEvent"),
				oDroppedTarget = sap.ui.getCore().byId(oBrowserEvent.toElement.id),
				sStartTime = oDroppedTarget.getTime(),
				sEndTime = oDroppedTarget.getEndTime(),
				oPopoverData,
				oParentData,
				aIgnoreProperty = ["__metadata", "NodeId", "USER_TIMEZONE"];

			if (oObject.NodeType !== "RESOURCE") {
				oParentData = this._getParentResource(oObject.ParentNodeId);
				oObject.USER_TIMEZONE = oParentData.TIME_ZONE;
			}

			oObject = this.copyObjectData(oObject, oDraggedObject.data, aIgnoreProperty);
			oPopoverData = {
				Guid: new Date().getTime(),
				sStartTime: sStartTime,
				sEndTime: sEndTime,
				oResourceObject: oObject,
				bDragged: true
			};
			this.openShapeChangePopover(oDroppedTarget, oPopoverData);
		},
		/**
		 * Button event press save Gantt changes
		 * @param {object} oEvent
		 */
		onPressSave: function (oEvent) {
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
				this._loadGanttData();
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
			var oSimpleformFileds = this.getView().getControlsByFieldGroupId("changeShapeInput");
			var oValidation = this.validateForm(oSimpleformFileds);

			if (oValidation && oValidation.state === "success") {
				this._validateAssignment();
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
				this._oPlanningPopover.close();
			};
			var cancelcallback = function () {};
			if (oData.isNew) {
				this._removeAssignmentShape(oData, true);
				this._oPlanningPopover.close();
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
				oSelContext = oSelectedItem.getBindingContext("viewModel"),
				oData = this.oPlanningModel.getProperty("/tempData/popover");

			oSource.setValueState(sap.ui.core.ValueState.None);
			//validate duplicate assignments
			if (this._validateDuplicateAsigment()) {
				return;
			}

			if (oData.isNew) {
				this.oPlanningModel.setProperty("/tempData/popover/RESOURCE_GROUP_COLOR", oSelContext.getProperty("ResourceGroupColor"));
				this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", oSelContext.getProperty("ResourceGroupDesc"));
				this.oPlanningModel.setProperty("/tempData/popover/ResourceGroupDesc", oSelContext.getProperty("ResourceGroupDesc"));

				this._removeAssignmentShape(oData, true);
				//add different resource group if it is not exist
				this._addSingleChildToParent(oData);

				if (!oData.isTemporary) {
					this._oPlanningPopover.close();
				}
			} else {
				this._removeAssignmentShape(oData, true, oSelContext);
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

			oSource.setValueState(sap.ui.core.ValueState.None);
			//validate duplicate assignments
			if (this._validateDuplicateAsigment()) {
				return;
			}

			if (oData.isNew) {
				this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", oSelContext.getProperty("TemplateDesc"));
				shiftData = oSelContext.getObject();
				oData = this.mergeObject(oData, shiftData);
				this._removeAssignmentShape(oData, true);
				//add different resource group if it is not exist
				this._addSingleChildToParent(oData);

				if (!oData.isTemporary) {
					this._oPlanningPopover.close();
				}
			} else {
				this._removeAssignmentShape(oData, true, oSelContext);
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
				oEndDate = oDateRange.getSecondDateValue();
			this.oPlanningModel.setProperty("/tempData/popover/StartDate", oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/EndDate", oEndDate);

			this.oPlanningModel.setProperty("/tempData/popover/EffectiveStartDate", oStartDate);
			this.oPlanningModel.setProperty("/tempData/popover/EffectiveEndDate", oEndDate);

			//validate for the overlapping
			if (this._validateDuplicateAsigment()) {
				return;
			}
			this.oPlanningModel.setProperty("/tempData/popover/isTemporary", true);
			this.oPlanningModel.setProperty("/tempData/popover/isChanging", true);
		},

		/**
		 * On click on today adjust the view of Gantt horizon
		 * @param {object} oEvent
		 */
		onPressToday: function (oEvent) {
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
			this.oPlanningModel.setProperty("/tempData/popover/Every", "");
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
				this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", shapeDescription);
			} else if (newData.NODE_TYPE === "SHIFT") {
				shapeDescription = newData["ScheduleIdDesc"] || this.getResourceBundle().getText("xtit.shift");
				this.oPlanningModel.setProperty("/tempData/popover/DESCRIPTION", shapeDescription);
			}
			this._removeAssignmentShape(oldData, true);
			this.createNewTempAssignment(newData.StartDate, newData.EndDate, newData, false).then(function (oData) {
				this._addSingleChildToParent(newData);
			}.bind(this));

			this.oPlanningModel.setProperty("/tempData/oldPopoverData", deepClone(newData));
		},

		/**
		 * Called when selection change in the demand list fragment
		 * Validated the selected item with AllowUnassign indicator
		 * This function will avoid the selection of the non-assigned items 
		 */
		onDemandSelectionChange: function (oEvent) {
			if (oEvent.getParameter("selectAll") || oEvent.getParameter("selected")) {
				var aListItems = oEvent.getParameter("listItems");
				aListItems.forEach(function (oLineItem) {
					var oLineContext = oLineItem.getBindingContext("demandModel");
					if (!oLineContext.getProperty("AllowUnassign")) {
						oLineItem.setSelected(false);
					}
				});
			}
		},

		/**
		 * Called when clicks o the unassign button in the demand list fragmrnt 
		 * Validates the selection
		 */
		onDemandUnassign: function (oEvent) {
			var oTable = sap.ui.getCore().byId("idFragDemandListTable"),
				aSelectedItems = oTable.getSelectedItems();

			if (aSelectedItems.length === 0) {
				this.showMessageToast("Select atleast one assignement");
				return;
			}
			debugger;
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Load the tree data and process the data to create assignments as child nodes
		 * 
		 */
		_loadGanttData: function () {
			this._initialisePlanningModel();
			this._getResourceData(0)
				.then(this._getResourceData.bind(this))
				.then(function () {
					//backup original data
					this.oOriginData = deepClone(this.oPlanningModel.getProperty("/"));
					this._setBackgroudShapes(this._sGanttViewMode);
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
				var oFilterBar = this.getView().byId("idPageResourcePlanningSmartFilterBar"),
					oDateRangePicker = this.getView().byId("idFilterGanttPlanningDateRange"),
					aFilters = oFilterBar.getFilters(),
					sUri = "/GanttResourceHierarchySet",
					mParams = {
						"$expand": "GanttHierarchyToResourceAssign,GanttHierarchyToShift"
					};

				if (iLevel > 0) {
					mParams = {};
				}

				aFilters.push(new Filter("HierarchyLevel", FilterOperator.EQ, iLevel));
				aFilters.push(new Filter("StartDate", FilterOperator.GE, formatter.date(oDateRangePicker.getDateValue())));
				aFilters.push(new Filter("EndDate", FilterOperator.LE, formatter.date(oDateRangePicker.getSecondDateValue())));

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
			var oTimeHorizon = this.oZoomStrategy.getTotalHorizon(),
				sStartTime = oTimeHorizon.getStartTime(),
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

			if (oFoundData && oFoundData.oData && aDeleteData.indexOf(oFoundData.oData.Guid) < 0) {
				aDeleteData.push(oFoundData.oData);
			}

			this.oPlanningModel.setProperty("/hasChanges", (aChanges.length > 0 || aDeleteData.length > 0));
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

			if (oTargetControl.sParentAggregationName === "shapes1") {
				//its background shape
				this.createNewTempAssignment(sStartTime, sEndTime, oResourceObject, bDragged).then(function (oData) {
					this.oPlanningModel.setProperty("/tempData/popover", oData);
					this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oData));
					if (oData && oData.NODE_TYPE !== "RESOURCE") {
						oChildData = Object.assign(oData, {
							bgTasks: oPopoverData.oResourceObject.bgTasks
						});
						this._addSingleChildToParent(oChildData);
					} else {
						this._addNewAssignmentShape(oData);
					}

				}.bind(this));
			} else if (oTargetControl.sParentAggregationName === "shapes2" && oContext) {
				//its a assignment
				oAssignData = oContext.getObject();
				this._setShapePopoverPosition(oAssignData);
				//popover data adjustment with repeat mode
				oAssignData.Repeat = "NEVER";
				oAssignData.minDate = new Date();
				oAssignData.isEditable = true;
				this.oPlanningModel.setProperty("/tempData/popover", oAssignData);
				this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oAssignData));
			} else if (oTargetControl.sParentAggregationName === "shapes3" && oContext) {
				//its a assignment
				oAssignData = oContext.getObject();
				this._setShapePopoverPosition(oAssignData);
				//popover data adjustment with repeat mode
				oAssignData.Repeat = "NEVER";
				oAssignData.minDate = new Date();
				oAssignData.isEditable = true;
				oAssignData.isEditable = !oAssignData.HR_SHIFT_FLAG;
				oAssignData.StartDate = oAssignData.EffectiveStartDate;
				oAssignData.EndDate = oAssignData.EffectiveEndDate;

				this.oPlanningModel.setProperty("/tempData/popover", oAssignData);
				this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oAssignData));
			}
		},
		/**
		 * Add new Resource Group under Resource in Gantt
		 * @param {object} oData - Resource Group data to be added under Resource if not exist
		 */
		_addSingleChildToParent: function (oData, bAllowMarkChange) {
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
						oItem.children.push(oData);
					}

					if (oData.NodeType === "SHIFT" && !this._checkIfShiftExist(oItem) && oItem.NodeId === oData.ParentNodeId && oItem.children) {
						oData["Description"] = this.getResourceBundle('i18n').getText("xtit.shift");
						oItem.children.unshift(oData);
					}
				}.bind(this);
				aChildren = this._recurseAllChildren(aChildren, callbackFn, oGanntObject);
				this.oPlanningModel.setProperty("/data/children", aChildren);
				this._addNewAssignmentShape(oData);
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
		 * When shape is rumming out of visible gantt horizon show popup
		 * on top or bottom else when left or right
		 * @param {object} oAssignData - shape assignment data
		 */
		_setShapePopoverPosition: function (oAssignData) {
			//this._visibileStartDate; this._visibileEndDate
			var oStartDate = moment(oAssignData.DateFrom),
				oEndDate = moment(oAssignData.DateTo);

			if (oStartDate.isSameOrBefore(this._visibileStartDate) && oEndDate.isSameOrAfter(this._visibileEndDate)) {
				this.getModel("viewModel").setProperty("/gantt/popoverPlacement", sap.m.PlacementType.VerticalPreferredBottom);
			} else {
				this.getModel("viewModel").setProperty("/gantt/popoverPlacement", sap.m.PlacementType.HorizontalPreferredRight);
			}

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
		 * @param {sChangedContext} - changed context of group
		 */
		_removeAssignmentShape: function (oAssignData, removeNew, sChangedContext) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			if (!oAssignData.isTemporary && !removeNew) {
				return;
			}
			if (oAssignData.isNew) {
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
			} else {
				this._validateForDelete(oAssignData, sChangedContext);
			}

		},
		/**
		 * Validation of assignment on change
		 */
		_validateForChange: function (oAssignItem) {
			var oParams = {
					Guid: oAssignItem.Guid,
					ObjectId: oAssignItem.NODE_ID,
					EndTimestamp: formatter.convertToUTCDate(oAssignItem.EndDate),
					StartTimestamp: formatter.convertToUTCDate(oAssignItem.StartDate),
					EndTimestampUtc: oAssignItem.EndDate,
					StartTimestampUtc: oAssignItem.StartDate
				},
				sFunctionName = "ValidateResourceAssignment",
				oDemandModel = this.getModel("demandModel"),
				oFoundData = this._getChildrenDataByKey("Guid", oAssignItem.Guid, null),
				oPopoverData = this.oPlanningModel.getProperty("/tempData/popover"),
				oOldAssignmentData = this.oPlanningModel.getProperty("/tempData/oldPopoverData"),
				bAssignmentCheck = this.getView().getModel("user").getProperty("/ENABLE_ASSIGNMENT_CHECK");

			var callbackfunction = function (oData) {
				if (oData.results.length > 0) {
					oDemandModel.setProperty("/data", oData.results);
					for (var i = 0; i < oFoundData.length; i++) {
						this.oPlanningModel.setProperty(oFoundData[i], oOldAssignmentData);
					}
					this.openDemandDialog();
				} else {
					this._changeAssignment(oPopoverData);
				}
				this.oPlanningModel.refresh();
			}.bind(this);
			if (this._oPlanningPopover) {
				this._oPlanningPopover.close();
			}

			if (oPopoverData.NODE_TYPE !== "SHIFT" && bAssignmentCheck) {
				this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);
			} else {
				this._changeAssignment(oPopoverData);
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
		_validateForDelete: function (oAssignItem, sChangedContext) {
			var oParams = {
					Guid: oAssignItem.Guid,
					ObjectId: oAssignItem.NODE_ID,
					EndTimestamp: oAssignItem.EndDate,
					StartTimestamp: oAssignItem.StartDate,
					StartTimestampUtc: formatter.convertFromUTCDate(oAssignItem.StartDate),
					EndTimestampUtc: formatter.convertFromUTCDate(oAssignItem.EndDate)
				},
				sFunctionName = "ValidateResourceAssignment",
				oDemandModel = this.getModel("demandModel"),
				bAssignmentCheck = this.getView().getModel("user").getProperty("/ENABLE_ASSIGNMENT_CHECK");

			var callbackfunction = function (oDemandData) {
				if (oDemandData.results.length > 0) {
					console.log(oDemandData.results);
					oDemandModel.setProperty("/data", oDemandData.results);
					this.openDemandDialog();
				} else {
					if (oAssignItem.NODE_TYPE === "RES_GROUP") {
						oAssignItem.StartDate = formatter.convertFromUTCDate(oAssignItem.StartDate);
						oAssignItem.EndDate = formatter.convertFromUTCDate(oAssignItem.EndDate);
					} else if (oAssignItem.NODE_TYPE === "SHIFT") {
						oAssignItem.EffectiveStartDate = formatter.convertFromUTCDate(oAssignItem.EffectiveStartDate);
						oAssignItem.EffectiveEndDate = formatter.convertFromUTCDate(oAssignItem.EffectiveEndDate);
					}
					this._deleteAssignment(oAssignItem, sChangedContext);

				}
				this.oPlanningModel.refresh();
			}.bind(this);
			if (oAssignItem.NODE_TYPE !== "SHIFT" && bAssignmentCheck) {
				this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);
			} else {
				if (oAssignItem.NODE_TYPE === "RES_GROUP") {
					oAssignItem.StartDate = formatter.convertFromUTCDate(oAssignItem.StartDate);
					oAssignItem.EndDate = formatter.convertFromUTCDate(oAssignItem.EndDate);
				} else if (oAssignItem.NODE_TYPE === "SHIFT") {
					oAssignItem.EffectiveStartDate = formatter.convertFromUTCDate(oAssignItem.EffectiveStartDate);
					oAssignItem.EffectiveEndDate = formatter.convertFromUTCDate(oAssignItem.EffectiveEndDate);
				}
				this._deleteAssignment(oAssignItem, sChangedContext);
			}

		},

		/**
		 * Method will get call after validation is done, if validation pass, data will get delete from gantt.
		 * @param {object} oAssignmentData - deleted data
		 * @param {object} sChangedContext - context of changed group
		 * 
		 */
		_deleteAssignment: function (oAssignmentData, sChangedContext) {
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
						this._markAsPlanningDelete(oAssignItemData);
						if (sChangedContext) {
							if (oAssignItemData.NODE_TYPE === "RES_GROUP") {
								oAssignItemData.RESOURCE_GROUP_COLOR = sChangedContext.getProperty("ResourceGroupColor");
								oAssignItemData.DESCRIPTION = sChangedContext.getProperty("ResourceGroupDesc");
							} else if (oAssignItemData.NODE_TYPE === "SHIFT") {
								oAssignItemData.DESCRIPTION = sChangedContext.getProperty("TemplateDesc");
								oAssignItemData.PARENT_NODE_ID = oAssignItemData.NodeId;
								oAssignItemData.ResourceGuid = oAssignItemData.ParentNodeId;
								shiftData = sChangedContext.getObject();
								oAssignItemData = this.mergeObject(oAssignItemData, shiftData);
							}

							this._addSingleChildToParent(oAssignItemData, true);
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
		 * Validate assigment while create/update 
		 * Created repeated assignments
		 * Change of shape assignment
		 * check if group or date range was changed
		 * when it was changed send validation request
		 */
		_validateAssignment: function () {
			var oData = this.oPlanningModel.getProperty("/tempData/popover");
			//validation for the duplicates
			if (this._validateDuplicateAsigment()) {
				return;
			}

			if (!oData.Repeat || oData.Repeat === "NEVER") {
				if (oData.isNew) {
					oData.isTemporary = false;
					this._markAsPlanningChange(oData, true);
				} else {
					this.oPlanningModel.setProperty("/tempData/popover/isTemporary", false);
					//validate whether changes are happend or not
					if (this._setChangeIndicator(oData)) {
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
				deletedData: []
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
		},

		/**
		 * Create repeated assignments
		 * Calculate the future assignments based on sented repeat mode
		 * @param {oData} Initial popover selection
		 */
		_repeatAssignments: function (oData) {
			var newData, iEvery = 0,
				dayCounter = 0,
				oDateProp = {
					startDateProp: null,
					endDateProp: null
				},
				oStartDate;

			if (oData.NODE_TYPE === "RES_GROUP") {
				oDateProp.startDateProp = "StartDate";
				oDateProp.endDateProp = "EndDate";
			} else if (oData.NODE_TYPE === "SHIFT") {
				oDateProp.startDateProp = "EffectiveStartDate";
				oDateProp.endDateProp = "EffectiveEndDate";
			}
			oStartDate = moment(oData[oDateProp.startDateProp]);

			do {
				if (oData.Repeat === "DAY") {
					newData = deepClone(oData);
					newData[oDateProp.startDateProp] = oStartDate.add(iEvery, 'days').toDate();

					this._validateAndPrepareNewAssignment(newData, oData, dayCounter, null, oDateProp);
					oStartDate = moment(newData[oDateProp.startDateProp]);

				} else if (oData.Repeat === "WEEK") {
					var week = oStartDate;
					for (var d = 0; d < oData.Days.length; d++) {
						newData = deepClone(oData);
						newData[oDateProp.startDateProp] = moment(week).day(oData.Days[d]).toDate();

						this._validateAndPrepareNewAssignment(newData, oData, dayCounter, d, oDateProp);
					}
					oStartDate = moment(oStartDate.add(iEvery, 'weeks').startOf('weeks').toDate());

				} else if (oData.Repeat === "MONTH") {
					newData = deepClone(oData);
					if (oData.On === 0) {
						newData[oDateProp.startDateProp] = oStartDate.add(iEvery, 'months').toDate();
					} else if (oData.On === 1) {
						var oStrDate = moment(oData[oDateProp.startDateProp]),
							iDay = oStrDate.day();
						newData[oDateProp.startDateProp] = oStartDate.add(iEvery, 'months').day(iDay).toDate();
					}

					this._validateAndPrepareNewAssignment(newData, oData, dayCounter, null, oDateProp);
					oStartDate = moment(newData[oDateProp.startDateProp]);
				}

				dayCounter++;
				iEvery = parseInt(oData.Every, 10);
			}
			while (oStartDate.isBefore(moment(oData.RepeatEndDate)));
		},

		/**
		 * validate the duplicate assignments
		 * Add new shape to gantt
		 * mark it to save
		 * @param {data} - data to be save fot he new assignment
		 * @param {oData} - date with popover selection
		 */
		_validateAndAddNewAssignment: function (data, oData) {
			var aAssigments = this._getResourceassigmentByKey("ResourceGuid", oData.ResourceGuid, oData.ResourceGroupGuid, oData);
			//validation for the existing assigments
			if (this._checkDuplicateAsigment(data, aAssigments)) {
				this._addNewAssignmentShape(data);
				data.isTemporary = false;
				this._markAsPlanningChange(data, true);
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
		_validateAndPrepareNewAssignment: function (newData, oData, iCounter, iDayIndex, oDateProp) {
			newData.Guid = newData.Guid + iCounter;
			if (iDayIndex) {
				newData.Guid = newData.Guid + iCounter + iDayIndex;
			}
			newData[oDateProp.endDateProp] = moment(newData[oDateProp.startDateProp]).endOf('day').toDate();

			if (moment(newData[oDateProp.startDateProp]).isSameOrAfter(oData[oDateProp.startDateProp]) && moment(newData[oDateProp.startDateProp])
				.isSameOrBefore(moment(oData.RepeatEndDate))) {
				this._validateAndAddNewAssignment(newData, oData);
			}
		},

		/**
		 * Set start date and end date for smart filter accroding to mode selected and change gantt view
		 * @param sKey - selected mode
		 * @private
		 */
		_setDateFilter: function (sKey) {
			var newDateRange = formatter.getDefaultDates(sKey, this.getModel("user"));
			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions(sKey));
			this._sGanttViewMode = formatter.getViewMapping(sKey);
			this._setBackgroudShapes(this._sGanttViewMode);
			this._previousView = sKey;
			this._setNewHorizon(newDateRange.StartDate, newDateRange.EndDate);
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
		 * Called when OK is pressed on Filter Dialog
		 * @param {object} oEvent - event of the filter button
		 * 
		 */
		onFilterGantt: function (oEvent) {
			this._oGanttFilterDialog.close();
		},

		/**
		 * Called when option get select in Filter dialog
		 * @param {object} oEvent - event of the filter button
		 * 
		 */
		onGanttEnableType: function (oEvent) {
			var oUserModel = this.getModel("user"),
				bCheckState = oEvent.getParameter('selected'),
				oSource = oEvent.getSource(),
				sPath = oSource.getBindingInfo("selected").binding.getPath();

			oUserModel.setProperty(sPath, bCheckState);
		}
	});
});