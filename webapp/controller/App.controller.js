sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.App
		 */
		onInit: function () {
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			//set init page title
			this.getOwnerComponent().getRouter().attachRouteMatched(function (oEvent) {
				var oParams = oEvent.getParameters();
				if (oParams.config.pattern === "") {
					this.getModel("viewModel").setProperty("/isSubPage", false);
				} else {
					this.getModel("viewModel").setProperty("/isSubPage", true);
				}
			}, this);
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.evorait.evosuite.evoresource.controller.App
		 */
		onAfterRendering: function () {
			this.getModel("viewModel").setProperty("/busy", false);
		}
	});
});