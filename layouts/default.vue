<template>
  <div>
    <!-- <div class="background">
      <img
        class="tizi1"
        src="~/assets/1.png"
        height="500">
      <img
        class="tizi2"
        src="~/assets/2.png"
        height="500">
      <img
        class="tizi3"
        src="~/assets/3.png"
        height="500">
    </div> -->
    <nuxt/>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
.background{
  position: fixed;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index: 1;
  background-image: url('~/assets/grass.jpg');

}
.background .tizi1{
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%) translateX(-50%);
}
.background .tizi2{
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%) translateX(50%);
}
.background .tizi3{
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateY(50%) translateX(-50%);
}
</style>
