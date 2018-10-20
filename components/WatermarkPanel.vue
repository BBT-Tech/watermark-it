<template>
  <div class="watermark-panel">
    <water-marker
      ref="watermarker"
      :width="800"
      :bgimg="bgimg"
      :smallimg="smallimg"
      @posChange="posChange"
      @ready="watermarkerReady" />
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix">
        <span>配置</span>
      </div>
      <el-row class="setting-row">
        定位方式：
        <template>
          <el-radio
            v-model="config.posType"
            label="absolute">像素定位</el-radio>
          <el-radio
            v-model="config.posType"
            label="ratio">百分比定位</el-radio>
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          横向参考：
          <el-radio
            v-model="config.rowRefer"
            label="left">左边</el-radio>
          <el-radio
            v-model="config.rowRefer"
            label="right">右边</el-radio>
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          纵向参考：
          <el-radio
            v-model="config.colRefer"
            label="top">顶边</el-radio>
          <el-radio
            v-model="config.colRefer"
            label="bottom">底边</el-radio>
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          水印比例参照：
          <el-radio
            v-model="config.smallRatioRefer"
            label="self">自身</el-radio>
          <el-radio
            v-model="config.smallRatioRefer"
            label="width">底图宽度</el-radio>
          <el-radio
            v-model="config.smallRatioRefer"
            label="height">底图高度</el-radio>
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          水印缩放比例：(可拖动右下角红点缩放)
          <el-input v-model="config.smallRatio" />
        </template>
      </el-row>
      <el-row class="setting-row">
        <p>x:{{ config.x }}</p>
        <p>y:{{ config.y }}</p>
      </el-row>
      <el-button @click="loadConfig">testLoad</el-button>
      <el-button @click="test">click me</el-button>
      <img ref="testimg">
    </el-card>
  </div>
