sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController",
	"sap/ui/core/mvc/OverrideExecution"
], function (BaseController, OverrideExecution, GroupHeaderListItem) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.ResourceGroupTable", {

		metadata: {
			methods: {
				onResourceGroupDragStart: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				},
				onResourceGroupDragEnd: {
					public: true,
					final: false,
					overrideExecution: OverrideExecution.Before
				}
			}
		},

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.evorait.evosuite.evoresource.controller.ResourceGroupTable
		 */
		onInit: function () {
			this._oResourceGroupTable = this.getView().byId("idResourceGroupTable");
			this.oEventBus = sap.ui.getCore().getEventBus();
			this.oEventBus.subscribe("ResourcePlanSideView", "refreshSideViewTab", this._refreshResourceSideView, this);
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
				type = oDraggedControl.getParent().getParent().getEntitySet(),
				NodeType = {
					"ResourceGroupSet":"RES_GROUP",
					"ShiftSet":"SHIFT",
					"ResourceSet":"RESOURCE"
				}[type],
				oObject = oContext.getObject(),
				draggedData;
				oObject.NodeType = NodeType;
				draggedData = {
					sPath: sPath,
					data: oObject
				};
			this.getView().getModel("viewModel").setProperty("/draggedData", draggedData);
			var result = this.validateResourceExist(oObject);
			if(result){
				oEvent.preventDefault();
			}
		},


		/**
		 * Called when a resource is dragged from Resource side tab
		 * Checks if the resource already exists in the GanttResourceHierarchy data
		 * params @ oDraggedData - it is the dragged resource object
		 */
		validateResourceExist: function(oDraggedData){
			var aChildren = this.getModel("ganttPlanningModel").getProperty("/data/children");
			var bExists = false;
			aChildren.forEach(function(item) {
				if(item.ResourceGuid === oDraggedData.ResourceGuid){
					this.showMessageToast(this.getResourceBundle().getText("yMsg.resourceValidation"));
					bExists = true;
				}		
			}.bind(this));
			return bExists;
		},

		/**
		 * Called when Resource Group drag end
		 * @param {object} oEvent
		 */
		onResourceGroupDragEnd: function (oEvent) {

		},

		/**
		 * Called before Smart Table got bind
		 * @param {object} oEvent
		 */
		onBeforeRebindSmartTable: function (oEvent) {
			this.setGrouperForSmartTable(oEvent);

		},
		
		/**
		 * Method to set grouper for the smart table
		 * @param {object} oEvent
		 * Checks custom data 'isGroup' is set, if yes set grouper for smart table with the property 'mParams.groupProperty'
		 */
		setGrouperForSmartTable: function (oEvent) {
			var mParams = oEvent.getSource().data(),
				mBindingParams = oEvent.getParameter("bindingParams");
			if (mParams.isGroup === "X") {
				mBindingParams.sorter = [new sap.ui.model.Sorter({
					path: mParams.groupProperty,
					descending: false,
					group: true
				})];
			}
		},

		/**
		 * @author Giri
		 * This is eventbus method used for refreshing side view on click of refresh button
		 */
		_refreshResourceSideView: function(){
			var sSelectedTab = this.getView().byId("idIconTabBar").getSelectedKey(),
			sSmartTableId = "idSmartTable--" + sSelectedTab;
			this.getView().byId(sSmartTableId).rebindTable();
		}
	});
});