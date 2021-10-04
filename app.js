const express = require("express");
const app = express();
const mysql = require("mysql");
const { obtener } = require("./operations");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require("dotenv").config();

app.use(express.json());
const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE 
});

connection.connect((error) => {
    if(error) throw error;
    console.log("connect to database success")
})


app.get("/", (req, res) => {
    res.send("Hola Policy");
})

const llenadoCSV = (records => {
    const csvWriter = createCsvWriter({
        path: 'policy.csv',
        header: [
            { id: "clientId", title: "CLIENTID" },
            { id: "salesChannelId", title: "SALESCHANNELID" },
            { id: "birthdate", title: "BIRTHDATE" },
            { id: "name", title: "NAME" },
            { id: "lastName", title: "LASTNAME" },
            { id: "secondFamilyName", title: "SECONDFAMILYNAME" },
            { id: "gender", title: "GENDER" },
            { id: "nationality", title: "NATIONALITY" },
            { id: "isPEP", title: "ISPEP" },
            { id: "mobile", title: "MOBILE" },
            { id: "healthQuestion1", title: "HEALTHQUESTION1" },
            { id: "accidentsQuestion1", title: "ACCIDENTSQUESTION1" },
            { id: "idCCInfo", title: "IDCCINFO" },
            { id: "addressCountry", title: "COUNTRY" },
            { id: "addressCity", title: "CITY" },
            { id: "addressExtNum", title: "EXTERIOR NUM" },
            { id: "addressIntNum", title: "INTERIOR NUM" },
            { id: "addressNeighborhood", title: "NEIGHBORDHOOD" },
            { id: "addressState", title: "STATE" },
            { id: "addressStreet", title: "STREET" },
            { id: "addressZipcode", title: "ZIPCODE" },
            { id: "addressMunicipality", title: "MUNICIPALITY" },
            { id: "contactName1", title: "CONTACTNAME1" },
            { id: "contactLastName1", title: "CONTACTLASTNAME1" },
            { id: "contactsecondFamilyName1", title: "CONTACTSECONDFAMILYNAME1" },
            { id: "contactEmail1", title: "CONTACTEMAIL1" },
            { id: "contactMobile1", title: "CONTACTMOBILE1" },
            { id: "contactRelationship1", title: "CONTACTRELATIONSHIP1" },
            { id: "contactName2", title: "CONTACTNAME2" },
            { id: "contactLastName2", title: "CONTACTLASTNAME2" },
            { id: "contactsecondFamilyName2", title: "CONTACTSECONDFAMILYNAME2" },
            { id: "contactEmail2", title: "CONTACTEMAIL2" },
            { id: "contactMobile2", title: "CONTACTMOBILE2" },
            { id: "contactRelationship2", title: "CONTACTRELATIONSHIP2" },
            { id: "contactName3", title: "CONTACTNAME3" },
            { id: "contactLastName3", title: "CONTACTLASTNAME3" },
            { id: "contactsecondFamilyName3", title: "CONTACTSECONDFAMILYNAME3" },
            { id: "contactEmail3", title: "CONTACTEMAIL3" },
            { id: "contactMobile3", title: "CONTACTMOBILE3" },
            { id: "contactRelationship3", title: "CONTACTRELATIONSHIP3" },
            { id: "contactName4", title: "CONTACTNAME4" },
            { id: "contactLastName4", title: "CONTACTLASTNAME4" },
            { id: "contactsecondFamilyName4", title: "CONTACTSECONDFAMILYNAME4" },
            { id: "contactEmail4", title: "CONTACTEMAIL4" },
            { id: "contactMobile4", title: "CONTACTMOBILE4" },
            { id: "contactRelationship4", title: "CONTACTRELATIONSHIP4" }
        ]
    });
    csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });

})

app.get("/obtener", (req, res) => {
    obtener(connection, (result) => {
        let clientes = [];
        result.map(function (obj){
            const data = obj.policyHolderJson
            ? JSON.parse(obj.policyHolderJson)
            : null;
            if(data) {
                let { 
                    clientId,
                    salesChannelId,
                    birthdate,
                    name,
                    lastName,
                    secondFamilyName,
                    gender,
                    nationality,
                    isPEP,
                    mobile,
                    healthQuestion1,
                    accidentsQuestion1,
                    address,
                    contacts,
                    idCCInfo
                } = data;
                contador = 1;
                let contactos = {}
                contacts.map(function (contacto){
                    (contactos["contactName" + contador] = contacto.name),
                    (contactos["contactLastName" + contador] = contacto.lastName),
                    (contactos["contactsecondFamilyName" + contador] = contacto.secondFamilyName),
                    (contactos["contactEmail" + contador] = contacto.email),
                    (contactos["contactMobile" + contador] = contacto.mobile),
                    (contactos["contactRelationship" + contador] = contacto.relationship)
                    contador++;
                });
                //llenado del arreglo
                clientes.push({
                    clientId,
                    salesChannelId,
                    birthdate,
                    name,
                    lastName,
                    secondFamilyName,
                    gender,
                    nationality,
                    isPEP,
                    mobile,
                    healthQuestion1,
                    accidentsQuestion1,
                    addressCountry : address.country,
                    addressCity: address.city,
                    addressExtNum: address.exteriorNumber,
                    addressIntNum: address.interiorNumber,
                    addressNeighborhood: address.neighborhood,
                    addressState: address.state,
                    addressStreet: address.street,
                    addressZipcode: address.zipCode,
                    addressMunicipality: address.municipality,
                    ...contactos
                });
            }
        });
        //se tiene que crear una function para crear el csv y pasarle como parametro todas las propiedadees que se necesiten
        llenadoCSV(clientes);
    })
})


let PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
