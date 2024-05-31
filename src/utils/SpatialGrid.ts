import { IWorld } from 'bitecs';
import { Position } from '../components';

export class SpatialGrid {
  private cellSize: number;
  private grid: Map<string, Set<number>>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  insert(world: IWorld, eid: number): void {
    const x = Position.x[eid];
    const y = Position.y[eid];
    const key = this.getCellKey(x, y);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key)!.add(eid);
  }

  query(x: number, y: number, range: number): Set<number> {
    const nearbyEntities = new Set<number>();
    const minX = Math.floor((x - range) / this.cellSize);
    const maxX = Math.floor((x + range) / this.cellSize);
    const minY = Math.floor((y - range) / this.cellSize);
    const maxY = Math.floor((y + range) / this.cellSize);

    for (let cx = minX; cx <= maxX; cx++) {
      for (let cy = minY; cy <= maxY; cy++) {
        const key = `${cx},${cy}`;
        if (this.grid.has(key)) {
          for (let eid of this.grid.get(key)!) {
            nearbyEntities.add(eid);
          }
        }
      }
    }

    return nearbyEntities;
  }

  clear(): void {
    this.grid.clear();
  }
}
