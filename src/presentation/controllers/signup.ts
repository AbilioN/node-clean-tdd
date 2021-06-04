import { HttpResponse , HttpRequest} from '../protocols/http'
import { MissingParamError} from '../errors/missing-param-error'
import { InvalidParamError} from '../errors/invalid-param-error'
import {EmailValidator } from '../protocols/email-validator'

import { badRequest } from '../helpers/http-helper'


export class SignUpController {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator){
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest) : HttpResponse {
        const requiredFields = ['name' , 'email', 'password' , 'password_confirmation']
        
        for (const field of requiredFields){
            if (!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }

        const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)

        if(!isValidEmail){
            return badRequest(new InvalidParamError('email'))
        }
    }
}