/* global moment:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/ui/core/Fragment",
	"com/evorait/evosuite/evoresource/model/Constants",
], function (Controller, Formatter, Fragment, Constants) {
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
		 * when background shape was pressed create temporary assignment
		 * for shape popover input fields and visibility inside Gantt chart
		 * 
		 * @param {object} oStartTime - start date of shape
		 * @param {object} oEndTime - end date of shape 
		 * @param {object} oRowData - row context data from Gantt row
		 */
		createNewTempAssignment: function (oStartTime, oEndTime, oRowData) {
			return new Promise(function (resolve) {
				var obj = {
					minDate: new Date(),
					isTemporary: true,
					isNew: true,
					Guid: new Date().getTime()
				};
				//collect all assignment properties who allowed for create
				this.getModel().getMetaModel().loaded().then(function () {
					var oMetaModel = this.getModel().getMetaModel(),
						oEntitySet = oMetaModel.getODataEntitySet("ResourceAssignmentSet"),
						oEntityType = oEntitySet ? oMetaModel.getODataEntityType(oEntitySet.entityType) : null,
						aProperty = oEntityType ? oEntityType.property : [];

					aProperty.forEach(function (property) {
						var isCreatable = property["sap:creatable"];
						if (typeof isCreatable === "undefined" || isCreatable === true) {
							obj[property.name] = "";
							if (oRowData[property.name]) {
								obj[property.name] = oRowData[property.name];
							}
						}
					});

					obj.StartDate = oStartTime;
					obj.EndDate = oEndTime;
					obj.NODE_TYPE = "GROUP";
					obj.ResourceGroupGuid = oRowData.ResourceGroupGuid;
					obj.ResourceGuid = oRowData.ResourceGuid;
					obj.DESCRIPTION = oRowData.ResourceGroupDesc || oRowData.Description;
					obj.PARENT_NODE_ID = oRowData.NodeId;
					obj.RESOURCE_GROUP_COLOR = oRowData.ResourceGroupColor;
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

			var isValid = true;

			//validate mandatory fields
			for (var i = 0; i < aCustomFields.length; i++) {
				if (aCustomFields[i].getValue) {
					var sValue = aCustomFields[i].getValue();
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

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

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
				} else if (aChildren[i].GanttHierarchyToResourceAssign && aChildren[i].GanttHierarchyToResourceAssign.results.length > 0) {
					//search in assignments
					sNewObj = this._getChildDataByKey(sProperty, sValue, sPath + "/" + i + "/GanttHierarchyToResourceAssign/results");
					if (sNewObj) {
						return sNewObj;
					} else if (aChildren[i].children && aChildren[i].children.length > 0) {
						//search in other children
						sNewObj = this._getChildDataByKey(sProperty, sValue, sPath + "/" + i + "/children");
						return sNewObj;
					}
				}
			}
			return sNewObj;
		},

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
				if (aChildren[i].GanttHierarchyToResourceAssign && aChildren[i].GanttHierarchyToResourceAssign.results.length > 0) {
					aAssignments = aChildren[i].GanttHierarchyToResourceAssign.results;
					for (var j = 0; j < aAssignments.length; j++) {

						if (aAssignments[j][sProperty] === sValue) {
							newSpath = sPath + "/" + i + "/GanttHierarchyToResourceAssign/results/" + j;
							aAllMatchedData.push(newSpath)
						}
					}

					aInnerChildren = aChildren[i].children;
					for (var k = 0; k < aInnerChildren.length; k++) {
						if (aInnerChildren[k].GanttHierarchyToResourceAssign && aInnerChildren[k].GanttHierarchyToResourceAssign.results.length > 0) {
							aInnerAssignments = aInnerChildren[k].GanttHierarchyToResourceAssign.results;
							for (var l = 0; l < aInnerAssignments.length; l++) {

								if (aInnerAssignments[l][sProperty] === sValue) {
									newSpath = sPath + "/" + i + "/children/" + k + "/GanttHierarchyToResourceAssign/results/" + l;
									aAllMatchedData.push(newSpath)
								}
							}
						}
					}
				}
			}
			return aAllMatchedData;
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

			this.oZoomStrategy.setTotalHorizon(new sap.gantt.config.TimeHorizon({
				startTime: oStartDate,
				endTime: oEndDate
			}));
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

			this.getModel("viewModel").setProperty("/gantt/defaultStartDate", sStartDate);
			this.getModel("viewModel").setProperty("/gantt/defaultEndDate", sEndDate);
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
				for (let prop in destination) {
					if (!ignore.includes(prop)) {
						source[prop] = destination[prop];
					}
				}
			}
			return source
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
					if (!this._oDemandDialogIsOpen) {
						this._oDemandDialog = oDialog;
						this.getView().addDependent(this._oDemandDialog);

						this._oDemandDialog.open();
						this._oDemandDialogIsOpen = true;
						this._oDemandDialog.attachAfterOpen(function () {}.bind(this));

						this._oDemandDialog.attachAfterClose(function () {
							this._oDemandDialogIsOpen = false;
						}.bind(this));
					}

				}.bind(this));
			} else {
				if (!this._oDemandDialogIsOpen) {
					this._oDemandDialog.open();
					this._oDemandDialogIsOpen = true;
				}
			}
		},
		/**
		 * To Demand Dialog close
		 */
		onDemandDialogClose: function (oEvent) {
			this._oDemandDialog.close();
		},
		/**
		 * Method to call Function Import
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
					fCallback(oData);
				}.bind(this),
				error: function (oError) {
					//Handle Error
					oViewModel.setProperty("/busy", false);
					MessageToast.show(oResourceBundle.getText("errorMessage"), {
						duration: 5000
					});
				}
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
		 *	Navigates to evoOrder detail page with static url.
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
	});
});