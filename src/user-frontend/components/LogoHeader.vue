<template>
  <header class="header">
    <div class="logo-container">
      <div class="logo-text-container">
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
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'LogoHeader'
}
</script>

<style scoped>
.header {
  background-color: white;
  padding-top: env(safe-area-inset-top);
  padding-bottom: 1rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.logo-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-text-orange {
  color: #FF8736;
}

.logo-text-black {
  color: #000;
}

.logo-text {
  font-weight: 700;
  font-size: 2.0rem;
  line-height: 1.2;
}
</style>