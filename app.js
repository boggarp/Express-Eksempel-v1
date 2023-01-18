const setup = require('./setup.js')
const app = setup.app
const db = setup.db

/**************************************************
          HANDLERE FOR Nettsider / HBS-FILER:
***************************************************/

// Handler fremsiden 
// -> Visning av alle personer registrert, med link til info om hver enkelt person
app.get('', (request,response) => {
    //Henter alle rader i tabellen personer
    const sqlPersoner = db.prepare('SELECT * FROM personer')
    const personer = sqlPersoner.all()

    // Rendrer index.hbs med alle radene i personer, 
    // og sender tilbake til klient
    response.render("index.hbs", {
        title: "The Country Visit Tracker", 
        personer: personer})
})

// Handler for /personInfo?id=...&navn=...
//  -> Info om en enkelt person
app.get('/personInfo', (request,response) => {
    // Henter id og navn som skal være lagt ved urlen ved å skrive ?id=...&navn=...
    const id = request.query.id
    const navn = request.query.navn

    // Henter alle radene i tabellen besøk, som hører til id-en over,
    // og henter land-navn ved en INNER JOIN
    const sqlpersonInfo = db.prepare(`
    SELECT * 
    FROM besok 
    INNER JOIN land
    ON besok.land_id = land.id 
    WHERE personer_id=(?)`)
    const personInfo = sqlpersonInfo.all(id)

    // Rendrer personInfo.hbs med navnet til personen,  
    // og landene han har besøkt, og sender resultat til klient
    response.render("personInfo.hbs", {
        title: "The Country Visit Tracker", 
        navn: request.query.navn,
        personInfo: personInfo})
})

// Handler adminForms
//  -> Innsetting av person,land og poststed
app.get('/adminForms', (request,response) => {
    // Henter alle radene i tabellen poststed
    const sql = db.prepare('SELECT * FROM poststed')
    const poststed = sql.all()

    // Rendrer adminForms med radene fra poststed, 
    // og sender resultat til klient
    response.render("adminForms.hbs", {
        title: "Admin Page", 
        poststed: poststed})
})

// Handler for /visitForm
//  -> Legg til et land en person har besøkt
app.get('/visitForm', (request,response) => {
    //Henter alle rader i tabellen personer
    const sqlPersoner = db.prepare('SELECT * FROM personer')
    const personer = sqlPersoner.all()

    //Henter alle rader i tabellen land
    const sqlLand = db.prepare('SELECT * FROM land')
    const land = sqlLand.all()

    // Rendrer visitForm.hbs med radene fra personer og land, 
    // og sender resultat til klient
    response.render("visitForm.hbs", {
        title: "Legg til besøk", 
        personer: personer,
        land: land})
})


/**************************************************
     HANDLERE FOR HTML-Skjemaer (POST-METHOD) 
***************************************************/

//Handler for innsetting av poststed
app.post('/addPoststed', (request,response) => {
    //Logger inndata fra html-skjema til console
    console.log(request.body)

    //Setter inn postnummer og poststed. Returnerer feilmelding viss det ikke går.
    //Sender klient til takk.html viss innsetting var vellykket.
    const sql = db.prepare('INSERT INTO poststed (postnummer,poststed) VALUES (?,?)');
    try {
        const info = sql.run(request.body.postnummer,request.body.poststed)
    } catch (error) {
        response.send("Error:" + error)
    }
    response.redirect("/takk.html")       
})

//Handler for innsetting av personer
app.post('/addPerson', (request,response) => {
    //Logger inndata fra html-skjema til console
    console.log(request.body)
    
    //Setter inn fornavn, etternavn og postnummer. Returnerer feilmelding viss det ikke går.
    //Sender klient til takk.html viss innsetting var vellykket.
    const sql = db.prepare('INSERT INTO personer (fornavn,etternavn,postnummer) VALUES (?,?,?)');
    try {
        const info = sql.run(request.body.fornavn,request.body.etternavn, request.body.postnummer)
    } catch (error) {
        response.send("Error:" + error)
    }
    response.redirect("/takk.html")       
})

//Handler for innsetting av land
app.post('/addLand', (request,response) => {
    //Logger inndata fra html-skjema til console
    console.log(request.body)

    //Setter inn et nytt land. Returnerer feilmelding viss det ikke går.
    //Sender klient til takk.html viss innsetting var vellykket.
    const sql = db.prepare('INSERT INTO land (navn) VALUES (?)');
    try {
        const info = sql.run(request.body.navn)
    } catch (error) {
        response.send("Error:" + error)
    }
    response.redirect("/takk.html")       
})


//Handler for innsetting av besøk
app.post('/addVisit', (request,response) => {
    //Logger inndata fra html-skjema til console
    console.log(request.body)

    //Setter inn et nytt besøk. Returnerer feilmelding viss det ikke går.
    //Sender klient til takk.html viss innsetting var vellykket.
    const sql = db.prepare('INSERT INTO besok (personer_id, land_id,antall_besok) VALUES (?,?,?)');
    try {
        const info = sql.run(request.body.person_id, request.body.land_id, 1)
    } catch (error) {
        response.send("Error:" + error)
    }
    response.redirect("/takk.html")       
})

/**************************************************
                 Oppstart Appikasjon
***************************************************/
app.listen(3000, function() { 
    console.log("Server is up! Check http://localhost:3000")
})