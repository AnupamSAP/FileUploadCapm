sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("nmpspc.attachfileui.controller.attachfiles", {
            onInit: function () {
this.readAttachmentData();
            },
            getBaseURL: function () {
                var oBaseUrl = this.getOwnerComponent().getManifestEntry("/sap.app/id").replaceAll(".", "/");
                return jQuery.sap.getModulePath(oBaseUrl)
            },

            /**
             * on File Change
             */
            onFileChange: function (oEvent) {
                var file = oEvent.getParameters("files").files[0];
                this.file = file;
            },

            /**
             * On File Upload
             */
            onUploadFile: function () {
                var oUploadSet = this.byId("__fileUploader");
                //Upload image
                var reader = new FileReader();
                reader.onload = function (oEvent) {
                    // get an access to the content of the file
                    this.content = oEvent.currentTarget.result;
                    this.createfile();
                }.bind(this);
                reader.readAsDataURL(this.file);

            },

            /**
             *  Create Operation to create an entry in CAP
             */
            createfile: function () {
                var that = this;
                // Data for CAP to create entry
                var oImageData = {
                    "content": this.content,
                    "mediaType": this.file.type,
                    "fileName": this.file.name
                };
                var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
                var sURL = "/MediaFile";
                //Create call for CAP OData Service
                oCAPModel.create(sURL,oImageData,{
                    success: function (oData, oResponse) {
                        var id = oData.id;
                        var sMsg = "File Uploaded Successfully for ID: " + id;
                        MessageBox.success(sMsg);
                    },
                    error: function (jqXHR, textStatus) {

                    },

                });
            },
            
            onBeforeUploadStarts: function (oEvent) {
                var oUploadSet = oEvent.getSource();
                
                var that= this;
                var oFile = this.getView().byId('UploadSet').getDefaultFileUploader().oFileUpload.files[0];
                that.fileName = oFile.name;
              
                var url = this.getBaseURL() ;
               
                    // var csrfToken = this.getOwnerComponent().getModel("oCAPModel").oSharedServerData.securityToken;
               
                oUploadSet.removeAllHeaderFields();
                // oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "x-csrf-token", text: csrfToken }));
                oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "sendXHR", text: 'true' }));
                oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "Slug", text: oFile.name }));
                
                
                oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "Content-Type", text: oFile.type }));
                oUploadSet.setUploadUrl("/v2/media/MediaFile");

                oUploadSet.setHttpRequestMethod("POST");

                // oUploadSet.upload();



                // if (oStatus && oStatus !== 201) {
                //     // oItem.setUploadState("Error");
                //     // oItem.removeAllStatuses();
                // } else {
                //     debugger;
                //     oUploadSet.removeIncompleteItem(oItem);
                //     // this.setAttachmentModel();
                //     // that.onReadAttachmentData();
                // }

            },

            readAttachmentData:function(){
                var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
               
                var sURL = "/MediaFile";
                //Create call for CAP OData Service
                oCAPModel.read(sURL,{
                    success: function (oData, oResponse) {
                       
                    },
                    error: function (jqXHR, textStatus) {

                    },

                });
            }
        });
    });
