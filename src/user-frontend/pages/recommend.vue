<template>
  <div class="container">
    <LogoHeader />
    <div class="content-wrapper">

      <!-- ローディング表示 -->
      <div v-if="loading" class="loading-container">
        <div class="sake-bottle">
          <div class="liquid"></div>
        </div>
        <p class="loading-text">おすすめの秋鹿を選んでいます...</p>
      </div>

      <!-- エラー表示 -->
      <div v-else-if="error" class="error-message">
        {{ error }}
        <br />
        <button @click="goToTop" class="top-button">TOPに戻る</button>
      </div>

      <!-- メインコンテンツ -->
      <div v-else>

        <!-- 全てSOLDOUTの場合のメッセージ -->
        <div v-if="isSoldOut" class="sold-out-message">
          <!-- ルートの表示 -->
          <p class="user-route">
            <span v-for="(route, index) in userRoute" :key="index" class="route-item">
              {{ route }}
              <span v-if="index < userRoute.length - 1" class="route-arrow">→</span>
            </span>
          </p>
          <p>申し訳ございません。現在このルートのおすすめは完売しております。</p>
          <p>在庫のあるものをスタッフにお気軽に相談してください。</p>
          <button @click="goToTop" class="top-button">TOPに戻る</button>
        </div>

        <!-- 通常のおすすめ表示 -->
        <div v-else>
                  <!-- ルートの表示 -->
          <p class="user-route">
            <span v-for="(route, index) in userRoute" :key="index" class="route-item">
              {{ route }}
              <span v-if="index < userRoute.length - 1" class="route-arrow">→</span>
            </span>
          </p>

          <h1 class="title">を選んだあなたにおすすめの秋鹿は...</h1>
          <div class="recommendations">

            <!-- 1位の表示 -->
            <div class="sake-card sake-card-first">
              <div :class="['sake-number', getNumberClass(0)]">
                  {{ 1 }}
              </div>
              <div class="sake-card-content">
                <img :src="getImagePath(recommendations[0])" :alt="recommendations[0].AKISHIKA_NAME" class="sake-image" />
                <div class="sake-details">
                  <h2 class="sake-name">{{ recommendations[0].AKISHIKA_NAME }}</h2>
                  <p v-if="recommendations[0].AKISHIKA_ID !== 'SOLD_OUT'" class="sake-type">
                    {{ recommendations[0].SAKE_TYPE }}, アルコール{{ recommendations[0].ALCOHOL_CONTENT }}度
                  </p>
                  <p class="sake-description">{{ recommendations[0].FEATURE }}</p>
                  <p v-if="recommendations[0].AKISHIKA_ID !== 'SOLD_OUT'" class="sake-price">
                    {{ recommendations[0].GLASS_QUANTITY }}ml: ¥{{ recommendations[0].GLASS_PRICE }},
                    2合: ¥{{ recommendations[0].NIGO_PRICE || '2合なし' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 2位と3位の表示 -->
            <div class="recommendations-sub">
              <template v-for="(sake, index) in recommendations.slice(1, 3)">
                <div v-if="index < 2" :key="sake.AKISHIKA_ID" class="sake-card sake-card-sub">
                  <div :class="['sake-number', getNumberClass(index + 1)]">{{ index + 2 }}</div>
                  <img :src="getImagePath(sake)" :alt="sake.AKISHIKA_NAME" class="sake-image-sub" />
                  <h2 class="sake-name-sub">{{ sake.AKISHIKA_NAME }}</h2>
                  <p v-if="sake.AKISHIKA_ID !== 'SOLD_OUT'" class="sake-type-sub">
                    {{ sake.SAKE_TYPE }},<br />アルコール{{ sake.ALCOHOL_CONTENT }}度
                  </p>
                  <p class="sake-description-sub">{{ sake.FEATURE }}</p>
                  <p v-if="sake.AKISHIKA_ID !== 'SOLD_OUT'" class="sake-price-sub">
                    {{ sake.GLASS_QUANTITY }}ml: ¥{{ sake.GLASS_PRICE }},<br />
                    2合: ¥{{ sake.NIGO_PRICE || '2合なし' }}
                  </p>
                </div>
              </template>
            </div>
          </div>
          <p class="order-message">注文はお近くのスタッフまで</p>
          <button @click="goToTop" class="top-button">TOPに戻る</button>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- 秋鹿が買えるお店 -->
<!-- https://maps.app.goo.gl/YxyZKAsbS1NRFDr19 -->
<!-- https://maps.app.goo.gl/goNd6CkiQRxHXYJX9 -->
<script>
import axios from 'axios';
import LogoHeader from '~/components/LogoHeader.vue'

export default {
  name: 'RecommendPage',
  components: {
    LogoHeader
  },
  data() {
    return {
      // 変数の定義
      userAnswers: [],
      userRoute: [],
      questionIdentifier: 0,
      recommendations: [],
      loading: true,
      error: null,
      // 結果のidsを保存する変数。このリストを変更することで結果を変更させることができる
      // 今後の目標：idsの内容をjsonなどで保存し、そこからデータを取得すればコードを簡潔に書ける。
      sakeRecommendations: {
        21: [1,29,27,26,19],
        111: [45,10,5,12,6,4],
        112: [46,12,5,11,4],
        121: [26,25,37,17,28],
        122: [42,4,9,36],
        221: [10,11,2,3,45],
        222: [29,26,1,17,8],
        231: [47,42,43,14,10],
        232: [43,14,10,42,47],
        241: [4,42,36,24],
        242: [7,23,32,37,24],
        311: [4,42,14,36,34],
        312: [13,30,34,36,33],
        313: [27,18,6,7,4],
        314: [34,31,41,37,32],
        315: [6,4,27,14,18],
        316: [6,25,4,41,18],
        317: [13,30,34,32,23],
        321: [4,42,43,14],
        322: [1,48,26,5,13],
        323: [34,31,41,37,32],
        324: [7,23,10,37,24],
        325: [1,48,26,5,13],
        326: [27,18,6,7,4],
        331: [10,11,8,45,27],
        332: [42,43,47,4,7],
      },
    };
  },
  computed: {
    isSoldOut(){
      // 1位のおすすめが存在し、かつ "SOLD OUT" である場合に true を返す
      return this.recommendations.length > 0 && this.recommendations[0].AKISHIKA_ID === 'SOLD_OUT';
    }
  },
  async created() {
    // データのセットを行う。quetionsの結果を格納する。
    try {
      if (this.$route.query.answers && this.$route.query.identifier) {
        this.userAnswers = JSON.parse(this.$route.query.answers);
        this.userRoute = JSON.parse(this.$route.query.route);
        this.questionIdentifier = parseInt(this.$route.query.identifier);
        // バックエンドとの接続
        await this.generateRecommendations();
      }
    } catch (error) {
      console.error('Error in created hook:', error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // おすすめ順に色を変更する
    getNumberClass(index) {
      if (index === 0) return 'gold';
      if (index === 1) return 'silver';
      return 'bronze';
    },
    // 画像のパスを変更する。sakeの結果が保存されている。sake.IMAGEでDBの内容が保存されている。
    getImagePath(sake) {
      return `http://localhost:3001${sake.IMAGE}`;
    },
    async generateRecommendations() {
      try {
        console.log('Recommend userAnswers',this.questionIdentifier)
        const ids = this.sakeRecommendations[this.questionIdentifier] || [];
        console.log('ids', ids);
  // バックエンドにidsを渡す
        const response = await axios.post('http://localhost:3001/get_recommends', {
          ids: ids
        });

        if (!response.data) throw new Error('データが取得できませんでした');
        // バックエンドからのデータを整形。
        this.recommendations = this.processRecommendations(response.data);
        console.log(response);
        // データがない場合はないことを知らせるメッセージをerrorにセット
        if (this.recommendations.length === 0) {
          this.error = 'おすすめの秋鹿は見つかりませんでした。再度選択をお願いします。';
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = 'データの取得中にエラーが発生しました。';
        this.recommendations = this.getDefaultRecommendations();
      }
    },

    processRecommendations(recommendations) {
      // 結果が2個以下ならSOLDOUTのデータをセット
      if (recommendations.length <= 2) {
        const soldOutData = {
          AKISHIKA_ID: 'SOLD_OUT',
          AKISHIKA_NAME: 'SOLD OUT',
          FEATURE: '現在、在庫がありません。',
          GLASS_QUANTITY: '',
          GLASS_PRICE: '',
          NIGO_PRICE: '',
          IMAGE: '/resources/img/sold_out_img.jpg'
        };
        
        while (recommendations.length < 3) {
          recommendations.push({ ...soldOutData });
        }
        // 4個以上なら結果を3個になるようにスライス
      } else if (recommendations.length > 3) {
        recommendations = recommendations.slice(0, 3);
      }
      // 結果が3個の時
      return recommendations;
    },
    // デフォルトデータ。エラー時に表示するデータをここに記述。→なくてもいい
    getDefaultRecommendations() {
      return [
        {
          AKISHIKA_ID: 10,
          AKISHIKA_NAME: "秋鹿 純米吟醸",
          FEATURE: "バランスの良い味わい, アルコール15度",
          GLASS_QUANTITY: "90ml",
          GLASS_PRICE: 700,
          NIGO_PRICE: 1900,
          IMAGE: "test_id1.jpg"
        },
        {
          AKISHIKA_ID: 11,
          AKISHIKA_NAME: "秋鹿 特別純米",
          FEATURE: "コクのある味わい, アルコール15.5度",
          GLASS_QUANTITY: "90ml",
          GLASS_PRICE: 650,
          NIGO_PRICE: 1800,
          IMAGE: "test_id1.jpg"
        },
        {
          AKISHIKA_ID: 12,
          AKISHIKA_NAME: "秋鹿 純米",
          FEATURE: "すっきりとした味わい, アルコール15度",
          GLASS_QUANTITY: "90ml",
          GLASS_PRICE: 600,
          NIGO_PRICE: 1700,
          IMAGE: "test_id1.jpg"
        }
      ];
    },
    // トップへ戻る関数
    goToTop() {
      this.$router.push('/home')
    }
  }
};
</script>
<style scoped>
.container {
  min-height: 100vh;
  background-color: #ffffff;
  max-width: 430px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-wrapper {
  padding: 1rem 0;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: left;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-route {
  background-color: #f3f4f6; /* 背景色を淡いグレーに */
  border: 1px solid #e5e7eb; /* ボーダーを追加 */
  border-radius: 0.5rem; /* 角を丸くする */
  padding: 0.5rem 1rem; /* 内側の余白を調整 */
  font-size: 0.8rem; /* フォントサイズを調整 */
  color: #374151; /* 文字色をダークグレーに */
  display: flex; /* フレックスレイアウトで整列 */
  flex-wrap: wrap; /* アイテムが多い場合は折り返し */
  gap: 0.5rem; /* アイテム間の隙間 */
  align-items: center; /* 垂直方向の中央揃え */
  font-weight: bold;
}

.route-item {
  display: flex; /* 矢印とテキストを並べる */
  align-items: center; /* 矢印とテキストを中央揃え */
}

.route-arrow {
  margin: 0 0.25rem; /* 矢印の前後にスペースを追加 */
  color: #f97316; /* 矢印をオレンジ色に変更 */
  font-weight: bold; /* 矢印を目立たせる */
}

.sold-out-message {
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #ffe4e1;
  border: 1px solid #ffccd5;
  border-radius: 8px;
  color: #e63946;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5;
}

/* 1位のカードスタイル */
.sake-card-first {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  position: relative;
}

.sake-card-content {
  display: flex;
  gap: 1rem;
}

.sake-image {
  width: 100px;
  height: 120px;
  object-fit: contain;
}

.sake-details {
  flex: 1;
}

/* 2位・3位のカードスタイル */
.recommendations-sub {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.sake-card-sub {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  position: relative;
  text-align: center;
}

.sake-image-sub {
  width: 80px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.sake-number {
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  background-color: #f97316; /* デフォルト色 */
  color: white;
  width: 2rem; /* 幅を調整 */
  height: 1.5rem; /* 高さを調整 */
  border-radius: 0rem 0rem 0.3rem 0.3rem; /* 上部だけ丸くする */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;

}

.sake-number::after {
  content: ''; /* 長方形部分を生成 */
  position: absolute;
  bottom: -0.3rem; /* 下にずらす */
  left: 25%; /* 長方形を中央に配置 */
  width: 50%; /* 長方形の幅 */
  height: 0.5rem; /* 長方形の高さ */
  background-color: inherit; /* 親と同じ背景色 */
}

.sake-number.gold {
  background-color: #ffd700; /* 金色 */
}

.sake-number.silver {
  background-color: #c0c0c0; /* 銀色 */
}

.sake-number.bronze {
  background-color: #cd7f32; /* 銅色 */
}


.sake-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.sake-name-sub {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.sake-type,
.sake-type-sub {
  font-size: 0.8rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.sake-description,
.sake-description-sub {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.sake-price,
.sake-price-sub {
  font-size: 0.8rem;
  color: #374151;
}

.order-message {
  text-align: center;
  margin: 1.5rem 0;
  font-size: 1rem;
  color: #374151;
}

.top-button {
  display: block;
  width: 100%;
  background-color: #f97316;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.top-button:hover {
  background-color: #ea580c;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.sake-bottle {
  width: 60px;
  height: 120px;
  background-color: #f3f4f6;
  border-radius: 0 0 30px 30px;
  position: relative;
  overflow: hidden;
}

.liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background-color: #f97316;
  animation: fill 2s ease-in-out infinite;
}

@keyframes fill {
  0%, 100% { height: 0; }
  50% { height: 100%; }
}

.loading-text {
  margin-top: 1rem;
  font-size: 1rem;
  color: #4b5563;
}

.error-message {
  color: #dc2626;
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #fee2e2;
  border-radius: 0.5rem;
}

.no-recommendation-message {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.sold-out {
  position: relative;
  opacity: 0.7;
}

.sold-out::after {
  content: 'SOLD OUT';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 2rem;
  font-weight: bold;
  color: #ff4136;
  border: 3px solid #ff4136;
  padding: 0.5rem 1rem;
  pointer-events: none;
}

.sold-out-text {
  text-align: center;
  font-weight: bold;
  color: #ff4136;
  margin-top: 1rem;
}

.sake-card-sub.sold-out,
.sake-card-first.sold-out {
  opacity: 0.7;
}

.sake-card-sub.sold-out .sake-image-sub,
.sake-card-first.sold-out .sake-image {
  filter: grayscale(100%);
}

.sake-card-sub.sold-out::after,
.sake-card-first.sold-out::after {
  content: 'SOLD OUT';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff4136;
  border: 3px solid #ff4136;
  padding: 0.5rem 1rem;
  pointer-events: none;
}
</style>