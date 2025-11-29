import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

 const handleLogin = async () => {
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axiosInstance.post('login/', {
                username: username,
                password: password,
            });

            console.log("Login response:", response.data);

            // Check for access token to determine success
            if (response.data.access) {
                setMessageColor("green");
                setMessage("Login successful");

                // Store tokens and user info
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                localStorage.setItem("username", response.data.username);

                // Redirect
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            } else {
                setMessageColor("red");
                setMessage(response.data.error || "Login failed");
            }
        } catch (error) {
            setMessageColor("red");
            setMessage(error.response?.data?.error || "Error connecting to server");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };


    // Split text into characters for animation
    const AnimatedText = ({ text, delay = 0 }) => {
        return (
            <span className="inline-block">
                {text.split('').map((char, index) => (
                    <span
                        key={index}
                        className="inline-block animate-fall"
                        style={{
                            animationDelay: `${delay + index * 0.05}s`,
                            opacity: 0,
                            animationFillMode: 'forwards'
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </span>
        );
    };

    return (
        <>
            <style>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-100px) rotate(-10deg);
                        opacity: 0;
                    }
                    50% {
                        transform: translateY(10px) rotate(5deg);
                    }
                    100% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .animate-fall {
                    animation: fall 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }

                .animate-slide-in-left {
                    animation: slideInLeft 0.6s ease-out forwards;
                }

                .animate-slide-in-right {
                    animation: slideInRight 0.6s ease-out forwards;
                }

                .animate-pulse-slow {
                    animation: pulse 3s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }

                .input-focus-animation {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .input-focus-animation:focus {
                    transform: scale(1.02);
                }

                .button-hover {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .button-hover::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    transition: width 0.6s, height 0.6s;
                }

                .button-hover:hover::before {
                    width: 300px;
                    height: 300px;
                }

                .card-enter {
                    animation: fadeInUp 0.8s ease-out;
                }

                @keyframes bounce-in {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .bounce-in {
                    animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }
            `}</style>

            <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated Background Circles */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

                <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 lg:p-10 border border-white/20 relative z-10 ${mounted ? 'card-enter' : 'opacity-0'}`}>
                    {/* Logo/Header Section */}
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg bounce-in animate-pulse-slow">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl text-black sm:text-3xl lg:text-4xl font-bold bg-clip-text  mb-2 sm:mb-3">
                            <AnimatedText text="Welcome to xpensa" delay={0.3} />
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: '1.5s', opacity: 0, animationFillMode: 'forwards' }}>
                            Sign in to continue to your account
                        </p>
                    </div>

                    <div className="space-y-5 sm:space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2 sm:space-y-3 animate-slide-in-left" style={{ animationDelay: '1.7s', opacity: 0, animationFillMode: 'forwards' }}>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 sm:text-base">
                                Username or Email
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username or email"
                                    required
                                    className="w-full px-4 py-3 sm:py-4 pl-11 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 outline-none text-black bg-white/50 shadow-sm hover:shadow-md focus:shadow-lg input-focus-animation"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2 sm:space-y-3 animate-slide-in-right" style={{ animationDelay: '1.9s', opacity: 0, animationFillMode: 'forwards' }}>
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 sm:text-base">
                                    Password
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-all duration-200 font-medium hover:scale-105 inline-block">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-4 py-3 sm:py-4 pl-11 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 outline-none text-black bg-white/50 shadow-sm hover:shadow-md focus:shadow-lg input-focus-animation"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center animate-fade-in-up" style={{ animationDelay: '2.1s', opacity: 0, animationFillMode: 'forwards' }}>
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-300 cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600 font-medium cursor-pointer hover:text-gray-800 transition-colors duration-200">
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Login Button */}
                        <div className="animate-fade-in-up" style={{ animationDelay: '2.3s', opacity: 0, animationFillMode: 'forwards' }}>
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 px-4 rounded-xl font-semibold focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] shadow-lg button-hover relative overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2 relative z-10">
                                        <span>Sign In</span>
                                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div
                            className={`mt-6 p-4 rounded-xl border-2 ${
                                messageColor === 'green' 
                                    ? 'bg-green-50/80 border-green-200 text-green-800' 
                                    : 'bg-red-50/80 border-red-200 text-red-800'
                            } transition-all duration-300 backdrop-blur-sm bounce-in`}
                        >
                            <div className="flex items-center">
                                {messageColor === 'green' ? (
                                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">{message}</span>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 text-center animate-fade-in-up" style={{ animationDelay: '2.5s', opacity: 0, animationFillMode: 'forwards' }}>
                        <p className="text-gray-500 text-sm sm:text-base">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold transition-all duration-200 hover:underline inline-block hover:scale-105">
                                Sign up now
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;