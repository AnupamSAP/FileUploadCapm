using {Media.db as db} from '../db/myfile';


service MediaService @(path : '/media') {
    entity MediaFile as projection on db.MediaFile;
};