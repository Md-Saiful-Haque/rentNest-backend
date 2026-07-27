import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { propertyRoute } from "./modules/properties/properties.route";
import { categoryRoute } from "./modules/category/category.route";
import { rentalRoute } from "./modules/rental/rental.route";
import { paymentRoute } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.routes";
import { adminRotes } from "./modules/admin/admin.routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello from RentNest backend")
})

app.use("/api/auth", authRouter)
app.use('/api/categories', categoryRoute);
app.use("/api/properties", propertyRoute)
app.use('/api/rentals', rentalRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/reviews', reviewRoutes)
app.use('/api/admin', adminRotes)

app.use(notFound)
app.use(globalErrorHandler)

export default app;