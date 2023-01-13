import { ChatTranscript } from './strategies/ChatTranscript';
import type { IStrategy } from './types/IStrategy';

export type Templates = 'chat-transcript';

export class PdfWorker {
	protected validMimeTypes = ['image/jpeg', 'image/png'];

	mode: Templates;

	worker: IStrategy;

	constructor(mode: Templates) {
		if (!mode) {
			throw new Error('Invalid mode');
		}

		this.mode = mode;
		this.worker = this.getWorkerClass();
	}

	getWorkerClass(): IStrategy {
		switch (this.mode) {
			case 'chat-transcript':
				return new ChatTranscript();
			default:
				throw new Error('Invalid mode');
		}
	}

	isMimeTypeValid(mimeType: string): boolean {
		return this.validMimeTypes.includes(mimeType);
	}

	async renderToStream({ data }: { template: Templates; data: Record<string, unknown | unknown[]> }): Promise<NodeJS.ReadableStream> {
		const parsedData = this.worker.parseTemplateData(data);
		return this.worker.renderTemplate(parsedData);
	}
}
