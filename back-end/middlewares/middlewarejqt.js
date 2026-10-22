import jwt from "jsonwebtoken"

import { SECRETKEY } from "../utils/jwt.js"

// Middleware проверки токена
function auth(request, response, next) {
  const header = request.headers.authorization

  if (!header) {
        response.status(401)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify({ "answer": "false", "info": 'Нет токена' }));
        return
    }

  const token = header.split(' ')[1];

  try {
    request.user = jwt.verify(token, SECRETKEY);
    next();
  } catch (err) {
        response.status(401)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify({ "answer": "false", "info": 'Плохой токен' }));
        return
    }
}

// Middleware проверки роли
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
        response.status(401)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify({ "answer": "false", "info": 'Нет доступа' }));
        return
    }
    next();
  };
}

// Middleware проверки ролей
function requireRoles(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        response.status(401)
        response.set("Content-Type", "application/json")
        response.send(JSON.stringify({ "answer": "false", "info": 'Нет доступа' }));
        return
    }
    next();
  };
}

export { auth, requireRole, requireRoles }