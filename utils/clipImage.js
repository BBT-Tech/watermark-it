async function loadImg(src) {
  return new Promise((resolve, reject) => {
    let tmp = new Image()
    tmp.src = src
    tmp.onload = () => resolve(tmp)
    tmp.onerror = (e) => reject(e)
  })
}
export default async function(bgSrc,posX,posY,width,height){
  const canvas = document.createElement('canvas')
  const imageBg = await loadImg(bgSrc)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageBg,-1* posX,-1*posY,imageBg.width,imageBg.height)
  return canvas.toDataURL("image/png",1)
}
