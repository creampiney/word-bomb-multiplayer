import React from 'react'
import Avatar1 from '../../images/avatar1.png'
import Avatar2 from '../../images/avatar2.png'
import Avatar3 from '../../images/avatar3.png'
import Avatar4 from '../../images/avatar4.png'
import Avatar5 from '../../images/avatar5.png'
import Avatar6 from '../../images/avatar6.png'

const SelectableAvatar = ({src, size, onClick, isSelected}: {src: number, size: number, onClick: (idx: number) => void, isSelected: boolean}) => {

  const ImageMapper = [
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
    Avatar6
  ]

  return (
    <img src={ImageMapper[src-1]} className={`w-${size} h-${size} hover:border-2 hover:border-gray-700 rounded-full ${(isSelected) && "ring-2 ring-indigo-300"}`} onClick={() => {onClick(src)}} />
    // <div className={`w-${size} h-${size} rounded-full`}>
        
    // </div>
    
  )
}

export default SelectableAvatar