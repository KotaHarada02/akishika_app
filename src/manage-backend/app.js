const express = require('express')
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express()
const port = 4001
const mysql = require('mysql2/promise');
const { log, Console } = require('console');
const fs = require('fs');
        
// CORSの設定
app.use(cors({
    origin: 'http://localhost:4000', // フロントエンドのURL
    methods: ['GET', 'POST'],
}));
        
// Multer設定 - 画像保存のカスタマイズ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../resources/img')); // 保存先ディレクトリ
    },
    filename: async(req, file, cb) => {

    const { id, name } = req.body;
    let uniqueName;
    try {
        if (id) {
        // id がある場合
        // 名前の重複チェック
        const checkQuery = 'SELECT COUNT(*) AS count FROM AKISHIKA WHERE AKISHIKA_NAME = ? AND AKISHIKA_ID != ?';
        const [rows] = await pool.query(checkQuery, [name, id])
        
        if (rows[0].count > 0) {
            return cb(new Error('指定された名前はすでに存在しています。')); // エラーをスローして処理停止
        }
        uniqueName = `test_id${id}.jpg`;
        const filePath = path.join(__dirname, '../resources/img', uniqueName);
        // 既存ファイルの削除
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        } else {
        // id がない場合
        // 名前の重複チェック
        const checkQuery = 'SELECT COUNT(*) AS count FROM AKISHIKA WHERE AKISHIKA_NAME = ? ';
        const [rows] = await pool.query(checkQuery, [name])
        
        if (rows[0].count > 0) {
            return cb(new Error('指定された名前はすでに存在しています。')); // エラーをスローして処理停止
        }
        const query = 'SELECT MAX(AKISHIKA_ID) AS max_id FROM AKISHIKA';
        const [result] = await pool.query(query);
        const maxId = result[0].max_id || 0;
        
        // 新しい名前の生成
        uniqueName = `test_id${maxId + 1}.jpg`;
        }
        cb(null, uniqueName); // ファイル名をコールバックに渡す
    } catch (error) {
        console.error('エラーが発生しました:', error);
        cb(error); // エラーをコールバックに渡す
    }
    }
});
        
     
// Multer設定 - 画像ファイルの保存先
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
    }
});
        
app.use(express.json());
        
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
        
