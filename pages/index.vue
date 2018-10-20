<template>
  <div class="container">
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
    <div
      v-show="step === 0"
      class="center-div">
      <ImageSelector
        @selected="onBgChange"
      />
      <el-button
        :disabled="!couldGoNext"
        @click="goNext">下一步</el-button>
    </div>
    <div
      v-show="step === 1"
      class="center-div">
      <WatermarkSelector @selected="onSmallChange" />
      <el-button
        :disabled="!couldGoNext"
        @click="goNext">下一步</el-button>
    </div>
    <div
      v-show="step === 2"
      class="center-div">
      <WatermarkPanel
        :smallimg="watermarkUrl"
        :bgimg="bgImageUrl"/>
      <el-button
        :disabled="!couldGoNext"
        @click="goNext">下一步</el-button>
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
      watermarkUrl: ''
    }
  },
  computed: {
    couldGoNext() {
      switch (this.step) {
        case 0:
          return this.bgImageUrl !== ''
        case 1:
          return this.watermarkUrl !== ''
      }
      return false
    }

  },
  watch: {
    step(newVal) {
      if (newVal > this.maxStep) {
        this.maxStep = newVal
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
    onBgChange(src){
      this.bgImageUrl = src
    },
    onSmallChange(src){
      this.watermarkUrl = src
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  .center-div {
    display: flex;
    justify-content: center;
  }
}
</style>
