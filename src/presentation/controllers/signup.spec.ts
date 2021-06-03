import { SignUpController} from './signup'
import  { MissingParamError} from '../errors/missing-error'

describe('SignUp Controller', () => {
    test('SignUp requires name', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                email: 'any_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new MissingParamError("name"))
    })

    test('SignUp requires email', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new MissingParamError("email"))
    })

    test('SignUp requires password', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                passwordConfirmation: 'any_password'
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new MissingParamError("password"))
    })

    test('SignUp requires password confirmation', () => {
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new MissingParamError("password_confirmation"))
    })
})