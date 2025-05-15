import React from 'react'

const IconBtn = ({ Icon, isActive, color, children, ...props}) => {
// console.log(Icon,"Icon")
// console.log(isActive,"isActive")
// console.log(color,"color")
// console.log(children,"children")
// console.log(props,"props")
  return (
    <button className={`btn icon-btn ${isActive ? 'active' : ''} ${color||""}`} {...props}>
    <span className={`${children!=null ? "mr-1" :""}`}>

        <Icon/>
    </span>
      {children}
    </button>
  )
}

export default IconBtn
