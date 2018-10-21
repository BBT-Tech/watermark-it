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
          <ImageSelector @selected="onBgChange" />
        </div>
        <div v-show="step === 1">
          <WatermarkSelector @selected="onSmallChange" />
        </div>
        <div v-show="step === 2">
          <WatermarkPanel
            ref="watermark-panel"
            :smallimg="watermarkUrl"
            :bgimg="bgImageUrl" />
        </div>
        <div v-show="step === 3">
          <img
            :src="finishImageUrl"
            style="max-width: 100%">
        </div>
      </div>
      <el-button
        v-if="step < 3"
        :disabled="!couldGoNext"
        style="float: right;"
        type="success"
        @click="goNext">下一步</el-button>
      <el-button
        v-if="step === 3"
        style="float: right;"
        type="primary"
        @click="saveImage">保存</el-button>
    </div>

  </div>
</template>

<script>
import ImageSelector from '~/components/ImageSelector.vue'
import WatermarkSelector from '~/components/WatermarkSelector'
import WatermarkPanel from '~/components/WatermarkPanel'
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
      finishImageUrl: ''
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
        this.$refs['watermark-panel'].getImage().then(e => {
          this.finishImageUrl = e
        })
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
    onBgChange(src) {
      this.bgImageUrl = src
    },
    onSmallChange(src) {
      this.watermarkUrl = src
    },
    async saveImage() {
      const dlLink = document.createElement('a');
      const imgUrl = this.finishImageUrl
      dlLink.download = 'export.png';
      dlLink.href = imgUrl;
      dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');
      document.body.appendChild(dlLink);
      dlLink.click();
      //some browser would not donwload if removed
      //document.body.removeChild(dlLink);
    }
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
