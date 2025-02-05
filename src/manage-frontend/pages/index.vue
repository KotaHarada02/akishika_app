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
      <a href="https://mitsuka-bose.notion.site/4dfdafc5f6da49ca8da031a99e24d11d" 
         class="nav-item" 
         target="_blank" 
         rel="noopener noreferrer">使用ガイド</a>
    </nav>
    </header>
    <div class="content">
      <div class="action-row">
        <div class="action-group">
          <span class="action-text">チェック入れた{{ checkedItemCount }}項目を在庫</span>
          <select v-model="selectedStockStatus" class="select-box">
            <option value="有">有</option>
            <option value="無">無</option>
          </select>
          に
          <button class="btn btn-orange" @click="navigate">変更</button>
        </div>
        <button class="btn btn-orange" @click="add">+ 秋鹿の追加</button>
      </div>
      <hr class="thin-line" />

      <div class="search-row">
        <div class="search-input">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="秋鹿の名前で検索"
          >
          <button @click="toggleFilter=true" class="btn-filter">
            <span class="filter-icon">≡</span>
            絞り込み
          </button>
          <Modal @closeModal="toggleFilter=false"
          v-if="toggleFilter"
          :selectedType="selectedType" 
          :selectedStock="selectedStock"
          @search="applyFilter"/>
        </div>
      </div>

      <div class="warehouse-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>名前</th>
            <th>種類</th>
            <th>在庫</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems"
          :key="item.id"
          :class="{ 'row-even': item.id % 2 === 0 }">
            <td><input type="checkbox" v-model="item.checked"></td>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.inStock ? '有' : '無' }}</td>
            <td><button class="btn btn-orange" @click="navigateToChange(item)">変更</button></td>
          </tr>
        </tbody>
      </table>
    </div>
   </div>
  </div>
</template>

<script>
  import Modal from '@/pages/modal.vue';
  import { ref } from 'vue';

  definePageMeta({
    middleware: ['auth'],
  });

  export default {
  name: 'WarehouseManagement',
  components: {
    Modal
  },
  data() {
      return {
      searchTerm: '',
      selectedStockStatus: '有',
      warehouseItems: [],
      toggleFilter: false,
      selectedType: '全て',
      selectedStock: '全て',
      }
  },
  computed: {
    filteredItems() {
      return this.warehouseItems.filter(item => {
        const matchesSearch = item.name.includes(this.searchTerm);
        const matchesType = this.selectedType === '全て' || item.type === this.selectedType;
        const matchesStock = this.selectedStock === '全て' || (item.inStock ? '有' : '無') === this.selectedStock;
        
        return matchesSearch && matchesType && matchesStock;
      });
    },

    checkedItemCount() {
      return this.warehouseItems.filter(item => item.checked).length;
    },

  },
  mounted() {
      // コンポーネントがマウントされた後にデータを取得
      this.fetchWarehouseItems();
    },
  methods: {
    async fetchWarehouseItems() {
      try {
        const response = await fetch('http://localhost:4001/get_list');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const data = await response.json();
        // データベースの結果を`warehouseItems`にマッピング
        this.warehouseItems = data.map((item) => ({
          id: item.AKISHIKA_ID,
          name: item.AKISHIKA_NAME,
          type: item.SAKE_TYPE,
          inStock: item.STOCK === 1, // `STOCK`が1ならtrue、0ならfalse
          checked: false, // 初期値
        }));
      } catch (error) {
        console.error('エラー:', error);
        alert(`データの取得に失敗しました: ${error.message}`);
      }
    },

    applyFilter({ type, stock }) {
      this.selectedType = type;
      this.selectedStock = stock;
    },

    search() {
    },

    navigate() {
      // チェックされたアイテムのみ抽出
      const selectedItems = this.warehouseItems.filter(item => item.checked);

      if (selectedItems.length === 0) {
        alert('項目を選択してください。');
        return;
      }

      const allValid = selectedItems.every(item =>
        (item.inStock && this.selectedStockStatus === '無') ||
        (!item.inStock && this.selectedStockStatus === '有')
      );

      if (allValid) {
        // 在庫の状態を変更するページに遷移
        this.$router.push({
          path: '/stock',
          query: {
            items: JSON.stringify(selectedItems),
            stockStatus: this.selectedStockStatus
          }
        });
      } else {
        alert('選択された項目の在庫状態を変更できません。');
      }
    },

    add(){
      this.$router.push({
          path: '/addition',
        });
    },

    navigateToChange(item) {
      this.$router.push({
        path: '/change',
        query: {
          id: item.id,
          name: item.name,
          type: item.type,
          inStock: item.inStock ? '有' : '無'
        }
      });
    }
  }
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
  margin: 0;
}

.thin-line {
  border: none;
  border-bottom: 0.5px solid #454545;
  margin: 0;
}

.navigation {
  display: flex;
  padding: 10px 10px 0;
}

.nav-item {
  text-decoration: none;
  color: #666;
  margin-right: 10px;
  font-size: 10px;
  padding-bottom: 10px;
}

.nav-item.active {
  font-weight: bold;
  color: #000;
  border-bottom: 2px solid #000;
}

.content {
  padding: 10px;
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.action-group {
  display: flex;
  align-items: center;
}

.action-text {
  font-size: 14px;
  margin-right: 10px;
}

.select-box {
  padding: 5px;
  margin-right: 10px;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-orange {
  background-color: #FF8736;
  color: white;
}

.thin-line {
  border: none;
  border-bottom: 1px solid hsl(0, 0%, 27%);
  margin-bottom: 5px;
}

.action-row, .search-row {
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
  flex-grow: 0; 
  width: 200px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-orange {
  background-color: #FF8736;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-filter {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
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

th, td {
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
</style>