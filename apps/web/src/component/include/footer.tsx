import React from 'react';

function Footer(): JSX.Element {
  return (
    <div className="flex justify-center items-center w-full bg-[#DDDDDD] h-[80px]">
      <p className="font-commissioner font-normal leading-[16.8px] text-[#444444]">
        &copy; Copyright 2023 <span className="text-[#FF5732] ">SCHelper</span> - All Rights Reserved.
      </p>
    </div>
  );
}

export default Footer;
