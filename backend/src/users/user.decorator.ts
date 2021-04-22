import { createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../auth/constants';

export const User = createParamDecorator((data, req) => {
  if (req[data] && req[data].user) {
    return req[data].user.id;
  }

  let token = req.headers
    ? (req.headers.authorization as string).split(' ')
    : null;
  if (!token && req.args && req.args.length > 0) {
    token = req.args[0].headers
      ? (req.args[0].headers.authorization as string).split(' ')
      : null;
  }
  if (token && token[1]) {
    const decoded: any = jwt.verify(token[1], jwtConstants.secret);
    const userId = decoded.sub;
    return userId;
  }
});
