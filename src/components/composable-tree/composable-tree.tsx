import { Component, Prop, h, State, Element } from "@stencil/core";
import * as d3 from "d3";

@Component({
  tag: 'metriken-composable-tree',
  styleUrl: './composable-tree.css',
  shadow: true
})
export class MetrikenComposableTree {
  @Element() el: HTMLElement;
  @Prop() data: string;
  @Prop() title: string;

  @State() parsedData: any;

  componentWillLoad() {
    this.parsedData = JSON.parse(this.data);
  }

  componentDidLoad() {
    this.generateTree();
  }

  generateTree(){
    
  }


  render() {
    return (
      <div>
        <h1>{this.title}</h1>
        <svg></svg>
        <div class="tooltip"></div>
      </div>
    );
  }
}
