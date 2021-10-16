/**
 * 将.scss编译为.css，输出到dist/index.min.css
 *
 * 完整样式，包含maxViewHeight.scss
 */

const fs = require('fs')
const path = require('path')
const sass = require('sass')
const cssnano = require('cssnano')
const { calcTimeCost, mkdirWhenNoExist, getFileDir } = require('./util')

// 输入文件
const input = path.resolve(__dirname, '../src/style.scss')
// 输出文件
const output = path.resolve(__dirname, '../src/style.css')

async function compile() {
  const modulePath = path.resolve(__dirname, '../node_modules')

  try {
    const result = sass.renderSync({
      file: input,
      outputStyle: 'compressed',
      importer(url, prev) {
        if (url.startsWith('~')) {
          return { file: path.join(modulePath, url.substring(1)) }
        }
        return { file: prev }
      }
    })

    // from: undefined 用来阻止cssnano显示警告
    const { css } = await cssnano().process(result.css, { from: undefined })

    fs.writeFileSync(output, css)
  }
  catch (e) {
    throw e
  }
}

calcTimeCost(() => {
  mkdirWhenNoExist(getFileDir(output))
  return compile()
}, 'Start scss compilation ...', 'Finish scss compilation')
