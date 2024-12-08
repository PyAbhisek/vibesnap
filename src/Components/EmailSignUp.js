import { useState, useContext } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContextProvider";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Services/Firebase';
const EmailSignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const context = useContext(AppContext);
    if (!context) {
        throw new Error("AppContext must be used within an AppContextProvider");
    }
    const { userInfo, setUserInfo } = context;



    const auth = getAuth();
    const navigate = useNavigate()

    const resetPassword = async () => {
        if (!email) {
            alert("Please enter your email to reset the password.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent! Please check your inbox.");
        } catch (error) {
            console.error("Error sending reset email:", error.message);
            if (error.code === "auth/user-not-found") {
                alert("No account found with this email.");
            } else {
                alert("Failed to send password reset email.");
            }
        }

    }
    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Send email verification
                await sendEmailVerification(user);
                alert("Verification email sent! Please check your inbox.");

                console.log("User created:", user);
            }
            else {
                const user = await signInWithEmailAndPassword(auth, email, password);
                const userRef = doc(db, 'users', user?.user.uid);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                localStorage.setItem("user", JSON.stringify({ ...user?.user, ...userData }));
                setUserInfo({ ...user?.user, ...userData });
                navigate("/feed")

            }
        } catch (error) {
            console.error("Error during sign up:", error.message);
            if (error.code === "auth/email-already-in-use") {
                alert("This email is already registered. Please log in.");
            }
            if (error.code === "auth/invalid-credential") {
                alert("password is incorrect");
            }
        }
    };

    return (
        <>
            <div className="font-karla font-bold text-[1rem] mt-[5px]">OR</div>
            <form onSubmit={handleSignUp} className="mt-[0.5rem] w-[90%]">
                <div>Email</div>
                <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                />
                <div>Password</div>
                <input
                    type="password"
                    placeholder="Enter your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                />
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-[#292929] text-white rounded font-bold"
                    >
                        {!isSignUp ? "Login" : "Sign Up"}
                    </button>
                    <div
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="mt-2 text-blue-500 cursor-pointer"
                    >
                        {!isSignUp ? "New User? Sign Up" : "Already a user? Login"}
                    </div>
                </div>
            </form>
            <div
                onClick={() => resetPassword("")}
                className="mt-2 text-blue-500 cursor-pointer"
            >
                Reset Passowrd
            </div>


        </>
    );
};

export default EmailSignUp;