(async () => {
    try {
        const connection = await pool.getConnection(); // 接続を取得
        console.log("Database connection successful!");
        connection.release(); // 接続を解放
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
})();
        
/*
app.get('/env_print', async (req, res) => {
    res.json([
    { 'host': process.env.DB_HOST },
    { 'port': process.env.DB_PORT },
    { 'user': process.env.DB_USER },
    { 'password': process.env.DB_PASSWORD },
    { 'db': process.env.DB_DATABASE }]);
})
*/
        
app.get('/get_list', async (req, res) => {
    try {
        const query = `SELECT AKISHIKA_ID, AKISHIKA_NAME, SAKE_TYPE, STOCK FROM AKISHIKA`;
        const results = await pool.query(query); //DBにクエリを送信する
        res.json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
        
app.post('/get_tuple', async(req, res) => {
    const { id } = req.body; // フロントエンドから送られてくるID
    if (!id) {
        return res.status(400).json({ error: 'Request error: ID is not specified.' });
    }
            
    const sqlQuery = 'SELECT * FROM AKISHIKA WHERE AKISHIKA_ID = ?';
    try {
        const [results] = await pool.query(sqlQuery, [id]); // awaitで非同期にクエリ実行
            
        if (results.length === 0) {
            return res.status(500).json({ error: 'An error occurred: The specified ID could not be found.' });
        }
            
        res.json(results[0]); // 取得したデータをフロントエンドに返す
        } catch (err) {
        console.error('クエリエラー:', err);
        return res.status(500).json({ error: 'An error occurred while retrieving data.' });
        }
});
        
app.post('/get_pic', async (req, res) => {
    const { imageId } = req.body; // フロントエンドから送られてくる画像ID
    if (!imageId) {
        return res.status(400).json({ error: 'Request error: Image ID is not specified.' });
            
    }
        
    // 画像ファイル名を決定
    //名前変更
    const imageFileName = `test_id${imageId}.jpg`;
    const imagePath = path.join(__dirname, '../resources/img', imageFileName); //pathの設定
        
    // 画像ファイルが存在するか確認
    if (fs.existsSync(imagePath)) {
        // 存在する場合、画像を返す
        res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('画像の送信中にエラーが発生しました:', err);
            return res.status(500).json({ error: 'An error occurred while sending the image.' });
            
        }
        });
    } else {
        // 存在しない場合、エラーレスポンスを返す
        return res.status(500).json({ error: 'An error occurred: The specified image could not be found.' });
    }
});     
        
app.post('/add_tuple', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Request error: Image file is not sent.' });
    }
        
    //フォームデータの取得
    const {name, type, alcoholPercentage, glassVolume, glassPrice, twoGoPrice, stockStatus, specialNotes } = req.body;
            
    //フォームデータの文字列から整数型変換
    const convertedAlcoholPercentage = parseInt(alcoholPercentage, 10) || 0;
    const convertedGlassVolume = parseInt(glassVolume, 10) || 0;
    const convertedGlassPrice = parseInt(glassPrice, 10) || 0;
    const convertedTwoGoPrice = parseInt(twoGoPrice, 10) || 0;
    const convertedStockStatus = stockStatus === "有" ? 1 : 0;
        
    //画像ファイルの保存パスの設定
    const imagePath = `/resources/img/${req.file.filename}`;
        try {
            //テーブルのIDの最大値を取得
            const [result] = await pool.query('SELECT MAX(AKISHIKA_ID) AS max_id FROM AKISHIKA');
            const maxId = result[0].max_id;
            const akishikaId = maxId + 1;
                
            const query = `
                INSERT INTO AKISHIKA
                (AKISHIKA_ID, AKISHIKA_NAME, SAKE_TYPE, ALCOHOL_CONTENT, GLASS_QUANTITY, GLASS_PRICE, NIGO_PRICE, FEATURE, STOCK, IMAGE)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
                
            const values = [
                akishikaId,
                name,
                type,
                convertedAlcoholPercentage,
                convertedGlassVolume,
                convertedGlassPrice,
                convertedTwoGoPrice,
                specialNotes,
                convertedStockStatus,
                imagePath,
            ];
                
            //SQLクエリを送信
            await pool.query(query, values);
                
            //レスポンス送信
            return res.status(200).json({
            message: '新しいデータが正常に追加されました。',
            formData: {
                akishikaId,
                name,
                type,
                alcoholPercentage: convertedAlcoholPercentage,
                glassVolume: convertedGlassVolume,
                glassPrice: convertedGlassPrice,
                twoGoPrice: convertedTwoGoPrice,
                stockStatus: convertedStockStatus,
                specialNotes,
                imagePath,
            },
            });
        }catch (error) {
            console.error('エラーが発生しました:', error);
            return res.status(500).json({ error: 'An error occurred.' });
        }
});

        
        
// change エンドポイント
app.post('/change_tuple', upload.single('image'), async (req, res) => {
    // フォームデータの取得
    const { id, name, type, alcoholPercentage, glassVolume, glassPrice, twoGoPrice, stockStatus, specialNotes } = req.body;
    
    if (!id) {
        return res.status(400).json({ error: 'Request error: ID is not specified.' });
    }
    
    // フォームデータを文字列型から整数型に変換
    const akishikaId = parseInt(id, 10);
    const convertedAlcoholPercentage = parseInt(alcoholPercentage, 10) || 0;
    const convertedGlassVolume = parseInt(glassVolume, 10) || 0;
    const convertedGlassPrice = parseInt(glassPrice, 10) || 0;
    const convertedTwoGoPrice = parseInt(twoGoPrice, 10) || 0;
    const convertedStockStatus = stockStatus === "有" ? 1 : 0;
    
    // 画像ファイルの保存パスの設定
    const imagePath = req.file ? `/resources/img/${req.file.filename}` : `/resources/img/test_id${akishikaId}.jpg`;
    
    try {
        // データの更新クエリ
        const query = `
            UPDATE AKISHIKA
            SET AKISHIKA_NAME = ?, SAKE_TYPE = ?, ALCOHOL_CONTENT = ?, GLASS_QUANTITY = ?, GLASS_PRICE = ?, 
                NIGO_PRICE = ?, FEATURE = ?, STOCK = ?, IMAGE = ?
            WHERE AKISHIKA_ID = ?`;
        
        const values = [
            name, type, convertedAlcoholPercentage, convertedGlassVolume, convertedGlassPrice, 
            convertedTwoGoPrice, specialNotes, convertedStockStatus, imagePath, akishikaId
        ];
        
        // SQLクエリを送信
        const [result] = await pool.query(query, values);
        
        // 結果の確認
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'An error occurred: The data for the specified ID could not be found.' });
        }
        
        // レスポンスの送信
        return res.status(200).json({
            message: 'データが正常に更新されました。',
            formData: {
                akishikaId, name, type, alcoholPercentage: convertedAlcoholPercentage, glassVolume: convertedGlassVolume,
                glassPrice: convertedGlassPrice, twoGoPrice: convertedTwoGoPrice, stockStatus: convertedStockStatus,
                specialNotes, imagePath
            }
        });
    } catch (error) {
        console.error('エラーが発生しました:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});      
        
app.post('/change_stock', async (req, res) => {
    try {
        //req.body.idsに入っているidを受け取る
        const ids = req.body.ids;
        // 変更後の在庫状態 (1: 有, 0: 無) を受け取る
        const change_value = req.body.change_value;
        if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Request error: Invalid input, expected an array of IDs.' });
        }
        // プレースホルダーを生成 (例: "?, ?, ?" のように配列の長さに応じて作成)
        const placeholders = ids.map(() => '?').join(',');
        // SQL クエリを動的に作成
        const query = `UPDATE AKISHIKA SET STOCK = ? WHERE AKISHIKA_ID IN (${placeholders})`;
        // クエリを実行し、結果を取得
        const results = await pool.query(query, [change_value, ...ids]);
        res.json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
                
app.get('/test_get', async (req, res) => {
    try {
        //全データ取得
        const [result] = await pool.query('SELECT * FROM AKISHIKA');
        res.json(result);
    } catch (error) {
        console.error('レコードの取得に失敗しました:', error);
        res.status(500).json({ error: error.message });
    }
});
        
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})