<template>
  <div>
    <loading-screen v-if="isLoading" @loading-complete="onLoadingComplete" />
  </div>
</template>

<script>
import LoadingScreen from '../components/loading.vue'

export default {
  name: 'IndexPage',
  components: {
    LoadingScreen
  },
  data() {
    return {
      isLoading: true
    }
  },
  methods: {
    onLoadingComplete() {
      this.isLoading = false
      this.$router.push('/home')
    }
  }
}
</script>