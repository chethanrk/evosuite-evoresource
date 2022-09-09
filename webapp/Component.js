/* globals moment */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/evorait/evosuite/evoresource/model/models",
	"com/evorait/evosuite/evoresource/controller/MessageManager",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/evorait/evosuite/evoresource/model/Constants",
	"com/evorait/evosuite/evoresource/controller/ErrorHandler"
], function (UIComponent, Device, models, MessageManager, JSONModel, Filter, FilterOperator, Constants, ErrorHandler) {
	"use strict";

	var oCoreMessageManager = sap.ui.getCore().getMessageManager();

	return UIComponent.extend("com.evorait.evosuite.evoresource.Component", {

		metadata: {
			manifest: "json"
		},
		oSystemInfoProm: null,
		oDefaultInfoProm: null,
		oResourceGroupInfoProm: null,
		oShiftInfoProm: null,
		oGanttSettingInfoProm: null,
		oTemplatePropsProm: null,

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.setModel(models.createInformationModel(this), "InformationModel");

			// set the user model for System Information
			this.setModel(models.createUserModel(), "user");

			//helper model viewModel
			this.setModel(models.createHelperModel({
				logoUrl: sap.ui.require.toUrl("com/evorait/evosuite/evoresource/assets/img/EvoResource.png"),
				busy: true,
				delay: 100,
				densityClass: this.getContentDensityClass(),
				isSubPage: false,
				gantt: {
					defaultStartDate: moment().toDate(),
					defaultEndDate: moment().endOf("day").toDate(),
					popoverPlacement: sap.m.PlacementType.Auto,
					firstVisibleRow:0
				},
				draggedData: null,
				launchMode: Constants.LAUNCH_MODE.BSP,
				enableProceed: false
			}), "viewModel");

			this.setModel(models.createHelperModel(), "ganttPlanningModel");
			// Demand List Model
			this.setModel(models.createHelperModel(), "demandModel");

			// set the message model with messages from core message manager
			this.setModel(models.createHelperModel([]), "coreMessageModel");

			this.MessageManager = new MessageManager();

			this._getTemplateProps();

			this._setApp2AppLinks();

			this._getResourceGroupDetails();
			this._getShiftDetails();

			// get System Information
			this._getSystemInformation();

			//get Gantt setting information
			this._getGanttSettingInformation();

			// enable routing
			this.getRouter().initialize();

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				var element = document.getElementsByTagName("body")[0];
				if (element.classList.contains("sapUiSizeCozy") || element.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!this._isMobile()) { // apply "compact" mode if touch is not supported
					//sapUiSizeCompact
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		/**
		 * Get url GET parameter by key name
		 * @param {string} sKey - key of GET parameter
		 * @returns {object}
		 */
		getLinkParameterByName: function (sKey) {
			var oComponentData = this.getComponentData();
			//Fiori Launchpad startup parameters
			if (oComponentData) {
				var oStartupParams = oComponentData.startupParameters;
				if (oStartupParams[sKey] && (oStartupParams[sKey].length > 0)) {
					return oStartupParams[sKey][0];
				} else if (!sKey) {
					return oStartupParams;
				}
			} else {
				var queryString = window.location.search,
					urlParams = new URLSearchParams(queryString);
				if (urlParams.has(sKey)) {
					return urlParams.get(sKey);
				} else if (!sKey) {
					return urlParams;
				}
			}
			return false;
		},

		/**
		 * Read from oData model service url with filters
		 * returns promise
		 */
		readData: function (sUri, aFilters, mUrlParams) {
			return new Promise(function (resolve, reject) {
				this.getModel().read(sUri, {
					filters: aFilters,
					urlParameters: mUrlParams || {},
					success: function (oData) {
						resolve(oData);
					},
					error: function (oError) {
						//Handle Error
						reject(oError);
					}
				});
			}.bind(this));
		},
		/**
		 * Extract messages from a the message manager and store it to "coreMessageMessage" JSON model.
		 */
		createMessages: function () {
			var aMessages = JSON.parse(JSON.stringify(this.getModel("coreMessageModel").getData())),
				oMessageModel = oCoreMessageManager.getMessageModel(),
				oData = oMessageModel.getData();

			if (oData.length === 0) {
				return;
			}

			for (var i = 0; i < oData.length; i++) {
				var item = {};
				item.id = oData[i].id;
				item.type = oData[i].type;
				item.title = oData[i].message;
				item.description = oData[i].description;

				if (!JSON.stringify(aMessages).includes(JSON.stringify(item))) {
					aMessages.push(item);
				}

			}
			this.getModel("coreMessageModel").setData(aMessages);
		},

		/**
		 * check if mobile device
		 * @returns {boolean}
		 * @private
		 */
		_isMobile: function () {
			return sap.ui.Device.system.tablet || sap.ui.Device.system.phone;
		},

		/**
		 * Calls the GetSystemInformation 
		 */
		_getSystemInformation: function () {
			this.oSystemInfoProm = new Promise(function (resolve) {
				this.readData("/SystemInformationSet", []).then(function (oData) {
					this.getModel("user").setData(oData.results[0]);
					resolve(oData.results[0]);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * Calls the PropertyValueDetermination 
		 */
		_getDefaultInformation: function () {
			this.oDefaultInfoProm = new Promise(function (resolve) {
				this.readData("/PropertyValueDeterminationSet", []).then(function (oData) {
					this.getModel("DefaultInformationModel").setProperty("/defaultProperties", oData.results);
					resolve(oData.results[0]);
				}.bind(this));
			}.bind(this));
		},
		/**
		 * Gets resource group data
		 * Returns promise
		 */
		_getResourceGroupDetails: function () {
			this.oResourceGroupInfoProm = new Promise(function (resolve) {
				this.readData("/ResourceGroupSet", []).then(function (oData) {
					this.getModel("viewModel").setProperty("/ResourceGroup", oData.results);
					resolve(oData.results);
				}.bind(this));
			}.bind(this));
		},
		/**
		 * Gets shift data
		 * Returns promise
		 */
		_getShiftDetails: function () {
			this.oShiftInfoProm = new Promise(function (resolve) {
				this.readData("/ShiftSet", []).then(function (oData) {
					this.getModel("viewModel").setProperty("/Shifts", oData.results);
					resolve(oData.results);
				}.bind(this));
			}.bind(this));
		},
		/**
		 * Gets Gantt Setting Information
		 * Returns promise
		 */
		_getGanttSettingInformation: function () {
			this.oGanttSettingInfoProm = new Promise(function (resolve) {
				this.readData("/ShowPopupSet", []).then(function (oData) {
					var aPopupSet = oData.results,
						ganttShapeVisibility = {};
					this.getModel("viewModel").setProperty("/GanttSettingInformation", aPopupSet);
					aPopupSet.forEach(function (oItem) {
						ganttShapeVisibility[oItem.Type] = oItem.DefaultFlag;
					});
					this.getModel("viewModel").setProperty("/GanttShapeVisibility", ganttShapeVisibility);
					resolve(oData.results);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * get Template properties as model inside a global Promise
		 */
		_getTemplateProps: function () {
			this.oTemplatePropsProm = new Promise(function (resolve) {
				var realPath = sap.ui.require.toUrl("com/evorait/evosuite/evoresource/model/TemplateProperties.json");
				var oTempJsonModel = new JSONModel();
				oTempJsonModel.loadData(realPath);
				oTempJsonModel.attachRequestCompleted(function () {
					this.setModel(oTempJsonModel, "templateProperties");
					resolve(oTempJsonModel.getData());
				}.bind(this));
			}.bind(this));
		},
		/**
		 * read app2app navigation links from backend
		 */
		_setApp2AppLinks: function () {
			if (sap.ushell && sap.ushell.Container) {
				this.getModel("viewModel").setProperty("/launchMode", Constants.LAUNCH_MODE.FIORI);
			}
			var oFilter = new Filter("LaunchMode", FilterOperator.EQ, this.getModel("viewModel").getProperty("/launchMode")),
				mProps = {};

			this.readData("/NavigationLinksSet", [oFilter])
				.then(function (data) {
					data.results.forEach(function (oItem) {
						if (oItem.Value1 && Constants.APPLICATION[oItem.ApplicationId]) {
							oItem.Property = oItem.Value2 || Constants.PROPERTY[oItem.ApplicationId];
							mProps[oItem.Property] = oItem;
						}
					});
					this.getModel("templateProperties").setProperty("/navLinks/", mProps);
				}.bind(this));
		}
	});
});