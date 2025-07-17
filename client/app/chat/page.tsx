import React from 'react'
import FileUpload from '../components/FileUpload'
import ChatBox from '../components/ChatBox'

const page = () => {
  return (
    <div className='pt-20 h-screen flex mx-auto items-center w-full bg-[var(--secondary-color)]'>
      <div className='left-panel h-full w-1/4'>
        <FileUpload />
      </div>
      <div className='right-panel h-[calc(100vh-5rem)] w-3/4'>
        <ChatBox />
      </div>
    </div>
  )
}

export default page
