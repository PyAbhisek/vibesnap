import vibeSnapLogo from '../Assests/vibeSnapLogo.svg'
import googleLogo from '../Assests/google.svg'
const SignUp = () => {

    return (
        <>
            <div className="h-[100vh] bg-[grey]  ">
                <div className="h-[63%] ">hi</div>
                <div className="h-[37%] border rounded-t-[3.9rem] bg-[white] flex flex-col items-center ">
                    <div className='flex flex-col justify-center items-center mt-[2.1rem] mx-[2.3rem]'>
                        <div className='flex'>
                            <img src={vibeSnapLogo} alt="vibeSnapLogo" className='w-[2.8rem] h-auto' />
                            <p className=' leading-[2rem] font-semibold text-[1.75rem] font-karla'>Vibesnap</p>
                        </div>
                        <p className=' mt-[0.5rem] leading-[1.2rem] font-normal text-[1rem] font-kumbh'>Moments That Matter, Shared Forever.</p>
                    </div>

                    <div className='flex flex-col bg-[#292929] mt-[1.8rem]  rounded-[1.6rem]'>
                        <button className='flex items-center'>
                            <img src={googleLogo} alt="googleLogo" className='w-[1.1rem] h-[auto] my-[1rem] ml-[1rem]' />
                            <p className=' ml-[0.87rem] leading-[1.4rem] font-bold text-[1rem] text-white font-karla mr-[1.18rem]'>Continue with Google</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp