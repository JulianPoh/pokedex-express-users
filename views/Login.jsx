var React = require('react');

class Login extends React.Component {
  render() {
    return (
        <div>
        <h2>Please Login to Access the Pokedex</h2>
          <form action="/users/login" method="POST">

            <input name="email" type="text" placeholder="email" />

            <input name="password" type="password" placeholder="password"/>

            <input name="submit" type="submit" />
          </form>
        </div>
    );

  }
}

module.exports = Login;