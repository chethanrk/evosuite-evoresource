sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController",
	"com/evorait/evosuite/evoresource/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.ResourcePlanGantt", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourcePlanningMain
		 */
		onInit: function () {
			/*this.oZoomStrategy = this.getView().byId("idGanttZoom");
			this.oZoomStrategy.setTimeLineOptions(formatter.getTimeLineOptions());
			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions("DAY"));*/

			//idPageResourcePlanningWrapper
		},

		/**
		 * Set new time line options for Gantt time horizon
		 * @param {obejct} oEvent - change event of filter view mode
		 */
		onChangeTimeMode: function (oEvent) {
			/*var mParam = oEvent.getParameters(),
				sKey = mParam.selectedItem.getKey();

			this.oZoomStrategy.setTimeLineOption(formatter.getTimeLineOptions(sKey));
			this._setBackgroudShapes(sKey);*/
		}
	});
});