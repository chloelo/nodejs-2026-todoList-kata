import * as http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { sendSuccess, sendError, headers } from './responseHandler.js';

const todos = [];

// 封裝不確定大小的 Request Body 讀取
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
  });
};

const requestListener = async function (req, res) {
  const { url, method } = req;

  // 1. 處理 CORS 預檢請求
  if (method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  // 2. 路由分類處理
  // GET /todos
  if (url === '/todos' && method === 'GET') {
    sendSuccess(res, todos);
  }

  // POST /todos
  else if (url === '/todos' && method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const { title } = JSON.parse(body);

      if (title !== undefined) {
        todos.push({ title, id: uuidv4() });
        sendSuccess(res, todos);
      } else {
        sendError(res);
      }
    } catch {
      sendError(res);
    }
  }

  // DELETE /todos (全部刪除)
  else if (url === '/todos' && method === 'DELETE') {
    todos.length = 0;
    sendSuccess(res, todos);
  }

  // DELETE /todos/:id
  else if (url.startsWith('/todos/') && method === 'DELETE') {
    const todoId = url.split('/').pop();
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      sendSuccess(res, todos);
    } else {
      sendError(res);
    }
  }

  // PATCH /todos/:id
  else if (url.startsWith('/todos/') && method === 'PATCH') {
    try {
      const body = await getRequestBody(req);
      const { title } = JSON.parse(body);
      const todoId = url.split('/').pop();
      const todoIndex = todos.findIndex((todo) => todo.id === todoId);

      if (title !== undefined && todoIndex !== -1) {
        todos[todoIndex].title = title;
        sendSuccess(res, todos);
      } else {
        sendError(res);
      }
    } catch {
      sendError(res);
    }
  }

  // 404 路由
  else {
    sendError(res, '無此路由', 404);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
