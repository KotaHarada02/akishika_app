export default defineNuxtRouteMiddleware((to, from) => {
  // useCookieで保存されたログイン状態を管理
  const user = useCookie('user', { default: () => false });
  const userLogin = useCookie('userLogin', { default: () => false })
  
  // userLoginの状態をuseStateで管理
  console.log('auth.jsが呼び出されました')
  console.log('userLogin.value:', userLogin.value)

  // ログインしていない場合、loginページ以外にアクセスしようとした場合、loginページにリダイレクト
  if (!userLogin.value && to.name !== 'login') {
    console.log('ユーザーがログインしていないため、ログインページへリダイレクトします')
    return navigateTo('/login')
  }

  // ログイン後、loginページに行こうとした場合、ホームページにリダイレクト
  if (userLogin.value && to.name === 'login') {
    console.log('すでにログインしているので、ホームページにリダイレクトします')
    return navigateTo('/')
  }
})