import { SignUpController} from './signup'
import  { MissingParamError} from '../errors/missing-param-error'
import { InvalidParamError} from '../errors/invalid-param-error'
import {ServerError} from '../errors/server-error'
import {EmailValidator } from '../protocols/'

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    return { 
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    test('SignUp requires name', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email',
                password: 'any_password',
                password_confirmation: 'any_password'
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new MissingParamError("name"))
    })

    test('SignUp requires email', () => {
        const {sut} = makeSut();

        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                password_confirmation: 'any_password'
            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new MissingParamError("email"))
    })

    test('SignUp requires password', () => {
        const {sut} = makeSut();

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
        const {sut} = makeSut();

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

    test('SignUp requires a valid email format', () => {
        const {sut , emailValidatorStub} = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@email.com',
                password: 'any_password',
                password_confirmation: 'any_password'

            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(400)
        expect(htttpResponse.body).toEqual(new InvalidParamError("email"))
    })

    test('SignUp call EmailValidator with correct email', () => {
        const {sut , emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@email.com',
                password: 'any_password',
                password_confirmation: 'any_password'

            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(isValidSpy).toHaveBeenCalledWith('invalid_email@email.com')
    })

    
    test('SignUp should return 500 if EmailValidator throws', () => {

        class EmailValidatorStub implements EmailValidator{
            isValid(email: string): boolean {
                throw new Error()
            }
        }
        const emailValidatorStub = new EmailValidatorStub()
        const sut = new SignUpController(emailValidatorStub)

        jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                password_confirmation: 'any_password'

            }
        }
        const htttpResponse = sut.handle(httpRequest)

        expect(htttpResponse.statusCode).toBe(500)
        expect(htttpResponse.body).toEqual(new ServerError())
    })
})