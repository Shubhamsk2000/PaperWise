import { useEffect, useState } from 'react'
import { X } from 'lucide-react';

const ServerCheck = () => {
    const [hide, setHide] = useState(true);
    const [logs, setLogs] = useState([]);

    const logSequence =
        ['Initializing client',
            'Checking server health',
            'Allocating resources',
            'Waking up backend instance (Render cold start detected)'
        ];

    const handleStatusCheck = async () => {
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

    const handleClick = () => {
        setHide(false);
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
        <div className={`w-full flex justify-center items-center h-full absolute top-0 left-0 backdrop-blur-xs z-30 ${hide ? '' : 'hidden -z-10'} shadow-2xl text-white`}>
            <div className='w-180 rounded-3xl h-120 bg-[#090b0e] relative'>
                <div className='h-10 w-10 border border-white absolute top-0 right-0 m-2 rounded-xl flex justify-center items-center cursor-pointer'
                    onClick={handleClick}
                >
                    <X />
                </div>

                <div className="p-6 font-mono text-sm text-gray-300 space-y-1 overflow-hidden">
                    {logs?.map((log, i) => (
                        <div key={i} className="flex gap-3">
                            <span className="text-gray-500">
                                {log?.time}
                            </span>


                            <span className="text-gray-200">
                                {log?.text}
                            </span>
                        </div>
                    ))}

                    <span className="text-green-400 animate-ping">▌</span>
                </div>
            </div>
        </div>
    )
}

export default ServerCheck