<template>
  <div class="loading-screen" :class="{ 'fade-out': startFade }">
    <!-- <div class="sake-bottle">
      <div class="liquid"></div>
    </div> -->
    <div class="loading-content">
      <h1 class="loading-title">
        <span>お</span>
        <span>す</span>
        <span>す</span>
        <span>め</span>
        <span>秋</span>
        <span>鹿</span>
        <span>ナ</span>
        <span>ビ</span>
      </h1>
    </div>
    <div class="rice-grains">
      <div v-for="n in 20" :key="n" class="rice-grain"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  data() {
    return {
      startFade: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.startFade = true
    }, 2000)

    setTimeout(() => {
      this.$emit('loading-complete')
    }, 3000)
  }
}
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 1s ease-out;
  overflow: hidden;
}

.loading-screen.fade-out {
  opacity: 0;
}

.loading-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.loading-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #f97316;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.loading-title span {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
}

.loading-title span:nth-child(1) { animation-delay: 0.1s; }
.loading-title span:nth-child(2) { animation-delay: 0.2s; }
.loading-title span:nth-child(3) { animation-delay: 0.3s; }
.loading-title span:nth-child(4) { animation-delay: 0.4s; }
.loading-title span:nth-child(5) { animation-delay: 0.5s; }
.loading-title span:nth-child(6) { animation-delay: 0.6s; }
.loading-title span:nth-child(7) { animation-delay: 0.7s; }
.loading-title span:nth-child(8) { animation-delay: 0.8s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sake-bottle {
  position: absolute;
  width: 100px;
  height: 250px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50px 50px 20px 20px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  z-index: 1;
}

.liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background-color: rgba(249, 115, 22, 0.7);
  animation: fill 2s ease-in-out infinite;
}

@keyframes fill {
  0%, 100% { height: 0; }
  50% { height: 80%; }
}

.rice-grains {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.rice-grain {
  position: absolute;
  width: 10px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 10s infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.rice-grain:nth-child(odd) {
  left: calc(50% + var(--offset, 0px));
  --offset: calc(random(100) * 1%);
  animation-delay: calc(random(10) * -1s);
}

.rice-grain:nth-child(even) {
  right: calc(50% + var(--offset, 0px));
  --offset: calc(random(100) * 1%);
  animation-delay: calc(random(10) * -1s);
}
</style>