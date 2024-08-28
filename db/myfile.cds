namespace Media.db;

using
{
    cuid,
    managed
}
   
from '@sap/cds/common';




entity MediaFile : cuid,managed{
   
        @Core.MediaType   : mediaType
        content   : LargeBinary;
        @Core.IsMediaType : true
        mediaType : String;
        fileName  : String;
        url       : String;
};