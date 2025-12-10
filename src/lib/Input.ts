export default class Input {
  private element: HTMLInputElement;
  private messages: Partial<Record<keyof ValidityState, string>> = {};

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

  min(message: string) {
    if (["number", "range"].includes(this.element.type)) {
      if (this.element.min === "") {
        throw new Error("У инпута нет атрибута min");
      }

      this.messages.rangeUnderflow = message;
    } else {
      if (this.element.minLength === -1) {
        throw new Error("У инпута нет атрибута minLength");
      }

      this.messages.tooShort = message;
    }

    return this;
  }

  max(message: string) {
    if (["number", "range"].includes(this.element.type)) {
      if (this.element.max === "") {
        throw new Error("У инпута нет атрибута max");
      }

      this.messages.rangeOverflow = message;
    } else {
      if (this.element.maxLength === -1) {
        throw new Error("У инпута нет атрибута maxLength");
      }

      this.messages.tooLong = message;
    }

    return this;
  }

  pattern(message: string) {
    if (this.element.pattern === "") {
      throw new Error("У инпута нет атрибута pattern");
    }

    this.messages.patternMismatch = message;

    return this;
  }

  required(message: string) {
    if (this.element.required === false) {
      throw new Error("У инпута нет атрибута required");
    }

    this.messages.valueMissing = message;

    return this;
  }

  validate() {
    const id = this.element.getAttribute("aria-describedby")!;
    const element = document.querySelector(`#${id}`)!;

    for (const rule in this.element.validity) {
      const result = this.element.validity[rule];

      if (rule === "valid" && result) {
        element.textContent = "";
        return true;
      } else if (result) {
        const message = this.messages[rule];
        element.textContent = message || "Невалидный инпут";
        return false;
      }
    }
  }
}
