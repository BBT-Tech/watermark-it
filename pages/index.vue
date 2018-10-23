<template>
  <div class="container">
    <div class="center-div">
      <el-steps
        :active="step"
        finish-status="success"
        align-center>
        <el-step
          title="选择底图"
          style="cursor: pointer;"
          @click.native="goTo(0)" />
        <el-step
          title="选择水印"
          style="cursor: pointer;"
          @click.native="goTo(1)" />
        <el-step
          title="选择配置"
          style="cursor: pointer;"
          @click.native="goTo(2)" />
        <el-step
          title="完成"
          style="cursor: pointer;"
          @click.native="goTo(3)" />
      </el-steps>
      <div class="module-container">
        <div v-show="step === 0">
          <ImageSelector
            :multiple="true"
            @selected="onBgChange" />
        </div>
        <div v-show="step === 1">
          <WatermarkSelector @selected="onSmallChange" />
        </div>
        <div v-show="step === 2">
          <WatermarkPanel
            ref="watermark-panel"
            :smallimg="watermarkUrl"
            :bgimg="bgImageUrl"
            :width="panelWidth" />
        </div>
        <div v-show="step === 3">
          <el-button
            :disabled="imageLoading"
            style="float: right;"
            type="primary"
            @click="saveImages">{{ imageLoading?'生成中':'保存' }}</el-button>
          <img
            v-for="(image,index) of images"
            :src="image"
            :key="index"
            style="max-width: 100%">
        </div>
      </div>
      <el-button
        v-if="step < 3"
        :disabled="!couldGoNext"
        style="float: right;"
        type="success"
        @click="goNext">下一步</el-button>
    </div>

  </div>
</template>

<script>
import ImageSelector from '~/components/ImageSelector.vue'
import WatermarkSelector from '~/components/WatermarkSelector'
import WatermarkPanel from '~/components/WatermarkPanel'
import resizeImage from '~/utils/resizeImage'
import computeConfig from '~/utils/computeConfig'
import watermarkImage from '~/utils/watermarkImage'
export default {
  components: {
    ImageSelector,
    WatermarkPanel,
    WatermarkSelector
  },
  data() {
    return {
      step: 0,
      maxStep: 0,
      bgImageUrl: '',
      watermarkUrl: '',
      finishImageUrl: '',
      imageUrls: [],
      panelWidth: 800,
      images: [],
      imageLoading: false
    }
  },
  computed: {
    couldGoNext() {
      switch (this.step) {
        case 0:
          return this.bgImageUrl !== ''
        case 1:
          return this.watermarkUrl !== ''
        case 2:
          return true
      }
      return false
    }

  },
  watch: {
    step(newVal) {
      if (newVal > this.maxStep) {
        this.maxStep = newVal
      }
      if (newVal === 3) {
        // this.$refs['watermark-panel'].getImage().then(e => {
        //   this.finishImageUrl = e
        // })
        this.updatePreviewImages()
      }
    }
  },
  methods: {
    goTo(step) {
      if (step <= this.maxStep) {
        this.step = step
      }
    },
    goNext() {
      this.step++
    },
    onBgChange(srcs) {
      this.imageUrls = srcs
      this.bgImageUrl = ''
      if (srcs.length > 0) {
        this.bgImageUrl = srcs[0]
      }

    },
    onSmallChange(src) {
      this.watermarkUrl = src
    },
    saveImage(imgUrl) {
      const dlLink = document.createElement('a');
      dlLink.download = 'export.png';
      dlLink.href = imgUrl;
      dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');
      document.body.appendChild(dlLink);
      dlLink.click();
      //some browser would not donwload if removed
      //document.body.removeChild(dlLink);
    },
    saveImages(){
      for(let image of this.images){
        this.saveImage(image)
      }
    },
    async updatePreviewImages() {
      this.imageLoading = true
      const panel = this.$refs['watermark-panel']
      const BgMaxwidth = this.panelWidth
      this.images = []
      const config = panel.getConfig()
      for (let url of this.imageUrls) {

        const image = await this.loadImg(url)
        const { ratio } = resizeImage(image.width, image.height, BgMaxwidth, -1)
        const computedConfig = computeConfig(config, panel.smallConfig.width, panel.smallConfig.height, image.width, image.height, ratio)
        const x = computedConfig.x / ratio
        const y = computedConfig.y / ratio
        const width = panel.smallConfig.width * computedConfig.ratio / ratio
        const height = panel.smallConfig.height * computedConfig.ratio / ratio
        const opacity = config.opacity
        this.images.push(await watermarkImage(url, this.watermarkUrl, x, y, width, height, opacity))
      }
      this.imageLoading = false

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
.container {
  min-height: 100vh;
  width: 100%;
  .center-div {
    margin: 0 auto;
    width: 800px;
    .module-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
