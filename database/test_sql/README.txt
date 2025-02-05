DockerのコンテナにSQLファイルをコピー
以下のXXX を 変更する
docker cp ./database/test_sql/XXX.sql db:/tmp/XXX.sql

使う時（DBコンテナで、Mysql起動後）
SOURCE /tmp/XXX.sql;

※テストデータ入れる前はデータ削除する
DELETE FROM AKISHIKA;

ALTER TABLE `AKISHIKA` auto_increment = 1;