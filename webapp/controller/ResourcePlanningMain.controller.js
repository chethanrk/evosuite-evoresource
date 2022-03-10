sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/TemplateRenderController",
	"com/evorait/evosuite/evoresource/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.ResourcePlanningMain", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourcePlanningMain
		 */
		onInit: function () {
			this.oViewModel = this.getModel("viewModel");

			var oRouter = this.getRouter();
			oRouter.attachRouteMatched(function (oEvent) {
				var sRouteName = oEvent.getParameter("name"),
					sViewName = null;

				this.getOwnerComponent().oTemplatePropsProm.then(function () {
					if (sRouteName === "ResourcePlanning") {
						sViewName = "com.evorait.evosuite.evoresource.view.templates.ResourcePlanGantt#ResourceGantt";
						this._onRouteMatched(oEvent, sViewName, "GanttHierarchySet");
					}
				}.bind(this));
			}.bind(this));
		},

		/* =========================================================== */
		/* internal methods                                              */
		/* =========================================================== */

		/**
		 * new order create
		 * @param oEvent
		 * @private
		 */
		_onRouteMatched: function (oEvent, sViewName, sEntitySet, mParams) {
			this.oViewModel.setProperty("/busy", true);
			this.getModel().metadataLoaded().then(function () {
				var sPath = this.getEntityPath(sEntitySet, mParams);
				//get template and create views
				this.insertTemplateFragment(sPath, sViewName, "idPageResourcePlanningWrapper", this._afterBindSuccess.bind(this));
			}.bind(this));
		},

		/**
		 * Handle ater bind success
		 * @private
		 */
		_afterBindSuccess: function () {
			this.oViewModel.setProperty("/busy", false);
		}
	});
});