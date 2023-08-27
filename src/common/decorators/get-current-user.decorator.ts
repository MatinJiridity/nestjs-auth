import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        console.log('data', data)
        const request = context.switchToHttp().getRequest();
        console.log("request.user", request.user)
        if(!data) return request.user;
        console.log('request.user["data"]', request.user[data])
        return request.user[data];
    }
)