/**
 * 判断是否为空值，undefined、null、'' 都视为空值
 *
 * @param str {*}
 * @return {boolean}  若为空值，返回true，否则返回false
 */
function isEmpty(str) {
  return str === undefined || str === null || str === ''
}

/**
 * 获取元素的内宽（扣除左右padding后）
 *
 * @param el {HTMLElement}
 * @return {number}
 */
function getElementInnerWidth(el) {
  if (!el) return 0

  const style = window.getComputedStyle(el)
  const { width, paddingLeft, paddingRight } = style

  return parseFloat(width) - (parseFloat(paddingLeft) + parseFloat(paddingRight))
}

export default {
  name: 'ElSearchForm',

  model: {
    prop: 'model',
    event: 'reset'
  },

  props: {
    // 搜索表单变量对象，暂时无用
    model: Object,
    // 是否默认展开全部
    defaultExpand: { type: Boolean, default: false },

    // el-form原始属性
    size: String,
    labelWidth: String,
    labelPosition: { type: String, default: 'right' },
    labelSuffix: { type: String, default: '：' },

    // 每个搜索项之间的间隔，等同于el-row的gutter
    gutter: { type: Number, default: 20 },

    /* 每个宽度下，一行能有多少个控件，需要是24的因数*/
    xs: { type: Number, default: 1 }, // <768px
    sm: { type: Number, default: 2 }, // >=768px
    md: { type: Number, default: 3 }, // >=998px
    lg: { type: Number, default: 4 }  // >=1200px
  },

  data(vm) {
    return {
      maxLabelLength: 0,            // 子级el-form-item中最长的label长度，中文占1，英文占0.5
      showCollapse: false,          // 是否需要折叠控制
      collapse: !vm.defaultExpand,  // 是否处于折叠状态
      num: 0,                       // 从第几个控件开始需要隐藏
      span: 8                       // 24等分下，每个栅格的宽度，这里是默认值
    }
  },

  computed: {
    innerLabelWith() {
      // 优先使用传入的props.labelWidth
      if (!isEmpty(this.labelWidth)) return this.labelWidth

      // 否则使用子级最长的label长度 + 固定后缀长度（固定为1）+ 1
      const fixedLength = isEmpty(this.labelSuffix) ? 0 : 1
      return `${this.maxLabelLength + fixedLength + 1}em`
    }
  },

  watch: {
    defaultExpand: {
      immediate: true,
      handler(v) {
        v && (this.collapse = false)
      }
    }
  },

  methods: {
    handleCollapse() {
      this.collapse = !this.collapse
    },
    handleSearch() {
      this.$emit('search')
    },
    handleReset() {
      this.$emit('reset')
    },
    handleSubmit() {
      this.handleSearch()
    },

    /**
     * 获取一行能容纳的元素数量
     *
     * @return {Number}
     */
    getElementNumInRow() {
      const vw = getElementInnerWidth(this.$el.parentNode)

      if (vw < 768) return this.xs
      if (vw < 998) return this.sm
      if (vw < 1200) return this.md
      return this.lg
    },

    resize() {
      const num = this.getElementNumInRow()

      this.span = 24 / num

      // 考虑后面的按钮组的占位
      this.num = num === 1 ? num : num - 1

      this.showCollapse = this.num < this.$slots.default.length
    },

    /**
     * 渲染查询按钮
     *
     * @param h {Vue.CreateElement}
     * @return {Vue.VNode}
     */
    renderSearchBtn(h) {
      const data = {
        props: { type: 'primary' },
        on: { click: this.handleSearch }
      }
      return h('el-button', data, ['查 询'])
    },
    /**
     * 渲染重置按钮
     *
     * @param h {Vue.CreateElement}
     * @return {Vue.VNode}
     */
    renderResetBtn(h) {
      const data = {
        props: { type: 'dashed', plain: true },
        on: { click: this.handleReset }
      }
      return h('el-button', data, ['重 置'])
    },
    /**
     * 渲染展开折叠按钮
     *
     * @param h {Vue.CreateElement}
     * @return {Vue.VNode | undefined}
     */
    renderCollapseBtn(h) {
      if (!this.showCollapse) return

      const ctrl = this.collapse
        ? { i: 'el-icon-arrow-down', t: '展开' }
        : { i: 'el-icon-arrow-up', t: '收起' }

      const data = {
        staticClass: 'el-search-form__action-button',
        props: { type: 'text' },
        on: { click: this.handleCollapse }
      }
      const icon = h('i', { 'class': ctrl.i })

      return h('el-button', data, [ctrl.t, icon])
    },
    /**
     * 渲染按钮组
     *
     * @param h {Vue.CreateElement}
     * @return {Vue.VNode}
     */
    renderAction(h) {
      return h(
        'el-col',
        {
          staticClass: 'el-search-form__action',
          props: { span: this.span }
        },
        [
          h(
            'el-form-item',
            { props: { labelWidth: '0' } },
            [
              this.renderSearchBtn(h),
              this.renderResetBtn(h),
              this.renderCollapseBtn(h)
            ])
        ])
    },
    /**
     * 为子级元素包裹一个el-col
     *
     * @param h {Vue.CreateElement}
     * @param children {Vue.VNode[]}
     * @param hide {boolean=} 该元素是否不需要显示
     * @return {Vue.VNode[]}
     */
    renderChildren(h, children, hide = false) {
      return children.map(child => {
        const data = {
          'class': { hide },
          props: { span: this.span }
        }
        return h('el-col', data, [child])
      })
    }
  },

  mounted() {
    this.resize()
    this.$ResizeObserver = new window.ResizeObserver(this.resize)
    this.$ResizeObserver.observe(this.$el.parentNode)

    this.$once('hook:beforeDestroy', () => {
      if (this.$ResizeObserver) {
        this.$ResizeObserver.disconnect()
        delete this.$ResizeObserver
      }
    })
  },

  render(h) {
    const slots = this.$slots.default.filter(i => i.tag)
    const collapse = this.showCollapse && this.collapse

    this.maxLabelLength = Math.max(...slots.map(vnode => {
      const label = vnode.componentOptions?.propsData?.label
      if (isEmpty(label)) return 0

      // 计算label对应多少em，中文为1em，英文为0.5em
      let num = 0
      for (let i = 0; i < label.length; i++) {
        num += label.charCodeAt(i) > 127 ? 1 : 0.5
      }
      return num
    }))

    const display = collapse ? slots.slice(0, this.num) : slots
    const hidden = collapse ? slots.slice(this.num) : []

    return h(
      'el-form',
      {
        staticClass: 'el-search-form',
        props: {
          size: this.size,
          labelPosition: this.labelPosition,
          labelWidth: this.innerLabelWith,
          labelSuffix: this.labelSuffix
        },
        nativeOn: {
          submit: this.handleSubmit
        }
      },
      [
        h(
          'el-row',
          { props: { gutter: this.gutter } },
          [
            this.renderChildren(h, display),
            this.renderChildren(h, hidden, true),
            this.renderAction(h)
          ]
        )
      ]
    )
  }
}
