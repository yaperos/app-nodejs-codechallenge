import { ConfigProps } from "src/interfaces/config.interface";

export const config = ():ConfigProps => ({
    port: parseInt(process.env.PORT, 10),
})