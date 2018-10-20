<template>
  <div
    :width="width + 'px'"
    :height="height + 'px'">
    <canvas
      ref="canvas"
      :width="canvas_width + 'px'"
      :height="canvas_height + 'px'" />
  </div>

</template>
<script>
function isInRect(x,y,left,top,width,height){
  if(x >= left && y >= top && x <= left+width && y <= top+height){
    return true
  }else{
    return false
  }
}
const strokeWidth = 10
import resizeImage from '~/utils/resizeImage'
export default {
  props: {
    bgimg: {
      type: String,
      default: () => require('~/assets/bg.png')
    },
    smallimg: {
      type: String,
      default: () => require('~/assets/small.jpg')
    },
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      bg: null,
      small: null,
      ctx: null,
      start_offset: {
        x: 0,
        y: 0
      },
      cur_offset: {
        x: 0,
        y: 0
      },
      canvas_width: 0,
      canvas_height: 0,
      bgRatio: 1,
      smallRatio: 1,
      mode: 'resize'
    }
  },
  computed: {
    bg_width() {
      return this.bg.width
    },
    bg_height() {
      return this.bg.height
    },

    bgDrawSize() {
      return {
        width: this.bg_width * this.bgRatio,
        height: this.bg_height * this.bgRatio
      }
    },
    small_width() {
      return this.small.width
    },
    small_height() {
      return this.small.height
    },

    smallDrawSize() {
      return {
        width: this.small_width * this.smallRatio,
        height: this.small_height * this.smallRatio
      }
    }
  },
  watch: {
    bgimg(newVal) {
      this.bgimg = newVal
      this.reloadImg()

    },
    smallimg(newVal) {
      this.smallimg = newVal
      this.reloadImg()

    }
  },
  mounted() {
    const canvas = this.$refs.canvas
    this.ctx = canvas.getContext('2d')
    canvas.onmousedown = this.onmousedown
    canvas.onmouseup = this.onmouseup
    this.reloadImg()
  },
  methods: {
    redraw(x, y) {
      const canvas = this.$refs.canvas
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.ctx.drawImage(this.bg, 0, 0, this.bgDrawSize.width, this.bgDrawSize.height)
      this.ctx.drawImage(this.small, x, y, this.smallDrawSize.width, this.smallDrawSize.height)
      this.ctx.lineWidth = strokeWidth
      this.ctx.strokeStyle = 'red'
      this.ctx.strokeRect(x + this.smallDrawSize.width, y + this.smallDrawSize.height, 1, 1)
      this.cur_offset.x = x
      this.cur_offset.y = y
    },
    onmousedown(e) {
      let x = e.offsetX
      let y = e.offsetY
      const canvas = this.$refs.canvas
      if(isInRect(x,y,this.cur_offset.x+ this.smallDrawSize.width-strokeWidth,this.cur_offset.y+ this.smallDrawSize.height-strokeWidth,2*strokeWidth,2*strokeWidth)){
        this.start_offset.x = x - this.cur_offset.x
        this.start_offset.y = y - this.cur_offset.y
        this.mode = 'resize'
        canvas.onmousemove = this.onmousemove
      }else if (isInRect(x,y,this.cur_offset.x,this.cur_offset.y,this.smallDrawSize.width,this.smallDrawSize.height)) {
        this.start_offset.x = x - this.cur_offset.x
        this.start_offset.y = y - this.cur_offset.y
        this.mode = 'move'
        canvas.onmousemove = this.onmousemove

      } else {
        canvas.onmousemove = null
      }
    },
    onmouseup(e) {
      this.$refs.canvas.onmousemove = null
      this.$emit('posChange',this.getConfig())
    },
    onmousemove(e) {
      const canvas = this.$refs.canvas
      let x = e.offsetX - this.start_offset.x
      let y = e.offsetY - this.start_offset.y
      if (x > canvas.width) {
        x = canvas.width
      }
      if (y > canvas.height) {
        y = canvas.height
      }
      if (x < 0) {
        x = 0
      }
      if (y < 0) {
        y = 0
      }
      if(this.mode === 'move'){
        this.redraw(x, y)
      }else{
        let widthRatio = (e.offsetX - this.cur_offset.x)/this.small_width
        let heightRatio = (e.offsetY - this.cur_offset.y)/this.small_height
        let ratio =Math.max(widthRatio,heightRatio)
        this.smallRatio=ratio
        this.redraw(this.cur_offset.x,this.cur_offset.y)
      }

    },
    async reloadImg() {
      this.bg = await this.loadImg(this.bgimg)
      this.small = await this.loadImg(this.smallimg)
      let targetsize = resizeImage(this.bg.width, this.bg.height, this.width, this.height, true)
      this.canvas_width = targetsize.width
      this.canvas_height = targetsize.height
      this.$nextTick(() => {
        this.resetSize()
        this.redraw(0, 0)
        this.$emit('ready')
      })

    },
    async loadImg(src) {
      return new Promise((resolve, reject) => {
        let tmp = new Image()
        tmp.src = src
        tmp.onload = () => resolve(tmp)
        tmp.onerror = (e) => reject(e)
      })
    },
    getConfig() {
      return {
        bg: {
          width: this.bg_width,
          height: this.bg_height,
          actualWidth: this.bg_width * this.bgRatio,
          actualHeight: this.bg_height * this.bgRatio,
          ratio: this.bgRatio
        },
        small: {
          width: this.small_width,
          height: this.small_height,
          ratio: this.smallRatio, /// this.bgRatio,
          x: this.cur_offset.x,// / this.bgRatio,
          y: this.cur_offset.y /// this.bgRatio
        }
      }
    },
    setSmallRatio(ratio){
      this.smallRatio = ratio //* this.bgRatio
    },
    setBgRatio(ratio){
      this.bgRatio = ratio
    },
    setSmallPos(x,y){
      x = x//*this.bgRatio
      y = y//* this.bgRatio
      this.$nextTick(() => {
        this.redraw(x,y)
      })
    },
    resetSize(){
      this.bgRatio = resizeImage(this.bg_width, this.bg_height, this.width, this.height).ratio
      this.smallRatio = resizeImage(this.small_width, this.small_height, 100, 100).ratio
    }
  },
}
</script>
