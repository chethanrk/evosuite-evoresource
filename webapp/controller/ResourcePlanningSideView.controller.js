sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/TemplateRenderController",
	"com/evorait/evosuite/evoresource/model/formatter"
], function (BaseController,formatter) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.ResourcePlanningSideView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.view.ResourcePlanningSide
		 */
		onInit: function () {
			this.oViewModel = this.getModel("viewModel");

			var oRouter = this.getRouter();
			oRouter.attachRouteMatched(function (oEvent) {
				var sRouteName = oEvent.getParameter("name"),
					sViewName = null,
					sEntitySet = null;

				this.getOwnerComponent().oTemplatePropsProm.then(function () {
					if (sRouteName === "ResourcePlanning") {
						sViewName = "com.evorait.evosuite.evoresource.view.templates.ResourcePlanSideTab#ResourcePlanSideIconTab";
						this._setIconTabBarPageInfo();
						this._onRouteMatched(oEvent, sViewName, sEntitySet);
					}
				}.bind(this));
			}.bind(this));
		},
		
		/**
		 * Called everytime when this view get naviagte
		 * @param {object} oEvent
		 * @param {string} sViewName - view name which is passed to TemplateRenderer
		 * @param {string} sEntitySet - entityset name which is passed to template renderer to bind to view
		 * @param {object} mParams - paramter to be added along with entityset to bind to view
		 */
		_onRouteMatched: function (oEvent, sViewName, sEntitySet, mParams) {
			this.oViewModel.setProperty("/busy", true);
			this.getModel().metadataLoaded().then(function () {
				//get template and create views
				this.insertTemplateFragment("/ResourceGroupSet", sViewName, "idPageResourcePlanningSideWrapper", this._afterBindSuccess.bind(this));
			}.bind(this));
		},
		
		/**
		 * Called to set entityset name and annotation to templateproperties json model
		 * 
		 */
		_setIconTabBarPageInfo: function () {
			this.getModel("templateProperties").setProperty("/annotationPath", {
				entitySet: "ResourceGroupSet",
				path: "com.sap.vocabularies.UI.v1.Facets#EntityTabs"
			});
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.evorait.evosuite.evoresource.view.ResourcePlanningSide
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.evorait.evosuite.evoresource.view.ResourcePlanningSide
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.evorait.evosuite.evoresource.view.ResourcePlanningSide
		 */
		//	onExit: function() {
		//
		//	},
		
		/**
		 * Handle ater bind success
		 * @private
		 */
		_afterBindSuccess: function () {
			this.oViewModel.setProperty("/busy", false);
		}

	});

});