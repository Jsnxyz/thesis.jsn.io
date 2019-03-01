import { Node } from './';

export class Link implements d3.SimulationLinkDatum<Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
  source: Node;
  target: Node;
  color?: string;
  doc_count?: number;
  max_count?:number;
  constructor(source, target, doc_count,maxCount) {
    this.source = source;
    this.target = target;
    this.doc_count = doc_count;
    this.max_count = maxCount;
    this.color = this.getColor(doc_count,maxCount);
  }
  getColor(doc_count,maxCount){
    let alpha = doc_count / maxCount ;
    alpha = alpha < 0.2 ? 0.2 : alpha;
    return 'rgba(115, 99, 99,' + alpha +')';
  }
}
