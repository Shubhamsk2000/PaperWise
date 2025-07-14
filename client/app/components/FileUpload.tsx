"use client";
import { Upload } from 'lucide-react';
import React from 'react';

const FileUpload = () => {
    const handleFileUpload =  () => {
        const element = document.createElement("input");
        element.setAttribute("type", "file");
        element.setAttribute("accept", "application/pdf");
        element.click();

        
        element.addEventListener('change', async () => {
            if(element.files && element.files.length > 0){
                const file = element.files[0];
                if(file){
                    const formdata = new FormData();

                    formdata.append('pdf', file);
                    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/upload/pdf`, {
                        method:'POST',
                        body: formdata
                    });

                }
            }
        });
    }
    return (
        <div
            onClick={handleFileUpload}
            className='border-2 border-black flex justify-center items-center flex-col cursor-pointer'
        >
            <Upload />
            <h3 className='text-xl'>Upload you File</h3>
        </div>
    )
}

export default FileUpload
