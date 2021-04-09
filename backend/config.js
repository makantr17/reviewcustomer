export default{
    // MONGODB_URL: process.env.MONGODB_URL || "mongodb+srv://node-shop:node-shop@node-rest-shop.ja4f9.mongodb.net/shopBackend?retryWrites=true&w=majority",
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost/entrepriseMS",
    JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret',
    JWT_COMPANY_SECRET: process.env.JWT_COMPANY_SECRET || 'companylogs',
    JWT_SECRET_REGISTER:  process.env.JWT_SECRET_REGISTER || 'http:localhose',
    JWT_COMPANY_REGISTER:  process.env.JWT_COMPANY_REGISTER || 'http:localhost',
    JWT_SECRET_RESET: process.env.JWT_SECRET_RESET || 'for@SecurityRaison',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
}
