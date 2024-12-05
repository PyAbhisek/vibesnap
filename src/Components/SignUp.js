import vibeSnapLogo from '../Assests/vibeSnapLogo.svg'
import googleLogo from '../Assests/google.svg'
import background from "../Assests/backgroung.svg"
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../Services/Firebase'
import { useContext } from 'react'
import { AppContext } from '../Context/AppContextProvider'
const SignUp = () => {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { setUserInfo } = context

    const handleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            setUserInfo(user)
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };
    return (
        <>
            <div className="h-[100vh]">
                <div className="h-[63%] "><img src={background} className='w-full' /></div>
                <div className="h-[37%] z-[100] relative  rounded-t-[3.9rem] bg-[white] flex flex-col items-center ">
                    <div className='flex flex-col justify-center items-center mt-[2.1rem] mx-[2.3rem]'>
                        <div className='flex'>
                            <img src={vibeSnapLogo} alt="vibeSnapLogo" className='w-[2.8rem] h-auto' />
                            <p className=' leading-[2rem] font-semibold text-[1.75rem] font-karla'>Vibesnap</p>
                        </div>
                        <p className=' mt-[0.5rem] leading-[1.2rem] font-normal text-[1rem] font-kumbh'>Moments That Matter, Shared Forever.</p>
                    </div>

                    <div className='flex flex-col bg-[#292929] mt-[1.8rem]  rounded-[1.6rem]'>
                        <button className='flex items-center' onClick={handleSignUp}>
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