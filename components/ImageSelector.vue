<template>
  <div
    :style="`width: ${width}px; height: ${height}px;`"
    class="image-selector"
    @click="selectImage">
    <div
      v-if="selected === false"
      class="cover">
      <span>拖动图片至此</span>
      <span>或点击上传</span>
    </div>
    <div class="image-div">
      <img
        :src="image_url"
        :width="image_width"
        :height="image_height">
    </div>
    <input
      ref="file"
      type="file"
      accept="image/*"
      style="display: none;"
      @change="onChangeImage">
  </div>
</template>
<script>
import resizeImage from '~/utils/resizeImage'
export default {
  props: {
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      selected: false,
      image: null,
      image_url: '',
      image_width: 0,
      image_height: 0
    }
  },
  methods: {
    selectImage() {
      this.$refs.file.click()
    },
    onChangeImage() {
      let file = this.$refs.file.files[0]
      const url = URL.createObjectURL(file)
      const tmp_image = new Image()
      tmp_image.src = url
      tmp_image.onload = () => {
        this.image = file
        this.image_url = url
        this.selected = true
        const size = resizeImage(tmp_image.width,tmp_image.height,this.width,this.height,true)
        this.image_width = size.width
        this.image_height = size.height
        this.$emit('selected',this.image_url)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.image-selector {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #d8d8d8;
    z-index: 2;
  }
  .image-div {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    img{
      margin: 0 auto;
      display: block;
    }
  }
}
</style>
