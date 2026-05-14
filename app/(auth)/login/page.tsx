import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center py-12 sm:py-24 px-4 bg-white">
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        .font-display { font-family: 'Archivo Black', sans-serif; line-height: 1.1; }
      `}} />

      {/* Login Container */}
      <div className="w-full max-w-md">
        
        <h1 className="font-display text-4xl sm:text-5xl mb-3 text-center tracking-wide text-black">
          WELCOME BACK
        </h1>
        <p className="text-[#666666] text-center text-sm sm:text-base mb-10">
          Enter your details to access your account.
        </p>

        <form className="space-y-6">
          {/* ช่องกรอก Email */}
          <div>
            <div className="relative">
              <input 
                type="email" 
                id="email"
                className="w-full bg-[#F0F0F0] text-black rounded-full px-6 py-4 outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder-gray-500 text-sm sm:text-base"
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          {/* ช่องกรอก Password */}
          <div>
            <div className="relative">
              <input 
                type="password" 
                id="password"
                className="w-full bg-[#F0F0F0] text-black rounded-full px-6 py-4 outline-none focus:ring-1 focus:ring-gray-400 transition-all placeholder-gray-500 text-sm sm:text-base"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-end mt-2 mr-2">
              <Link href="#" className="text-xs text-[#666666] hover:text-black font-medium underline transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* ปุ่ม Sign In */}
          <button 
            type="submit" 
            className="cursor-pointer w-full bg-black text-white rounded-full py-4 font-medium text-base hover:bg-gray-800 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        {/* เส้นคั่นกลาง */}
        <div className="mt-8 relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full absolute"></div>
          <span className="bg-white px-4 text-xs text-[#666666] relative z-10 font-medium">OR</span>
        </div>

        {/* ปุ่ม Social Login (Google) */}
        <button className="cursor-pointer w-full border border-gray-300 bg-white text-black rounded-full py-3.5 mt-8 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* ไปหน้า Register */}
        <p className="text-center text-sm text-[#666666] mt-10">
          Don't have an account?{' '}
          <Link href="/register" className="text-black font-medium underline hover:text-gray-600 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>

    </main>
  );
}