import Input from "./Input";

export function form(element: HTMLFormElement) {
  const inputs = element.querySelectorAll("input");
  const inputMap = new Map<string, HTMLInputElement>();
  const inputClasses: Input[] = [];

  for (const input of inputs) {
    if (!input.name) {
      throw new Error("Each input element must have a name attribute!");
    }

    if (!input.labels || input.labels.length === 0) {
      throw new Error("Each input element must have at least one label tag!");
    }

    const describedBy = input.getAttribute("aria-describedby");

    if (!describedBy) {
      throw new Error(
        "Each input element must have an aria-describedby attribute!"
      );
    }

    if (!document.querySelector(`span#${describedBy}`)) {
      throw new Error("Each input element must have connected described span!");
    }

    inputMap.set(input.name, input);
  }

  return {
    field(name: string) {
      const input = inputMap.get(name);

      if (!input) {
        throw new Error("There is no input with this name!");
      }

      const x = new Input(input);
      inputClasses.push(x);
      return x;
    },

    validate(callback: (data: FormData) => void) {
      element.addEventListener("submit", (ev) => {
        ev.preventDefault();

        if (inputClasses.every((input) => input.validate())) {
          const data = new FormData(element);

          callback(data);
        }
      });
    },
  };
}
