/*import { AppDataSource } from "./data-source"
import { Product } from "./models/Product/Product"

AppDataSource.then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new Product()
    user.firstName = "Timber"
    user.lastName = "Saw"
    user.age = 25
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(Product)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

    const products = await AppDataSource.manager.find(Product)
    console.log("Loaded products: ", products);
}).catch(error => console.log(error))*/
