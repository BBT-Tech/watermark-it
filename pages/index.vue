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
          title="裁剪图片"
          style="cursor: pointer;"
          @click.native="goTo(1)" />
        <el-step
          title="选择水印"
          style="cursor: pointer;"
          @click.native="goTo(2)" />
        <el-step
          title="选择配置"
          style="cursor: pointer;"
          @click.native="goTo(3)" />
        <el-step
          title="完成"
          style="cursor: pointer;"
          @click.native="goTo(4)" />
      </el-steps>
      <div class="module-container">
        <div v-show="step === 0">
          <ImageSelector
            :multiple="true"
            @selected="onBgChange" />
        </div>
        <div v-show="step === 1">
          <!-- <picture-clipper
            ref="picture-clipper"
            :bgimg="bgImageUrl"
            :width="panelWidth" /> -->
        </div>
        <div v-show="step === 2">
          <WatermarkSelector @selected="onSmallChange" />
        </div>
        <div v-show="step === 3">
          <WatermarkPanel
            ref="watermark-panel"
            :smallimg="watermarkUrl"
            :bgimg="clippedImage"
            :width="panelWidth" />
        </div>
        <div v-show="step === 4">
          <el-button
            :disabled="imageLoading"
            style="float: right;"
            type="primary"
            @click="saveImages">{{ imageLoading?'生成中':'保存' }}</el-button>
          <el-button
            :disabled="imageLoading"
            style="float: right;"
            type="warning"
            @click="reWatermark">{{ imageLoading?'生成中':'再打一层水印' }}</el-button>
          <img
            v-for="(image,index) of images"
            :src="image"
            :key="index"
            style="max-width: 100%">
        </div>
      </div>
      <el-button
        v-if="step < 4"
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
import PictureClipper from '~/components/PictureClipper'
import resizeImage from '~/utils/resizeImage'
import computeConfig from '~/utils/computeConfig'
import watermarkImage from '~/utils/watermarkImage'
import clipImage from '~/utils/clipImage'
export default {
  components: {
    ImageSelector,
    WatermarkPanel,
    WatermarkSelector,
    PictureClipper
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
      imageLoading: false,
      clippedImage: '',
      clipImage: false
    }
  },
  computed: {
    couldGoNext() {
      switch (this.step) {
        case 0:
          return this.bgImageUrl !== ''
        case 1:
          return true
        case 2:
          return this.watermarkUrl !== ''
        case 3:
          return true
      }
      return false
    }

  },
  watch: {
    async step(newVal) {
      if (newVal > this.maxStep) {
        this.maxStep = newVal
      }
      if(newVal === 3){
        if(this.clipImage){
          this.clippedImage = await this.$refs['picture-clipper'].getImage()
        }else{
          this.clippedImage = this.bgImageUrl
        }

      }
      if (newVal === 4) {
        // this.$refs['watermark-panel'].getImage().then(e => {
        //   this.finishImageUrl = e
        // })
        this.updatePreviewImages()
      }
    }
  },
  methods: {
    goTo(step) {
      if(step === 1){
        step = 2
      }
      if (step <= this.maxStep) {
        this.step = step
      }
    },
    goNext() {
      this.step++
      if(this.step === 1){
        this.step++
      }
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
    reWatermark(){
      this.onBgChange([...this.images])
      this.maxStep = 2
      this.goTo(2)

    },
    async getClippedImages(){
      const panel = this.$refs['picture-clipper']
      const BgMaxwidth = this.panelWidth
      const ret = []
      const config = panel.getConfig()
      for (let url of this.imageUrls) {
        const image = await this.loadImg(url)
        const { ratio } = resizeImage(image.width, image.height, BgMaxwidth, -1)
        const computedConfig = computeConfig(config, panel.smallConfig.width, panel.smallConfig.height, image.width, image.height, ratio)
        const x = computedConfig.x / ratio
        const y = computedConfig.y / ratio
        const width = panel.smallConfig.width * computedConfig.ratio / ratio
        const height = panel.smallConfig.height * computedConfig.ratio / ratio
        ret.push(await clipImage(url, x, y, width, height))
      }
      return ret
    },
    async updatePreviewImages() {
      this.imageLoading = true
      const panel = this.$refs['watermark-panel']
      const BgMaxwidth = this.panelWidth
      this.images = []
      const config = panel.getConfig()
      let clippedImages = []
      if(this.clipImage){
        clippedImages =  await this.getClippedImages(this.imageUrls)
      }else{
        clippedImages = this.imageUrls
      }
      for (let url of clippedImages) {
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
