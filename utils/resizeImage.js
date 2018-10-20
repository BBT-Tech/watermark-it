export default function resizeImage(origin_width, origin_height, max_width, max_height, fullfill = false) {
  let ratio = 1
  let ratio_a = origin_width / max_width
  let ratio_b = origin_height / max_height
  if(max_width === -1){
    ratio = ratio_b
  }else if(max_height === -1){
    ratio = ratio_a
  }else{
    if (ratio_a > 1 || ratio_b > 1) {
      ratio = Math.max(ratio_a, ratio_b)
    }
    if (ratio_a < 1 && ratio_b < 1) {
      if (fullfill) {
        ratio = Math.max(ratio_a, ratio_b)
      }
    }
  }
  return {
    width: origin_width / ratio,
    height: origin_height / ratio,
    ratio: 1 / ratio
  }
}
