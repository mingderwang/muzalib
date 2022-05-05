import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ClockController } from './clock.js'

@customElement('my-element')
class MyElement extends LitElement {
  private readonly clock = new ClockController(this) // Instantiate

  render() {
    // Use controller
    return html`
      <div>
        <h1>Hello, Ming!</h1>
        <h2>It is ${this.clock.date.toLocaleTimeString()}.</h2>
      </div>
    `
  }
}
