const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const { PORT } = require("./config/config.js");
const { sequelize } = require("./model");
const { errorLogger, errorResponder } = require("./middlewares/error.js");

/**
 * express middleware를 사용합니다.
 * @todo 교차 출처 리소스 공유 의논해서 다시 작성할 예정
 * @param {express.Application} app express app
 * @returns {express.Application}
 */
function loader(app) {
  app.use(express.json());
  app.use(cors());
  app.use(logger("combined"));

  return app;
}

/**
 * API Routers를 등록합니다.
 * @param {express.Application} app express app
 * @returns {*}
 */
function registerRouters(app) {
  // app.use('/components/user/...', routers.xxApi);
  return app;
}

// error 처리 미들웨어를 추가합니다.
function errorHandler(app) {
  app.use(errorLogger);
  app.use(errorResponder);

  return app;
}

/**
 * express 서비스를 생성합니다.
 */
async function bootstrap() {
  const app = express();

  sequelize
    .sync({ force: false })
    .then(() => console.log("connected database"))
    .catch((err) =>
      console.error("occurred error in database connecting", err)
    );

  loader(app);
  registerRouters(app);
  errorHandler(app);

  // 서버 체크를 위한 ping-pong End Point
  app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
  });

  return app.listen(PORT, () => {
    console.log("Running server on " + PORT);
  });
}

module.exports = {
  bootstrap,
};
