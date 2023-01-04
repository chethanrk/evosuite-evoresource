/* global moment:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/ui/core/Fragment",
	"com/evorait/evosuite/evoresource/model/Constants",
	"sap/base/util/deepClone",
	"sap/base/util/merge",
	"sap/m/MessageBox"
], function (Controller, Formatter, Fragment, Constants, deepClone, merge, MessageBox) {
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
				
				getObjectFromEntity: {
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
				},
				getLengthOfAllChildren: {
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
				width: "20em", // default
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
					if (aCustomFields[i] instanceof sap.m.MultiInput) {
						sValue = aCustomFields[i].getTokens().length;
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
					this.getView().getModel("viewModel").setProperty("/isResetEnabled", false);
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
								if((property.type === "Edm.DateTime" || property.type === "Edm.DateTimeOffset") && oRowData[property.name]){
									obj[property.name] = Formatter.convertToUTCDate(oRowData[property.name]);
								}
								/**
								 * Bellow piece of code is written because of enddate with UTC for the multiple days are not wotking properly
								 * added formatter to convert the date to UTC before backend call
								 * Removed 1 more second from the enddate before send it to backend
								 * Remove bellow code once we get valid loigc to send UTC date for multiple days selection
								 */
								if ((property.name === "EndDate" || property.name === "EffectiveEndDate") && obj[property.name]) {
									obj[property.name] = new Date(obj[property.name].getTime() - 1000);
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
					var entitySet = oEntitySetList[oAssignment.NODE_TYPE],
						sPath = "";
					if (oAssignment.isRepeating) { // checking if single delete or series delete
						oAssignment.IsSeries = true;
					} else {
						oAssignment.IsSeries = false;
					}

					if (oAssignment.NODE_TYPE === "RES_GROUP") {
						sPath = "/" + entitySet + "(Guid='" + oAssignment.Guid + "',IsSeries=" + oAssignment.IsSeries + ")";
					} else if (oAssignment.NODE_TYPE === "SHIFT") {
						sPath = "/" + entitySet + "(Guid='" + oAssignment.Guid + "',TemplateId='" + oAssignment.TemplateId + "',IsSeries=" + oAssignment.IsSeries + ")";
					}
					this.getModel().remove(sPath, param);

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
		 * This function is used for calculating length of items in tree table along with the children
		 * @param aChildren {array} - Array with the GanttPlanningModel data
		 * */
		getLengthOfAllChildren: function (aChildren) {
			var iItemsLength = 0;
			aChildren.forEach(function (item) {
				iItemsLength++;
				if (item.children)
					iItemsLength += item.children.length;
			});
			return iItemsLength - 1;
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
		 * Returns true if oDate and oSecondDate is same, else false
		 * @param {object} oDate - Date
		 * @param {object} oSecondDate - Date
		 */
		_isDateSame: function (oDate, oSecondDate) {
			return moment(oDate).isSame(oSecondDate);
		}

	});
});