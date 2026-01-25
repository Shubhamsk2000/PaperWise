import { PanelLeft, Plus, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const AddSources = ({ workspaceId, activePdfs, setActivePdfs }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const fileRef = useRef();
    const [file, setFile] = useState(null);
    const [sources, setSources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('jwt-token');

    // fetching preuploaded files
    useEffect(() => {
        const handleGetPdfs = async () => {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspace/${workspaceId}/pdfs`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setSources(data.pdfs);

            if(data.pdfs && data.pdfs.length > 0){
                setActivePdfs([data.pdfs[0]._id]);
            }
        }
        handleGetPdfs();
    }, [workspaceId]);

    // uploading file
    useEffect(() => {
        if (!file) return;
        const handlePostFile = async () => {
            try {
                const formData = new FormData();
                formData.append('pdf', file);

                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspace/${workspaceId}/pdfs`, {
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }
                const data = await response.json();

                if (!data?.pdf) {
                    throw new Error("Invalid response formate");
                }

                setSources(prev => [data.pdf, ...prev]);
            } catch (error) {
                console.log(error.message)
            }
        }

        handlePostFile();

    }, [file]);

    const openFileDialog = () => {
        fileRef.current?.click();
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleCheckboxChange = (pdfId) => {
        setActivePdfs((prev) => {
            if (prev.includes(pdfId)) {
                return prev.filter(id => id !== pdfId);
            } else {
                return [...prev, pdfId];
            }
        });
    };

    return (
        <div
            className={`border-2 border-[#4b4b4b] bg-[#1a1a1a] h-full rounded-xl transition-[width] duration-200
            ${isCollapsed ? "w-12" : "w-80 md:w-140"} 
            overflow-hidden flex flex-col`} 
        >
            <div className={`flex items-center shrink-0 ${isCollapsed ? 'justify-center py-4' : 'justify-between p-4 border-b-2 border-[#4b4b4b]'}`}>
                {!isCollapsed && <span className="font-semibold whitespace-nowrap">Sources</span>}
                <PanelLeft
                    className="cursor-pointer shrink-0"
                    onClick={() => setIsCollapsed(p => !p)}
                />
            </div>

            {!isCollapsed && (
                <div className="p-4 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                    <input type="file" className="hidden" ref={fileRef} onChange={onFileChange} />
                    <button className="flex border cursor-pointer p-3 mt-2 w-full justify-center rounded-4xl gap-4 hover:bg-[#ffffff0f] shrink-0"
                        onClick={openFileDialog}><Plus />Add pdf sources
                    </button>
                    
                    <div className="pt-4 flex flex-col gap-1">
                        {sources.map((source) => {
                            let displayName = source.fileName.replace(/^[^_]*_/, "");
                            let isSelected = activePdfs?.includes(source._id);

                            return (
                                <div
                                    key={source._id}
                                    onClick={() => handleCheckboxChange(source._id)}
                                    className="flex items-center rounded-xl p-3 justify-between hover:bg-[#ffffff0f] cursor-pointer gap-3 min-w-0 w-full" 
                                >
                                 
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <FileText className="text-blue-400 shrink-0" size={18} />
                                        <span className="truncate text-gray-300" title={displayName}>
                                            {displayName}
                                        </span>
                                    </div>
                                    
                                    <input
                                        type="checkbox"
                                        className="shrink-0 appearance-none w-5 h-5 cursor-pointer border-2 border-[#4b4b4b] bg-[#1a1a1a] checked:bg-blue-500 relative checked:border-blue-500 after:content-[''] after:absolute after:hidden checked:after:block
                                        after:left-1.25 after:top-px after:w-1.5 after:h-2.5
                                        after:border-white after:border-r-2 after:border-b-2 after:rotate-45 rounded-sm"
                                        checked={isSelected}
                                        readOnly
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddSources;
