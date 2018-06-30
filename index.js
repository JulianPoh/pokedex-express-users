/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const config = {
  user: 'julian',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};


const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */


/*
<<============================================================================>>
<<============================================================================>>
<< CREATE USER                                                                >>
<<============================================================================>>
<<============================================================================>>
*/
//<<<< GET CREATE USER FORM >>>>
app.get('/users/new', (request, response) => {
    response.render('Register');
});
//<<<< CREATE USER FUNCTION >>>>
app.post('/users/new', (request, response) => {
    let password = sha256( request.body.password );
    let queryText = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [request.body.name, request.body.email, password];
    pool.query(queryText, values, (err, queryResult) => {
        if( err ){
            response.send('db error: '+ err.message)
        }else{
            let user_id = queryResult.rows[0].id;
            let user_name = queryResult.rows[0].name;
            response.cookie('logged_in', 'true');
            response.cookie('user_id', user_id);
            response.send( "created user " + user_name + " with id: " + user_id )
        }
    });
});


/*
<<============================================================================>>
<<============================================================================>>
<< USER LOGIN & LOGOUT                                                        >>
<<============================================================================>>
<<============================================================================>>
*/
//<<<< LOGIN FORM >>>>
app.get('/users/login', (request, response) => {
    response.render('Login');
});
//<<<< LOGIN FUNCTION >>>>
app.post('/users/login', (request, response) => {
    let queryText = 'SELECT * FROM users WHERE email=$1';
    const values = [request.body.email];
    pool.query(queryText, values, (err, queryResult) => {
        if( err ){
            response.send('db error: '+ err.message)
        }else{
            const queryRows = queryResult.rows;
            console.log( queryRows );

            if( queryRows.length < 1){
                response.send(401);
            }else{
                let db_pass_hash = queryRows[0].password_hash;
                let request_pass_hash = sha256( request.body.password );
                if( db_pass_hash ===  request_pass_hash ){
                    response.cookie('logged_in', 'true');
                    response.cookie('user_id', queryRows[0].id);
                    response.send("Welcome "+queryRows[0].email);
                }else{
                    response.status(401).send('nope');
                }
            }
        }
    });
});

//<<<< LOGOUT FUNCTION >>>>
app.delete( '/users', (request, response) =>{
    response.clearCookie('user_id');
    response.clearCookie('logged_in');
    response.redirect('/')
})


/*
<<============================================================================>>
<<============================================================================>>
<< QUERY ALL POKEMON                                                          >>
<<============================================================================>>
<<============================================================================>>
*/
 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'Home', {pokemon: result.rows} );
    }
  });
}


/*
<<============================================================================>>
<<============================================================================>>
<< MAKE NEW POKEMON                                                           >>
<<============================================================================>>
<<============================================================================>>
*/
//<<<< GET FORM >>>>
const getNew = (request, response) => {
  response.render('New');
}
//<<<< FIND POKEMON BY ID >>>>
const getPokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'Pokemon', {pokemon: result.rows[0]} );
    }
  });
}
//<<<< SAVE NEW POKEMON >>>>
const postPokemon = (request, response) => {
  let params = request.body;
  
  const queryString = 'INSERT INTO pokemon(id, num, name, image, height, weight) VALUES($1, $2, $3, $4, $5, $6);';
  const values = [params.id, params.num, params.name, params.img, params.height, params.weight];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};


/*
<<============================================================================>>
<<============================================================================>>
<< EDIT POKEMON                                                               >>
<<============================================================================>>
<<============================================================================>>
*/
//<<<< GET FORM >>>>
const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'Edit', {pokemon: result.rows[0]} );
    }
  });
}
//<<<<  EDIT FUNCTION >>>>
const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($1)';
  const values = [pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}


/*
<<============================================================================>>
<<============================================================================>>
<< DELETE POKEMON                                                             >>
<<============================================================================>>
<<============================================================================>>
*/
//<<<< GET FORM >>>>
const deletePokemonForm = (request, response) => {
  response.send("COMPLETE ME");
}
//<<<< DELETE FUNCTION >>>>
const deletePokemon = (request, response) => {
  response.send("COMPLETE ME");
}



/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


