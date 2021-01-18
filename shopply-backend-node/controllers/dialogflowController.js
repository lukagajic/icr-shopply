const Product = require('../models/product');
const Category = require('../models/category');

const { Op } = require('sequelize');

const dialogflowFulfillment = require('dialogflow-fulfillment');

function demoWebHook(agent) {
    agent.add('Saljemo odgovor sa webhook servera');
}

let detailedSearchParameters = {};


async function detaljnaPretraga01(agent) {
    detailedSearchParameters = {};
    agent.add('Kojoj kategoriji pripada proizvod?');
}

async function detaljnaPretraga02Intent(agent) {
    detailedSearchParameters.category = agent.request_.body.queryResult.parameters.any;
    agent.add('Unesite početnu cenu');
}

async function detaljnaPretraga03Intent(agent) {
    detailedSearchParameters.startingPrice = agent.request_.body.queryResult.parameters.any * 1;
    agent.add('Unesite krajnju cenu');
}

async function detaljnaPretraga04Intent(agent) {
    detailedSearchParameters.endingPrice = agent.request_.body.queryResult.parameters.any * 1;
    agent.add('Unesite ime ili deo imena proizvoda');
}

async function detaljnaPretraga05Intent(agent) {
    let payload = {
        "richContent": [
            [
                
            ]
        ]
    };

    detailedSearchParameters.productName = agent.request_.body.queryResult.parameters.any;
    
    const category = await Category.findOne({
        where: {
            title: {
                [Op.like]: `%${detailedSearchParameters.category}%`
            }
        }
    });

    if (!category) {
        agent.add('Ne postoji takav proizvod. Molimo Vas da pokušate ponovo!');
        return;
    }

    const productsMatchingParams = await Product.findAll({
        where: {
            categoryId: category.dataValues.categoryId,
            price: {
                [Op.gt]: detailedSearchParameters.startingPrice,
                [Op.lt]: detailedSearchParameters.endingPrice
            },
            title: {
                [Op.like]: `%${detailedSearchParameters.productName}%`
            }
        }   
    });

    if (productsMatchingParams.length === 0) {
        agent.add('Ne postoji takav proizvod. Molimo Vas da pokušate ponovo!');
        return;
    }

    for (product of productsMatchingParams) {
        payload.richContent[0].push(
            {
                "type": "button",
                "icon": {
                    "type": "chevron_right",
                    "color": "#FF9800"
                },
                "text": `${product.dataValues.title}`,
                "link": `http://localhost:3000/products/${product.dataValues.productId}`,
                "event": {
                    "name": "",
                    "languageCode": "",
                    "parameters": {}
                }
            }
        );
        console.log(`${product.dataValues.title} - http://localhost:3000/products/${product.dataValues.productId}`);
    }
    

    await agent.add(new dialogflowFulfillment.Payload(
        agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
    ));
}


async function pretraga02Intent(agent) {
    let payload = {
        "richContent": [
            [
                
            ]
        ]
    };
    
    const query = agent.request_.body.queryResult.outputContexts[0].parameters.any;

    const productsMatchingQuery = await Product.findAll({
        where: {
            title: {
                [Op.like]: `%${query}%`
            }
        }
    });

    if(productsMatchingQuery.length === 0) {
        await agent.add('Ne postoji nijedan takav proizvod');
        return;
    }

    for (product of productsMatchingQuery) {
        payload.richContent[0].push(
            {
                "type": "button",
                "icon": {
                    "type": "chevron_right",
                    "color": "#FF9800"
                },
                "text": `${product.dataValues.title}`,
                "link": `http://localhost:3000/products/${product.dataValues.productId}`,
                "event": {
                    "name": "",
                    "languageCode": "",
                    "parameters": {}
                }
            }
        );
        console.log(`${product.dataValues.title} - http://localhost:3000/products/${product.dataValues.productId}`);
    }
    

    await agent.add(new dialogflowFulfillment.Payload(
        agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
    ));
}

async function featuredProductsIntent(agent) {
    let payload = {
        "richContent": [
            [
                
            ]
        ]
    };

    const featuredProducts = await Product.findAll({
        where: {
            isFeatured: true
        },
        limit: 5,
        order: [
            ['createdAt', 'DESC']
        ]
    });

    for (product of featuredProducts) {
        payload.richContent[0].push(
            {
                "type": "button",
                "icon": {
                    "type": "chevron_right",
                    "color": "#FF9800"
                },
                "text": `${product.dataValues.title}`,
                "link": `http://localhost:3000/products/${product.dataValues.productId}`,
                "event": {
                    "name": "",
                    "languageCode": "",
                    "parameters": {}
                }
            }
        );
        console.log(`${product.dataValues.title} - http://localhost:3000/products/${product.dataValues.productId}`);
    }

    await agent.add(new dialogflowFulfillment.Payload(
        agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
    ));
}

async function latestProductsIntent(agent) {
    let payload = {
        "richContent": [
            [
                
            ]
        ]
    };

    const latestProducts = await Product.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        limit: 5
    });

    for (product of latestProducts) {
        payload.richContent[0].push(
            {
                "type": "button",
                "icon": {
                    "type": "chevron_right",
                    "color": "#FF9800"
                },
                "text": `${product.dataValues.title}`,
                "link": `http://localhost:3000/products/${product.dataValues.productId}`,
                "event": {
                    "name": "",
                    "languageCode": "",
                    "parameters": {}
                }
            }
        );
        console.log(`${product.dataValues.title} - http://localhost:3000/products/${product.dataValues.productId}`);
    }

    detailedSearchParameters = {};

    await agent.add(new dialogflowFulfillment.Payload(
        agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
    ));
}

async function categoriesIntent(agent) {
    let payload = {
        "richContent": [
            [
                
            ]
        ]
    };

    const allCategories = await Category.findAll();
    
    for (category of allCategories) {
        payload.richContent[0].push(
            {
                "type": "button",
                "icon": {
                    "type": "chevron_right",
                    "color": "#FF9800"
                },
                "text": `${category.dataValues.title}`,
                "link": `http://localhost:3000/categories/${category.dataValues.categoryId}`,
                "event": {
                    "name": "",
                    "languageCode": "",
                    "parameters": {}
                }
            }
        );
        console.log(`${category.dataValues.title} - http://localhost:3000/categories/${category.dataValues.categoryId}`);
    }


    await agent.add(new dialogflowFulfillment.Payload(
        agent.UNSPECIFIED, payload, { sendAsMessage: true, rawPayload: true }
    ));
}
module.exports = {
    async handleFullfilments(req, res) {
        const agent = new dialogflowFulfillment.WebhookClient({
            request: req,
            response: res
        });

        let intentMap = new Map();
        intentMap.set('webendpoint', demoWebHook);
        intentMap.set('categoriesIntent', categoriesIntent);
        intentMap.set('latestProductsIntent', latestProductsIntent);
        intentMap.set('featuredProductsIntent', featuredProductsIntent);
        intentMap.set('pretraga02Intent', pretraga02Intent);

        intentMap.set('detaljnaPretraga01', detaljnaPretraga01);
        intentMap.set('detaljnaPretraga02Intent', detaljnaPretraga02Intent);
        intentMap.set('detaljnaPretraga03Intent', detaljnaPretraga03Intent);
        intentMap.set('detaljnaPretraga04Intent', detaljnaPretraga04Intent);

        intentMap.set('detaljnaPretraga05Intent', detaljnaPretraga05Intent);
        agent.handleRequest(intentMap);
    }
};
