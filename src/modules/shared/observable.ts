export class Observable<T> {
  private _value: T;
  private observers: ((_value: T) => void)[] = [];

  constructor(initial_Value: T) {
    this._value = initial_Value;
  }

  next(_value: T): void {
    this._value = _value;
    this.notify();
  }

  subscribe(observer: (_value: T) => void): void {
    this.observers.push(observer);
    observer(this._value);
  }

  get value(): T {
    return this._value;
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer(this._value);
    }
  }
}
