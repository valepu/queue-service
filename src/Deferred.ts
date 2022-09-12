/**
 * https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-the-promise-constructor-scope?answertab=modifieddesc#tab-top
 */
export class Deferred<T> {
    public readonly promise: Promise<T>
    private resolveFn!: (value: T | PromiseLike<T>) => void
    private rejectFn!: (reason?: any) => void

    public constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolveFn = resolve
            this.rejectFn = reject
        })
    }

    public reject(reason?: any): void {
        this.rejectFn(reason)
    }

    public resolve(param: T): void {
        this.resolveFn(param)
    }
}