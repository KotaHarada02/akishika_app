<template>
  <div class="container">
    <!-- Logo Text -->
    <div class="logo-text">
      <span class="logo-text-orange">M</span>
      <span class="logo-text-orange">I</span>
      <span class="logo-text-black">T</span>
      <span class="logo-text-orange">S</span>
      <span class="logo-text-black">U</span>
      <span class="logo-text-black">K</span>
      <span class="logo-text-black">A</span>
    </div>
    <div class="log-text">
      <span class="logo-text-black">B</span>
      <span class="logo-text-orange">O</span>
      <span class="logo-text-black">S</span>
      <span class="logo-text-black">E</span>
    </div>
    <div class="center">
      みつか坊主 秋鹿管理機能サービス
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <label for="password">パスワード：</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="input-field"
          required
        />
      </div>
      <div class="center">
        <button type="submit" class="login-button">ログイン</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCookie } from '#app'

const password = ref('')
const userLogin = useCookie('userLogin', { default: () => false })
const router = useRouter()

const handleLogin = async () => {
  const correctPassword = 'mitsuka-akishika'

  console.log('password.value:', password.value)
  // パスワードが正しい場合
  if (password.value === correctPassword) {
    userLogin.value = true;
    console.log('ログイン成功: userLogin.value =', userLogin.value);
    
    // ホームページにリダイレクト
    console.log('リダイレクトします')
    router.push('/')
  } else {
    alert('パスワードが間違っています。')
  }
}
</script>

  <style scoped>
  .container {
    padding: 2rem;
  }
  
  .logo-text {
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin-top: 30px;
  }
  
  .log-text {
    display: flex;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
  }
  
  .logo-text-orange {
    color: #FF8736;
  }
  
  .logo-text-black {
    color: #000;
  }
  
  .center {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 1rem;
  }
  
  .login-form {
    margin-top: 1.5rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
  }
  
  .input-group label {
    display: block;
    width: 100%;
    margin-left: 800px;
    margin-bottom: 0.5rem;
    margin-top: 40px;
  }
  
  .input-field {
    width: 100%;
    max-width: 18rem;
    padding: 0.5rem;
    border: 1px solid #D1D5DB;
    border-radius: 0.375rem;
    outline: none;
  }
  
  .input-field:focus {
    border-color: #FF8736;
    box-shadow: 0 0 0 2px #FF8736;
  }
  
  .login-button {
    padding: 0.5rem 2rem;
    background-color: #FF8736;
    color: white;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }
  
  .login-button:hover {
    background-color: #FF8736; /* hover時の色 */
  }
  </style>
  