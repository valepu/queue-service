import { Deferred } from './Deferred';
import { Queue } from './Queue';

interface QueueHandler {
	name: string;
	handler: (input: any) => Promise<any>;
	working: boolean;
	queue: Queue<QueueElement>;
}

interface QueueElement {
	payload: any;
	deferred: Deferred<any>;
}

export class QueueService {
	private static queues: { [key: string]: QueueHandler } = {};
	private working: { [key: string]: boolean } = {};
	private static config = {
		configSet: false,
		name: 'queueService',
		update: 100
	};

	private constructor() {}

	public static getInstance(): QueueService {
		QueueService.config.configSet = true;
		if(!window[QueueService.name]) {
			window[QueueService.name] = new QueueService();
		}

		return window[QueueService.name];
	}

	public static addQueue(name: string, handler: (input: any) => Promise<any>) {
		console.log(handler);
		QueueService.queues[name] = {
			name,
			handler,
			working: false,
			queue: new Queue<QueueElement>(),
		};
	}

	public removeQueue(name: string) {
		delete QueueService.queues[name];
	}

	public addJob<T>(name: string, payload: any): Promise<T> {
		if(!name || !QueueService.queues[name]) {
			throw new Error('Queue not found');
		}

		const deferred = new Deferred<T>();
		QueueService.queues[name].queue.push({ payload, deferred });
		this.handleJobs(QueueService.queues[name]);

		return deferred.promise;
	}

	private handleJobs(queue: QueueHandler) {
		if(!this.working[queue.name]) {
			this.working[queue.name] = true;
			this.doHandleJobs(queue);
		}
	}

	private doHandleJobs(queue) {
		if(!queue.working && queue.queue.length > 0) {
			queue.working = true;
			const queueElement = queue.queue.shift();
			queue.handler(queueElement.payload)
				.then((r) => queueElement.deferred.resolve(r))
				.catch((r) => queueElement.deferred.reject(r))
				.finally(() => (queue.working = false));
		}

		setTimeout(() => {
			if(queue.queue.length > 0) {
				this.doHandleJobs(queue);
			} else {
				this.working[queue.name] = false;
			}
		}, QueueService.config.update);
	}
}
