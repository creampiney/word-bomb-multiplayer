import React from 'react'

const AvatarSkeleton = ({size}: {size?: number}) => {
  return (
    <>
      <div className={`flex flex-row animate-pulse w-${size} h-${size}`}>
        <div className="w-24 bg-slate-300 h-24 rounded-full "></div>
        {/* <div className={`w-${size} h-${size} rounded-full bg-slate-300`}></div> */}
      </div>
    </>
    
    
  )
}

export default AvatarSkeleton