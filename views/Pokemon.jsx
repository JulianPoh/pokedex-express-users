var React = require("react");

class Pokemon extends React.Component {
  render() {
    return (
      <html>
        <head />
        <body>
          <div>
            <img src={this.props.pokemon.img}/>
            <h2>{this.props.pokemon.name}</h2>
            <ul className="pokemon-list">
              <li className="pokemon-attribute">
                PokeID: {this.props.pokemon.id}
              </li>
              <li className="pokemon-attribute">
                Pokemon No.: {this.props.pokemon.num}
              </li>
              <li className="pokemon-attribute">
                Height: {this.props.pokemon.height}
              </li>
              <li className="pokemon-attribute">
                Weight: {this.props.pokemon.weight}
              </li>
              <li className="pokemon-attribute">
                Candy: {this.props.pokemon.candy}
              </li>
              <li className="pokemon-attribute">
                Candy Count: {this.props.pokemon.candy_count}
              </li>
              <li className="pokemon-attribute">
                Egg: {this.props.pokemon.egg}
              </li>
              <li className="pokemon-attribute">
                Avg Spawns: {this.props.pokemon.avg_spawns}
              </li>
              <li className="pokemon-attribute">
                Spawn Time: {this.props.pokemon.spawn_time}
              </li>
            </ul>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = Pokemon;
