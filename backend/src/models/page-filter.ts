export class PageFilter {
  sortAsc: boolean = true;
  index: number;
  size: number;

  get start(): number {
    return this.size * this.index;
  }
  
  get end(): number {
    return this.size * (this.index + 1);
  }

}