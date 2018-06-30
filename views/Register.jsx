var React = require("react");

class Newuser extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
        <div className="container">
          <h2>Register a New Pokemon Master!</h2>
          <form className="user-form" method="POST" action="/users">
            <div className="user-attribute">
              User Name:<input name="id" type="text" placeholder="New User Name"/>
            </div>
            <div className="user-attribute">
              User Email:<input name="email" type="text" placeholder="New User email"/>
            </div>
            <div className="user-attribute">
              Password:<input name="password" type="password" placeholder="Password"/>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </div>
        </body>
      </html>
    );
  }
}

module.exports = Newuser;
