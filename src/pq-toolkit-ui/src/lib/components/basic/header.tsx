import React, {useState, useEffect, useRef} from 'react';
import useSWR from 'swr';
import ThemeSwitch from '@/lib/components/basic/themeSwitch';
import {TbLogout2} from 'react-icons/tb';
import {HiMenu, HiChevronLeft} from 'react-icons/hi';
import {FaRegFileAlt, FaTasks, FaHome, FaUser, FaPlus, FaBook} from 'react-icons/fa';
import {MdLeaderboard} from 'react-icons/md';
import {userFetch} from '@/lib/utils/fetchers';

const Header = (props: any): JSX.Element => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {data: userData, error} = useSWR('/api/v1/auth/user', userFetch);
    const isLoggedIn: boolean = userData?.is_active ?? false;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            {/* Back Button */}
            <button
                onClick={() => window.history.back()}
                className="absolute left-8 top-9 transform translate-y-8 text-white z-20 transition-transform duration-300 ease-in-out hover:text-blue-500 hover:scale-125"
            >
                <HiChevronLeft className="h-12 w-12"/>
            </button>

            <div className="flex md:mx-auto mt-0 mb-0">
                <div className="w-full flex items-center justify-between h-20 pl-3 md:pl-10 pr-3 md:pr-10">
                    {/* Logo i tytuł */}
                    <a
                        className="flex items-center transform duration-300 ease-in-out fadeInUp"
                        href="/"
                    >
                        <img
                            src="/logo.svg"
                            alt="logo"
                            className="flex h-9 md:h-10 mr-3"
                        />
                        <span
                            className="text-indigo-400 dark:text-indigo-500 font-bold text-3xl lg:text-4xl md:text-4xl">
              PQ
            </span>
                        <span
                            className="bg-clip-text font-bold text-3xl lg:text-4xl md:text-4xl text-transparent bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500">
              Toolkit
            </span>
                    </a>

                    {/* Guziki po prawej stronie */}
                    <div className="flex content-center fadeInUp">
                        <ThemeSwitch/>
                        <a
                            className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-105 duration-300 ease-in-out"
                            href="/about"
                        >
                            <svg
                                className="fill-current h-8 md:h-10"
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                viewBox="0 1 23 23"
                            >
                                <path
                                    d="M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10s10-4.477,10-10S17.523,2,12,2z M12,17L12,17c-0.552,0-1-0.448-1-1v-4 c0-0.552,0.448-1,1-1h0c0.552,0,1,0.448,1,1v4C13,16.552,12.552,17,12,17z M12.5,9h-1C11.224,9,11,8.776,11,8.5v-1 C11,7.224,11.224,7,11.5,7h1C12.776,7,13,7.224,13,7.5v1C13,8.776,12.776,9,12.5,9z"></path>
                            </svg>
                        </a>
                        <a
                            className="text-blue-400 dark:text-blue-500 no-underline hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-105 duration-300 ease-in-out z-50"
                            href="https://github.com/pawelmuller/pq-toolkit"
                        >
                            <svg
                                className="fill-current h-7 md:h-9"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 500 500"
                            >
                                <path
                                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
                            </svg>
                        </a>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="text-blue-400 dark:text-blue-500 hover:text-pink-500 dark:hover:text-pink-600 transform hover:scale-105 duration-300 ease-in-out h-10 w-10 mx-2 flex items-center justify-center"
                                onClick={() => {setDropdownOpen(!dropdownOpen);}}
                            >
                                <HiMenu className="h-10 w-10"/>
                            </button>
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-64 bg-blue-400 dark:bg-blue-500 text-white rounded-lg shadow-lg z-50"
                                >
                                    <ul>
                                        {isLoggedIn ? (
                                            <>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/';
                                                        }}
                                                    >
                                                        <FaHome className="mr-2"/> Main page
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/admin';
                                                        }}
                                                    >
                                                        <FaPlus className="mr-2"/> Add experiment
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/admin/review';
                                                        }}
                                                    >
                                                        <FaTasks className="mr-2"/> Experiment review
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/admin/management';
                                                        }}
                                                    >
                                                        <FaRegFileAlt className="mr-2"/> Experiment management
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/ranking';
                                                        }}
                                                    >
                                                        <MdLeaderboard className="mr-2"/> Sample ranking
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/admin/guide';
                                                        }}
                                                    >
                                                        <FaBook className="mr-2"/> Administrator guide
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            localStorage.removeItem('token');
                                                            window.location.href = '/admin';
                                                        }}
                                                    >
                                                        <TbLogout2 className="mr-2"/> Logout
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/';
                                                        }}
                                                    >
                                                        <FaHome className="mr-2"/> Main page
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/admin';
                                                        }}
                                                    >
                                                        <FaUser className="mr-2"/> Log in
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="flex items-center w-full text-left px-4 py-2 rounded-lg hover:bg-pink-500 dark:hover:bg-pink-600"
                                                        onClick={() => {
                                                            window.location.href = '/ranking';
                                                        }}
                                                    >
                                                        <MdLeaderboard className="mr-2"/> Sample ranking
                                                    </button>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <div>{props.children}</div>
        </div>
    );
};

export default Header;
