import React from 'react'

const LetterDisplay = ({letter, status}: {letter: string, status: string}) => {

    const color = (status === "Normal") ? "bg-white" : ((status === "Filled") ? "bg-indigo-200" : "bg-slate-200 opacity-50")

    
    return (
      <div 
          className={"flex items-center justify-center w-8 h-12 rounded-md " + color}
      >
          <span className="h-fit">{letter}</span>
      </div>
    )
}

export default LetterDisplay