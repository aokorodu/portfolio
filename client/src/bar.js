import * as PIXI from 'pixi.js';

export class Bar{
  constructor(x, y, width, title="hi world", color=0x69D2E7, textPosition="right"){
    this.x = x
    this.y = y;
    this.w = width;
    this.h = 40;
    this.left = this.x - this.w/2;
    this.right = this.x + this.w/2;
    this.center = this.x;
    this.top = this.y;
    this.bottom = this.y + this.h;
    this.g;
    this.title = title;
    this.color = color;
    this.alpha = .5;
    this.text;
    this.textPosition = textPosition;
    this.textX;

    //this.COLORS = [ '#69D2E799', '#A7DBD899', '#E0E4CC99', '#F3863099', '#FA690099', '#FF4E5099', '#F9D42399' ];
  }

  init(stage) {
    this.g = new PIXI.Graphics();
    this.g.position.set(this.x, this.y)
    this.g.alpha = this.alpha;
    stage.addChild(this.g);

    this.initTitle(stage);

    this.draw();
  }

  initTitle(stage){
    const style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 14, fill : this.color, align : 'center'});
    this.text = new PIXI.Text(`${this.title}`, style);
    console.log('text width: ', this.text.width)
    this.textX = this.x -this.text.width/2;
    this.text.x = this.textX;
    this.text.y = this.y + this.h + 5;
    stage.addChild(this.text);
  }

  update(newWidth){
    if(this.w == newWidth) return;
    this.w = newWidth;
    this.left = this.x - this.w/2;
    this.right = this.x + this.w/2;
    this.center = this.x;
    this.draw();
  }

  move(newX){
    if(this.x == newX) return;
    this.x = newX;
    this.left = this.x - this.w/2;
    this.right = this.x + this.w/2;
    this.center = this.x;
    this.g.x = this.x;
    this.textX = this.x -this.text.width/2;
    this.text.x = this.textX;
    //this.draw();
  }

  draw(){
    this.g.clear();
    const r = this.w > 20 ? 10 : this.w/2;
    const l = this.w < 2 ? 2 : this.w;
    this.g.beginFill(this.color);
    this.g.drawRoundedRect(-l/2,0,l, this.h, r);
    //this.g.drawCircle(0,0,l/2);
    this.g.endFill();
    this.textX = this.textPosition == "right" ? this.x: this.x -this.text.width;
    this.text.x = this.x -this.text.width/2;

  }
}