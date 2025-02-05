<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">
        <div class="logo-text">
          <span class="logo-text-orange">M</span>
          <span class="logo-text-orange">I</span>
          <span class="logo-text-black">T</span>
          <span class="logo-text-orange">S</span>
          <span class="logo-text-black">U</span>
          <span class="logo-text-black">K</span>
          <span class="logo-text-black">A</span>
        </div>
        <div class="logo-text">
          <span class="logo-text-orange">&nbsp;</span>
          <span class="logo-text-orange">&nbsp;</span>
          <span class="logo-text-orange">&nbsp;</span>
          <span class="logo-text-black">B</span>
          <span class="logo-text-orange">O</span>
          <span class="logo-text-black">S</span>
          <span class="logo-text-black">E</span>
        </div>
      </div>
      <h1 class="app-title">秋鹿管理アプリ</h1>
      <nav class="navigation">
        <a href="#" class="nav-item active">秋鹿管理画面</a>
        <a href="#" class="nav-item">アプリ質問管理画面</a>
        <a href="#" class="nav-item">使用ガイド</a>
      </nav>
    </header>
  </div>   
  <div class="content bg-gray-100 min-h-screen p-6">
  <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-4">以下の秋鹿の在庫を全て「{{ stockStatus }}」に変更しますか？</h2>
    <table class="w-full mb-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-left">ID</th>
          <th class="p-2 text-left">名前</th>
          <th class="p-2 text-left">種類</th>
          <th class="p-2 text-left">現在の在庫</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id" class="border-b">
        <td class="p-2">{{ item.id }}</td>
        <td class="p-2">{{ item.name }}</td>
        <td class="p-2">{{ item.type }}</td>
        <td class="p-2">{{ item.inStock ? '有' : '無' }}</td>
      </tr>
    </tbody>
    </table>
    <div class="form-actions" style="padding-left: 100px; padding-right: 100px;">
      <button type="button" class="btn btn-cancel" @click="handleCancel">キャンセル</button>
      <button type="submit" class="btn btn-save" @click="handleConfirm">変更を保存</button>
    </div>
  </div>
</div>

</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'InventoryEditor',
  setup() {
    const items = ref([]);
    const stockStatus = ref('');
    const route = useRoute();
    const router = useRouter();

     // キャンセルボタンを押したときの処理
    const handleCancel = () => {
      router.push('/');
    }

    // 確認ボタンを押したときの処理
    const handleConfirm = async () => {
      // 変更したいアイテムのIDと在庫状態を集める
      const ids = items.value.map(item => item.id); // アイテムのIDを抽出
      const changeValue = stockStatus.value === '有' ? 1 : 0; // 在庫状態を1か0に変換

      try {
        // サーバーへ在庫状態を変更するリクエストを送信
        const response = await fetch('http://localhost:4001/change_stock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ids: ids, // アイテムIDのリスト
            change_value: changeValue, // 変更する在庫値（1または0）
          }),
        });

        if (!response.ok) {
          throw new Error('在庫の変更に失敗しました');
        }

        const data = await response.json(); // サーバーからのレスポンスをJSONとして受け取る
        console.log('在庫変更成功:', data);
        router.push('/'); // トップページに遷移
      } catch (error) {
        console.error('エラー:', error);
        alert(`エラー: ${error.message}`);
      }
    };

    // コンポーネントがマウントされた際に実行される処理
    onMounted(() => {
      // URLのクエリパラメータからアイテム情報を取得
      if (route.query.items) {
        items.value = JSON.parse(route.query.items);  // クエリパラメータからアイテムのリストをパースしてセット
      }
      stockStatus.value = route.query.stockStatus || '有';
    });

    return {
      items,
      stockStatus,
      handleCancel,
      handleConfirm,
    }
},
}
</script>


<style scoped>
.app-container {
  font-family: Arial, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  background-color: white;
}

.header {
  background-color: #f0f0f0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}

.logo {
  font-weight: bold;
  font-size: 18px;
}

.logo-text-orange {
  color: #FF8736;
}

.logo-text-black {
  color: #000;
}

.app-title {
  color: #FF8736;
  font-size: 18px;
  margin: 0 20px;
}

.navigation {
  display: flex;
  padding: 10px 0;
}

.nav-item {
  text-decoration: none;
  color: #666;
  margin-right: 20px;
  font-size: 14px;
  padding-bottom: 5px;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #000;
}

.nav-item.active {
  font-weight: bold;
  color: #000;
  border-bottom: 2px solid #000;
}

.content {
  padding: 10px;
}

.action-row,
.search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status-change {
  display: flex;
  align-items: center;
}

.status-change select {
  margin: 0 10px;
  padding: 5px;
}

.search-input {
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 10px;
}

.search-input input {
  width: 200px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-orange {
  background-color: #FF8736;
  color: white;
}

.btn-search,
.btn-filter {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.filter-icon {
  margin-right: 5px;
}

.filter-options {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.warehouse-table {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.row-even {
  background-color: #f9f9f9;
}

input[type="checkbox"] {
  margin: 0;
}

.btn-orange {
  padding: 5px 10px;
  font-size: 12px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn-save {
  background-color: #FF8736;
  color: #fff;
}
</style>
