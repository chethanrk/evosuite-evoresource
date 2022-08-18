sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createHelperModel: function (obj) {
			var oModel = new JSONModel(obj);
			oModel.setDefaultBindingMode("TwoWay");
			oModel.setSizeLimit(99999);
			return oModel;
		},

		createInformationModel: function (oComponent) {
			var oMetadata = oComponent.getMetadata();
			var oManifest = oMetadata._oManifest;
			var oModel = new JSONModel();

			var oInformation = {
				appVersion: oManifest._oManifest["sap.app"].applicationVersion.version,
				ui5Version: sap.ui.getVersionInfo().version,
				language: sap.ui.getCore().getConfiguration().getLocale().getSAPLogonLanguage()
			};
			oModel.setData(oInformation);
			return oModel;
		},
		
		createUserModel:function(){
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});