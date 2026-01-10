<template>
  <transition name="fade" appear>
    <div v-if="state" class="z-60 fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center flex-col">
      <div class="loader-2 center">
        <span />
      </div>
      <div v-if="loaderMessage" class="mt-4 text-white font-semibold text-center">
        <p>{{ loaderMessage }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    state () {
      return this.$store.getters['utils/IS_LOADING'];
    },
    loaderMessage () {
      return this.$store.getters['utils/LOADER_MESSAGE'];
    }
  }
}
</script>

<style scoped lang="scss">
.loader-2 {
  display: block;
  height: 64px;
  width: 64px;
  -webkit-animation: loader-2-1 3s linear infinite;
  animation: loader-2-1 3s linear infinite;
}
@-webkit-keyframes loader-2-1 {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes loader-2-1 {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader-2 span {
  display: block;
  position: absolute;
  top: 0; left: 0;
  bottom: 0; right: 0;
  margin: auto;
  height: 64px;
  width: 64px;
  clip: rect(32px, 64px, 64px, 0);
  -webkit-animation: loader-2-2 1.5s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
  animation: loader-2-2 1.5s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-2-2 {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes loader-2-2 {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader-2 span::before {
  content: "";
  display: block;
  position: absolute;
  top: 0; left: 0;
  bottom: 0; right: 0;
  margin: auto;
  height: 64px;
  width: 64px;
  border: 5px solid transparent;
  border-top: 5px solid #FFF;
  border-radius: 50%;
  -webkit-animation: loader-2-3 1.5s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
  animation: loader-2-3 1.5s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-2-3 {
  0%   { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}
@keyframes loader-2-3 {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader-2 span::after {
  content: "";
  display: block;
  position: absolute;
  top: 0; left: 0;
  bottom: 0; right: 0;
  margin: auto;
  height: 64px;
  width: 64px;
  border: 5px solid rgba(255, 255, 255, .5);
  border-radius: 50%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
