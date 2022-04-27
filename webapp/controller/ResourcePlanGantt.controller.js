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
	"sap/m/MessageBox"
], function (BaseController, OverrideExecution, formatter, deepClone, deepEqual, models, Fragment, Filter, FilterOperator,
	MessageBox) {
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
				}
			}
		},

		oOriginData: null,
		oPlanningModel: null,
		_defaultView: "DAY",
		_treeTable: null,

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
				this._setNewHorizon(oResult.DEFAULT_GANTT_START_DATE, oResult.DEFAULT_GANTT_END_DATE);
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
				sKey = mParam.selectedItem.getKey();
			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions(sKey));
			this._sGanttViewMode = formatter.getViewMapping(sKey);
			this._setBackgroudShapes(this._sGanttViewMode);
		},

		/**
		 * When filterbar was initialized then get all filters and send backend request
		 * @param {object} oEvent - change event of filterbar
		 */
		onInitializedSmartVariant: function (oEvent) {
			this._loadGanttData();
		},

		/**
		 * when user srolls horizontal inside cgantt chart 
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
		 * when shape was pressed show popover with details of assignment
		 * or create new temporary assignment
		 * @param {object} oEvent - when shape in Gantt was selected
		 */
		onShapePress: function (oEvent) {
			var mParams = oEvent.getParameters(),
				oShape = mParams.shape;
			if (!mParams || !oShape) {
				return;
			}

			var oRowContext = mParams.rowSettings.getParent().getBindingContext("ganttPlanningModel"),
				sStartTime = oShape.getTime(),
				sEndTime = oShape.getEndTime(),
				oRowData = oRowContext.getObject(),
				oPopoverData = {
					Guid: new Date().getTime(),
					sStartTime: sStartTime,
					sEndTime: sEndTime,
					oResourceObject: oRowData
				};

			this.openShapeChangePopover(mParams.shape, oPopoverData);
		},
		/**
		 * Called to open ShapeChangePopover
		 * @param {object} oTargetControl - Control where popover should open
		 * @param {object} oPopoverData - Data to be displayed in Popover
		 */
		openShapeChangePopover: function (oTargetControl, oPopoverData) {
			if (!this._validateForOpenPopover()) {
				return;
			}
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
							this._addResourceGroupColor();
						}.bind(this));

						//after popover gets closed remove popover data
						this._oPlanningPopover.attachAfterClose(function () {
							var oData = this.oPlanningModel.getProperty("/tempData/popover");
							this._removeAssignmentShape(oData);
							this.oPlanningModel.setProperty("/tempData/popover", {});
							this.oPlanningModel.setProperty("/tempData/oldPopoverData", {});
							this.reValidateForm(this.getView().getControlsByFieldGroupId("changeShapeInput"));
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
				oPopoverData;

			oObject = this.copyObjectData(oObject, oDraggedObject.data, ["__metadata"]);
			oPopoverData = {
				Guid: new Date().getTime(),
				sStartTime: sStartTime,
				sEndTime: sEndTime,
				oResourceObject: oObject
			};
			this.openShapeChangePopover(oDroppedTarget, oPopoverData);
		},
		/**
		 * @param {object} oEvent -
		 */
		onPressSave: function () {
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
		 * @param {object} oEvent -
		 */
		onPressCancel: function () {
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
		 * @param {oEvent}
		 */
		onChangeResourceGroup: function (oEvent) {
			var oSource = oEvent.getSource(),
				oSelectedItem = oSource.getSelectedItem(),
				oSelContext = oSelectedItem.getBindingContext(),
				oData = this.oPlanningModel.getProperty("/tempData/popover");

			oSource.setValueState(sap.ui.core.ValueState.None);
			//validate duplicate assignments
			if (this._validateDuplicateAsigment()) {
				return;
			}

			//oData.RESOURCE_GROUP_COLOR = oSelContext.getProperty("ResourceGroupColor");
			this.oPlanningModel.setProperty("/tempData/popover/RESOURCE_GROUP_COLOR", oSelContext.getProperty("ResourceGroupColor"));

			//var newPopoverdata = oData;
			oData.DESCRIPTION = oSelContext.getProperty("ResourceGroupDesc");
			if (oData.isNew) {
				//add different resource group if it is not exist
				this._addSingleChildToParent(oData);
				this._removeAssignmentShape(oData, true);
			} else {
				this._removeAssignmentShape(oData, true, true);
				this._oPlanningPopover.close();
			}
		},

		/**
		 * chnage selected date to UTC date to make display valid date on the screen
		 */
		onChangeDate: function (oEvent) {
			var oDateRange = oEvent.getSource();

			this.oPlanningModel.setProperty("/tempData/popover/StartDate", formatter.convertToUTCDate(oDateRange.getDateValue()));
			this.oPlanningModel.setProperty("/tempData/popover/EndDate", formatter.convertToUTCDate(oDateRange.getSecondDateValue()));

			//validate for the overlapping
			this._validateDuplicateAsigment();
		},

		/**
		 * on click on today adjust the view of Gantt horizon.
		 * @param oEvent
		 */
		onPressToday: function (oEvent) {
			this.changeGanttHorizonViewAt(this.getModel("viewModel"), this.oZoomStrategy.getZoomLevel(), this.oZoomStrategy);
		},

		/**
		 * On click on expand the tree nodes gets expand to level 1
		 * On click on collapse all the tree nodes will be collapsed to root.
		 * @param oEvent
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
						"$expand": "GanttHierarchyToResourceAssign"
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
				aAssignments = []
			var callbackFn = function (oItem) {
				oItem.children = [];
				aAssignments = [];
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
						oItem.children.push(oResItem);
					}
				});
			};
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
				if (oFoundData && oFoundData.oData && aChanges.indexOf(oFoundData.oData.Guid) < 0) {
					aChanges.push(oFoundData.oData.Guid);
				}
			} else if (isNewChange === false) {
				//object change needs removed from "/changedData" array by path
				if (oFoundData && oFoundData.oData && aChanges.indexOf(oFoundData.oData.Guid) >= 0) {
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
				aDeleteData.push(oFoundData.oData.Guid);
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
				oContext = oTargetControl.getBindingContext("ganttPlanningModel"),
				oChildData;

			if (oTargetControl.sParentAggregationName === "shapes1") {
				//its background shape
				this.createNewTempAssignment(sStartTime, sEndTime, oResourceObject).then(function (oData) {
					this.oPlanningModel.setProperty("/tempData/popover", oData);
					this.oPlanningModel.setProperty("/tempData/oldPopoverData", Object.assign({}, oData));
					if (oData && oData.ResourceGroupGuid) {
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
				var oAssignData = oContext.getObject();
				this._setShapePopoverPosition(oAssignData);
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
				oGanntObject["NodeType"] = "RES_GROUP";
				oGanntObject["ParentNodeId"] = oData["PARENT_NODE_ID"].split("//")[0];
				oGanntObject["NodeId"] = oData["ParentNodeId"] + "//" + new Date().getTime();
				var callbackFn = function (oItem, oData) {
					if (!this._checkIfGroupExist(oItem, oData["ResourceGroupGuid"]) && oItem.NodeId === oData.ParentNodeId && oItem.children) {
						oItem.children.push(oData);
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
					this._markAsPlanningChange(oData, true);
				}
			}.bind(this));
		},
		/**
		 * Checks if Resource Group is already exist under Resource
		 * @param {object} aResourceData - Resource Group data to be added under Resource if not exist
		 * @param {object} sResourceGroupGuid - Resource guid to be checked inside aResourceData
		 */
		_checkIfGroupExist: function (aResourceData, sResourceGroupGuid) {
			if (aResourceData && aResourceData.children)
				return aResourceData.children.some(oChild => oChild.ResourceGroupGuid === sResourceGroupGuid);
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
			};
			aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignData);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},

		/**
		 * remove freshly created shape from gantt chart
		 * @param {object} oAssignData - object of assignment based on entityType of assignment 
		 * 
		 */
		_removeAssignmentShape: function (oAssignData, removeNew, bMarkChange) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			if (!oAssignData.isTemporary && !removeNew) {
				return;
			}

			var callbackFn = function (oItem, oData, idx) {
				var aAssignments = oItem.GanttHierarchyToResourceAssign ? oItem.GanttHierarchyToResourceAssign.results : [];
				aAssignments.forEach(function (oAssignItem, index) {
					if (oAssignItem.Guid === oData.Guid) {
						if (oData.isNew) {
							//remove from resource and group when its a shape who was not yet saved by user
							this._markAsPlanningChange(oAssignItem, false);
							aAssignments.splice(index, 1);
						} else {
							this._validateForDelete(oAssignItem, aAssignments, index, bMarkChange);
						}
					}
				}.bind(this));
			};
			aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignData);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},
		/**
		 * Validation of assignment on change
		 */
		_validateForChange: function (oAssignItem) {
			var oParams = {
					ObjectId: oAssignItem.NODE_ID,
					EndTimestamp: oAssignItem.EndDate,
					StartTimestamp: oAssignItem.StartDate
				},
				sFunctionName = "ValidateResourceAssignment",
				oDemandModel = this.getModel("demandModel"),
				oFoundData = this._getChildrenDataByKey("Guid", oAssignItem.Guid, null),
				oPopoverData = this.oPlanningModel.getProperty("/tempData/popover"),
				oOldAssignmentData = this.oPlanningModel.getProperty("/tempData/oldPopoverData");

			var callbackfunction = function (oData) {
				if (oData.results.length > 0) {
					oDemandModel.setProperty("/data", oData.results);
					for (var i = 0; i < oFoundData.length; i++) {
						this.oPlanningModel.setProperty(oFoundData[i], oOldAssignmentData);
					}
					this.openDemandDialog();
				} else {
					oAssignItem.isTemporary = false;
					this._markAsPlanningChange(oPopoverData, true);
					this._markAsPlanningDelete(oPopoverData);
				}
				this.oPlanningModel.refresh();
			}.bind(this);
			this._oPlanningPopover.close();
			this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);
		},

		/**
		 * list if demands who are assigned to this time frame
		 */
		_validateForDelete: function (oAssignItem, aAssignments, index, bMarkChange) {
			var oParams = {
					ObjectId: oAssignItem.NODE_ID,
					EndTimestamp: oAssignItem.EndDate,
					StartTimestamp: oAssignItem.StartDate
				},
				sFunctionName = "ValidateResourceAssignment",
				oDemandModel = this.getModel("demandModel");

			var callbackfunction = function (oData) {
				if (oData.results.length > 0) {
					oDemandModel.setProperty("/data", oData.results);
					this.openDemandDialog();
				} else {
					this._markAsPlanningDelete(oAssignItem);
					if (bMarkChange) {
						this._addSingleChildToParent(oAssignItem, true);
					}
					aAssignments.splice(index, 1);
				}
				this.oPlanningModel.refresh();
			}.bind(this);

			this.callFunctionImport(oParams, sFunctionName, "POST", callbackfunction);

		},
		/**
		 * validated if popover can be visible or not
		 */
		_validateForOpenPopover: function () {
			var bPopover = this.getView().getModel("user").getProperty("/ENABLE_PLANNING_POPOVER");
			if (!bPopover) {
				this.showMessageToast(this.getResourceBundle().getText("xtxt.noAuthorization"));
			}
			return bPopover;
		},

		/**
		 * To update resource group color based on selected resource group
		 * time out is to wait to load ResourceGroupSet data
		 */
		_addResourceGroupColor: function () {
			var oData = this.oPlanningModel.getProperty("/tempData/popover");
			if (oData.ResourceGroupGuid) {
				setTimeout(function () {
					var oGroupSelection = sap.ui.getCore().byId("idResourceGroupGroup");
					if (oGroupSelection && oGroupSelection.getSelectedItem()) {
						var sColor = oGroupSelection.getSelectedItem().getBindingContext().getProperty("ResourceGroupColor")
						oData.RESOURCE_GROUP_COLOR = sColor;
						this.oPlanningModel.refresh();
					}
				}.bind(this), 1000);
			}
		},

		/**
		 * Trigger when Demand link press
		 */
		onShowDemandPress: function (oEvent) {
			var oSource = oEvent.getSource();
			this.openApp2AppPopover(oSource, "demandModel", "Orderid");
		},

		/**
		 * Validate assigment while create/update 
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

			if (oData.isNew) {
				this._markAndClosePlanningPopover(oData);
			} else {
				//validate whether changes are happend or not
				if (this._setChangeIndicator(oData)) {
					this._validateForChange(oData);
				}
				this._oPlanningPopover.close();
			}
		},

		/**
		 * To call change planning popover data to done
		 * close planning popover
		 * @param {oData} popover data
		 */
		_markAndClosePlanningPopover: function (oData) {
			oData.isTemporary = false;
			this._markAsPlanningChange(oData, true);
			this._oPlanningPopover.close();
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
			this.showMessageToast("Successfully updated");
			this._loadGanttData();
		},

		/**
		 * failed to save the gantt changed entry
		 */
		_saveFailed: function (oError) {
			this.getModel().resetChanges();
		}
	});
});