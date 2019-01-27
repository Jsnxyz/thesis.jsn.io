import APP_CONFIG from '../../app.config';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  linkCount: number = 0;
  maxDocCount: number;
  constructor(id,maxDocCount) {
    this.id = id;
    this.maxDocCount = maxDocCount;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / (this.maxDocCount + 100));
  }

  get r() {
    return 50 * this.normal() + 10;
  }

  get fontSize() {
    return 15 + 'px';
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[index];
  }
}
