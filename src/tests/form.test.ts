import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { form } from "../lib";

describe("form", () => {
  let formElement: HTMLFormElement;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    // Создаем базовую форму с валидной структурой
    formElement = document.createElement("form");
    formElement.innerHTML = `
      <label for="username">Username</label>
      <input 
        type="text" 
        id="username" 
        name="username" 
        aria-describedby="username-error"
      >
      <span id="username-error" class="error"></span>
      
      <label for="email">Email</label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        aria-describedby="email-error"
      >
      <span id="email-error" class="error"></span>
      
      <button type="submit">Submit</button>
    `;

    container.appendChild(formElement);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("должен успешно создавать форму с валидными полями", () => {
    const formInstance = form(formElement);

    expect(formInstance).toHaveProperty("field");
    expect(formInstance).toHaveProperty("validate");
    expect(typeof formInstance.field).toBe("function");
    expect(typeof formInstance.validate).toBe("function");
  });

  it("должен выбрасывать ошибку, если input не имеет атрибута name", () => {
    formElement.innerHTML = `
      <label for="test">Test</label>
      <input type="text" id="test" aria-describedby="test-error">
      <span id="test-error"></span>
    `;

    expect(() => form(formElement)).toThrow(
      "Each input element must have a name attribute!"
    );
  });

  it("должен выбрасывать ошибку, если input не имеет связанного label", () => {
    formElement.innerHTML = `
      <input 
        type="text" 
        name="test" 
        aria-describedby="test-error"
      >
      <span id="test-error"></span>
    `;

    expect(() => form(formElement)).toThrow(
      "Each input element must have at least one label tag!"
    );
  });

  it("должен выбрасывать ошибку, если input не имеет aria-describedby", () => {
    formElement.innerHTML = `
      <label for="test">Test</label>
      <input type="text" id="test" name="test">
      <span id="test-error"></span>
    `;

    expect(() => form(formElement)).toThrow(
      "Each input element must have an aria-describedby attribute!"
    );
  });

  it("должен выбрасывать ошибку, если span с указанным id не существует", () => {
    formElement.innerHTML = `
      <label for="test">Test</label>
      <input 
        type="text" 
        id="test" 
        name="test" 
        aria-describedby="non-existent-error"
      >
    `;

    expect(() => form(formElement)).toThrow(
      "Each input element must have connected described span!"
    );
  });

  it("должен выбрасывать ошибку при вызове field с несуществующим именем", () => {
    const formInstance = form(formElement);

    expect(() => formInstance.field("non-existent")).toThrow(
      "There is no input with this name!"
    );
  });

  it("должен добавлять обработчик submit и вызывать callback при валидной форме", () => {
    const formInstance = form(formElement);
    const mockCallback = vi.fn();
    const submitEvent = new Event("submit", { bubbles: true });

    formInstance.validate(mockCallback);
    formElement.dispatchEvent(submitEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(expect.any(FormData));
  });
});
