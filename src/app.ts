import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { propertyRoute } from "./modules/properties/properties.route";
import { categoryRoute } from "./modules/category/category.route";
import { rentalRoute } from "./modules/rental/rental.route";

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

export default app;