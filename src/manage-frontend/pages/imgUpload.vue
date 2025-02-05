<template>
    <div>
        <h1>画像アップロード</h1>
        <input type="file" @change="handleFileUpload" />
        <button @click="submitImage">アップロード</button>
    </div>
    </template>
    
    <script>
    import axios from 'axios';
    
    export default {
      data() {
        return {
          selectedFile: null,
        };
      },
      methods: {
        handleFileUpload(event) {
          this.selectedFile = event.target.files[0];
        },
        async submitImage() {
          if (!this.selectedFile) {
            alert('ファイルを選択してください');
            return;
          }
    
          const formData = new FormData();
          formData.append('image', this.selectedFile);
    
          try {
            const response = await axios.post('http://localhost:4001/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            alert(response.data.message);
          } catch (error) {
            console.error(error);
            alert('画像のアップロードに失敗しました');
          }
        },
      },
    };
    </script>