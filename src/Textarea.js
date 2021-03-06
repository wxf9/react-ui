import React, { Component } from 'react'
import classnames from 'classnames'
import { objectAssign } from './utils/objects'
import { getGrid } from './utils/grids'
import { filterTextareaProps } from './utils/propsFilter'
import FormItem from './higherOrders/FormItem'
import Trigger from './higherOrders/Trigger'
import { cloneShadow } from './utils/dom'
import PropTypes from './utils/proptypes'
import { compose } from './utils/compose'

import _inputs from './styles/_input.scss'

class Textarea extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    if (this.props.autoHeight) {
      let el = this.element

      // wait css
      setTimeout(() => {
        this.minHeight = el.clientHeight
        this.shadow = cloneShadow(el)
      })
    }
  }

  componentWillUnmount () {
    if (this.shadow) {
      this.element.parentNode.removeChild(this.shadow)
    }
  }

  handleChange (event) {
    let value = event.target.value
    if (this.props.autoHeight) {
      this.shadow.value = value
      this.element.style.height = Math.max(this.minHeight, this.shadow.scrollHeight) + 'px'
    }
    this.props.onChange(event.target.value, event)
  }

  render () {
    let { className, grid, autoHeight, readOnly, value, size, ...other } = this.props

    let style = {}
    if (autoHeight) {
      style.resize = 'none'
      style.overflowY = 'hidden'
    }

    const props = {
      className: classnames(
        className,
        getGrid(grid),
        readOnly && _inputs.disabled,
        size && _inputs[size],
        _inputs.input
      ),
      onChange: readOnly ? undefined : this.handleChange,
      style: objectAssign({}, this.props.style, style),
      readOnly
    }

    return (
      <textarea ref={(el) => { this.element = el }} { ...filterTextareaProps(other, props) } value={value} />
    )
  }
}

Textarea.propTypes = {
  autoHeight: PropTypes.bool,
  className: PropTypes.string,
  grid: PropTypes.grid,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  rows: PropTypes.number,
  size: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.any
}

Textarea.defaultProps = {
  style: {},
  grid: 1,
  rows: 10,
  size: 'middle',
  value: ''
}

export default compose(
  FormItem.register(['textarea'], {}),
  Trigger
)(Textarea)