</template>
<script>
import WaterMarker from '~/components/WaterMarker'
import watermarkImage from '~/utils/watermarkImage'
export default {
  components: {
    WaterMarker
  },
  props: {
    bgimg: {
      type: String,
      default: () => require('~/assets/bg.png')
    },
    smallimg: {
      type: String,
      default: () => require('~/assets/small.jpg')
    },
  },
  data() {
    return {
      config: {
        posType: 'absolute',
        rowRefer: 'left',
        colRefer: 'top',
        x: 0,
        y: 0,
        smallRatio: 1,
        smallRatioRefer: 'self'
      },
      smallConfig: {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
        ratio: 1
      },
      bgConfig: {
        width: 0,
        height: 0,
        actualWidth: 0,
        actualHeight: 0,
        ratio: 0
      },
      isSettingConfig: false
    }
  },
  computed: {
    computedConfig() {
      let x = this.config.x
      let y = this.config.y
      let width = this.smallConfig.width
      let height = this.smallConfig.height
      let ratio = 1
      if (this.config.posType === 'ratio') {
        x = this.bgConfig.actualWidth * x
        y = this.bgConfig.actualHeight * y
      }
      if (this.config.rowRefer === 'right') {
        x = this.bgConfig.actualWidth - x
      }
      if (this.config.colRefer === 'bottom') {
        y = this.bgConfig.actualHeight - y
      }
      if (this.config.smallRatioRefer === 'self') {
        ratio = this.config.smallRatio
      }
      if (this.config.smallRatioRefer === 'width') {
        ratio = this.config.smallRatio * this.bgConfig.actualWidth / width
      }
      if (this.config.smallRatioRefer === 'height') {
        ratio = this.config.smallRatio * this.bgConfig.actualHeight / height
      }
      return {
        x,
        y,
        ratio
      }
    }
  },
  watch: {
    computedConfig(newVal) {
      console.log(newVal)
      this.$refs.watermarker.setSmallRatio(newVal.ratio)
      this.$refs.watermarker.setSmallPos(newVal.x, newVal.y)
    },
    "config.posType": function (newVal, oldVal) {
      if (newVal !== oldVal && this.isSettingConfig === false) {
        if (newVal === 'absolute') {
          this.config.x = this.config.x * this.bgConfig.actualWidth
          this.config.y = this.config.y * this.bgConfig.actualHeight
        }
        if (newVal === 'ratio') {
          this.config.x = this.config.x / this.bgConfig.actualWidth
          this.config.y = this.config.y / this.bgConfig.actualHeight
        }
      }
    },
    "config.rowRefer": function (newVal, oldVal) {
      if (newVal !== oldVal && this.isSettingConfig === false) {
        if (this.config.posType === 'ratio') {
          this.config.x = 1 - this.config.x
        } else {
          this.config.x = this.bgConfig.actualWidth - this.config.x
        }
      }
    },
    "config.colRefer": function (newVal, oldVal) {
      if (newVal !== oldVal && this.isSettingConfig === false) {
        if (this.config.posType === 'ratio') {
          this.config.y = 1 - this.config.y
        } else {
          this.config.y = this.bgConfig.actualHeight - this.config.y
        }
      }
    },
    "config.smallRatioRefer": function (newVal, oldVal) {
      if (newVal !== oldVal && this.isSettingConfig === false) {
        let selfRatio = this.config.smallRatio
        if (oldVal === 'width') {
          selfRatio = selfRatio * this.bgConfig.actualWidth / this.smallConfig.width
        }
        if (oldVal === 'height') {
          selfRatio = selfRatio * this.bgConfig.actualHeight / this.smallConfig.height
        }
        let targetRatio = selfRatio
        if (newVal === 'width') {
          targetRatio = selfRatio * this.smallConfig.width / this.bgConfig.actualWidth
        }
        if (newVal === 'height') {
          targetRatio = selfRatio * this.smallConfig.height / this.bgConfig.actualHeight
        }
        this.config.smallRatio = targetRatio
      }
    }
  },
  methods: {
    posChange({ bg, small }) {
      Object.assign(this.bgConfig, bg)
      Object.assign(this.smallConfig, small)
      this.setSmallPos(this.smallConfig.x, this.smallConfig.y)
      this.setSmallRatio(this.smallConfig.ratio)
    },
    setSmallPos(x, y) {
      if (this.config.rowRefer === 'right') {
        x = this.bgConfig.actualWidth - x
      }
      if (this.config.colRefer === 'bottom') {
        y = this.bgConfig.actualHeight - y
      }
      if (this.config.posType === 'ratio') {
        x = x / this.bgConfig.actualWidth
        y = y / this.bgConfig.actualHeight
      }
      this.config.x = x
      this.config.y = y
      console.log(x, y)
    },
    setSmallRatio(ratio) {
      if (this.config.smallRatioRefer === 'self') {
        this.config.smallRatio = ratio
      }
      if (this.config.smallRatioRefer === 'width') {
        this.config.smallRatio = ratio * this.smallConfig.width / this.bgConfig.actualWidth
      }
      if (this.config.smallRatioRefer === 'height') {
        this.config.smallRatio = ratio * this.smallConfig.height / this.bgConfig.actualHeight
      }
    },
    watermarkerReady() {
      this.posChange(this.$refs.watermarker.getConfig())
      this.config.smallRatio = this.smallConfig.ratio
    },
    async getImage() {
      const x = this.computedConfig.x / this.bgConfig.ratio
      const y = this.computedConfig.y / this.bgConfig.ratio
      const width = this.smallConfig.width * this.computedConfig.ratio / this.bgConfig.ratio
      const height = this.smallConfig.height * this.computedConfig.ratio / this.bgConfig.ratio
      return watermarkImage(this.bgimg, this.smallimg, x, y, width, height)
    },
    async test() {
      this.$refs.testimg.src = await this.getImage()
    },
    loadConfig(){
      let config = {"posType":"ratio","rowRefer":"right","colRefer":"bottom","x":0.26625,"y":0.24334319526627213,"smallRatio":0.2475,"smallRatioRefer":"width"}
      console.log(JSON.stringify(this.config))
      this.isSettingConfig = true
      Object.assign(this.config, config)
      this.$nextTick(() => {
        this.isSettingConfig = false
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.watermark-panel {
  .setting-row {
    margin: 10px 0;
  }
}
</style>
