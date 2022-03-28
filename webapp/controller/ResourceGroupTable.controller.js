sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.ResourceGroupTable", {

		metadata: {
			methods: {}
		},
		
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourceGroupTable
		 */
		onInit: function () {
			this._oResourceGroupTable = this.getView().byId("idResourceGroupTable");
		},
		
		/**
		 * Called when Resource Group drag start
		 * @param {object} oEvent
		 */
		onResourceGroupDragStart: function (oEvent) {
			// ondrag of the resource group
			var oDragSession = oEvent.getParameter("dragSession"),
				oDraggedControl = oDragSession.getDragControl(),
				oContext = oDraggedControl.getBindingContext(),
				sPath = oDraggedControl.getBindingContext().getPath(),
				oObject = oContext.getObject(),
				draggedData = {
					sPath:sPath,
					data:oObject
				};
			
			
			this.getView().getModel("viewModel").setProperty("/draggedData",draggedData);
		},
		
		/**
		 * Called when Resource Group drag end
		 * @param {object} oEvent
		 */
		onResourceGroupDragEnd: function (oEvent) {

		}
	});
});