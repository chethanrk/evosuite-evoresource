sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/evorait/evosuite/evoresource/model/models",
	"com/evorait/evosuite/evoresource/controller/MessageManager",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, MessageManager, JSONModel) {
	"use strict";

	var oCoreMessageManager = sap.ui.getCore().getMessageManager();

	return UIComponent.extend("com.evorait.evosuite.evoresource.Component", {

		metadata: {
			manifest: "json",
			config: {
				fullWidth: true
			}
		},

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
				busy: true,
				delay: 100,
				densityClass: this.getContentDensityClass(),
				isSubPage: false,
				gantt: {
					defaultStartDate: moment().startOf("week").toDate(),
					defaultEndDate: moment().endOf("month").add(1, "months").toDate()
				}
			}), "viewModel");

			this.setModel(models.createHelperModel(), "ganttPlanningModel");

			// set the message model with messages from core message manager
			this.setModel(oCoreMessageManager.getMessageModel(), "coreMessageModel");

			this.MessageManager = new MessageManager();

			this._getTemplateProps();

			// get System Information
			this._getSystemInformation();
			this.oSystemInfoProm.then(function (oResult) {
				//this.getModel("viewModel").setProperty("/gantt/defaultStartDate", oResult.DEFAULT_GANTT_START_DATE);
				//this.getModel("viewModel").setProperty("/gantt/defaultEndDate", oResult.DEFAULT_GANTT_END_DATE);
			}.bind(this));

			// enable routing
			this.getRouter().initialize();
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
					console.log(oData.results[0])
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
		}
	});
});