import QueueService from './QueueService';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const QueueMethod = (name: string) => (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
	QueueService.addQueue(name, descriptor.value);
};