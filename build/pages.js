const glob = require('glob')
const con = require('console')

//console.log('获取页面文件中...')
const files = glob.sync('**/views/**/main.js')
const pages = {}
files.forEach(item => {
  const items = item.split('/')
  let page = items[items.length - 2]
  const pageParent = items[items.length - 3]
  if (page === 'frame') {
    page = `${pageParent}Frame`
  }
  pages[page] = item
})
con.log('文件获取结束',JSON.stringify(pages))

module.exports = pages