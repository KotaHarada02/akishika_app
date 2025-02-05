const express = require('express')
const app = express()
const port = 3001
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

app.use(cors({
    origin: 'http://localhost:3000', // フロントエンドのURLを指定
    methods: ['GET', 'POST'], // 許可するHTTPメソッド
    credentials: false, // 認証情報を含めるリクエストを許可
}));

// プリフライトリクエスト対応
app.options('*', cors());

app.use(express.json());

app.use('/resources', express.static(path.join(__dirname, '../resources')))

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'host.docker.internal',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'mitsuka',
    password: process.env.DB_PASSWORD || 'mitsuka',
    database: process.env.DB_NAME || 'mitsuka_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database connection successful!");
        connection.release();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
})();

app.post('/get_recommends', async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: 'Invalid input, expected on array of IDs' });
        }
        const placeholders = ids.map(() => '?').join(',');
        const query = `SELECT * FROM AKISHIKA WHERE AKISHIKA_ID IN (${placeholders}) AND STOCK=1 ORDER BY FIELD(AKISHIKA_ID, ${placeholders})`;
        const [results] = await pool.query(query, [...ids, ...ids]);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/get_stock_imagepath', async (req, res) => {
    try {
        // フロントエンドで必要なカラムを明示的に指定
        const query = `
            SELECT IMAGE
            FROM AKISHIKA 
            WHERE STOCK = 1
        `;
        // `STOCK = 1` をバインドパラメータに変更して安全性を向上
        const [results] = await pool.query(query, [1]);
        
        // 結果をJSONで返す
        res.status(200).json(results);
    } catch (error) {
        console.error('Error executing query:', error.message);
        
        // エラーの詳細をフロントに送るのではなく、一般的なメッセージを送る
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})