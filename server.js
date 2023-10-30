const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password 'guitar',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
)