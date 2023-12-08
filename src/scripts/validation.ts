import type { SuiteResult } from 'vest';
import suite from "./vest-tests";
import classnames from "vest/classnames";

const form = document.querySelector("form");
const submit = form?.querySelector("button[type=submit]");

if (!form) throw new Error("Form not found");
const allInputs = Array.from(form.querySelectorAll("input"));
const formValues = {}; //state

const handleChange = (e: KeyboardEvent) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    Object.assign(formValues, {
        [name]: { value, checked },
    });
    const res = suite(formValues, name).done(handleResult);

    res.isValid()
        ? submit?.removeAttribute("disabled")
        : submit?.setAttribute("disabled", "disabled");
};

const handleSubmit = async () => {
    // Here we're organizing the input values in an on object
    // so that we can pass it over to our validation module

    const allData = allInputs.reduce(
        (allData, current) =>
            Object.assign(allData, {
                [current.name]: current,
            }),
        {}
    );

    // run our validation suite with the values of all inputs
    // And after that handle the results
    suite(allData, {}).done(handleResult);

    // const formData = new FormData(formValues);

    // Post the data to the server
    const response = await fetch("/api/form", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.redirected) {
        window.location.assign(response.url);
    }
};

const handleResult = (result: SuiteResult<string, string>) => {
    const cn = classnames(result, {
        valid: "success",
        invalid: "error",
        warning: "warning",
    });

    // Iterate over all the tested fields in the current validations
    // (Since some may have been skipped)

    for (const { name } of allInputs) {
        // Find the parent element
        const parent = form?.querySelector(`input[name="${name}"]`);

        const formInputContainer = parent?.closest(`.${formInputClassName}`);

        // update the DOM
        if (!formInputContainer) throw new Error("Form input not found");
        formInputContainer.className = [cn(name), formInputClassName]
            .filter(Boolean)
            .join(" ");

        const msg = formInputContainer?.querySelector(".validation-message");

        if (msg) {
            const messages = [
                ...result.getErrors(name),
                ...result.getWarnings(name),
            ];
            // msg.innerText = messages[0] || "";
            msg.innerHTML = messages[0] || "";
        }
    }
};

form?.addEventListener("keyup", handleChange);
form?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
});

const formInputClassName = "form-input";