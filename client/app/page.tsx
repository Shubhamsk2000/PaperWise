import React from 'react'
import FileUpload from './components/FileUpload'
import ChatBox from './components/ChatBox'
import Navbar from './components/Navbar'

const Home = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto'>
        <nav>
          <Navbar />
        </nav>
        
        <div className='w-full flex justify-center items-center'>
          
          <div className='w-1/2 border-2 border-gray-500 h-[90vh] flex justify-center items-center'>
            <FileUpload />
          </div>
          <div className='w-1/2 border-2 border-gray-500 h-[90vh]'>
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
