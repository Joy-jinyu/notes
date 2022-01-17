import React from 'react'
import classNames from 'classnames';
export default function Icon(props) {
  let {className}=props||{};
  return (
    <svg {...props} className={classNames("icon",className)} aria-hidden="true">
      <use xlinkHref={`#icon-${props.icon||''}`} />
    </svg>
  )
}