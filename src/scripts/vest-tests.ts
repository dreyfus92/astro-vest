import { create, test, enforce, only } from 'vest'

const suite = create((data, currentField) => {
    only(currentField);

    test('name', 'Name is required', () => {
        enforce(data.name.value).isNotEmpty()
    })

    test('email', 'Email is required', () => {
        enforce(data.email.value).isNotEmpty()
    })

    test('message', 'Message is required', () => {
        enforce(data.message.value).isNotEmpty()
    })

})

export default suite