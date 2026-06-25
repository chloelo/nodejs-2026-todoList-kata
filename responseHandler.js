const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
  'Content-Type': 'application/json',
};

// 成功回應
export function sendSuccess(res, data, statusCode = 200) {
  res.writeHead(statusCode, headers);
  res.write(JSON.stringify({ status: 'success', data }));
  res.end();
}

// 失敗回應
export function sendError(
  res,
  message = '欄位錯誤或無此 id',
  statusCode = 400,
) {
  res.writeHead(statusCode, headers);
  res.write(JSON.stringify({ status: 'error', message }));
  res.end();
}

// 供 OPTIONS 使用的 headers 導出
export { headers };
