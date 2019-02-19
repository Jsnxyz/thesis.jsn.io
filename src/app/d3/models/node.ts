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
    return COLORMAP.get(this.id)
  }
}
