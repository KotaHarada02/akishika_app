<template>
    <div class="modal">
      <div class="bg" @click="$emit('closeModal')"></div>
      <div class="modal-wrap">
        <button @click="$emit('closeModal')" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
          </svg>
        </button>
  
        <div class="content">
          <div class="section">
            <h2>種類</h2>
            <div class="button-group">
              <button
                v-for="(type, index) in types"
                :key="index"
                :class="['filter-button', { active: localSelectedType === type }]"
                @click="selectType(type)"
              >
                {{ type }}
              </button>
            </div>
          </div>
  
          <div class="section">
            <h2>在庫</h2>
            <div class="button-group">
              <button
                v-for="(stock, index) in stocks"
                :key="index"
                :class="['filter-button', { active: localSelectedStock === stock }]"
                @click="selectStock(stock)"
              >
                {{ stock }}
              </button>
            </div>
          </div>
  
          <button class="search-button" @click="search">検索</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {//親からデータを受け取る
        selectedType: {
            type: String,
            default: "全て"  // デフォルト値を設定
        },
        selectedStock: {
            type: String,
            default: "全て"  // デフォルト値を設定
        }
    },
    data() {
      return {
        types: ["全て", "純米酒", "純米吟醸", "純米大吟醸", "熟成種", "限定酒", "ハイボール", "カクテル"],
        stocks: ["全て", "有", "無"],
        localSelectedType: this.selectedType, // propsから初期化
        localSelectedStock: this.selectedStock // propsから初期化 
      };
    },
    watch: {//親からのデータが変わった瞬間に呼び出される
        selectedType(newType) {
            this.localSelectedType = newType; // 親からの更新を受け取る
        },
        selectedStock(newStock) {
            this.localSelectedStock = newStock; // 親からの更新を受け取る
        }
    },
    methods: {
      selectType(type) {
        this.localSelectedType = type;
      },
      selectStock(stock) {
        this.localSelectedStock = stock;
      },
      search() {
        // 親コンポーネントに種類と在庫を渡す
        this.$emit('search', {
          type: this.localSelectedType,
          stock: this.localSelectedStock
        });
        // モーダルを閉じる
        this.$emit('closeModal');
      }
    }
  };
  </script>
  
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-wrap {
    position: relative;
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    z-index: 1001;
    width: 90%;
    max-width: 500px;
  }
  
  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .close-button svg {
    width: 20px;
    height: 20px;
  }
  
  .content {
    margin-top: 1rem;
  }
  
  .section {
    margin-bottom: 2rem;
  }
  
  .section h2 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filter-button {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-button:hover {
    background: #f7fafc;
  }
  
  .filter-button.active {
    background: #FF8736;
    color: white;
    border-color: #FF8736;
  }
  
  .search-button {
    width: 100%;
    padding: 0.75rem;
    background: #FF8736;
    color: white;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }
  
  .search-button:hover {
    background: #FF8736;
  }
  </style>
  