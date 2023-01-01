import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // const user = request.user;
    const user = { id: 1, nome: 'Foo', sobrenome: 'Bar' };

    return data ? user?.[data] : user;
  },
);
