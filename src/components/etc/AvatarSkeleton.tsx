import React from 'react'

const AvatarSkeleton = ({size}: {size: number}) => {
  return (
    <div className={`animate-pulse h-${size}`}>
      <div className={`w-${size} h-${size} rounded-full bg-slate-300`}></div>
    </div>
    
  )
}

export default AvatarSkeleton