sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/evorait/evosuite/evoresource/model/formatter",
	"sap/ui/core/Fragment"
], function (Controller, Formatter, Fragment) {
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
				showMessageToast: {
					public: true,
					final: true
				},
				createNewTempAssignment: {
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
					Guid: new Date().getTime()
				};
				//collect all assignment properties who allowed for create
				this.getModel().getMetaModel().loaded().then(function () {
					var oMetaModel = this.getModel().getMetaModel(),
						oEntitySet = oMetaModel.getODataEntitySet("AssignmentSet"),
						oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType),
						aProperty = oEntityType.property;

					aProperty.forEach(function (property) {
						var isCreatable = property["sap:creatable"];
						if (typeof isCreatable === "undefined" || isCreatable === true) {
							obj[property.name] = "";
							if (oRowData[property.name]) {
								obj[property.name] = oRowData[property.name];
							}
						}
					});

					obj.DateFrom = oStartTime;
					obj.DateTo = oEndTime;
					obj.AssignmentType = "GROUP";
					obj.ResourceGroupGuid = oRowData.ResourceGroupGuid;
					obj.ResourceGuid = oRowData.ResourceGuid;
					resolve(obj);
				}.bind(this));
			}.bind(this));
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * opens Message Popover 
		 * @param {object} oView - view instance of the caller
		 * @param {object} oEvent -  Message manager button press event
		 */
		_openMessageManager: function (oView, oEvent) {
			this.getOwnerComponent().MessageManager.open(oView, oEvent);
		}
	});
});