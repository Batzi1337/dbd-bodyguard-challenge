import Tile from './Tile'
import './index.css'

// Automatically load every picture placed in src/pictures.
// Drop your image files (jpg, jpeg, png, gif, webp, svg) into that folder
// and a tile will be generated for each one.
const pictureModules = import.meta.glob(
  './pictures/*.(png|jpe?g|gif|webp|svg)',
  { eager: true, import: 'default' }
)

const pictures = Object.keys(pictureModules)
  .sort()
  .map((path) => pictureModules[path])

function App() {

  return (
    <div className="app">
      <header className="app-header">
        <h1>DBD Bodyguard Challenge</h1>
        <p>
          Left-click a tile to mark it <strong>green</strong>.
          Right-click to mark it <strong>red</strong> and decrease its
          counter each time.
        </p>
      </header>

      <div className="grid">
        {pictures.map((src, i) => (
          <Tile key={src} index={i} src={src} />
        ))}
      </div>
    </div>
  )
}

export default App
