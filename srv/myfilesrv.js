const SequenceHelper = require("./library/SequenceHelper");
const { Readable, PassThrough } = require("stream");
const cds = require('@sap/cds');
cds.env.features.fetch_csrf = true

module.exports = cds.service.impl(async function () {

    const {
        MediaFile
    } = this.entities;


    /**
     * Handler method called before creating data entry
     * for entity Mediafile.
     */
    this.before('CREATE', MediaFile, async (req) => {
        // const db = await cds.connect.to("db");
        // // Create Constructor for SequenceHelper 
        // // Pass the sequence name and db
        // const SeqReq = new SequenceHelper({
        //     sequence: "MEDIA_ID",
        //     db: db,
        //     table: "MEDIA_DB_MEDIAFILE",
		// 	field: "Id"
        // });
        // //Call method getNextNumber() to fetch the next sequence number 
        // let seq_no = await SeqReq.getNextNumber();
        // // Assign the sequence number to id element
        // req.data.id = seq_no;
        // //Assign the url by appending the id
        req.data.url = `/v2/media/MediaFile(${req.data.ID})/content`;
    });

    /**
     * Handler method called on reading data entry
     * for entity Mediafile.
     **/
    

    function _formatResult(decodedMedia, mediaType) {
        const readable = new Readable();
        const result = new Array();
        readable.push(decodedMedia);
        readable.push(null);
        return {
            value: readable,
            '*@odata.mediaContentType': mediaType
        }
    }
});
