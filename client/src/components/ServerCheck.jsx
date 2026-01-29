import { useEffect, useState } from 'react'
import { Terminal, X } from 'lucide-react';

const ServerCheck = () => {
    const [hide, setHide] = useState(false);
    const [logs, setLogs] = useState([]);

    const logSequence =
        ['Initializing client',
            'Checking server health',
            'Allocating resources',
            'Waking up backend instance (Render cold start detected)'
        ];

    const handleStatusCheck = async () => {
        setHide(true)
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/health`);

        if (response.ok) {
            setLogs((prev) => [
                ...prev,
                {
                    time: new Date().toLocaleTimeString(),
                    text: "Server Started Successfully"
                }
            ])
            setHide(false);
        }
        console.log(response)
    }

    useEffect(() => {
        handleStatusCheck();
        setLogs([{
            time: new Date().toLocaleTimeString(),
            text: logSequence[0]
        }]);
        let i = 1;
        const interval = setInterval(() => {
            if (i < logSequence.length) {
                setLogs((prev) => [
                    ...prev,
                    {
                        time: new Date().toLocaleTimeString(),
                        text: logSequence[i]
                    }
                ]);
                i++;
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`w-full flex justify-center items-center h-full fixed top-0 left-0 backdrop-blur-sm z-50 shadow-2xl text-white p-4 ${hide ? '' : 'hidden'}`}>
            <div className='w-full max-w-2xl rounded-2xl h-96 bg-[#090b0e] relative border border-gray-800 flex flex-col'>

                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-gray-500" />
                        <span className="text-xs font-mono text-gray-500">root@portfolio:~</span>
                    </div>
                    <div
                        className='h-7 w-7 border border-gray-700 rounded-lg flex justify-center items-center cursor-pointer hover:bg-white/5 transition-colors'
                        onClick={() => setHide(false)}
                    >
                        <X size={14} />
                    </div>
                </div>

                <div className="p-6 font-mono text-sm text-gray-300 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                    {logs?.map((log, i) => (
                        <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                            <span className="text-gray-500 shrink-0 select-none">[{log.time}]</span>
                            <span className='text-gray-300'>
                                {log?.text}
                            </span>
                        </div>
                    ))}

                    <div className="flex items-center gap-2">
                        <span className="text-blue-500">$</span>
                        <span className="w-2 h-4 bg-green-500 animate-bounce inline-block" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ServerCheck