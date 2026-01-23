import Pdf from "../infra/db/models/pdf.model.js"
import { uploadQueue } from "../infra/queue.js";

export const uploadPdfService = async ({ userId, workspaceId, file }) => {
    try {
        const pdf = await Pdf.create({
            userId,
            workspaceId,
            fileName: file.filename,
            filePath: file.path,
        });

        await uploadQueue.add('ingest-pdf', {
            pdfId: pdf._id.toString(),
            filePath: file.path
        });

        return {
            _id: pdf._id,
            fileName: pdf.fileName
        }

    } catch (error) {
        console.log(error.message);
    }
}