import { vectorStore } from '../infra/vectorStore.js';

export const handleRetriever = async (userQuery, activePdfs) => {
    const filter = {
        preFilter: {
            pdfId: {
                $in: activePdfs,
            },
        },
    }

    const retriever = vectorStore.asRetriever({
        filter: filter,
        k: 1,
    });

    const relevantChunks = await retriever.invoke(userQuery);

    return relevantChunks;
}