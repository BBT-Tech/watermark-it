export default function (config,smallWidth,smallHeight,bgWidth,bgHeight,bgRatio){
  let x = config.x
  let y= config.y
  let width = smallWidth
  let height = smallHeight
  let ratio = 1
  let bgAcutalWidth = bgWidth * bgRatio
  let bgAcutalHeight= bgHeight * bgRatio
  if (config.posType === 'ratio') {
    x = bgAcutalWidth * x
    y = bgAcutalHeight * y
  }
  if (config.rowRefer === 'right') {
    x = bgAcutalWidth - x
  }
  if (config.colRefer === 'bottom') {
    y = bgAcutalHeight - y
  }
  if (config.smallRatioRefer === 'self') {
    ratio = config.smallRatio
  }
  if (config.smallRatioRefer === 'width') {
    ratio = config.smallRatio * bgAcutalWidth / width
  }
  if (config.smallRatioRefer === 'height') {
    ratio = config.smallRatio * bgAcutalHeight / height
  }
  return {
    x,
    y,
    ratio,
    opacity: config.opacity
  }
}
