import Link from 'next/link';
import React from 'react';
import Guest from '../../component/layouts/guest';

function Login(): JSX.Element {
  return (
    <Guest footer>
      <div className="flex justify-center items-center w-full min-h-[calc(100vh-180px)] bg-[#F5F5F5]">
        <div className="flex flex-col gap-9 max-w-[470px] ">
          <p className="text-[#444444] font-commissioner text-xl leading-6 font-semibold">
            You must log in to view the page at /web-sch.
          </p>
          <input
            type="email"
            placeholder="Email address"
            className="w-full h-[70px] px-5 text-[#000] placeholder-[#DDDDDD] focus:outline-none bg-[#fff] rounded-[65px] text-center placeholder:text-center"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-[70px] px-5 text-[#000] placeholder-[#DDDDDD] focus:outline-none bg-[#fff] rounded-[65px] text-center placeholder:text-center"
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#FF5732] text-white py-4 w-48 h-16 transition-transform transform hover:scale-105 rounded-[65px] font-commissioner font-semibold text-xl leading-6"
            >
              Login
            </button>
          </div>
          <div className="flex justify-center text-[#A0A0A0] font-commissioner font-normal leading-[16.8px]">
            <Link href="">Forgot password?</Link>
          </div>
        </div>
      </div>
    </Guest>
  );
}

export default Login;
