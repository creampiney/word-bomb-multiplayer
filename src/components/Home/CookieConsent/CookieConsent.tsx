import React from 'react'

const CookieConsent = ({handleSubmit, group}: {handleSubmit: (isAccept: boolean) => void, group: string}) => {
  return (
    <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none bg-white opacity-80"></div>
        
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-30 outline-none focus:outline-none">
            <div className="relative w-[600px] my-6 mx-auto max-w-3xl bg-white z-40 flex flex-col justify-center py-5 space-y-5 shadow-md rounded-2xl">
                <div className="flex justify-center">
                    <svg width="76" height="70" viewBox="0 0 76 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M70.277 33.3907C70.1838 34.0061 70.2994 34.6365 70.3319 35.2603C70.3901 36.3549 70.4767 37.4488 70.5016 38.5418C70.5765 41.835 70.3727 45.2693 68.7374 48.212C68.6051 48.4496 68.4661 48.6854 68.318 48.9188C68.199 49.1074 68.0575 49.2801 67.9035 49.4412C66.5304 50.8806 65.3004 52.4711 64.1703 54.1505C62.3253 56.8922 60.9713 60.6505 58.4706 62.8357C56.4983 64.5591 53.7887 65.1812 51.3304 65.8722C49.0252 66.5201 47.2659 67.8921 45.148 68.9303C43.1108 69.9287 40.6891 70.1596 38.4571 69.9037C36.5855 69.6895 34.7822 69.8406 32.918 69.3896C31.1721 68.9669 29.3787 68.2783 27.7318 67.7742C23.7855 66.5657 19.26 67.0549 15.8522 64.452C13.1442 62.3847 11.3275 59.3565 8.44899 57.4802C7.19736 56.6646 5.92743 55.8249 4.99204 54.663C2.58617 51.6755 4.41034 47.4695 3.25941 44.0517C3.12293 43.6448 2.96565 43.2395 2.78589 42.8358C2.65524 42.5185 2.51377 42.2062 2.36231 41.8981C0.0404816 37.1656 -0.315698 31.4812 1.43358 26.502C1.52262 26.2495 1.63913 26.0053 1.78476 25.7811C2.79671 24.2221 4.17816 22.8733 4.89135 21.1449C5.58374 19.4688 5.64698 17.615 6.18125 15.8924C6.82537 13.816 8.16021 11.6699 9.98272 10.4415C12.1206 9.00211 14.6355 8.22304 16.7784 6.64249C19.8343 4.38918 22.7877 1.57275 26.4785 0.385048C30.2092 -0.816772 33.6212 1.1666 37.3303 1.29866C37.6848 1.31112 38.0394 1.31278 38.3989 1.31278C38.4122 1.31278 38.4247 1.31278 38.438 1.31278C40.2122 1.31029 41.7127 2.64251 41.8974 4.40413C41.944 4.84432 42.0505 5.26874 42.2428 5.64997C42.7196 6.59681 42.703 7.71806 42.2378 8.67071C41.3523 10.4838 40.4777 13.3493 41.8691 16.061C43.1565 18.5718 45.5341 19.4182 47.35 19.6814C48.7489 19.8841 49.8707 20.9123 50.236 22.2745C50.6929 23.9804 51.605 26.056 53.3975 26.8342C55.384 27.6964 58.2134 27.1224 60.1158 26.546C61.2734 26.1955 62.5384 26.4538 63.438 27.2603C64.4275 28.1465 65.9695 29.0975 67.9859 29.0211C67.9859 29.0211 70.9677 28.8027 70.2753 33.3915L70.277 33.3907Z" fill="#F7B658"/>
                        <path d="M13.1442 18.6001C14.0546 16.2645 17.1746 15.0968 19.6453 17.0428C22.1153 18.9888 20.4168 23.7936 15.4619 23.4007C12.188 23.1416 12.2346 20.9356 13.1451 18.5992L13.1442 18.6001ZM34.8803 4.82772C33.0495 4.26792 31.4109 5.78286 31.6231 7.66159C31.7946 9.17902 33.1094 10.4498 34.5791 10.7479C36.5156 11.1408 38.1842 11.5353 38.2383 8.91075C38.2116 8.61258 38.1584 8.32437 38.0793 8.04946C37.6707 6.6209 36.2992 5.26376 34.8795 4.82855L34.8803 4.82772ZM28.9751 30.3458C28.5282 30.4397 28.1346 30.2287 27.6868 30.2985C27.1218 30.3865 26.57 30.6722 26.139 31.041C22.4723 34.1772 29.9055 38.4911 32.9272 35.4845C34.6498 33.7702 34.5916 30.3849 31.9335 29.6482C31.371 29.492 30.7493 29.4854 30.1943 29.6764C29.774 29.8209 29.4644 30.2138 29.04 30.3301C29.0184 30.3359 28.9967 30.3409 28.9759 30.3458H28.9751ZM43.6791 21.2329C43.442 21.1225 43.2422 20.9148 43.0949 20.5211C42.8278 19.8077 43.0633 19.3052 42.3942 18.8152C40.0999 17.135 38.7467 20.4256 38.8516 22.1233C38.9714 24.0577 40.0558 26.3243 42.1204 26.767C43.4228 27.046 44.9224 26.6183 45.8337 25.6332C46.4787 24.9356 46.9022 23.8367 46.6193 22.9024C46.0992 21.1864 44.8892 21.7977 43.6791 21.2338V21.2329ZM17.1279 40.668C15.2231 38.8823 11.9009 38.2195 10.239 40.8724C9.57411 41.8674 9.57411 43.1938 9.90699 44.1888C11.236 47.173 14.891 45.5152 17.5016 45.8507C17.7513 45.7494 17.936 45.56 18.065 45.3092C18.194 45.0592 18.2672 44.7477 18.2947 44.4064C18.3221 44.065 18.303 43.6913 18.2464 43.3167C17.8811 42.5302 17.8811 41.8674 17.5366 41.2893C17.4034 41.0484 17.2644 40.8366 17.1279 40.668ZM26.7398 51.0741C24.859 51.815 23.198 54.1364 24.527 56.1256C25.856 57.452 28.514 56.1256 29.6467 57.9968C29.8056 58.3133 29.9795 58.4811 30.1576 58.5442C30.5138 58.6696 30.8866 58.3772 31.1787 57.9894C31.3244 57.795 31.4509 57.5774 31.5441 57.3756C33.4981 54.4678 31.505 49.4936 27.5329 50.7593C27.2599 50.8341 26.9928 50.9404 26.7398 51.0741ZM48.9178 43.5351C49.8216 41.4961 49.6526 38.4014 47.0454 37.8093C45.9835 37.5676 44.6844 37.982 44.4822 39.178C44.0611 41.6689 38.998 39.0725 39.5323 42.6215C39.9243 45.2253 42.6431 46.3906 45.108 46.0825C46.7358 45.879 48.2529 45.0335 48.917 43.5351H48.9178ZM62.9387 34.3018C61.1186 33.134 56.698 34.9654 57.6084 37.6182C58.5189 40.271 62.0291 41.5684 64.1095 40.1415C66.19 38.7137 66.5487 36.9754 65.5085 35.5485C64.4682 34.1207 62.9395 34.3026 62.9395 34.3026L62.9387 34.3018ZM52.82 57.2967C53.1004 56.1256 54.4295 54.1364 53.1004 53.8042C51.7714 53.4728 49.7775 53.4728 48.689 54.6621C48.5067 54.7876 48.3328 54.9246 48.1672 55.0749C48.0024 55.2253 47.846 55.3881 47.7011 55.5658C47.0687 56.3399 46.442 57.3714 46.6484 58.4088C46.7974 59.158 47.33 59.8199 48.0315 60.1256C49.1908 60.6314 50.5056 60.1505 51.4419 59.3606C51.6291 59.2028 51.8014 59.0317 51.9528 58.8548C52.1659 58.6056 52.3415 58.3432 52.4846 58.0791C52.6277 57.8158 52.7359 57.5533 52.8208 57.2967H52.82Z" fill="#593412"/>
                        <path d="M65.4752 24.0469C65.6 24.5851 65.3828 25.3816 64.6871 25.2952C63.7059 25.1732 61.6454 25.8592 61.444 24.6175C61.2435 23.3808 63.1226 22.5635 64.3992 22.9423C64.9176 23.0959 65.3362 23.4473 65.476 24.0478L65.4752 24.0469ZM74.3239 27.5859C73.7197 27.0162 73.1422 26.7329 72.5463 27.6648C72.0171 28.4929 73.0074 29.3783 72.791 30.198C72.5746 31.0178 72.4074 31.5203 73.5142 31.7188C74.3539 31.87 75.3542 31.1623 75.5972 30.3783C75.8826 29.4547 75.2352 28.5228 74.6268 27.8899C74.5245 27.7836 74.4229 27.6806 74.3231 27.5859H74.3239ZM73.1314 23.8642C72.0221 23.8642 71.5227 24.9016 72.3966 25.2479C73.2704 25.5934 75.142 24.2105 73.1314 23.8642ZM51.6549 1.96897C50.6954 1.41416 49.7417 2.062 50.3234 2.79787C50.9051 3.53458 53.2203 3.27378 51.6549 1.96897ZM68.5776 25.5644C67.9393 25.5428 66.8283 26.0178 68.2597 26.8492C68.7457 27.1316 69.8941 28.3044 69.9915 27.076C70.0573 26.2487 69.379 25.5918 68.5776 25.5644ZM67.8761 20.9232C67.3318 21.4647 66.8783 22.3069 67.415 22.5336C68.1823 22.8567 69.9948 22.6042 69.7285 21.4522C69.6353 21.0494 69.1335 20.635 68.7599 20.4697C68.561 20.3817 68.2023 20.5984 67.8752 20.9232H67.8761ZM44.2209 0.787916C43.3013 0.532935 42.8428 1.84605 43.4786 2.4806C44.1144 3.11515 43.3729 3.74554 44.751 4.17079C46.1291 4.59686 46.1291 1.31615 44.2209 0.787086V0.787916ZM45.4093 6.81612C44.9574 6.83938 44.667 7.29785 44.7643 7.7206C44.8817 8.22807 45.2969 8.2505 45.7072 8.39419C45.9644 8.48389 46.2681 9.1475 46.596 8.85016C46.6792 8.77541 46.7108 8.65664 46.7058 8.54452C46.6751 7.84435 46.2623 6.77127 45.4085 6.81612H45.4093Z" fill="#F7B658"/>
                    </svg>
                </div>
                <div className="flex justify-center font-bold text-2xl">
                    Cookie Consent
                </div>
                <div className="flex justify-center px-8 text-justify">
                    {"We use necessary cookies to make our site work. We would like to set additional cookies to understand site usage, make site improvements and to remember your settings. We also use cookies set by other sites to help deliver content from their services."} 
                </div>
                <div className="flex justify-center space-x-3">
                    {/* <button 
                        className="text-gray-900 hover:bg-slate-100 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 w-36 border-2 border-slate-400" 
                        onClick={() => {handleSubmit(false)}}
                    >
                        Decline cookies
                    </button> */}
                    <button 
                        className={`${(group === "B") ? "text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-blue-700" : "text-white bg-indigo-700 hover:bg-indigo-800"} focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 w-36`} 
                        onClick={() => {handleSubmit(false)}}
                    >
                        Decline cookies
                    </button>
                    <button 
                        className={`text-white ${(group === "B") ? "bg-green-700 hover:bg-green-800" : "bg-indigo-700 hover:bg-indigo-800"} focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 w-36`} 
                        onClick={() => {handleSubmit(true)}}
                    >
                        Accept cookies
                    </button>
                </div>
            </div>
        
        </div>
    </>
    
  )
}

export default CookieConsent