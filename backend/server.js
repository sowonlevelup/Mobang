const express = require('express');
const app = express();
const morgan = require('morgan');
const multer = require('multer');
const PORT = 8888;
const routes = require('./routes');
const cors = require('cors');

app.use(cors());
// cors 에러 방지를 위해

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// req.body를 미들웨어 없이 수신하고 접근했을때  -> undefined 문제 해결 body-parser / 또는 multer를 사용해야하는데 12-13라인을 사용해 해결

app.use(morgan("dev"));
// GET /api/room 200 1.775 ms - 15

app.use("/", routes);

app.listen(PORT, () => console.log(`이 서버는 ${PORT}번으로 동작하고 있습니다`))
