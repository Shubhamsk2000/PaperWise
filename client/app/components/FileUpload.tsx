"use client";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import React, { useState } from "react";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = () => {
    // Don't allow file selection if already uploading
    if (uploadStatus === 'uploading') return;

    const element = document.createElement("input");
    element.setAttribute("type", "file");
    element.setAttribute("accept", "application/pdf");
    element.click();

    element.addEventListener("change", async () => {
      if (element.files && element.files.length > 0) {
        const file = element.files[0];
        if (file) {
          setUploadStatus('uploading');
          setFileName(file.name);
          setErrorMessage(null);
          setUploadProgress(0);
          
          const formData = new FormData();
          formData.append("pdf", file);

          try {
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
              setUploadProgress(prev => {
                if (prev >= 90) {
                  clearInterval(progressInterval);
                  return 90;
                }
                return prev + 10;
              });
            }, 200);

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/upload/pdf`, {
              method: "POST",
              body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.status === 200) {
              const data = await response.json();
              setUploadStatus('success');
              setTimeout(() => setUploadProgress(0), 1000); // Reset progress after showing success
            } else {
              throw new Error(`Upload failed with status: ${response.status}`);
            }
          } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
            setUploadProgress(0);
          }
        }
      }
    });
  };

  return (
    <div 
      className={`w-full h-[calc(100vh-5rem)] relative overflow-hidden ${uploadStatus === 'uploading' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        background: uploadStatus === 'success' 
          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
          : uploadStatus === 'error'
          ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
          : 'linear-gradient(135deg, #92D277 0%, #7BC159 100%)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Progress Bar */}
      {uploadStatus === 'uploading' && (
        <div className="absolute top-0 left-0 w-full h-2 bg-black bg-opacity-20">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <div 
        className="absolute inset-0 flex items-center justify-center" 
        onClick={uploadStatus !== 'uploading' ? handleFileUpload : undefined}
      >
        <div className="text-center z-10">
          <div className="mb-8 relative">
            <div 
              className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: uploadStatus === 'uploading' ? '0 0 0 15px rgba(146, 210, 119, 0.3)' : '0 0 0 0 rgba(146, 210, 119, 0.7)',
                animation: uploadStatus === 'idle' ? 'pulse 2s infinite' : 'none'
              }}
            >
              {uploadStatus === 'success' ? (
                <CheckCircle 
                  className="text-white"
                  size={64}
                  strokeWidth={1.5}
                />
              ) : uploadStatus === 'error' ? (
                <AlertCircle 
                  className="text-white"
                  size={64}
                  strokeWidth={1.5}
                />
              ) : (
                <Upload 
                  className={`text-white transition-all duration-300 ${uploadStatus === 'uploading' ? 'animate-spin' : ''}`}
                  size={64}
                  strokeWidth={1.5}
                />
              )}
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {uploadStatus === 'uploading' ? 'Uploading...' : 
             uploadStatus === 'success' ? 'Success!' :
             uploadStatus === 'error' ? 'Upload Failed' : 'Upload'}
          </h2>
          
          {uploadStatus === 'idle' && !fileName && (
            <p className="text-white text-xl opacity-90 mb-8 font-light">
              Drag & drop your PDF here
            </p>
          )}
          
          {fileName && uploadStatus === 'success' && (
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <FileText className="text-white mr-3" size={24} />
                <p className="text-white text-lg opacity-95 font-medium bg-white bg-opacity-20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  {fileName}
                </p>
              </div>
              <p className="text-white text-sm opacity-80">
                Your PDF is ready for analysis!
              </p>
            </div>
          )}
          
          {uploadStatus === 'uploading' && (
            <div className="mb-8">
              <p className="text-white text-lg opacity-90 mb-2 font-light animate-pulse">
                Processing your file...
              </p>
              <p className="text-white text-sm opacity-75">
                {uploadProgress}% complete
              </p>
            </div>
          )}

          {uploadStatus === 'error' && errorMessage && (
            <p className="text-white text-lg opacity-90 mb-8 font-light bg-white bg-opacity-20 px-6 py-3 rounded-2xl backdrop-blur-sm mx-auto max-w-md">
              {errorMessage}
            </p>
          )}
          
          <button 
            className={`px-10 py-4 rounded-2xl font-medium transition-all duration-300 border-2 text-white bg-[var(--button-color)] border-black ${
              uploadStatus === 'uploading' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 hover:bg-opacity-30'
            }`}
            disabled={uploadStatus === 'uploading'}
            onClick={uploadStatus === 'success' ? () => {
              setUploadStatus('idle');
              setFileName(null);
              setErrorMessage(null);
            } : undefined}
          >
            {uploadStatus === 'uploading' ? `Uploading... ${uploadProgress}%` : 
             uploadStatus === 'success' ? 'Upload Another PDF' :
             uploadStatus === 'error' ? 'Try Again' : 'Choose PDF File'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;