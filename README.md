# el-search-form

这是一个基于`element-ui`的自适应表单容器，能够根据父级容器的宽度确定每行表单控件的数量。

其使用`window.ResizeObserver`来监听容器大小变化，如果有兼容需求，那么需要自行引入`resize-observer-polyfill`。

- [在线预览](https://toesbieya.github.io/el-search-form/example/index.html)

## 安装

```
npm i el-search-form -S
```

该包使用的是`es6`语法，如果想转成`es5`，需要自行转换（比如`vue-cli`可以用`transpileDependencies: ['el-search-form']`）

`el-search-form`会直接使用`element-ui`的`el-form`、`el-row`、`el-col`、`el-button`，需要确保这四个组件均已全局注册，并且记得引入`element-ui`的图标字体。

## 使用

记得在引入`element-ui`的样式后，引入`el-search-form`的样式：
```js
// 需要有scss预处理器
import 'el-search-form/src/style.scss'
// 纯css
// import 'el-search-form/src/style.css'
```

在`el-search-form`内直接书写`el-form-item`即可，不需要考虑`label-width`属性

```html

<template>
  <el-search-form label-position="left" @search="onSearch" @reset="onReset">
    <el-form-item label="v1">
      <el-input v-model="searchForm.v1"></el-input>
    </el-form-item>
    <el-form-item label="v2">
      <el-input v-model="searchForm.v2"></el-input>
    </el-form-item>
    <el-form-item label="v3">
      <el-input v-model="searchForm.v3"></el-input>
    </el-form-item>
    <el-form-item label="v4">
      <el-select v-model="searchForm.v4">
        <el-option v-for="i in 4" :key="i" :label="i" :value="i"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="v5">
      <el-date-picker v-model="searchForm.v5" type="date" value-format="yyyy-MM-dd"></el-date-picker>
    </el-form-item>
    <el-form-item label="v6">
      <el-date-picker v-model="searchForm.v6" type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
    </el-form-item>
  </el-search-form>
</template>
```

```js
export default {
  data() {
    return {
      searchForm: {
        v1: null,
        v2: null,
        v3: null,
        v4: null,
        v5: null
      }
    }
  },

  methods: {
    onSearch() {
      alert('查询')
    },
    onReset() {
      alert('重置')
    }
  }
}
```

注意！为了实现自适应功能，`el-search-form`内的每个表单控件宽度必须相同，比如常见的开始时间、结束时间必须拆成两个控件（或者用范围选择器），不然控件超宽会导致样式出错

## API说明

### Attributes

|名称|说明|类型|默认|
|:---:|:---:|:---:|:---:|
|defaultExpand|是否默认展开|`boolean`|`false`|
|size|等同于el-form的size|`string`|-|
|labelWidth|等同于el-form的labelWidth，不填时会取最长的控件label的长度（中文1em，英文0.5em）|`string`|-|
|labelPosition|等同于el-form的labelPosition，不支持top|`string`|`'right'`|
|labelSuffix|等同于el-form的labelSuffix|`string`|`'：'`|
|gutter|等同于el-row的gutter|`number`|`20`|
|xs|父级宽度<768px时，每行能有多少个控件（包含操作按钮组），需要是24的因数|`number`|`1`|
|sm|父级宽度>=768px|`number`|`2`|
|md|父级宽度>=998px|`number`|`3`|
|lg|父级宽度>=1200px|`number`|`4`|


### Events

|事件名称|说明|回调参数|
|:---:|:---:|:---:|
|search|点击查询按钮触发|-|
|reset|点击重置按钮触发|-|
