import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

// In your login.jsx handleLogin function
const handleLogin = async () => {
    setIsLoading(true);
    setMessage('');

    try {
        // Use the API instance for login
        const response = await API.post("/login/", {
            username: username,
            password: password
        });

        const data = response.data;
        console.log('Login response:', data); // Debug log

        if (data.status === "success") {
            setMessageColor("green");
            setMessage(data.message);
            
            // Store user information and token in localStorage
            if (data.user && data.token) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', data.token);  // Store the token
                console.log('Token stored:', data.token); // Debug log
            } else {
                console.error('No token received in login response');
            }
            
            // Redirect to dashboard
            navigate("/dashboard");
        } else {
            setMessageColor("red");
            setMessage(data.message || "Login failed");
        }
    } catch (error) {
        setMessageColor("red");
        if (error.response?.data?.message) {
            setMessage(error.response.data.message);
        } else {
            setMessage("Error connecting to server");
        }
        console.error('Login error:', error);
    } finally {
        setIsLoading(false);
    }
};
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className="min-w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md mx-auto p-6 sm:p-8 lg:p-10 border border-white/20">
                {/* Logo/Header Section */}
                <div className="text-center mb-8 sm:mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                        Welcome to xpensa
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base">Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2 sm:space-y-3">
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
                                className="w-full px-4 py-3 sm:py-4 pl-11 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 outline-none text-black bg-white/50 shadow-sm hover:shadow-md focus:shadow-lg"
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 sm:text-base">
                                Password
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 font-medium">
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
                                className="w-full px-4 py-3 sm:py-4 pl-11 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 outline-none text-black bg-white/50 shadow-sm hover:shadow-md focus:shadow-lg"
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-600 font-medium">
                            Remember me for 30 days
                        </label>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-red-700 hover:to-purple-700 text-white py-3 sm:py-4 px-4 rounded-xl font-semibold focus:ring-4 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] shadow-lg"
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
                            <div className="flex items-center justify-center space-x-2">
                                <span>Sign In</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        )}
                    </button>
                </form>

                {/* Divider */}
                {/* <div className="w-full flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-gray-500 text-sm font-medium">Or continue with</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div> */}

                {/* Social Login Buttons */}
                {/* <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Twitter</span>
                    </button>
                </div> */}

                {/* Message Display */}
                {message && (
                    <div
                        className={`mt-6 p-4 rounded-xl border-2 ${
                            messageColor === 'green' 
                                ? 'bg-green-50/80 border-green-200 text-green-800' 
                                : 'bg-red-50/80 border-red-200 text-red-800'
                        } transition-all duration-300 backdrop-blur-sm`}
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
                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-gray-500 text-sm sm:text-base">
                        Don't have an account?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200 hover:underline">
                            Sign up now
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;