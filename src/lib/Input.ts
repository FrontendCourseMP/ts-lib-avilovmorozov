export default class Input {
  private element: HTMLInputElement;

  constructor(element: HTMLInputElement) {
    this.element = element;
  }

  string() {
    if (this.element.type !== "text") {
      throw new Error("Типы инпута различаются");
    }

    return this;
  }

  number() {
    if (this.element.type !== "number") {
      throw new Error("Типы инпута различаются");
    }

    return this;
  }

  max(message: string) {
    return this;
  }

  min(message: string) {
    return this;
  }
}
