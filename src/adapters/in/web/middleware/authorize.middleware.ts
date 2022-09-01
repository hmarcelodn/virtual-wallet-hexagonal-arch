/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';
import { NotAuthorizedError } from '../../../../application/errors';
import { LoadBlackListerTokenPort } from '../../../../application/port/out';
import { GENERAL } from '../../../../shared/constants';

interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  uuid: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const loadBlackListerTokenPort = Container.get('') as LoadBlackListerTokenPort;

  if (!req.headers.authorization) {
    throw new NotAuthorizedError();
  }

  const token = req.headers.authorization.toString();

  if (await loadBlackListerTokenPort.getToken(token)) {
    throw new NotAuthorizedError();
  }

  try {
    const payload: any = jwt.verify(token, GENERAL.ENCRYPTION_TOKEN);
    req.currentUser = {
      uuid: payload.uuid,
      email: payload.email,
      lastName: payload.lastName,
      firstName: payload.firstName,
      id: payload.id,
    };
  } catch (err) {
    throw new NotAuthorizedError();
  }

  next();
};
