async function loadImg(src) {
  return new Promise((resolve, reject) => {
    let tmp = new Image()
    tmp.src = src
    tmp.onload = () => resolve(tmp)
    tmp.onerror = (e) => reject(e)
  })
}
export default async function(bgSrc,smallSrc,posX,posY,smallWidth,smallHeight, opacity = 1){
  const canvas = document.createElement('canvas')
  const imageBg = await loadImg(bgSrc)
  const imageSmall = await loadImg(smallSrc)
  canvas.width = imageBg.width
  canvas.height = imageBg.height
  const ctx = canvas.getContext('2d')
  ctx.globalAlpha = 1
  ctx.drawImage(imageBg,0,0,imageBg.width,imageBg.height)
  ctx.globalAlpha = opacity
  ctx.drawImage(imageSmall,posX,posY,smallWidth,smallHeight)
  return canvas.toDataURL("image/png",1)
}
