<template>
  <div class="watermark-selector">
    <div style="width: 100%">
      <el-autocomplete
        :fetch-suggestions="querySearchAsync"
        placeholder="搜索水印文件"
        style="width: 99%;display: block; margin: 10px auto;"
        @select="handleSelect"
      />
    </div>

    <el-card class="box-card">
      <div class="gallery">
        <image-item
          v-for="(item,index) in watermarksUrl"
          :key="index"
          :src="item"
          :width="100"
          :height="50"
          @click.native="selectImg(item)"/>
      </div>
    </el-card>
    <div>
      <span>已选择的水印文件:</span><img
        :src="curImg"
        width="100px">
    </div>
</div></template>
<script>
import ImageItem from '~/components/ImageItem'
export default {
  components:{
    ImageItem
  },
  data(){
    return {
      watermarks: [],
      query: '',
      selected_img: ''
    }
  },
  computed:{
    queryWatermarks(){
      return this.watermarks.filter(e => e.indexOf(this.query) !== -1)
    },
    watermarksUrl(){
      return this.queryWatermarks.map(e => {
        return 'watermarks/' + e.split('/').map(e => encodeURIComponent(e)).join('/')
      })
    },
    curImg(){
      return this.selected_img
    }
  },
  watch:{
    selected_img(newVal){
      this.$emit('selected', newVal)
    }
  },
  async mounted(){
    let {data} = await this.$axios.get('./api/watermarks')
    this.watermarks = data
  },
  methods:{
    querySearchAsync(query, cb){
      if(!query){
        query = ''
      }
      let tmp = this.watermarks.filter(e => e.indexOf(query) !== -1).map(e => {
        return {
          value: e
        }
      })
      this.query = query
      cb(tmp)
    },
    handleSelect(obj){
      this.selected_img = 'watermarks/' + obj.value.split('/').map(e => encodeURIComponent(e)).join('/')
    },
    selectImg(src){
      this.selected_img = src
    }
  },
}
</script>
<style lang="scss" scoped>
.watermark-selector{
  width: 50vw;

  .gallery{
    width: 100%;
      background-color: #fafafa;
  }
}
</style>
