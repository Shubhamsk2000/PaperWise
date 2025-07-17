import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Logo positioned at top left */}
      <div className="absolute top-6 left-6">
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
      </div>
      
      {/* SignIn component centered */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border-0 rounded-xl"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}