<template>
  <div class="container">
    <el-steps
      :active="step"
      finish-status="success"
      align-center>
      <el-step title="选择底图"/>
      <el-step title="选择水印"/>
      <el-step title="选择配置"/>
      <el-step title="完成"/>
    </el-steps>
    <div
      v-show="step === 0"
      class="center-div">
      <ImageSelector/>
    </div>
    <div
      v-show="step === 1"
      class="center-div">
      <WatermarkSelector/>
    </div>
    <div
      v-show="step === 2"
      class="center-div">
    <WatermarkPanel/></div>
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
  data(){
    return{
      step: 2
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  min-height: 100vh;
  .center-div{
    display: flex;
    justify-content: center;
  }
}

</style>
