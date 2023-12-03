import React from 'react'

const Avatar = ({src, size}: {src: string, size: number}) => {
  return (
    <img src={src} className={`w-${size} h-${size} rounded-full`} />
  )
}

export default Avatar