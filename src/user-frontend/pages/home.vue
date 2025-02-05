<template>
  <div class="container">
    <LogoHeader />
    <div class="content-wrapper">
      <h2 class="title">おすすめ秋鹿ナビ</h2>
      <h3 class="subtitle">Akishika Recommendation Explore</h3>
      <p class="description">
        みつか坊主では、秋鹿酒造さんの日本酒を<br />多数の種類取り扱っています。
      </p>
      <!-- DBの画像を流す処理 -->
      <div class="top_image">
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-else class="carousel">
          <img
            v-for="(item, index) in sakeData"
            :key="index"
            :src="getImagePath(item)"
            :alt="`Sake bottle ${index + 1}`"
            class="sake-image"
          />
        </div>
      </div>
      <p class="recommendation-text">
        いくつかの質問に答えると、<br />
        今日のあなたにピッタリの日本酒を<br />
        オススメします♪
      </p>
      <div class="button-wrapper">
        <button @click="goToQuestions" class="recommendation-button pulse">
          おすすめを見つけに行く →
        </button>
      </div>
      <!-- コラム的なリンクセクション -->
      <div class="links-section">
        <h3 class="links-title">秋鹿の購入できるお店はこちら</h3>
        <ul class="links-list">
          <li><a href="https://maps.app.goo.gl/YxyZKAsbS1NRFDr19" target="_blank">樋口酒店</a></li>
          <li><a href="https://maps.app.goo.gl/goNd6CkiQRxHXYJX9" target="_blank">きりもと酒店</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>



<script>
import LogoHeader from '~/components/LogoHeader.vue';
import axios from 'axios';

export default {
  // ヘッダーを取得
  name: 'SakeRecommendationHome',
  components: {
    LogoHeader,
  },
  // 使用する変数の定義
  data() {
    return {
      sakeData: [], // サーバーから取得したデータを格納
      error: null, // エラーメッセージ
    };
  },
  // DBとの接続を行う。DBのIMAGEから画像のPATHを取得
  async created() {
    await this.getImageDataPath(); // データ取得
  },
  methods: {
    // templateから呼び出すメソッド。画像のパスをリターン
    getImagePath(sake) {
      return `http://localhost:3001${sake.IMAGE}`;
    },
    // ボタンクリック時に質問画面へ遷移する関数
    goToQuestions() {
      this.$router.push('/question'); // 質問画面に遷移
    },
    // DBへ接続する関数
    async getImageDataPath() {
      try {
        const response = await axios.post('http://localhost:3001/get_stock_imagepath', {});
        if (!response.data || response.data.length === 0) {
          throw new Error('データが取得できませんでした');
        }
        // sakeDataにはDBとの接続結果が格納されている。IMAGEのみがリスポンスに含まれている
        this.sakeData = response.data; // データを格納
        console.log('取得したデータ:', this.sakeData);
      } catch (error) {
        console.error('データ取得エラー:', error.message);
        this.error = 'データの取得中にエラーが発生しました。'; // エラー表示
      }
    },
  },
};
</script>



<style scoped>
.container {
  min-height: 100vh;
  background-color: #ffffff; 
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  padding: 20px; /* コンテンツの左右に余白 */
}

.title {
  font-size: 1.5rem; /* フォントサイズを大きく */
  font-weight: 700; /* 太字に変更 */
  text-align: center;
  background-color: #f97316;
  color: white;
  padding: 1rem;
  margin: 0;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 影を追加 */
}

.subtitle {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: #f97316;
  margin: 10px 0;
  letter-spacing: 1px; /* スペーシングを追加 */
}

.description {
  text-align: center;
  font-size: 1rem;
  line-height: 1.8;
  padding: 1rem;
  margin: 0;
  color: #374151;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.top_image {
  margin-top: 20px;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.carousel {
  display: flex;
  animation: rotate 50s linear infinite; /* 画像の回転速度を調整 */
  width: max-content; /* 画像がはみ出ないように調整 */
  gap: 1rem; /* 画像間のスペース */
}

.carousel img {
  width: 100px;
  height: auto;
  border-radius: 10px; /* 画像の丸み */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 軽い影を追加 */
  transition: transform 0.3s ease; /* ホバー時のエフェクト */
}

.carousel img:hover {
  transform: scale(1.05); /* ホバー時の拡大効果 */
}

@keyframes rotate {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%); /* すべての画像を左にスライド */
  }
}

.recommendation-text {
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.8;
  padding: 2rem 1rem; /* 上下に広めの余白 */
  margin: 20px 0;
  color: #374151;
  background-color: #ffe9dc; /* 優しいオレンジ色の背景 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 影を追加 */
}

.button-wrapper {
  padding: 1rem;
  margin-top: 0; /* 余計なスペースを削除 */
  display: flex;
  justify-content: center;
}


.recommendation-button {
  width: 100%;
  background-color: #f97316;
  color: white;
  font-weight: bold;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  font-size: 1.3rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.recommendation-button:hover {
  background-color: #ea580c;
  transform: translateY(-3px); /* ホバー時に少し浮かせる */
}

@media (min-width: 640px) {
  .title {
    font-size: 1.75rem;
  }
  .subtitle {
    font-size: 1.0rem;
  }

  .description, .recommendation-text {
    font-size: 1rem;
  }

  .content-wrapper {
    max-width: 640px;
  }
}

.links-section {
  bottom: 10px; /* 画面下からの距離 */
  right: 50%; /* 画面左から50%の位置に配置 */
  transform: translateX(+100%); /* 自分の幅の半分だけ左に移動して中央寄せ */
  width: 40%; /* 全体の幅を画面の約半分に調整 */
  background-color: #ffe9dc; /* 背景色 */
  border-radius: 8px; /* 角を丸く */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 影を追加 */
  padding: 1rem;
  text-align: center; /* テキストを中央揃え */
}
.links-title {
  font-size: 1.1rem;
  color: #000000;
  margin-bottom: 10px;
  text-align: center;
}

.links-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: center;
}

.links-list li {
  margin: 5px 0;
}

.links-list a {
  color: blue;
  text-decoration: underline;
  font-weight: bold;
  transition: color 0.3s ease;
}

.links-list a:hover {
  color: #ea580c;
}

</style>