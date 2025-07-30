const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prismaConfig");

const prismaSessionOption = {
    cookie: {
      // 1 day
      maxAge: 24 * 60 * 60 * 1000, // ms
    },
    secret: "santa ana cascade",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      // 1 hr
      checkPeriod: 60 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }

  module.exports.prismaSessionOption = prismaSessionOption
  