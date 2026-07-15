# Shopping Mall Server

Node.js, Express, MongoDB(Mongoose) 기반 API 서버입니다.

## 시작하기

```bash
npm install
cp .env.example .env
npm run dev
```

## 환경변수

```env
PORT=5000
HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/shoppingmall
```

## 확인 URL

- `GET /`
- `GET /health`
- `GET /products`
