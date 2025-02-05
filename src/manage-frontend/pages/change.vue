<template>
  <div class="form-header">
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
      <span class="logo-text-black">B</span>
      <span class="logo-text-orange">O</span>
      <span class="logo-text-black">S</span>
      <span class="logo-text-black">E</span>
    </div>
    <h2 class="form-title">変更したい秋鹿の情報を入力してください</h2>
    <form @submit.prevent="submitForm">
    <div class="form-group" style="padding-left: 300px; padding-right: 400px;">
        <label for="id" class="label-left" style="margin-right: 10px;">ID
          <span class="font">※IDは変更できません</span>
        </label>
        <input type="text" id="id" v-model="formData.id" required disabled>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 400px;">
      <label for="name" class="label-left">名前
        <span class="btn-required required">必須</span>
      </label>
      <input type="text" id="name" v-model="formData.name" required>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 383px;">
      <label for="type" class="label-left">種類
        <span class="btn-required required">必須</span>
      </label>
      <select id="type" v-model="formData.type" required>
        <option value="" disabled selected>選択してください</option>
        <option value="純米酒">純米酒</option>
        <option value="純米吟醸">純米吟醸</option>
        <option value="純米大吟醸">純米大吟醸</option>
        <option value="熟成種">熟成種</option>
        <option value="限定酒">限定酒</option>
        <option value="ハイボール">ハイボール</option>
        <option value="カクテル">カクテル</option>
      </select>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 354px;">
      <label for="alcoholPercentage" class="label-left">アルコール度数</label>
      <div class="input-with-unit">
        <input type="number" id="alcoholPercentage" v-model="formData.alcoholPercentage" min="0">
        <span class="unit">度</span>
      </div>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 345px;">
      <label for="glassVolume" class="label-left">グラス量</label>
      <div class="input-with-unit">
        <input type="number" id="glassVolume" v-model="formData.glassVolume" min="0">
        <span class="unit">ml</span>
      </div>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 354px;">
      <label for="glassPrice" class="label-left">グラス価格
        <span class="btn-required required">必須</span>
      </label>
      <div class="input-with-unit">
        <input type="number" id="glassPrice" v-model="formData.glassPrice" min="0" required>
        <span class="unit">円</span>
      </div>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 354px;">
      <label for="twoGoPrice" class="label-left">2合価格</label>
      <div class="input-with-unit">
        <input type="number" id="twoGoPrice" v-model="formData.twoGoPrice" min="0">
        <span class="unit">円</span>
      </div>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 383px;">
      <label for="stockStatus" class="label-left">在庫状態
        <span class="btn-required required">必須</span>
      </label>
      <select id="stockStatus" v-model="formData.stockStatus" required>
        <option value="" disabled selected>選択してください</option>
        <option value="有">有</option>
        <option value="無">無</option>
      </select>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 320px;">
      <label for="specialNotes" class="label-left">特徴
        <span class="btn-required required">必須</span>
      </label>
      <textarea id="specialNotes" v-model="formData.specialNotes" rows="4" required></textarea>
    </div>
    <div class="form-group" style="padding-left: 300px; padding-right: 300px;">
      <label for="imageUpload" class="label-left">画像アップロード
        <span class="btn-required required">必須</span>
      </label>
      <div class="file-upload">
        <label for="fileInput" class="file-upload-bar">
          ファイルを選択する
          <input type="file" id="fileInput" accept="image/*" @change="previewImage" />
        </label>
      </div>
      <div class="image-preview">
        <img v-if="formData.image" :src="formData.image" alt="プレビュー画像" />
      </div>
    </div>
    <div class="form-actions" style="padding-left: 180px; padding-right: 180px;">
      <button type="button" class="btn btn-cancel" @click="cancelForm">キャンセル</button>
      <button type="submit" class="btn btn-save" @click="changeForm">変更を保存</button>
    </div>
  </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        id: '',
        name: '',
        type: '',
        alcoholPercentage: '',
        glassVolume: '',
        glassPrice: '',
        twoGoPrice: '',
        stockStatus: '',
        specialNotes: '',
        image: null
      },
      selectedFile: null,
    };
  },
  created() {
    // クエリパラメータからIDを取得
    const id = this.$route.query.id;
    if (!id) {
      alert("IDが指定されていません。");
      this.$router.push('/'); // トップページにリダイレクト
      return;
    }

    this.formData.id = id; // フォームデータにIDを設定

    // IDを基にデータを取得
    fetch(`http://localhost:4001/get_tuple`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // IDをサーバーに送信
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("データ取得に失敗しました。");
      }
      return response.json();
    })
    .then((data) => {
      console.log('受け取ったデータ:', data);
      // レスポンスデータをフォームに反映
      this.formData.name = data.AKISHIKA_NAME || '';
      this.formData.type = data.SAKE_TYPE || '';
      this.formData.alcoholPercentage = data.ALCOHOL_CONTENT || '';
      this.formData.glassVolume = data.GLASS_QUANTITY || '';
      this.formData.glassPrice = data.GLASS_PRICE || '';
      this.formData.twoGoPrice = data.NIGO_PRICE || '';
      this.formData.stockStatus = data.STOCK === 1 ? '有' : '無'; // 在庫状況を変換
      this.formData.specialNotes = data.FEATURE || '';

      // ここで画像データを取得
      fetch('http://localhost:4001/get_pic', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: data.AKISHIKA_ID // 画像IDをサーバーに送信
        }),
      })
      .then(response => response.blob()) // 画像をBlob形式で受け取る
      .then(imageBlob => {
        const imageUrl = URL.createObjectURL(imageBlob); // BlobをURLに変換
        this.formData.image = imageUrl; // フォームデータに画像URLを設定
      })
      .catch(error => {
        console.error('画像取得エラー:', error);
      });
    })
    .catch((error) => {
      console.error("データ取得エラー:", error);
      alert("データの取得に失敗しました。");
    });
  },

  mounted() {
    // マウスホイール操作を無効化
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach((input) => {
      input.addEventListener('wheel', this.preventScroll, { passive: false });
    });
  },

  methods: {
    // キャンセルボタンの処理
    cancelForm() {
      this.$router.push('/'); // トップページに戻る
    },
    preventScroll(event) {
      // ホイール操作を無効化
      event.preventDefault();
    },

    // 画像選択時のプレビュー処理
    previewImage(event) {
      const file = event.target.files[0]; // 選択されたファイルを取得
      if (file && file.type.startsWith('image/')) { // 画像ファイルであるか確認
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.image = e.target.result; // プレビュー用URLを設定
        };
        reader.readAsDataURL(file); // ファイルをBase64形式で読み込む
        this.selectedFile = file; // 選択されたファイルを保持
      } else {
        alert('画像ファイルを選択してください。');
        this.formData.image = null;
        this.selectedFile = null;
      }
    },

    // フォームデータの送信処理
    changeForm() {
      const formData = new FormData();

      if (!this.formData.name) {
        alert("名前を入力してください。");
        return;
      }
      if (!this.formData.type) {
        alert("種類を選択してください。");
        return;
      }
      if (!this.formData.glassPrice) {
        alert("グラス価格を入力してください。");
        return;
      }
      if (!this.formData.stockStatus) {
        alert("在庫を選択してください。");
        return;
      }
      if (!this.formData.specialNotes) {
        alert("特徴を入力してください。");
        return;
      }
      // フォームデータを追加
      formData.append('id', this.formData.id);
      formData.append('name', this.formData.name);
      formData.append('type', this.formData.type);
      formData.append('alcoholPercentage', this.formData.alcoholPercentage);
      formData.append('glassVolume', this.formData.glassVolume);
      formData.append('glassPrice', this.formData.glassPrice);
      formData.append('twoGoPrice', this.formData.twoGoPrice);
      formData.append('stockStatus', this.formData.stockStatus);
      formData.append('specialNotes', this.formData.specialNotes);
      formData.append('image', this.selectedFile);

      // FormDataの中身をコンソールで確認
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // サーバーにデータを送信
      fetch("http://localhost:4001/change_tuple", {
        method: "POST",
        body: formData,
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("更新に失敗しました。");
        }
        return response.json(); // サーバーからのレスポンスを取得
      })
      .then((data) => {
        console.log("サーバーからの応答:", data);
        console.log("返されたフォームデータ:", data.formData);
        this.$router.push("/"); // 更新後にトップページへ移動
      })
      .catch((error) => {
        console.error("エラー:", error);
        alert(`更新に失敗しました: ${error.message}`);
      });
    },
  },
}
</script>



