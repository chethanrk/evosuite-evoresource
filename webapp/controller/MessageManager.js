sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/OverrideExecution"
], function (Controller, Fragment, OverrideExecution) {
	"use strict";
	var oCoreMessageManager = sap.ui.getCore().getMessageManager();
	return Controller.extend("com.evorait.evosuite.evoresource.controller.MessageManager", {

		metadata: {
			methods: {
				open: {
					public: true,
					final: true
				}
			}
		},

		_showMessageManager: null,
		_oCurrentView: null,

		/**
		 * Opens the Message Manager popover 
		 * @param {object} oView view instance from the caller function
		 * @param {object} oEvent Message Manager button click event
		 */
		open: function (oView, oEvent) {
			var oOpenByControl = oEvent.getSource();
			this._oCurrentView = oView;
			if (!this._showMessageManager) {
				Fragment.load({
					name: "com.evorait.evosuite.evoresource.view.fragments.MessageManager",
					controller: this,
					type: "XML"
				}).then(function (oFragment) {
					this._showMessageManager = oFragment;
					oView.addDependent(oFragment);
					this._showMessageManager.addStyleClass(oView.getModel("viewModel").getProperty("/densityClass"));
					this._showMessageManager.openBy(oOpenByControl);
				}.bind(this));
			} else {
				if (this._showMessageManager.isOpen()) {
					this._showMessageManager.close();
				} else {
					this._refreshMessageModel();
					this._showMessageManager.openBy(oOpenByControl);
				}
			}
		},

		/**
		 * Delete all messages from message manager model
		 */
		deleteAllMessages: function () {
			if (this._showMessageManager.getModel("coreMessageModel")) {
				this._showMessageManager.getModel("coreMessageModel").setData([]);
				oCoreMessageManager.removeAllMessages();
				this._showMessageManager.close();
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Called when coreMessageModel model needs to refresh
		 */
		_refreshMessageModel: function () {
			oCoreMessageManager.getMessageModel().refresh();
			if (this._showMessageManager.getModel("coreMessageModel")) {
				this._showMessageManager.getModel("coreMessageModel").refresh();
			} else if (this._oCurrentView.getModel("coreMessageModel")) {
				this._showMessageManager.setModel(this._oCurrentView.getModel("coreMessageModel"), "coreMessageModel");
				this._showMessageManager.getModel("coreMessageModel").refresh();
			}
		}

	});
});