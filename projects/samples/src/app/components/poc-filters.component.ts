import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import * as _html2canvas from 'html2canvas';
import jspdf from 'jspdf';
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

import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.componen';

const html2canvas: any = _html2canvas;

@Component({
  selector: 'app-poc-filters',
  templateUrl: './poc-filters.component.html',
  styleUrls: ['../sample.css'],
})
export class PocFiltersComponent {
  @ViewChild('orgDiagram') orgDiagram!: ElementRef;

  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  annotations: LevelAnnotationConfig[] = [];
  items: OrgItemConfig[] = [];
  itemsOriginal: OrgItemConfig[] = [];
  levels = 5;

  rootsValue = this.levels;
  leafsValue = this.levels;

  rootNodeId = 1;
  groupsCategory = ['DI', 'SNC', 'SAS', 'SPA', 'SRL', 'COOP'];

  diagramScale: number = 1;

  groupsObject: { name: string; value: boolean; color: string }[] =
    this.groupsCategory.map((elem, index) => {
      return {
        name: elem,
        value: true,
        color: Object.keys(Colors)[index + 20],
      };
    });

  localStorageKey = 'poc-filters-tree';
  disabledLoad = true;

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.createTree();
  }

  createTree() {
    this.rootsValue = this.levels;
    this.leafsValue = this.levels;
    this.rootNodeId = 1;
    this.resetGroupObjValues();
    this.items = this.generateTree();
    this.itemsOriginal = JSON.parse(JSON.stringify(this.items));

    this.disabledLoad = !this.checkSavedTree();
  }

  generateTree() {
    const n = this.levels;
    for (let i = 0; i < 10; i++) {
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
    let currentId = 1;
    const groups = this.groupsObject;

    function createNode(id: number, parentId: number, level: number) {
      const randomNum = Math.floor(Math.random() * 6);
      return new OrgItemConfig({
        id: 'z' + id,
        parent: 'z' + parentId,
        title: `Node ${id}`,
        description: `Description for node ${id}`,
        image: `./assets/photos/d.png`,
        groupTitle: groups[randomNum].name,
        groupTitleColor: groups[randomNum].color,
        context: { level: level },
        //levelOffset: level,
      });
    }

    function addNodes(level: number, parentId: number) {
      if (level > n) return;

      const nodeCount = level === 1 ? 1 : 2;
      for (let i = 0; i < nodeCount; i++) {
        const nodeId = currentId++;
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
        return {
          ...el,
          parent: null,
        };
      }
      return el;
    });

    return pero;
  }

  hideLeafs(e: any) {
    this.rootNodeId = 1;
    this.resetGroupObjValues();
    this.leafsValue = e.target.valueAsNumber;
    this.rootsValue = this.levels;
    this.items = this.filterLeafs(e.target.valueAsNumber);
  }

  hideRoots(e: any) {
    this.rootNodeId = 1;
    this.resetGroupObjValues();
    this.rootsValue = e.target.valueAsNumber;
    this.leafsValue = this.levels;
    this.items = this.filterRoots(this.levels - e.target.valueAsNumber);
  }

  onHideBtnClick(itemConfig: OrgItemConfig) {
    itemConfig.isVisible = false;
    itemConfig.isActive = false;
  }

  onResetBtnClick() {
    this.rootNodeId = 1;
    this.items = JSON.parse(JSON.stringify(this.itemsOriginal));
    this.resetGroupObjValues();
    this.leafsValue = this.levels;
    this.rootsValue = this.levels;
  }

  resetGroupObjValues() {
    this.groupsObject = this.groupsObject.map((group) => {
      return { name: group.name, value: true, color: group.color };
    });
  }

  changedGroupSelection(e: any) {
    this.rootNodeId = 1;
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
          return {
            ...el,
            isVisible: true,
            isActive: true,
          };
        } else {
          return {
            ...el,
            isVisible: false,
            isActive: false,
          };
        }
      }
      return el;
    });
  }

  selectNewRoot() {
    const newRoot = this.itemsOriginal.find(
      (item) => item.id === 'z' + this.rootNodeId
    );
    if (newRoot) {
      this.items = [...this.rebuildTree([newRoot]), newRoot];
    } else {
      this.items = [];
    }
  }

  rebuildTree(nodeList: OrgItemConfig[]): OrgItemConfig[] {
    this.resetGroupObjValues();
    this.rootsValue = this.levels;
    this.leafsValue = this.levels;

    const filtered = this.itemsOriginal.filter((item) => {
      let returnVal = false;
      nodeList.forEach((node) => {
        if (node.id === item.parent) {
          returnVal = true;
        }
      });
      return returnVal;
    });

    let recursiveVal: OrgItemConfig[] = [];

    if (filtered.length) {
      recursiveVal = this.rebuildTree(filtered);
    }

    return [
      ...JSON.parse(JSON.stringify(nodeList)),
      ...JSON.parse(JSON.stringify(recursiveVal)),
    ];

    //nodeList = [...nodeList, ...filtered, ]
  }

  onDownLevelBtnClick(item: OrgItemConfig) {
    const newUniqueId = Date.now().toString();
    this.items.push(
      new OrgItemConfig({
        id: newUniqueId,
        parent: item.parent,
        isVisible: false,
        context: {
          isMockItem: true,
        },
      })
    );
    item.parent = newUniqueId;
  }

  onUpLevelBtnClick(itemClicked: OrgItemConfig) {
    let parentItem: null | OrgItemConfig = null;
    const tempItems = this.items.filter((item: OrgItemConfig) => {
      const returnVal = !(
        item.id === itemClicked.parent && item.context.isMockItem
      );
      if (!returnVal) parentItem = { ...item };
      return returnVal;
    });
    if (parentItem) {
      this.items = tempItems.map((item: OrgItemConfig) => {
        if (itemClicked.id === item.id) {
          return { ...item, parent: parentItem!.parent };
        }
        return item;
      });
    }
  }

  onEditDescriptionBtnClick(itemClicked: OrgItemConfig) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: { description: itemClicked.description },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) itemClicked.description = result;
      console.log(`Dialog result: ${result}`);
    });
  }

  // Genearate Pdf using canvas return the generated pdf
  private async generatePdf(): Promise<jspdf> {
    const htmlElement = document.getElementById('printcontent');
    const canvas = html2canvas(htmlElement, {
      onrendered: function (canvas: any) {
        document.body.appendChild(canvas);
      },
      allowTaint: true,
      useCORS: true,
      height: 10000,
    });
    var imgWidth = 190;
    var imgHeight = ((await canvas).height * imgWidth) / (await canvas).width;
    const pdf = new jspdf();

    pdf.addImage(
      (await canvas).toDataURL('image/png'),
      'PNG',
      10,
      10,
      imgWidth,
      imgHeight
    );
    return pdf;
  }

  async savePDF() {
    const screenWidth = this.orgDiagram.nativeElement.offsetWidth;
    const diagramWidth = this.getWitdh();
    this.diagramScale = screenWidth / diagramWidth;

    setTimeout(async () => {
      const pdf = await this.generatePdf();
      pdf.save('diagram.pdf');
      this.diagramScale = 1;
    }, 1000);
  }

  getWitdh(): number {
    const diagram = this.orgDiagram.nativeElement;
    const childElements = diagram.querySelectorAll('.mouse-panel');
    let width = 0;
    childElements.forEach((child: Element) => {
      // Use offsetWidth to get the width of each element
      width = (child as HTMLElement).offsetWidth;
    });
    return width;
  }

  saveTree() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.items));
    this.items && this.items.length
      ? (this.disabledLoad = false)
      : (this.disabledLoad = true);
  }

  loadTree() {
    const item = localStorage.getItem(this.localStorageKey);
    if (item) {
      this.items = JSON.parse(item);
    }
  }

  checkSavedTree(): boolean {
    let storage = localStorage.getItem(this.localStorageKey);
    if (storage) {
      storage = JSON.parse(storage);
    }
    return storage && storage.length > 0 ? true : false;
  }

  deleteTree() {
    localStorage.removeItem(this.localStorageKey);
    this.disabledLoad = true;
  }
}