<style scoped>
.warehouse-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.form-header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.logo-text-orange {
  color: #FF8736;
}

.logo-text-black {
  color: #000;
}

.form-title {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
/* Chrome, Safari, Edge 用 */
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.label-left{
  text-align: left;
  display: block
}

.input-with-unit {
  display: flex;
  align-items: center;
}

.input-with-unit input {
  flex-grow: 1;
  margin-right: 5px;
}

.unit {
  flex-shrink: 0;
}

.file-upload-bar {
  display: block;
  width: 25%; /* 横幅を100%に拡張 */
  max-width: 500px; /* 最大幅 */
  background-color: #d1d1d1;
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 10px 20px;
  text-align: center;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.file-upload-bar:hover {
  background-color: #e9e9e9;
  border-color: #777;
}

.file-upload input[type="file"] {
  display: none;
}

.image-preview {
  text-align: center;
  margin-top: 20px;
}

.image-preview img {
  border: 2px solid #ddd;
  border-radius: 5px;
  max-width: 100%;
  height: auto;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-cancel {
  background-color: #ccc;
  color: #000;
}

.btn-save {
  background-color: #FF8736;
  color: #fff;
}

.required {
  background-color: #FF8736;
  color: #fff;
}

.btn-required{
  margin-left: 5px;
  padding: 5px 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.font{
margin-left: 6px;
font-size: 10px;
}
</style>
