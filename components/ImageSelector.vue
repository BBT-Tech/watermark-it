<template>
  <div
    :style="`width: ${width}px; height: ${curHeight}px;`"
    class="image-selector"
    @click="selectImage">
    <div
      v-if="selected === false"
      class="cover">
      <!-- <span>拖动图片至此</span> -->
      <span>点击选择图片</span>
    </div>
    <div class="image-div">
      <img
        :src="image_url"
        :width="image_width"
        :height="image_height">
    </div>
    <input
      ref="file"
      :multiple="multiple"
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
    },
    multiple: {
      type: Boolean,
      default: false
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
  computed: {
    curHeight() {
      if (this.selected) {
        return this.image_height
      } else {
        return this.height
      }
    }
  },
  methods: {
    selectImage() {
      this.$refs.file.click()
    },
    async onChangeImage() {
      const urls = []
      for (let file of this.$refs.file.files) {
        const url = URL.createObjectURL(file)
        urls.push(url)
      }
      if(urls.length > 0){
        const url = urls[0]
        const image = await this.loadImg(url)
        this.image_url = url
        this.selected = true
        const size = resizeImage(image.width, image.height, this.width, this.height, true)
        this.image_width = size.width
        this.image_height = size.height
        this.$emit('selected', urls)
      }else{
        this.image_url = ''
        this.selected = false
      }

    },
    async loadImg(src) {
      return new Promise((resolve, reject) => {
        let tmp = new Image()
        tmp.src = src
        tmp.onload = () => resolve(tmp)
        tmp.onerror = (e) => reject(e)
      })
    },
  },
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
    img {
      margin: 0 auto;
      display: block;
    }
  }
}
</style>
