export default function (config,smallWidth,smallHeight,bgWidth,bgHeight,bgRatio){
  let x = config.x
  let y= config.y
  let width = smallWidth
  let height = smallHeight
  let ratio = 1
  let bgAcutalWidth = bgWidth * bgRatio
  let bgAcutalHeight= bgHeight * bgRatio
  if (config.smallRatioRefer === 'self') {
    ratio = config.smallRatio
  }
  if (config.smallRatioRefer === 'width') {
    ratio = config.smallRatio * bgAcutalWidth / width
  }
  if (config.smallRatioRefer === 'height') {
    ratio = config.smallRatio * bgAcutalHeight / height
  }
  if (config.posType === 'ratio') {
    x = bgAcutalWidth * x
    y = bgAcutalHeight * y
  }
  if (config.rowRefer === 'middle') {
    x = bgAcutalWidth/2 - smallWidth * ratio / 2 + x
  }
  if (config.rowRefer === 'right') {
    x = bgAcutalWidth - x
  }
  if (config.colRefer === 'middle') {
    y = bgAcutalHeight/2 - smallHeight * ratio / 2 + y
  }
  if (config.colRefer === 'bottom') {
    y = bgAcutalHeight - y
  }
  return {
    x,
    y,
    ratio,
    opacity: config.opacity
  }
}
