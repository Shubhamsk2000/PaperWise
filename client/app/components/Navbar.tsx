"use client";
import Link from "next/link";
import Image from "next/image";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="shadow-lg px-6 py-4 flex justify-between items-center fixed top-0 w-full z-50"
      style={{
        backgroundColor: 'var(--primary-color)',
        fontFamily: 'var(--font-poppins)'
      }}
    >
      {/* Logo Section */}
      <Link href='/'>
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="PaperWise Logo"
            width={50}
            height={50}
            className="text-white"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PaperWise</h1>
            <p className="text-xs text-gray-500 -mt-1">AI Document Analysis</p>
          </div>
        </div>
      </Link>


      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <nav className="flex items-center space-x-8">
          {/* <Link href='https://github.com/Shubhamsk2000/PaperWise' target="_blank">
            <Image
              src={'/github-color.svg'}
              alt="github"
              width={35}
              height={35}
            />

          </Link> */}
          <Link
            href="/"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
          >
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
              style={{ backgroundColor: 'var(--secondary-color)' }}></span>
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full"
              style={{ backgroundColor: 'var(--secondary-color)' }}></span>
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <SignedOut>
            <Link href='/sign-in' >
              <button
                className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200 cursor-pointer bg-[var(--secondary-color)]"
              >
                Login
              </button>
            </Link>
            <Link href='/sign-up'>
              <button
                className="px-5 py-2.5 text-white font-medium rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg  bg-[var(--button-color)] cursor-pointer hover:bg-white hover:text-black"
              >
                Sign Up
              </button>
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex justify-center items-center gap-4">

              <Link href='/chat'>
                <button
                  className="px-5 py-2.5 text-white font-medium rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-lg  bg-[var(--button-color)] cursor-pointer hover:bg-white hover:text-black"
                >
                  Start Chat
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 right-0 md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        <div className="px-6 py-4 space-y-4 shadow-lg border-t border-gray-200">
          <Link
            href="#features"
            className="block text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors duration-200"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-gray-200 space-y-3">

            <SignedOut>
              <Link href='/sign-in'>
                <button
                  className="w-full px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200"
                >
                  Login
                </button>
              </Link>
              <Link href='/sign-up'>
                <button
                  className="w-full px-5 py-2.5 text-white font-medium rounded-xl transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: 'var(--button-color)' }}
                >
                  Sign Up
                </button>
              </Link>
            </SignedOut>

            <SignedIn>
              <div>
                <Link href='/chat'>
                  <button
                    className="w-full px-5 py-2.5 text-white font-medium rounded-xl transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: 'var(--button-color)' }}
                  >
                    Start Chat
                  </button>
                </Link>
                <UserButton />
              </div>
            </SignedIn>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;