import { Component } from '@angular/core';
import {
  AnnotationType,
  Colors,
  Enabled,
  GroupByType,
  LevelAnnotationConfig,
  LineType,
  OrgItemConfig,
  PageFitMode,
  Thickness,
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

  annotations: LevelAnnotationConfig[] = [];
  items: OrgItemConfig[] = [];
  itemsOriginal: OrgItemConfig[] = [];
  levels = 5;

  minLeafs = this.levels;
  minRoots = this.levels;

  groupsCategory = ['DI', 'SNC', 'SAS', 'SPA', 'SRL', 'COOP'];

  groupsObject: { name: string; value: boolean }[] = this.groupsCategory.map(
    (elem) => {
      return { name: elem, value: true };
    }
  );
  //annotations: LabelAnnotationConfig[] = [];

  ngOnInit(): void {
    this.items = this.generateTree(this.levels);
    this.itemsOriginal = JSON.parse(JSON.stringify(this.items));
  }

  generateTree(n: number) {
    for (let i = 0; i < n; i++) {
      this.annotations.push(
        new LevelAnnotationConfig({
          annotationType: AnnotationType.Level,
          levels: [i],
          title: 'Level ' + i,
          titleColor: Object.keys(Colors)[i + 10],
          offset: new Thickness(0, 0, 0, -1),
          lineWidth: new Thickness(0, 0, 0, 0),
          opacity: 0,
          borderColor: Colors.Gray,
          fillColor: Colors.Gray,
          lineType: LineType.Dotted,
          titleFontColor: 'black',
        })
      );
    }

    let nodes: OrgItemConfig[] = [];
    let currentLevel = 0;
    let currentId = 1;
    const groups = this.groupsCategory;
    //const groupT = this.groupsCategory[Math.floor(Math.random() * (5 - 0 + 1))];

    function createNode(id: number, parentId: number, level: number) {
      const randomNum = Math.floor(Math.random() * 6);
      return new OrgItemConfig({
        id: 'i' + id,
        parent: 'i' + parentId,
        title: `Node ${id}`,
        description: `Description for node ${id}`,
        image: `./assets/photos/d.png`,
        groupTitle: groups[randomNum],
        groupTitleColor: Object.keys(Colors)[randomNum + 20],
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
        };
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

  onHideBtnClick(itemConfig: OrgItemConfig) {
    itemConfig.isVisible = false;
    itemConfig.isActive = false;
  }

  onResetBtnClick() {
    const updatedTreeItems = this.items.map((el: OrgItemConfig) => {
      if (el.isVisible === false) {
        el.isVisible = true;
        el.isActive = true;
        return el;
      }

      return el;
    });

    this.items = updatedTreeItems;
    this.groupsObject = this.groupsObject.map((group) => {
      return { name: group.name, value: true };
    });
  }

  changedGroupSelection(e: any) {
    console.log(e);
    const groupFound = this.groupsObject.find(
      (elem) => elem.name === e.target.id
    );
    if (groupFound) {
      groupFound.value = e.target.checked;
      this.hideShowGroups(groupFound);
    }
  }

  hideShowGroups(group: { name: string; value: boolean }) {
    this.items = this.items.map((el: OrgItemConfig) => {
      if (el.groupTitle === group.name) {
        if (group.value) {
          el.isVisible = true;
          el.isActive = true;
        } else {
          el.isVisible = false;
          el.isActive = false;
        }
      }
      return el;
    });
  }
}
