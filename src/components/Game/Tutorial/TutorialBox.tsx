import React, { useState } from 'react'
import { GrPrevious, GrNext } from "react-icons/gr";

import tutorial1 from '../../../videos/tutorial-1.mp4'
import tutorial2 from '../../../videos/tutorial-2.mp4'

const TutorialBox = () => {

    const maxPage = 3

    const [page, setPage] = useState<number>(1)


    return (
    <div className="flex flex-col justify-center w-full sm:w-fit bg-white px-0 sm:px-10 py-5 shadow rounded-t-lg sm:rounded-lg">
        <div className="flex w-full px-5 sm:px-0">
            <button onClick={() => {setPage((page) => (Math.max(page - 1, 1)))}} className={`w-[16px] h-[25px]`} disabled={(page === 1)}>{(page !== 1) && <GrPrevious />}</button>
            <div className="text-center w-full mb-4 font-bold text-lg text-gray-700">How to Play ({page}/{maxPage})</div>
            <button onClick={() => {setPage((page) => (Math.min(page + 1, maxPage)))}} className={`w-[16px] h-[25px]`} disabled={(page === maxPage)}>{(page !== maxPage) && <GrNext />}</button>
        </div>
        <div className="flex flex-col text-center w-full h-20 mb-4 text-md text-gray-700">
            {
                (page === 1) && (
                    <>
                        <div className="w-full text-center break-words">Type English word that contain specified letters</div>
                        <div className="w-full text-center break-words">Some examples for letters <span className="text-indigo-600 font-bold">EN</span> are P<span className="text-indigo-600 font-bold">EN</span>CIL or KITCH<span className="text-indigo-600 font-bold">EN</span>S</div>
                        <div className="w-full text-center break-words">These letters must be adjacent!</div>
                    </>  
                )
            }
            {
                (page === 2) && (
                    <>
                        <div className="w-full text-center break-words">You can type with your keyboard or in-app keyboard</div>
                        <div className="w-full text-center break-words">Answer within <span className="text-indigo-600 font-bold">10 seconds</span> or lose your life</div>
                    </>
                )
            }
            {
                (page === 3) && (
                    <>
                        <div className="w-full text-center break-words">You have <span className="text-indigo-600 font-bold">2 lifes</span> for each game</div>
                        <div className="w-full text-center break-words">Losing all 2 lifes will result in game over!</div>
                    </>
                )
            }
            
        </div>
        <div className="h-[360px]">
            {
                (page === 1 || page === 2) &&
                <video src={tutorial1} width="640" height="360" autoPlay loop muted className="bg-slate-100">
                This browser does not support video
                </video>
            }
            {
                (page === 3) &&
                <video src={tutorial2} width="640" height="360" autoPlay loop muted className="bg-slate-100">
                This browser does not support video
                </video>
            }
            
        </div>
        
    </div>
    )
}

export default TutorialBox