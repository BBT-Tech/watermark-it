const fs = require('fs')
const path = require('path')
const express = require('express')
async function scandir(dir, prefix = '') {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, async (err, data) => {
      if (err) {
        reject(err)
        return
      }

      let ret_data = []
      for (let file of data) {
        if(file.substr(0,1)!=='.'){
          let stat = fs.lstatSync(path.resolve(dir,file))
          if (stat.isDirectory()) {
            let subs = await scandir(path.resolve(dir, file), prefix + file + '/')
            ret_data.push(...subs)
          }
          else if (stat.isFile()) {
            ret_data.push(prefix + file)
          }
        }

      }
      resolve(ret_data)
    })
  })
}
module.exports = function (app) {
  app.use('/watermarks', express.static(path.resolve(__dirname,'./uploads/watermarks')))
  app.use('/configs', express.static(path.resolve(__dirname,'./uploads/configs')))
  app.get('/api/watermarks', async (req, res) => {
    const files = await scandir(path.resolve(__dirname, './uploads/watermarks'))
    res.send(files)
  })
  app.get('/api/configs', async(req,res) => {
    const files = await scandir(path.resolve(__dirname, './uploads/configs'))
    res.send(files)
  })
  app.post('/api/configs', async(req,res) => {
    const files = await scandir(path.resolve(__dirname, './uploads/configs'))
    res.send(files)
  })
}
