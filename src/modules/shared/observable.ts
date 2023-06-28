export class BehaviorSubject<T> {
  private value: T;
  private observers: ((value: T) => void)[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  next(value: T): void {
    this.value = value;
    this.notify();
  }

  subscribe(key: string, observer: (value: T) => void): void {
    this.observers.push(observer);
    observer(this.value);
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer(this.value);
    }
  }
}
