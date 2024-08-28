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
                var itemsModel = new sap.ui.model.json.JSONModel();
                    var itemsData = [];
                    itemsModel.setData(itemsData);

                    this.getView().setModel(itemsModel, "itemsModel");
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
                oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "fileName", text: oFile.name }));
                
                oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "Content-Type", text: oFile.type }));
                oUploadSet.setUploadUrl("/v2/media/MediaFile");

                oUploadSet.setHttpRequestMethod("POST");
                

                // oUploadSet.upload();

                // this.readAttachmentData();

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
            onUploadCompleted: function (oEvent) {
                var itemsData = [];
                this.getView().getModel('itemsModel').setData(itemsData);
                this.getView().getModel('itemsModel').refresh();
                //   this.byId("UploadSet").rerender();
                this.byId("UploadSet").getDefaultFileUploader().oFilePath.setValue('')
                var oUploadSet = this.byId("UploadSet");
                oUploadSet.removeAggregation("items", oUploadSet.getItems()[0]);

                var oStatus = oEvent.getParameter("status"),
                    oItem = oEvent.getParameter("item");
                if (oStatus && oStatus !== 201) {
                    oItem.setUploadState("Error");
                    oItem.removeAllStatuses();
                } else {
                    oUploadSet.removeIncompleteItem(oItem);
                    // this.setAttachmentModel();
                    this.readAttachmentData();
                }
            },
            readAttachmentData:function(){
                var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
                var itemsData = [];
                var sURL = "/MediaFile";
                var that = this;
                //Create call for CAP OData Service
                oCAPModel.read(sURL,{
                    success: function (oData, oResponse) {
                        for (var i = 0; i < oData.results.length; i++) {
                            var attachmentObj = {};
                            attachmentObj.fileName = oData.results[i].fileName;
                            attachmentObj.mediaType = oData.results[i].mediaType;
                            attachmentObj.url = oData.results[i].url;
                            attachmentObj.ID = oData.results[i].ID;
                           
                            attachmentObj.statuses = [];
                            attachmentObj.statuses.push({
                                title: "Uploaded By",
                                text: "Anupam",
                                active: true
                            });
                            attachmentObj.statuses.push({
                                title: "Uploaded On",
                                text: "20-06-2024",
                                active: false
                            });
                            // attachmentObj.statuses.push({
                            //     title: "File Size",
                            //     text: that.formatAttribute(oData.d.results[i].FileSize),
                            //     active: false
                            // });
                            itemsData.push(attachmentObj);
                        }
                        var attachmentTableData = { itemsData: itemsData };
                        that.FileMain = itemsData;
                        that.getView().getModel("itemsModel").setData(attachmentTableData);
                        that.getView().getModel("itemsModel").refresh();
                        
                    },
                    error: function (jqXHR, textStatus) {

                    },

                });
            },
            uploadSetDelete:function(oEvent){
                debugger;
                var oUploadSet = oEvent.getSource();
                var ID = oUploadSet.getBindingContext("itemsModel").getObject().ID;
                var mediaType = oUploadSet.getBindingContext("itemsModel").getObject().mediaType;
                var oFile = this.getView().byId('UploadSet').getDefaultFileUploader().oFileUpload.files[0];
                // oUploadSet.addHeaderField(new sap.ui.core.Item({ key: "Content-Type", text: mediaType }));
this.deletefile(mediaType,ID);
                // oUploadSet.setUploadUrl("/v2/media/MediaFile("+ID+")");

                // oUploadSet.setHttpRequestMethod("DELETE");
            },
            deletefile: function (mediaType,ID) {
                var that = this;
                // Data for CAP to create entry
                var oImageData = {
                    "Content-Type": mediaType,
                    
                };
                var oCAPModel = this.getOwnerComponent().getModel("oCAPModel");
                var sURL = "/MediaFile("+ID+")";
                //Create call for CAP OData Service
                oCAPModel.remove(sURL,oImageData,{
                    success: function (oData, oResponse) {
                      
                        var sMsg = "File  deleted for ID: " + ID;
                        // MessageBox.success(sMsg);
                    },
                    error: function (jqXHR, textStatus) {

                    },

                });
            }
        });
    });
