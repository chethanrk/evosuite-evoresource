sap.ui.define([
	"com/evorait/evosuite/evoresource/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/mvc/View",
	"sap/ui/core/mvc/ViewType",
	"com/evorait/evosuite/evoresource/model/AnnotationHelper",
	"sap/ui/core/mvc/OverrideExecution"
], function (BaseController, Controller, CoreView, ViewType, AnnotationHelper, OverrideExecution) {
	"use strict";

	return BaseController.extend("com.evorait.evosuite.evoresource.controller.TemplateRenderController", {

		metadata: {
			// extension can declare the public methods
			// in general methods that start with "_" are private
			methods: {
				setOwnerComponent: {
					public: true,
					final: true
				},

				getTemplateModel: {
					public: true,
					final: true
				},

				setTemplateProperties: {
					public: true,
					final: true
				},

				getEntityPath: {
					public: true,
					final: true
				},

				insertTemplateFragment: {
					public: true,
					final: true
				},

				createView: {
					public: true,
					final: true
				},

				bindView: {
					public: true,
					final: true
				}
			}
		},

		mTemplates: {},

		_oTemplateModel: null,

		_oOwnerComponent: null,

		/**
		 * !Important when navigation in FLP between apps
		 * cached view needs to be destroyed on exit
		 * else on back navigation view can't be integrated anymore
		 */
		onExit: function () {
			this._oTemplateModel = null;
			this._oOwnerComponent = null;

			for (var key in this.mTemplates) {
				if (this.mTemplates.hasOwnProperty(key) && this.mTemplates[key]) {
					this.mTemplates[key].destroy();
					this.mTemplates[key] = null;
				}
			}
		},

		/**
		 * for rendering xml view templates with controllers
		 * where ownerComponent is not known for example dialogs
		 */
		setOwnerComponent: function (oComponent) {
			this._oOwnerComponent = oComponent;
		},

		/**
		 * get global helper model for generating template xml views
		 */
		getTemplateModel: function () {
			if (!this._oTemplateModel) {
				if (this._oOwnerComponent) {
					this._oTemplateModel = this._oOwnerComponent.getModel("templateProperties");
				} else {
					this._oTemplateModel = this.getOwnerComponent().getModel("templateProperties");
				}
			}
			return this._oTemplateModel;
		},

		/**
		 * set parameters to Json model templateProperties
		 */
		setTemplateProperties: function (mParams) {
			var oTempModel = this.getTemplateModel();
			oTempModel.setProperty("/annotationPath", mParams.annotationPath);
			oTempModel.setProperty("/tempData", mParams);
		},

		/**
		 * get path for create or edit binding from entitySet
		 * @param sEntitySet
		 * @param mParams
		 * @param oView
		 * @param sPath
		 * @returns {string|*}
		 */
		getEntityPath: function (sEntitySet, mParams, oView, sPath, oParentContext, sGroupId) {
			var oModel = oView ? oView.getModel() : this.getModel();
			if (sPath) {
				return sPath;
			}
			if (mParams) {
				return "/" + oModel.createKey(sEntitySet, mParams);
			} else {
				var oContext = oModel.createEntry("/" + sEntitySet, {
					context: oParentContext,
					groupId: sGroupId
				});
				return oContext.getPath();
			}
		},

		/**
		 * Get template page or fragment for generic pages or dialogs by annotations
		 * Only create new view from template when wrapper content is empty
		 * Will prevent too much loading time 
		 * in template controller onAfterrendering is still called after navigations also when content is already in page
		 */
		insertTemplateFragment: function (sPath, sViewName, sContainerId, callbackFn, mParams) {
			var oView = this.getView(),
				sControllerName = null;

			if (mParams) {
				oView = mParams.oView;
				sControllerName = mParams.controllerName;
			}

			var oViewContainer = oView.byId(sContainerId) || sap.ui.getCore().byId(sContainerId),
				oModel = oView.getModel();
			if (!oViewContainer) {
				return;
			}

			var aContent = oViewContainer.getContent();
			if (aContent.length > 0) {
				var sContentViewName = this._joinTemplateViewNameId(aContent[0].getId(), aContent[0].getViewName());
				if (sContentViewName !== sViewName) {
					oViewContainer.removeAllContent();
					aContent = oViewContainer.getContent();
				}
			}

			if (aContent.length === 0) {
				if (this.mTemplates[sViewName]) {
					//when template was already in use then just integrate in viewContainer and bind new path
					//will improve performance
					oViewContainer.insertContent(this.mTemplates[sViewName]);
					this.bindView(this.mTemplates[sViewName], sPath, callbackFn);
				} else {
					//load template view ansync and interpret annotations based on metadata model
					//and bind view path and save interpreted template global for reload
					var oMetaModel = oModel.getMetaModel();
					oMetaModel.loaded().then(function () {

						//insert rendered template in content and bind path
						var setTemplateAndBind = function (oTemplateView) {
							this.mTemplates[sViewName] = oTemplateView;
							oViewContainer.insertContent(oTemplateView);
							this.bindView(oTemplateView, sPath, callbackFn);
						}.bind(this);

						if (sControllerName) {
							Controller.create({
								name: "com.evorait.evosuite.evoorderrelate.controller." + sControllerName
							}).then(function (controller) {
								this.createView(oModel, oMetaModel, sPath, sViewName, controller).then(setTemplateAndBind);
							}.bind(this));
						} else {
							this.createView(oModel, oMetaModel, sPath, sViewName, null).then(setTemplateAndBind);
						}

					}.bind(this));
				}
			} else {
				this.bindView(aContent[0], sPath, callbackFn);
			}
		},

		/**
		 * create view and set owner component for routing
		 * and calls for getOwnerComponent() in nested views and blocks
		 * @param oModel
		 * @param oMetaModel
		 * @param sPath
		 * @param sViewNameId
		 * @param oController
		 * @returns {*}
		 */
		createView: function (oModel, oMetaModel, sPath, sViewNameId, oController) {
			var sViewId = this._getTemplateViewId(sViewNameId, true),
				sViewName = this._getTemplateViewId(sViewNameId, false),
				oTemlateModel = this.getTemplateModel();

			if (oTemlateModel.getProperty("/annotationPath")) {
				//add metaModel to JsonModel for custom AnnotationHelper
				oTemlateModel.setProperty("/metaModel", oMetaModel);
			}

			var fnCreateView = function () {
				return CoreView.create({
					id: sViewId,
					async: true,
					models: oModel,
					preprocessors: {
						xml: {
							bindingContexts: {
								meta: oMetaModel.getMetaContext(sPath)
							},
							models: {
								meta: oMetaModel,
								templateProperties: oTemlateModel
							}
						}
					},
					type: ViewType.XML,
					viewName: sViewName,
					controller: oController
				});
			};

			//run as owner so views knows ownerComponent
			var oOwnerComponent = this._oOwnerComponent || this.getOwnerComponent();
			if (oOwnerComponent) {
				return oOwnerComponent.runAsOwner(fnCreateView);
			} else {
				return fnCreateView();
			}
		},

		/**
		 * bind special view control with new path
		 * @param oView
		 * @param sPath
		 * @param callbackFn
		 */
		bindView: function (oView, sPath, callbackFn) {
			var sViewName = this._joinTemplateViewNameId(oView.getId(), oView.getViewName()),
				eventBus = sap.ui.getCore().getEventBus();

			if (!sPath) {
				eventBus.publish("TemplateRendererEvoResource", "changedBinding", {
					viewNameId: sViewName
				});
				if (callbackFn) {
					callbackFn();
				}
				return;
			}

			oView.unbindElement();
			oView.bindElement({
				path: sPath,
				events: {
					change: function () {
						eventBus.publish("TemplateRendererEvoResource", "changedBinding", {
							viewNameId: sViewName
						});
						if (callbackFn) {
							callbackFn();
						}
					},
					dataRequested: function () {},
					dataReceived: function () {}
				}
			});
		},

		/**
		 * get view name or view id
		 * @param sViewName
		 * @param getId
		 */
		_getTemplateViewId: function (sViewName, getId) {
			if (sViewName.indexOf("#") >= 0) {
				sViewName = sViewName.split("#");
				return getId ? sViewName[1] : sViewName[0];
			}
			return getId ? null : sViewName;
		},

		/**
		 * join fragment name and Id together again
		 * @param sViewId
		 * @param sViewName
		 */
		_joinTemplateViewNameId: function (sViewId, sViewName) {
			if (sViewId) {
				return sViewName + "#" + sViewId;
			}
			return sViewName;
		}
	});
});