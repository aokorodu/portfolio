export class Utils{


  static buildTextElement(x, y, anchor, baseline, fill, textClass, content=""){
    const ns = "http://www.w3.org/2000/svg";
    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", anchor);
    // dominant-baseline - baseline, middle, or hanging
    text.setAttribute("dominant-baseline", baseline);
    text.setAttribute("dx", 0);
    text.setAttribute("fill", fill);
    text.setAttribute("class", textClass);
    text.textContent = content;

    return text;
  }

  static buildGroup(){
    const ns = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(ns, "g");

    return group;
  }

  static buildLine(x1, y1, x2, y2, stroke, strokeWidth=1){
    const ns = "http://www.w3.org/2000/svg";
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", strokeWidth);
    
    return line;
  }

  static buildRect(x, y, w, h, fill="#FFFFFF"){
    const ns = "http://www.w3.org/2000/svg";
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("rx", 4);
    rect.setAttribute("opacity", 1);
    rect.setAttribute("fill", fill);

    return rect;
  }
}