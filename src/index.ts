import * as z from "./lib";
import "./styles.css";

const authForm = document.querySelector("#auth") as HTMLFormElement;
const regForm = document.querySelector("#reg") as HTMLFormElement;

const authValidator = z.form(authForm);

authValidator
    .field("phone")
    .string()
    .pattern("Введите корректный номер")
    .required("Заполните поле");

authValidator.validate((data) => console.log(Object.fromEntries(data)));
