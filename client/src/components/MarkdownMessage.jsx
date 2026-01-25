import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownMessage = memo(({ content }) => {
    return (
        /* The key is using 'prose' along with explicit list markers if Preflight is active */
        <div className="prose prose-invert max-w-none wrap-break-word leading-relaxed text-inherit">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // 1. Ensure the container has enough padding-left (pl-8) to show numbers
                    // 2. Spread ...props to ensure the 'start' attribute is passed correctly
                    ol: ({ node, children, ...props }) => (
                        <ol className="list-decimal pl-8 mb-4 space-y-2" {...props}>
                            {children}
                        </ol>
                    ),
                    ul: ({ node, children, ...props }) => (
                        <ul className="list-disc pl-8 mb-4 space-y-2" {...props}>
                            {children}
                        </ul>
                    ),
                    li: ({ node, children, ...props }) => (
                        <li  {...props}>
                            {children}
                        </li>
                    ),
                    p: ({ children }) => <p className="mb-4 last:mb-0 inline-block w-full">{children}</p>,
                    a: ({ href, children }) => (
                        <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !match ? (
                            <code className="bg-zinc-800/80 px-1.5 py-0.5 rounded font-mono text-sm text-emerald-400">
                                {children}
                            </code>
                        ) : (
                            <pre className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm shadow-xl">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});

MarkdownMessage.displayName = "MarkdownMessage";
export default MarkdownMessage;