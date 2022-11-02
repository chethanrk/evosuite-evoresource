/* global moment:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/ui/core/Fragment",
	"com/evorait/evosuite/evoresource/model/Constants",
	"sap/base/util/deepClone",
	"sap/base/util/merge",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/config/TimeHorizon",
	"sap/m/MessageBox"
], function (Controller, Formatter, Fragment, Constants, deepClone, merge, StepwiseZoomStrategy, TimeHorizon, MessageBox) {
	"use strict";

	return Controller.extend("com.evorait.evosuite.evoresource.controller.BaseController", {

		metadata: {
			methods: {
				getRouter: {
					public: true,
					final: true
				},
				getModel: {
					public: true,
					final: true
				},
				setModel: {
					public: true,
					final: true
				},
				getResourceBundle: {
					public: true,
					final: true
				},
				onAboutIconPress: {
					public: true,
					final: true
				},
				onCloseDialog: {
					public: true,
					final: true
				},
				onMessageManagerPress: {
					public: true,
					final: true
				},
				showConfirmDialog: {
					public: true,
					final: true
				},
				showMessageToast: {
					public: true,
					final: true
				},
				showInfoMessageBox: {
					public: true,
					final: true
				},
				createNewTempAssignment: {
					public: true,
					final: true
				},
				getObjectFromEntity: {
					public: true,
					final: true
				},
				changeGanttHorizonViewAt: {
					public: true,
					final: true
				},
				copyObjectData: {
					public: true,
					final: true
				},
				validateForm: {
					public: true,
					final: true
				},
				reValidateForm: {
					public: true,
					final: true
				},
				callFunctionImport: {
					public: true,
					final: true
				},
				openEvoAPP: {
					public: true,
					final: true
				},
				openApp2AppPopover: {
					public: true,
					final: true
				},
				mergeObject: {
					public: true,
					final: true
				}

			}
		},

		formatter: Formatter,

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			if (this.getOwnerComponent()) {
				return this.getOwnerComponent().getModel(sName);
			}
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			if (this.getOwnerComponent()) {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			}
			return this.getView().getModel("i18n").getResourceBundle();
		},

		/**
		 * loads and opens the About info dialog
		 * @param {object} oEvent - Button press event
		 */
		onAboutIconPress: function (oEvent) {
			// create popover
			if (!this._infoDialog) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.InformationPopover",
					controller: this,
					type: "XML"
				}).then(function (oFragment) {
					this._infoDialog = oFragment;
					this.getView().addDependent(oFragment);
					this._infoDialog.open();
				}.bind(this));
			} else {
				this._infoDialog.open();
			}
		},

		/**
		 * closes the About info dialog
		 */
		onCloseDialog: function () {
			this._infoDialog.close();
		},

		/**
		 * Opens Message Manager popover on click
		 * @param {object} oEvent - Message manager button press event
		 */
		onMessageManagerPress: function (oEvent) {
			this._openMessageManager(this.getView(), oEvent);
		},

		/**
		 * show confirm dialog where user needs confirm some action
		 * @param sTitle
		 * @param sMsg
		 * @param successCallback
		 * @param cancelCallback
		 */
		showConfirmDialog: function (sTitle, sMsg, successCallback, cancelCallback, sState) {
			var dialog = new sap.m.Dialog({
				title: sTitle,
				type: "Message",
				state: sState || "None",
				content: new sap.m.Text({
					text: sMsg
				}),
				beginButton: new sap.m.Button({
					text: this.getResourceBundle().getText("btn.confirm"),
					press: function () {
						dialog.close();
						if (successCallback) {
							successCallback();
						}
					}.bind(this)
				}),
				endButton: new sap.m.Button({
					text: this.getResourceBundle().getText("btn.no"),
					press: function () {
						if (cancelCallback) {
							cancelCallback();
						}
						dialog.close();
					}.bind(this)
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});
			dialog.addStyleClass(this.getModel("viewModel").getProperty("/densityClass"));
			dialog.open();
		},

		/**
		 * show message toast with a text inside with default parameters
		 * @param {string} sMsg - test for message toast
		 */
		showMessageToast: function (sMsg) {
			sap.m.MessageToast.show(sMsg, {
				duration: 3000, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true // default
			});
		},

		/**
		 * show message box with a text inside with default parameters
		 * @param {string} sMsg - test for message toast
		 */
		showInfoMessageBox: function (sMsg) {
			MessageBox.information(sMsg, {
				styleClass: this.getOwnerComponent().getContentDensityClass()
			});
		},

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
						Repeat: "NEVER",
						Every: "",
						Days: [],
						On: 0,
						RepeatEndDate: new Date(),
						isEditable: true,
						isDeletable: true,
						isRestChanges: true,
						maxDate: this.getModel("viewModel").getProperty("/gantt/defaultEndDate")
					},
					oDraggedData = this.getView().getModel("viewModel").getProperty("/draggedData"),
					nodeType;
				
				if (bDragged) { 
					nodeType = oDraggedData.data.NodeType;
					if(nodeType === undefined){
						if(this.bAddNewResource)
							nodeType = "RESOURCE";
					}
					//added the below condition as Guid is passing as int in POST and causing an issue
					if(nodeType === "RESOURCE")
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
								"Edm.String" : "",
								"Edm.Byte" : 0,
								"Edm.DateTime" : null,
							};
						obj[property.name] = defaultValue.hasOwnProperty(property.type) ? defaultValue[property.type] : null;
						if (oRowData.hasOwnProperty(property.name)) {
							obj[property.name] = oRowData[property.name];
						}
					});
					obj.RepeatEndDate = oEndTime;
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
		 * Validate simiple form
		 * @public
		 */
		validateForm: function (aCustomFields) {
			if (!aCustomFields) {
				return {
					state: "error"
				};
			}

			var isValid = true,
				invalidFields = [];

			//validate mandatory fields
			for (var i = 0; i < aCustomFields.length; i++) {
				if (aCustomFields[i].getValue) {
					var sValue = aCustomFields[i].getValue();
					if (aCustomFields[i] instanceof sap.m.MultiComboBox) {
						sValue = aCustomFields[i].getSelectedKeys().length;
					}
					try {
						if (aCustomFields[i].getRequired() && aCustomFields[i].getEditable() && (!sValue || sValue.trim() === "")) {
							aCustomFields[i].setValueState(sap.ui.core.ValueState.Error);
							isValid = false;
							invalidFields.push(aCustomFields[i]);
						} else {
							aCustomFields[i].setValueState(sap.ui.core.ValueState.None);
						}
					} catch (e) {
						//do nothing
					}
				}
			}

			if (isValid) {
				return {
					state: "success"
				};
			} else {
				return {
					state: "error"
				};
			}
		},

		/**
		 * Re-Validate simiple form
		 * @public
		 */
		reValidateForm: function (aCustomFields) {
			if (!aCustomFields) {
				return;
			}
			//validate mandatory  fields
			for (var i = 0; i < aCustomFields.length; i++) {
				if (aCustomFields[i].getValue) {
					var sValue = aCustomFields[i].getValue();
					try {
						if (aCustomFields[i].getRequired() && aCustomFields[i].getEditable()) {
							aCustomFields[i].setValueState(sap.ui.core.ValueState.None);
						}
					} catch (e) {
						//do nothing
					}
				}
			}
		},

		/***
		 * Save changes generic method
		 */
		saveChanges: function (oSuccessCallback, oErrorCallback) {
			var mParameters = {
				groupId: "batchSave",
				success: oSuccessCallback,
				error: oErrorCallback
			};
			this._preparePayload(mParameters).then(function (oData) {
				if (oData.length > 0) {
					this.getModel().setRefreshAfterChange(false); //avoid GET request for every after POST request
					this.getModel().submitChanges(mParameters);
				} else {
					if (oSuccessCallback) {
						oSuccessCallback();
					}
				}
			}.bind(this));
		},
		/**
		 * Merge source object to destination object to source.
		 * Deletes all emply,null and undefined value from destination object
		 *  @param {object} destination - Destination object
		 * @param {object} source - Source object
		 */
		mergeObject: function (destination, source) {
			for (var prop in source) {
				if (source[prop] === null || source[prop] === undefined || source[prop] === "") {
					delete source[prop];
				}
			}

			return merge(destination, source);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */
		/**
		 * Preapre payload for the create new assigmentes 
		 * Create changeset
		 * used deferredgroups
		 * @Param {mParameters} - details to odata model
		 */
		_preparePayload: function (mParameters) {
			return new Promise(function (resolve) {
				var aChangedData = this.oPlanningModel.getProperty("/changedData"),
					oEntitySetList = this.getModel("templateProperties").getProperty("/EntitySet");
				this.getModel().setDeferredGroups(["batchSave"]);
				aChangedData.forEach(function (sPath) {
					var oFoundData = this._getChildDataByKey("Guid", sPath, null),
						oRowData = oFoundData.oData,
						singleentry = {
							groupId: "batchSave"
						},
						obj = {},
						entitySet = oEntitySetList[oRowData.NODE_TYPE];
					//collect all assignment properties who allowed for create
					this.getModel().getMetaModel().loaded().then(function () {
						var oMetaModel = this.getModel().getMetaModel(),
							oEntitySet = oMetaModel.getODataEntitySet(entitySet),
							oEntityType = oEntitySet ? oMetaModel.getODataEntityType(oEntitySet.entityType) : null,
							aProperty = oEntityType ? oEntityType.property : [];

						aProperty.forEach(function (property) {
							obj[property.name] = "";
							if (oRowData.hasOwnProperty(property.name)) {
								obj[property.name] = oRowData[property.name];

								// added formatter to convert the date to UTC before backend call
								if ((property.name === "StartDate" || property.name === "EffectiveStartDate") && oRowData[property.name]) {
									obj[property.name] = Formatter.convertToUTCDate(oRowData[property.name]);
								}
								/**
								 * Bellow piece of code is written because of enddate with UTC for the multiple days are not wotking properly
								 * added formatter to convert the date to UTC before backend call
								 * Removed 1 more second from the enddate before send it to backend
								 * Remove bellow code once we get valid loigc to send UTC date for multiple days selection
								 */
								if ((property.name === "EndDate" || property.name === "EffectiveEndDate") && oRowData[property.name]) {
									obj[property.name] = new Date(oRowData[property.name].getTime() - 1000);
									obj[property.name] = Formatter.convertToUTCDate(obj[property.name]);
								}
							}
						});
						singleentry.properties = obj;
						this.getModel().createEntry("/" + entitySet, singleentry);
					}.bind(this));
				}.bind(this));
				resolve(aChangedData);
			}.bind(this));
		},

		/**
		 * Preapre payload for the delete assigmentes 
		 * Create changeset
		 * used deferredgroups
		 */
		_prepareDeleteData: function () {
			return new Promise(function (resolve) {
				var aDeleteData = this.oPlanningModel.getProperty("/deletedData");
				var param = {
						groupId: "batchDelete"
					},
					oEntitySetList = this.getModel("templateProperties").getProperty("/EntitySet");
				aDeleteData.forEach(function (oAssignment) {
					var entitySet = oEntitySetList[oAssignment.NODE_TYPE];
					if (oAssignment.NODE_TYPE === "RES_GROUP") {
						this.getModel().remove("/" + entitySet + "('" + oAssignment.Guid + "')", param);
					} else if (oAssignment.NODE_TYPE === "SHIFT") {
						this.getModel().remove("/" + entitySet + "(Guid='" + oAssignment.Guid + "',TemplateId='" + oAssignment.TemplateId +
							"')",
							param);
					}

				}.bind(this));
				resolve(aDeleteData);
			}.bind(this));
		},

		/**
		 * loop trough all nested array of children
		 * When max level for search was reached execute callbackFn
		 * @param aChildren
		 * @param iMaxLevel
		 * @param callbackFn
		 * @returns aChildren
		 */
		_recurseChildren2Level: function (aChildren, iMaxLevel, callbackFn) {
			function recurse(aItems, level) {
				for (var i = 0; i < aItems.length; i++) {
					var aChilds = aItems[i].children;
					if (level === (iMaxLevel - 1)) {
						if (callbackFn) {
							callbackFn(aItems[i]);
						}
					} else if (aChilds && aChilds.length > 0) {
						recurse(aChilds, level + 1);
					}
				}
			}
			recurse(aChildren, 0);
			return aChildren;
		},

		/**
		 * loop trough all nested array of children
		 * and execute callback function for each child
		 * @param {Array} aChildren
		 * @param {Object} callbackFn
		 * @param {(string|Array|Object)} data
		 * @returns aChildren
		 */
		_recurseAllChildren: function (aChildren, callbackFn, data) {
			aChildren.forEach(function (oItem, idx) {
				if (callbackFn) {
					callbackFn(oItem, data, idx);
				}
				if (oItem.children) {
					this._recurseAllChildren(oItem.children, callbackFn, data);
				}
			}.bind(this));
			return aChildren;
		},

		/**
		 * loops all children inside ganttPlanningModelfor a special property key and its value
		 * return objct data and path of found object or null when nothign was found
		 * 
		 * @param {string} sProperty - property key of search in object
		 * @param {string} sValue - property value of search in object
		 * @param {string} sPath - given path withing ganttPlanningModel default is '/data/children'
		 * @returns Object - {sPath, oData}
		 */
		_getChildDataByKey: function (sProperty, sValue, sPath) {
			sPath = sPath || "/data/children";
			var aChildren = this.getModel("ganttPlanningModel").getProperty(sPath),
				sNewObj = null;

			for (var i = 0; i < aChildren.length; i++) {
				if (aChildren[i][sProperty] === sValue) {
					sPath += "/" + i;
					return {
						sPath: sPath,
						oData: aChildren[i]
					};
				} else if (aChildren[i].GanttHierarchyToResourceAssign && aChildren[i].GanttHierarchyToResourceAssign.results && aChildren[i].GanttHierarchyToResourceAssign
					.results.length > 0) {
					//search in assignments
					sNewObj = this._getChildDataByKey(sProperty, sValue, sPath + "/" + i + "/GanttHierarchyToResourceAssign/results");
					if (sNewObj) {
						return sNewObj;
					} else if (aChildren[i].children && aChildren[i].children.length > 0) {
						//search in other children
						sNewObj = this._getChildDataByKey(sProperty, sValue, sPath + "/" + i + "/children");
						if (sNewObj) {
							return sNewObj;
						}
					}
				}
			}
			for (var i = 0; i < aChildren.length; i++) {
				if (aChildren[i][sProperty] === sValue) {
					sPath += "/" + i;
					return {
						sPath: sPath,
						oData: aChildren[i]
					};
				} else if (aChildren[i].GanttHierarchyToShift && aChildren[i].GanttHierarchyToShift.results && aChildren[i].GanttHierarchyToShift.results
					.length > 0) {
					//search in assignments
					sNewObj = this._getChildDataByKey(sProperty, sValue, sPath + "/" + i + "/GanttHierarchyToShift/results");
					if (sNewObj) {
						return sNewObj;
					} else if (aChildren[i].children && aChildren[i].children.length > 0) {
						//search in other children
						sNewObj = this._getChildDataByKey(sProperty, sValue, sPath + "/" + i + "/children");
						if (sNewObj) {
							return sNewObj;
						}
					}
				}
			}
			return sNewObj;
		},
		/**
		 * Return all the path matching property value
		 * @param {string} sProperty - Property of the object
		 * @param {string} sValue -  Value of sProperty need to compared
		 * @param {string} sPath -  path of the array where need to be searched.
		 */

		_getChildrenDataByKey: function (sProperty, sValue, sPath) {
			sPath = sPath || "/data/children";
			var aChildren = this.getModel("ganttPlanningModel").getProperty(sPath),
				sNewObj = null,
				aAllMatchedData = [],
				aAssignments = [],
				aInnerChildren = [],
				aInnerAssignments = [],
				newSpath = sPath;
			for (var i = 0; i < aChildren.length; i++) {
				if (aChildren[i].GanttHierarchyToResourceAssign && aChildren[i].GanttHierarchyToResourceAssign.results && aChildren[i].GanttHierarchyToResourceAssign
					.results.length > 0) {
					aAssignments = aChildren[i].GanttHierarchyToResourceAssign.results;
					for (var j = 0; j < aAssignments.length; j++) {

						if (aAssignments[j][sProperty] === sValue) {
							newSpath = sPath + "/" + i + "/GanttHierarchyToResourceAssign/results/" + j;
							aAllMatchedData.push(newSpath);
						}
					}

					aInnerChildren = aChildren[i].children;
					for (var k = 0; k < aInnerChildren.length; k++) {
						if (aInnerChildren[k].GanttHierarchyToResourceAssign && aInnerChildren[k].GanttHierarchyToResourceAssign.results &&
							aInnerChildren[k].GanttHierarchyToResourceAssign.results.length > 0) {
							aInnerAssignments = aInnerChildren[k].GanttHierarchyToResourceAssign.results;
							for (var l = 0; l < aInnerAssignments.length; l++) {

								if (aInnerAssignments[l][sProperty] === sValue) {
									newSpath = sPath + "/" + i + "/children/" + k + "/GanttHierarchyToResourceAssign/results/" + l;
									aAllMatchedData.push(newSpath);
								}
							}
						}
					}
				}

				if (aChildren[i].GanttHierarchyToShift && aChildren[i].GanttHierarchyToShift.results && aChildren[i].GanttHierarchyToShift.results
					.length > 0) {
					aAssignments = aChildren[i].GanttHierarchyToShift.results;
					for (var j = 0; j < aAssignments.length; j++) {

						if (aAssignments[j][sProperty] === sValue) {
							newSpath = sPath + "/" + i + "/GanttHierarchyToShift/results/" + j;
							aAllMatchedData.push(newSpath);
						}
					}

					aInnerChildren = aChildren[i].children;
					for (var k = 0; k < aInnerChildren.length; k++) {
						if (aInnerChildren[k].GanttHierarchyToShift && aInnerChildren[k].GanttHierarchyToShift.results && aInnerChildren[k].GanttHierarchyToShift
							.results.length > 0) {
							aInnerAssignments = aInnerChildren[k].GanttHierarchyToShift.results;
							for (var l = 0; l < aInnerAssignments.length; l++) {

								if (aInnerAssignments[l][sProperty] === sValue) {
									newSpath = sPath + "/" + i + "/children/" + k + "/GanttHierarchyToShift/results/" + l;
									aAllMatchedData.push(newSpath);
								}
							}
						}
					}
				}
			}
			return aAllMatchedData;
		},
		_getResourceassigmentByKey: function (sProperty, sValue, sResourceGroupId, oPopoverData) {
			var sPath = "/data/children",
				oModel = this.getModel("ganttPlanningModel"),
				aChildren = oModel.getProperty(sPath),
				aResourceAssignment = [];

			for (var i = 0; i < aChildren.length; i++) {
				var aResourceAssign = aChildren[i].GanttHierarchyToResourceAssign;
				if (aChildren[i][sProperty] === sValue && aResourceAssign) {
					var iResourceCount = aResourceAssign.results.length;
					for (var j = 0; j < iResourceCount; j++) {
						if (aResourceAssign.results[j].ResourceGroupGuid === sResourceGroupId && oPopoverData.Guid !== aResourceAssign.results[j].Guid) {
							aResourceAssignment.push(aResourceAssign.results[j]);
						}
					}
					return aResourceAssignment;
				}
			}
			return aResourceAssignment;
		},

		/**
		 * Return all shift matching resource guid
		 * @param {string} sResourceGuid - Resource Guid
		 */
		_getResourceShiftByKey: function (sNodeId, oShiftData) {
			var sPath = "/data/children",
				oModel = this.getModel("ganttPlanningModel"),
				aChildren = oModel.getProperty(sPath),
				aResourceSelectedShift = [],
				aAllShifts = [];
			for (var i = 0; i < aChildren.length; i++) {
				if (aChildren[i].NodeId === sNodeId) {
					aAllShifts = aChildren[i].GanttHierarchyToShift ? (aChildren[i].GanttHierarchyToShift.results ? aChildren[i].GanttHierarchyToShift
						.results : []) : [];
					for (var j = 0; j < aAllShifts.length; j++) {
						if (oShiftData.Guid !== aAllShifts[j].Guid) {
							aResourceSelectedShift.push(deepClone(aAllShifts[j]));
						}
					}

				}
			}
			return aResourceSelectedShift;
		},

		/**
		 * validate duplicate resouce group in same time
		 */
		_checkDuplicateAsigment: function (oData, aResourceChild) {
			var sStartTime, sEndTime,
				bValidate = true,
				sAssignmentStartDate, sAssignmentEndDate;
			if (oData.NODE_TYPE === "RES_GROUP") {
				if (oData.isNew || oData.isChanging) {
					sStartTime = oData.StartDate;
					sEndTime = oData.EndDate;
				} else {
					sStartTime = Formatter.convertFromUTCDate(oData.StartDate, false);
					sEndTime = Formatter.convertFromUTCDate(oData.EndDate, false);
				}
			} else if (oData.NODE_TYPE === "SHIFT") {
				if (oData.isNew || oData.isChanging) {
					sStartTime = oData.EffectiveStartDate;
					sEndTime = oData.EffectiveEndDate;
				} else {
					sStartTime = Formatter.convertFromUTCDate(oData.EffectiveStartDate, false);
					sEndTime = Formatter.convertFromUTCDate(oData.EffectiveEndDate, false);
				}
			}

			aResourceChild.forEach(function (oAssignment) {
				// added formatter to convert the date from UTC to local time for UI Validation
				if (oData.NODE_TYPE === oAssignment.NODE_TYPE) {
					if (oAssignment.NODE_TYPE === "RES_GROUP") {
						if (oAssignment.isNew || oAssignment.isChanging) {
							sAssignmentStartDate = oAssignment.StartDate;
							sAssignmentEndDate = oAssignment.EndDate;
						} else {
							sAssignmentStartDate = Formatter.convertFromUTCDate(oAssignment.StartDate, false);
							sAssignmentEndDate = Formatter.convertFromUTCDate(oAssignment.EndDate, false);
						}

					} else if (oAssignment.NODE_TYPE === "SHIFT") {
						if (oAssignment.isNew || oAssignment.isChanging) {
							sAssignmentStartDate = oAssignment.EffectiveStartDate;
							sAssignmentEndDate = oAssignment.EffectiveEndDate;
						} else {
							sAssignmentStartDate = Formatter.convertFromUTCDate(oAssignment.EffectiveStartDate, false);
							sAssignmentEndDate = Formatter.convertFromUTCDate(oAssignment.EffectiveEndDate, false);
						}
					}

					if (moment(sStartTime).isSameOrAfter(sAssignmentStartDate) && moment(sEndTime).isSameOrBefore(sAssignmentEndDate)) {
						bValidate = false;
					} else if (moment(sStartTime).isBetween(moment(sAssignmentStartDate), moment(sAssignmentEndDate)) || moment(sEndTime).isBetween(
							moment(sAssignmentStartDate), moment(sAssignmentEndDate))) {
						bValidate = false;
					} else if (moment(sAssignmentStartDate).isBetween(moment(sStartTime), moment(sEndTime)) || moment(sAssignmentEndDate).isBetween(
							moment(sStartTime), moment(sEndTime))) {
						bValidate = false;
					}
				}
			}.bind(this));
			return bValidate;
		},

		/**
		 * Validate the duplicate assigmnents to compare with other assignments
		 */
		_validateDuplicateAsigment: function () {
			var oData = this.oPlanningModel.getProperty("/tempData/popover"),
				aAssigments = [],
				nodeType = oData.NODE_TYPE,
				nodeTypeText;

			//get groups assigned to the selected resource
			if (nodeType === "RES_GROUP") {
				aAssigments = this._getResourceassigmentByKey("ResourceGuid", oData.ResourceGuid, oData.ResourceGroupGuid, oData);
				nodeTypeText = this.getResourceBundle().getText("xtxt.group");
			} else if (nodeType === "SHIFT") {
				aAssigments = this._getResourceShiftByKey(oData.ParentNodeId, oData);
				nodeTypeText = this.getResourceBundle().getText("xtxt.shift");
			}

			//validation for the existing assigments
			if (!this._checkDuplicateAsigment(oData, aAssigments)) {
				this.showMessageToast(this.getResourceBundle().getText("msg.errorduplicateresource", nodeTypeText));
				//reset if other assigmnt exist
				this._resetChanges();
				return true;
			}
			return false;
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

		/**
		 * Promise return Structture of a given EntitySet with data if passed
		 * @param {string} sEntitySet - EntitySet name
		 * @param {object} oRowData -  Data to be copied to new object
		 */
		getObjectFromEntity: function (sEntitySet, oRowData) {
			var obj = {};
			return new Promise(function (resolve) {
				this.getModel().getMetaModel().loaded().then(function () {
					var oMetaModel = this.getModel().getMetaModel(),
						oEntitySet = oMetaModel.getODataEntitySet(sEntitySet),
						oEntityType = oEntitySet ? oMetaModel.getODataEntityType(oEntitySet.entityType) : null,
						aProperty = oEntityType ? oEntityType.property : [];
					aProperty.forEach(function (property) {
						obj[property.name] = "";
						if (oRowData[property.name]) {
							obj[property.name] = oRowData[property.name];
						}
					});
					resolve(obj);
				}.bind(this));
			}.bind(this));
		},
		/**
		 * opens Message Popover 
		 * @param {object} oView - view instance of the caller
		 * @param {object} oEvent -  Message manager button press event
		 */
		_openMessageManager: function (oView, oEvent) {
			this.getOwnerComponent().MessageManager.open(oView, oEvent);
		},

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
		/**
		 * Method copy one object data to another having same property
		 * @param source {object} source object
		 * @param start {destination} target object
		 * @param end {array} ingnored property while copy
		 */
		copyObjectData: function (source, destination, ignore) {
			if (destination) {
				for (var prop in destination) {
					if (!ignore.includes(prop)) {
						source[prop] = destination[prop];
					}
				}
			}
			return source;
		},

		/**
		 * Method to call Function Import
		 * @param oParams {object} parameter to be passed to function import
		 * @param sFuncName {string} function import name
		 * @param sMethod {string} method of the function import, default is "POST"
		 * @param fCallback {function} callback function when function import return value
		 */
		callFunctionImport: function (oParams, sFuncName, sMethod, fCallback) {
			var oModel = this.getModel(),
				oViewModel = this.getModel("viewModel"),
				oResourceBundle = this.getResourceBundle();
			oViewModel.setProperty("/busy", true);
			oModel.callFunction("/" + sFuncName, {
				method: sMethod || "POST",
				urlParameters: oParams,
				refreshAfterChange: false,
				success: function (oData, oResponse) {
					//Handle Success
					oViewModel.setProperty("/busy", false);
					fCallback(oData, oResponse);
				}.bind(this),
				error: function (oError) {
					//Handle Error
					oViewModel.setProperty("/busy", false);
					this.showMessageToast(oResourceBundle.getText("errorMessage"));
				}.bind(this)
			});

		},
		/**
		 * render a popover with button inside
		 * next to Notification ID or Equipment ID
		 * @param oSource
		 * @param sProp
		 */
		openApp2AppPopover: function (oSource, oModelName, sProp) {
			var oNavLinks = this.getModel("templateProperties").getProperty("/navLinks"),
				oContext = oSource.getBindingContext(oModelName) || oSource.getBindingContext(),
				oModel = this.getModel(oModelName) || this.getModel();

			if (oContext && oNavLinks[sProp]) {
				var sPath = oContext.getPath() + "/" + oNavLinks[sProp].Property;
				var oPopover = new sap.m.ResponsivePopover({
					placement: sap.m.PlacementType.Right,
					showHeader: false,
					showCloseButton: true,
					afterClose: function () {
						oPopover.destroy(true);
					}
				});
				var oButton = new sap.m.Button({
					text: this.getResourceBundle().getText("btn.App2App", oNavLinks[sProp].ApplicationName),
					icon: "sap-icon://action",
					press: function () {
						oPopover.close();
						oPopover.destroy(true);
						this.openEvoAPP(oModel.getProperty(sPath), oNavLinks[sProp].ApplicationId);
					}.bind(this)
				});
				oPopover.insertContent(oButton);
				oPopover.openBy(oSource);
			}
		},
		/**
		 * Navigates to evoOrder detail page with static url.
		 * @param sParamValue
		 * @param sAppID
		 */
		openEvoAPP: function (sParamValue, sAppID) {
			var sUri, sSemanticObject, sParameter,
				sAction,
				sAdditionInfo,
				sLaunchMode = this.getModel("viewModel").getProperty("/launchMode"),
				oAppInfo = this._getAppInfoById(sAppID);

			// if there is no configuration maintained in the backend
			if (oAppInfo === null) {
				return;
			}

			if (sLaunchMode === Constants.LAUNCH_MODE.FIORI) {
				sAdditionInfo = oAppInfo.Value1 || "";
				sSemanticObject = sAdditionInfo.split("\\\\_\\\\")[0];
				sAction = sAdditionInfo.split("\\\\_\\\\")[1] || "Display";
				sParameter = sAdditionInfo.split("\\\\_\\\\")[2];
				if (sSemanticObject && sAction) {
					this._navToApp(sSemanticObject, sAction, sParameter, sParamValue);
				}
			} else {
				sAdditionInfo = oAppInfo.Value1;
				sUri = sAdditionInfo.replace("\\\\place_h1\\\\", sParamValue);
				window.open(sUri, "_blank");
			}
		},
		/**
		 * get respective navigation details
		 * @param sAppID
		 */
		_getAppInfoById: function (sAppID) {
			var aNavLinks = this.getModel("templateProperties").getProperty("/navLinks");
			for (var i in aNavLinks) {
				if (aNavLinks.hasOwnProperty(i)) {
					if (aNavLinks[i].ApplicationId === sAppID) {
						return aNavLinks[i];
					}
				}
			}
			return null;
		},
		/**
		 * In Fiori Launchpad navigate to another app
		 * @param sSemanticObject
		 * @param sAction
		 * @param sParameter
		 * @param sParamValue
		 * @private
		 */
		_navToApp: function (sSemanticObject, sAction, sParameter, sParamValue) {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"),
				mParams = {};

			mParams[sParameter] = [sParamValue];
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: sSemanticObject,
					action: sAction
				},
				params: mParams
			});
		},
		/**
		 * Function will validtate if date is past, if date is past return true or else return false
		 * @param oDate - date object to be checked
		 */
		_isDatePast: function (oDate) {
			var isDatePast = moment(oDate).isBefore(moment().startOf('day').toDate());
			return isDatePast;
		},

		/**
		 * Fetch resource based on node id
		 * @param {string} sNodeId - NodeId of Resource
		 */
		_getParentResource: function (sNodeId) {
			var aChildren = this.oPlanningModel.getProperty("/data/children");

			return aChildren.find(function (oResource, idx) {
				return oResource.NodeId === sNodeId;
			}.bind(this));
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

		/*
		 * Returns true if oDate and oSecondDate is same, else false
		 * @param {object} oDate - Date
		 * @param {object} oSecondDate - Date
		 */
		_isDateSame: function (oDate, oSecondDate) {
			return moment(oDate).isSame(oSecondDate);
		}
	});
});