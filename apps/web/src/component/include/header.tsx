import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface NavigationItem {
  id: number;
  label: string;
  link: string;
}

const navigationItems: NavigationItem[] = [
  { id: 1, label: 'Main', link: '#' },
  { id: 2, label: 'About', link: '#about' },
  { id: 3, label: 'Price', link: '#price' },
  { id: 4, label: 'Support', link: '#support' },
  { id: 5, label: 'Profile', link: '#profile' },
  { id: 6, label: 'V1.48.1', link: '#version' },
];

function Header(): JSX.Element {
  return (
    <div className="flex justify-between items-center lg:flex-row flex-col 2xl:pl-[144px] 2xl:pr-[142px] lg:px-[90px] lg:py-9 py-5 gap-4 lg:gap-0 w-[100%] border-b border-[#DDDDDD] bg-[#F5F5F5]">
      <div>
        <Image alt="logo" src="../logo/LOGO.svg" width={186} height={27} />
      </div>
      <ul className="flex xl:gap-9 gap-7">
        {navigationItems.map((item) => (
          <li
            className="font-normal text-[18px] xl:w-[70px] leading-[22.01px] text-[#444444] font-commissioner"
            key={item.id}
          >
            <Link href={item.link}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <div className="font-normal font-commissioner w-fit xl:max-w-[188px] text-[18px] leading-[22.01px] text-[#444444]">
        You are not logged in.
      </div>
    </div>
  );
}

export default Header;
