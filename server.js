import * as http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from './errorHandler.js';

const todos = [];

const requestListener = function (req, res) {
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      }),
    );
    res.end();
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        if (title !== undefined) {
          todos.push({ title, id: uuidv4() });
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            }),
          );
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      }),
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const todoId = req.url.split('/').pop();
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        }),
      );
      res.end();
    } else {
      errorHandler(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        const todoId = req.url.split('/').pop();
        const todoIndex = todos.findIndex((todo) => todo.id === todoId);
        if (title !== undefined && todoIndex !== -1) {
          todos[todoIndex].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            }),
          );
          res.end();
        } else {
          errorHandler(res);
        }
      } catch (error) {
        errorHandler(res);
      }
    });
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'error',
        message: '無此路由',
      }),
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
