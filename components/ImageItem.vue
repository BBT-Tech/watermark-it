<template>
  <div class="image-item">
    <img
      :src="src"
      :width="width"
      :height="height">
  </div>
</template>
<script>
export default {
  props:{
    src:{
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  }
}
</script>
<style lang="scss" scoped>
.image-item{
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  cursor: pointer;
  &:hover{
    background: #f3f3f3;
  }
}
</style>

