const express = require('express')
const swaggerUi = require('swagger-ui-express')
const openAPIyml = require('yamljs')
const app = express();


const swaggerFile = openAPIyml.load('openapi.yaml')





app.use('api/docs',swaggerUi.serve, swaggerUi.setup(swaggerFile));

const port = 8000

app.listen(port,() => {
    console.log(`Swagger backend setup for testing at ${port} `)
})