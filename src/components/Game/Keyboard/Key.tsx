import React from 'react'

const Key = ({value, handleKeyType} : {value: string, handleKeyType: (key: string) => void}) => {
    const buttonWidth = (value == "ENTER" || value == "BACKSPACE") ? "w-24" : "w-9"
    return (
    <div 
        className={"flex items-center justify-center h-12 bg-slate-200 hover:bg-slate-300 rounded-md" + " " + buttonWidth}
        onClick={() => handleKeyType(value)}
    >
        <span className="h-fit">{value}</span>
    </div>
    )
}

export default Key