async function loadImg(src) {
  return new Promise((resolve, reject) => {
    let tmp = new Image()
    tmp.src = src
    tmp.onload = () => resolve(tmp)
    tmp.onerror = (e) => reject(e)
  })
}
export default async function(bgSrc,width,height){
  const canvas = document.createElement('canvas')
  const imageBg = await loadImg(bgSrc)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageBg,0,0,width,height)
  return canvas.toDataURL("image/png",1)
}
