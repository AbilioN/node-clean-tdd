import { SignUpController} from './signup'

describe('SignUp Controller', () => {
    test('SignUp requires name', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
    })
})