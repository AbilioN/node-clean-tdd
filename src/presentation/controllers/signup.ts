import { MissingParamError , InvalidParamError } from '../errors'
import { HttpResponse, HttpRequest ,EmailValidator } from '../protocols/'

import { badRequest , serverError} from '../helpers/http-helper'


export class SignUpController {
    private readonly emailValidator: EmailValidator
    constructor(emailValidator: EmailValidator){
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest) : HttpResponse {

        try{
            const requiredFields = ['name' , 'email', 'password' , 'password_confirmation']
        
            for (const field of requiredFields){
                if (!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
            }

            const {email, password, passwordConfirmation} = httpRequest.body

            if(password !== passwordConfirmation){
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }
            const isValidEmail = this.emailValidator.isValid(email)

            if(!isValidEmail){
                return badRequest(new InvalidParamError('email'))
            }
        }catch(error)
        {
           return serverError();
        }

        
    }
}