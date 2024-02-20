import { Router } from "express";

const smartMoneyRouter = Router();

smartMoneyRouter.use((req, res, next) => {
    console.log(req.ip);
    next();
});

smartMoneyRouter.get('', (req, res) => {
    return res.send("Home page.");
});

export default smartMoneyRouter;