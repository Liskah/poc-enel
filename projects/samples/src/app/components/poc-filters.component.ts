import { Component } from '@angular/core';
import {
  Enabled,
  GroupByType,
  OrgItemConfig,
  PageFitMode,
} from 'ngx-basic-primitives';

// @ts-ignore

@Component({
  selector: 'app-poc-filters',
  templateUrl: './poc-filters.component.html',
  styleUrls: ['../sample.css'],
})
export class PocFiltersComponent {
  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  items: OrgItemConfig[] = [];
  itemsOriginal: OrgItemConfig[] = [];
  levels = 5;

  minLeafs = this.levels;
  minRoots = this.levels;
  //annotations: LabelAnnotationConfig[] = [];

  ngOnInit(): void {
    this.items = this.generateTree(this.levels);
    this.itemsOriginal = JSON.parse(JSON.stringify(this.items));
  }

  generateTree(n: number) {
    let nodes: OrgItemConfig[] = [];
    let currentLevel = 0;
    let currentId = 1;

    function createNode(id: number, parentId: number, level: number) {
      return new OrgItemConfig({
        id: 'i' + id,
        parent: 'i' + parentId,
        title: `Node ${id}`,
        description: `Description for node ${id}`,
        image: `./assets/photos/d.png`,
        groupTitle: 'level' + level,
        context: { level: level },
      });
    }

    function addNodes(level: number, parentId: number) {
      if (level > n) return;

      let nodeCount = level === 1 ? 1 : 2; //Math.pow(2, level - 1); // Number of nodes at current level
      for (let i = 0; i < nodeCount; i++) {
        let nodeId = currentId++;
        nodes.push(createNode(nodeId, parentId, level));
        addNodes(level + 1, nodeId);
      }
    }

    // Start with level 1 (root level)
    addNodes(1, 0);

    return nodes;
  }

  filterLeafs(maxLevel: number): OrgItemConfig[] {
    return this.itemsOriginal.filter((item) => {
      if (item.context.level < maxLevel + 1) {
        return true;
      }
      return false;
    });
  }

  filterRoots(minLevel: number): OrgItemConfig[] {
    const filtered = this.itemsOriginal.filter((item) => {
      if (item.context.level >= minLevel + 1) {
        return true;
      }
      return false;
    });

    const pero = filtered.map((el: OrgItemConfig) => {
      if (el.context.level === minLevel + 1) {
        el = {
          ...el,
          parent: null,
        }
        return el;
      }
      return el;
    });

    return pero;
  }

  hideLeafs(e: any) {
    this.minLeafs = e.target.valueAsNumber;
    this.items = this.filterLeafs(e.target.valueAsNumber);
  }

  hideRoots(e: any) {
    this.minRoots = e.target.valueAsNumber;
    this.items = this.filterRoots(this.levels - e.target.valueAsNumber);
  }
}
