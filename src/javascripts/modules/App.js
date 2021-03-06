import * as PIXI from 'pixi.js'
import Stamp from './Stamp'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from './Constants'

export default class App {
  constructor(opts) {
    this.renderer = PIXI.autoDetectRenderer({
      width:           CANVAS_WIDTH,
      height:          CANVAS_HEIGHT,
      view:            opts.canvas,
      preserveDrawingBuffer: true
    })

    this.stage = new PIXI.Container()
    this.stage.width = CANVAS_WIDTH
    this.stage.height = CANVAS_HEIGHT
    this.ticker = PIXI.ticker.shared

    this.ticker.add(() => {
      this.renderer.render(this.stage)
    })
  }

  setImage(url, width, height) {
    const sprite = new PIXI.Sprite.fromImage(url)
    this.sprite = sprite
    if (width > height) {
      sprite.height = CANVAS_HEIGHT
      sprite.width = width * CANVAS_HEIGHT / height
    } else {
      sprite.width = CANVAS_WIDTH
      sprite.height = height * CANVAS_WIDTH / width
    }
    sprite.anchor.set(0.5, 0.5)
    sprite.x = CANVAS_WIDTH / 2
    sprite.y = CANVAS_HEIGHT / 2

    this.stage.addChild(sprite)
    this.renderer.render(this.stage)
  }

  setFilter(type) {
    if (!this.sprite) return

    switch(type) {
      case 'blur':
        this.sprite.filters = [new PIXI.filters.BlurFilter()]
        break
      case 'color':
        const color = new PIXI.filters.ColorMatrixFilter()
        color.contrast(2)
        this.sprite.filters = [color]
        break
      case 'alpha':
        const alpha = new PIXI.filters.AlphaFilter
        alpha.alpha = 0.5
        this.sprite.filters = [alpha]
        break
      case 'noise':
        this.sprite.filters = [new PIXI.filters.NoiseFilter()]
        break
      default:
        break
    }
  }

  export() {
    if (this.stage.children.length < 1) return false

    return this.renderer.view.toDataURL("image/png")
  }

  addStamp(url) {
    const stamp = new Stamp({
      image: url
    })
    this.stage.addChild(stamp)
  }
}
