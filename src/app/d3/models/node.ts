import APP_CONFIG, {COLORMAP} from '../../app.config';
export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  active = false;
  id: string;
  linkCount: number = 0;
  maxDocCount: number;
  constructor(id,linkCount,maxDocCount) {
    this.id = id;
    this.linkCount = linkCount;
    this.maxDocCount = maxDocCount;
  }

  normal = () => {
    return Math.sqrt((this.linkCount / (this.maxDocCount + 100)));
  }

  get r() {
    if(this.linkCount > 0 && this.maxDocCount > 0){
      return 50 * this.normal() + 10;
    }
    return 0;
  }
  set r(radius) {
    this.r = radius;
  }
  get fontSize():string {
    if(this.linkCount > 0 && this.maxDocCount > 0){
      //return (20 * this.normal() + 10) + 'px';
      return '15px';
    } 
    return '0px';
  }
  set fontSize(fs) {
    this.fontSize = fs + 'px'; 
  }

  get color() {
    // return COLORMAP.get(this.id)
    if(this.linkCount > 0 && this.maxDocCount > 0){
      let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
      return APP_CONFIG.SPECTRUM[index];
    } 
    return "#0000";
  }
  set color(c) {
    this.color = c;
  }
}
