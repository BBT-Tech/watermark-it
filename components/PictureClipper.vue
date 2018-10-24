<template>
  <div class="picture-clipper">
    <el-dialog
      :visible.sync="dialogVisible"
      title="输入配置名字"
      width="30%">
      <el-row class="setting-row">
        <template>
          <el-input v-model="configSaveName" />
        </template>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveConfig">保 存</el-button>
      </span>
    </el-dialog>
    <water-marker
      ref="watermarker"
      :width="width"
      :bgimg="bgimg"
      :smallimg="smallimg"
      :allow-outside="false"
      @posChange="posChange"
      @ready="watermarkerReady" />
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix">
        <span>配置</span>
      </div>
      <el-autocomplete
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索已有配置文件"
        style="width: 99%;display: block; margin: 10px auto;"
        @select="handleSelect" />
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
          裁剪框比例参照：
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
          裁剪框缩放比例：(可拖动右下角红点缩放)
          <el-input v-model="config.smallRatio" />
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          裁剪框宽高比
          <el-input-number
            v-model="config.aspectRatio"
            :precision="4"
            :step="0.01"
            :min="0" />
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          横向定位:
          <el-input v-model="config.x" />
        </template>
      </el-row>
      <el-row class="setting-row">
        <template>
          纵向定位:
          <el-input v-model="config.y" />
        </template>
      </el-row>
      <el-row style="display:flex; justify-content: center;">
        <el-button @click="test"/>
        <el-button
          type="primary"
          plain
          @click="dialogVisible = true">保存配置文件</el-button>
        <el-button @click="test">测试</el-button>
        <img ref="test">
      </el-row>

    </el-card>
  </div>
</template>
<script>
import WaterMarker from '~/components/WaterMarker'
import watermarkImage from '~/utils/watermarkImage'
import computeConfig from '~/utils/computeConfig'
import clipImage from '~/utils/clipImage'
import resizeImageCanvas from '~/utils/resizeImageCanvas'
const rect = require('~/assets/rect.svg')
export default {
  components: {
    WaterMarker
  },
  props: {
    bgimg: {
      type: String,
      default: () => require('~/assets/bg.png')
    },
    width: {
      type: Number,
      default: 800
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
        smallRatioRefer: 'self',
        opacity: 1,
        aspectRatio: 1
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
      isSettingConfig: false,
      dialogVisible: false,
      savedConfigs: [],
      configSaveName: '',
      smallimg: rect
    }
  },
  computed: {
    computedConfig() {
      return computeConfig(this.config, this.smallConfig.width, this.smallConfig.height, this.bgConfig.width, this.bgConfig.height, this.bgConfig.ratio)
      // let x = this.config.x
      // let y = this.config.y
      // let width = this.smallConfig.width
      // let height = this.smallConfig.height
      // let ratio = 1
      // if (this.config.posType === 'ratio') {
      //   x = this.bgConfig.actualWidth * x
      //   y = this.bgConfig.actualHeight * y
      // }
      // if (this.config.rowRefer === 'right') {
      //   x = this.bgConfig.actualWidth - x
      // }
      // if (this.config.colRefer === 'bottom') {
      //   y = this.bgConfig.actualHeight - y
      // }
      // if (this.config.smallRatioRefer === 'self') {
      //   ratio = this.config.smallRatio
      // }
      // if (this.config.smallRatioRefer === 'width') {
      //   ratio = this.config.smallRatio * this.bgConfig.actualWidth / width
      // }
      // if (this.config.smallRatioRefer === 'height') {
      //   ratio = this.config.smallRatio * this.bgConfig.actualHeight / height
      // }
      // return {
      //   x,
      //   y,
      //   ratio,
      //   opacity: this.config.opacity
      // }
    }
  },
  watch: {
    computedConfig(newVal) {
      this.$refs.watermarker.setSmallRatio(newVal.ratio)
      this.$refs.watermarker.setOpacity(newVal.opacity)
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
    },
    "config.aspectRatio": function (newVal, oldVal) {
      this.setAspect(newVal)
    }
  },
  mounted() {
    this.fetchConfigs()
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
      return clipImage(this.bgimg, x, y, width, height)
    },
    async loadConfig(config) {
      await this.setAspect(config.aspectRatio)
      this.$nextTick(() => {
        this.isSettingConfig = true
        Object.assign(this.config, config)
        this.$nextTick(() => {
          this.isSettingConfig = false
        })
      })

    },
    async fetchConfigs() {
      let { data } = await this.$axios.get('./api/configs/clipper')
      this.savedConfigs = data
    },
    querySearchAsync(query, cb) {
      if (!query) {
        query = ''
      }
      let tmp = this.savedConfigs.filter(e => e.indexOf(query) !== -1).map(e => {
        return {
          value: e
        }
      })
      this.query = query
      cb(tmp)
    },
    async handleSelect(obj) {
      let src = 'configs/clipper/' + obj.value.split('/').map(e => encodeURIComponent(e)).join('/')
      let { data } = await this.$axios.get(src)
      this.loadConfig(data)
    },
    async saveConfig() {
      if (this.configSaveName === '') {
        return
      }
      let { data } = await this.$axios.post('./api/configs/clipper', {
        name: this.configSaveName,
        config: this.config
      }).catch(e => {
        this.$notify.error({
          title: '保存失败',
          message: '未知错误'
        });
        throw e
      })
      await this.fetchConfigs()
      this.$notify({
        title: '保存成功',
        message: '可以在下次复用该配置文件噢',
        type: 'success'
      });
      this.dialogVisible = false
    },
    getConfig() {
      return this.config
    },
    async test() {
      const url = await this.getImage()
      this.$refs.test.src = url
    },
    async setAspect(ratio) {
      let width = 100 * ratio
      let height = 100
      this.smallimg = await resizeImageCanvas(rect, width, height)
    },
    onekeyCenter(){
      const config = {
        posType: 'absolute',
        rowRefer: 'left',
        colRefer: 'top',
        x: 0,
        y: 0,
        smallRatio: 1,
        smallRatioRefer: 'self',
        opacity: 1,
        aspectRatio: 1
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.watermark-clipper {
  .setting-row {
    margin: 10px 0;
  }
}
</style>
