/* globals moment */
sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController",
	"sap/ui/core/mvc/OverrideExecution",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/base/util/deepClone",
	"sap/base/util/deepEqual",
	"com/evorait/evosuite/evoresource/model/models",
	"sap/gantt/misc/Format",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, OverrideExecution, formatter, deepClone, deepEqual, models, Format, Fragment, Filter, FilterOperator) {
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
				}
			}
		},

		oOriginData: null,
		oPlanningModel: null,
		_defaultView: "DAY",

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourcePlanningMain
		 */
		onInit: function () {
			this.oZoomStrategy = this.getView().byId("idResourcePlanGanttZoom");
			this.oZoomStrategy.setTimeLineOptions(formatter.getTimeLineOptions());
			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions(this._defaultView));
			this._sGanttViewMode = formatter.getViewMapping(this._defaultView);

			//idPageResourcePlanningWrapper
			this.oOriginData = {
				data: {
					children: []
				},
				tempData: {},
				changedData: [],
				hasChanges: false
			};
			this.oPlanningModel = this.getOwnerComponent().getModel("ganttPlanningModel");
			this.oPlanningModel.setData(deepClone(this.oOriginData));
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
		 * When Go button in filterbar was pressed then get all filters and send backend request
		 * @param {object} oEvent - change event of filterbar
		 */
		onSearch: function () {
			var oDateRangePicker = this.getView().byId("idFilterGanttPlanningDateRange"),
				oStartDate = oDateRangePicker.getDateValue(),
				oEndDate = oDateRangePicker.getSecondDateValue();

			this.getModel("viewModel").setProperty("/gantt/defaultStartDate", oStartDate);
			this.getModel("viewModel").setProperty("/gantt/defaultEndDate", oEndDate);
			this.oZoomStrategy.setTotalHorizon(new sap.gantt.config.TimeHorizon({
				startTime: oStartDate,
				endTime: oEndDate
			}));
			this._loadGanttData();
		},

		/**
		 * when shape was pressed show popover with details of assignment
		 * or create new temporary assignment
		 * @param {object} oEvent - when shape in Gantt was selected
		 */
		onShapePress: function (oEvent) {
			var mParams = oEvent.getParameters(),
				oShape = mParams.shape,
				oRowContext = mParams.rowSettings.getParent().getBindingContext("ganttPlanningModel"),
				sStartTime = oShape.getTime(),
				sEndTime = oShape.getEndTime(),
				oRowData = oRowContext.getObject(),
				oPopoverData = {
					sStartTime,
					sEndTime,
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
			if(!this._validateForOpenPopover()){
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

						//after popover gets closed remove popover data
						this._oPlanningPopover.attachAfterClose(function () {
							var oData = this.oPlanningModel.getProperty("/tempData/popover");
							this._removeAssignmentShape(oData);
							this.oPlanningModel.setProperty("/tempData/popover", {});
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
				oObject = oContext.getObject(),
				oDraggedObject = this.getView().getModel("viewModel").getProperty("/draggedData"),
				oBrowserEvent = oEvent.getParameter("browserEvent"),
				oAxisTime = this.byId("idResourcePlanGanttChartContainer").getAggregation("ganttCharts")[0].getAxisTime(),
				oDroppedTarget = sap.ui.getCore().byId(oBrowserEvent.toElement.id),
				sStartTime = oDroppedTarget.getTime(),
				sEndTime = oDroppedTarget.getEndTime(),
				oPopoverData = {
					sStartTime,
					sEndTime,
					oResourceObject: oObject
				};

			oObject["ResourceGroupGuid"] = oDraggedObject.data["ResourceGroupGuid"]; //assigned dragged Resource group id
			this.openShapeChangePopover(oDroppedTarget, oPopoverData);

		},
		/**
		 * @param {object} oEvent -
		 */
		onPressSave: function () {},

		/**
		 * @param {object} oEvent -
		 */
		onPressCancel: function () {},
		/**
		 * Change of shape assignment
		 * Todo 
		 * check if group or date range was changed
		 * when it was changed send validation request
		 * 
		 * @param {object} oEvent - event of OK button press
		 */
		onPressChangeAssignment: function (oEvent) {
			var oData = this.oPlanningModel.getProperty("/tempData/popover");
			oData.isTemporary = false;
			this._markAsPlanningChange(oData, true);
			this._oPlanningPopover.close();
		},

		/**
		 * delete a shape inside Gantt
		 * user needs confirm deletion and when its not freshly created assignment 
		 * a validation request is send to backend
		 * 
		 * @param {object} oEvent - event of delete button press
		 */
		onPressDeleteAssignment: function (oEvent) {
			//todo show confirm dialog and send validation request
			this._removeAssignmentShape(this.oPlanningModel.getProperty("/tempData/popover"), true);
			this._oPlanningPopover.close();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Load the tree data and process the data to create assignments as child nodes
		 * 
		 */
		_loadGanttData: function () {
			this._getResourceData(0)
				.then(this._getResourceData.bind(this))
				.then(function () {
					this.oOriginData = deepClone(this.oPlanningModel.getProperty("/"));
					this._setBackgroudShapes(this._sGanttViewMode);
					console.log(this.oOriginData);
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
						//"$expand": "AssignmentSet"
					};

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
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			var callbackFn = function (oItem) {
				oItem.children = [];
				oResData.forEach(function (oResItem) {
					if (oItem.NodeId === oResItem.ParentNodeId) {
						//add assignments as children in tree for expanding
						/*if (oResItem.AssignmentSet && oResItem.AssignmentSet.results.length > 0) {
							oResItem.children = oResItem.AssignmentSet.results;
							oResItem.children.forEach(function (oAssignItem, idx) {
								oResItem.AssignmentSet.results[idx].NodeType = "ASSIGNMENT";
								var clonedObj = deepClone(oResItem.AssignmentSet.results[idx]);
								oResItem.children[idx].AssignmentSet = {
									results: [clonedObj]
								};
							});
						}*/
						oItem.children.push(oResItem);
					}
				});
			};
			aChildren = this._recurseChildren2Level(aChildren, iLevel, callbackFn);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},

		fnTimeConverter: function (sTimestamp) {
			return Format.abapTimestampToDate(sTimestamp);
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
				aChanges = this.oPlanningModel.getProperty("/changedData");

			//object change needs added to "/changedData" array by path
			if (isNewChange) {
				if (oFoundData && aChanges.indexOf(oFoundData.sPath) < 0) {
					aChanges.push(oFoundData.sPath);
				}
			} else if (isNewChange === false) {
				//object change needs removed from "/changedData" array by path
				if (oFoundData && aChanges.indexOf(oFoundData.sPath) >= 0) {
					aChanges.splice(aChanges.indexOf(oFoundData.sPath), 1);
				}
			}
			this.oPlanningModel.setProperty("/hasChanges", aChanges.length > 0);
		},

		/**
		 * create new temporary assignment when background shape was pressed
		 * when assignment shape was pressed get assignment data from row
		 * 
		 * @param {object} mParams - event parameters from shape press
		 */
		_setPopoverData: function (oTargetControl, oPopoverData) {
			var {
				sStartTime,
				sEndTime,
				oResourceObject
			} = oPopoverData,
			oContext = oTargetControl.getBindingContext("ganttPlanningModel");

			if (oTargetControl.sParentAggregationName === "shapes1") {
				//its background shape
				this.createNewTempAssignment(sStartTime, sEndTime, oResourceObject).then(function (oData) {
					this.oPlanningModel.setProperty("/tempData/popover", oData);
					this._addNewAssignmentShape(oData);
				}.bind(this));
			} else if (oTargetControl.sParentAggregationName === "shapes2" && oContext) {
				//its a assignment
				this.oPlanningModel.setProperty("/tempData/popover", oContext.getObject());
			}

		},

		/**
		 * add a freshly created assignment to json model into Gantt Chart
		 * @param {object} oAssignData - object of assignment based on entityType of assignment 
		 */
		_addNewAssignmentShape: function (oAssignData) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			var callbackFn = function (oItem, oData, idx) {
				if (!oItem.AssignmentSet) {
					oItem.AssignmentSet = {
						results: []
					};
				}
				if (oItem.ResourceGuid && oItem.ResourceGuid === oData.ResourceGuid && !oItem.ResourceGroupGuid) {
					//add to resource itself
					oItem.AssignmentSet.results.push(oData);
				} else if (oItem.ResourceGroupGuid && oItem.ResourceGroupGuid === oData.ResourceGroupGuid && oItem.ResourceGuid === oData.ResourceGuid) {
					//add to resource group
					oItem.AssignmentSet.results.push(oData);
				}
			};
			aChildren = this._recurseAllChildren(aChildren, callbackFn, oAssignData);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},

		/**
		 * remove freshly created shape from gantt chart
		 * @param {object} oAssignData - object of assignment based on entityType of assignment 
		 * //todo
		 */
		_removeAssignmentShape: function (oAssignData, removeNew) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");
			if (!oAssignData.isTemporary && !removeNew) {
				return;
			}

			var callbackFn = function (oItem, oData, idx) {
				var aAssignments = oItem.AssignmentSet ? oItem.AssignmentSet.results : [];
				aAssignments.forEach(function (oAssignItem, index) {
					if (oAssignItem.Guid === oData.Guid) {
						if (oData.isNew) {
							//remove from resource and group when its a shape who was not yet saved by user
							this._markAsPlanningChange(oAssignItem, false);
							aAssignments.splice(index, 1);
						} else {
							//validate if assignment is allowed for delete
							var isValid = this._validateForDelete(oAssignItem);
							if (isValid) {
								//set delete flag to assignment
								this._markAsPlanningChange(oAssignItem, true);
								oAssignItem.isDelete = true;
							}
						}
					}
				}.bind(this));
			};
			aChildren = this._recurseAllChildren(aChildren, callbackFn.bind(this), oAssignData);
			this.oPlanningModel.setProperty("/data/children", aChildren);
		},

		/**
		 * todo validate against backend
		 * todo get path inside json model
		 * todo when not valida show dialog with h
		 * list if demands who are assigned to this time frame
		 */
		_validateForDelete: function (oData) {
			return true;
		},
		
		_validateForOpenPopover:function(){
			var bPopover = this.getView().getModel("user").getProperty("/ENABLE_PLANNING_POPOVER");
			if(!bPopover){
				this.showMessageToast(this.getResourceBundle().getText("xtxt.noAuthorization"));
			}
			return bPopover;
		},

		/**
		 * creates and returns a hidden div at the same position
		 * as the Spot on the Canvas rightclicked by user
		 * the div is added as a child to the GeoMapContainer with absolute positioning,
		 * then style top and left values are provided which we get -
		 * from the click position returned by the spot contextmenu event
		 * @param {object} oSpotPosition - x and y values of clicked position on the geo map
		 * @ returns the div element
		 * todo
		 */
		hiddenDivPoistion: function (oPosition) {
			var div = document.createElement("div");
			div.style.position = "absolute";
			div.style.top = oPosition[1] + "px";
			div.style.left = oPosition[0] + "px";
			// add as a child to the GeoMap
			// this get by id
			var oContainer = this.getView().byId("").$[0];
			oContainer.appendChild(div);
			return div;
		}
	});
});