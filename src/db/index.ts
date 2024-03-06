import mongoSetup from '../config/db.config';

class Database {
    constructor() {
        mongoSetup();
    }
}

export default Database;
