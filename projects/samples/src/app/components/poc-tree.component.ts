import { Component } from '@angular/core';
import {
  AnnotationType,
  Colors,
  ConnectorAnnotationConfig,
  ConnectorPlacementType,
  ConnectorShapeType,
  Enabled,
  GroupByType,
  LineType,
  OrgItemConfig,
  PageFitMode,
  Size,
} from 'ngx-basic-primitives';

import { mockData } from '../mock-data/mock-data';
import { Utils } from '../utils/utils.component';
// @ts-ignore
@Component({
  selector: 'app-poc-tree',
  templateUrl: './poc-tree.component.html',
  styleUrls: ['../sample.css'],
})
export class PocTreeComponent {
  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  cursorItem = 'z1';

  annotations: ConnectorAnnotationConfig[] = [];
  items: OrgItemConfig[] = [];
  showLegend: boolean = false;
  legendItems: { name: string; color: string }[] = [];
  jsonTextArea = '';
  errorMsg = '';

  localStorageKey = 'poc-tree';
  disabledLoad = true;

  ngOnInit(): void {
    this.createDiagram(mockData);
    this.disabledLoad = !this.checkSavedTree();
  }

  calculateGraph(json: any) {
    const addedNodes = new Set<string>([]);
    this.items = [];

    json.forEach((element: any) => {
      const azionisti: any = [];
      const valuta = element.azioniModel[0].valuta;
      const colorItem = Utils.generateHexColorFromString(valuta);

      let result = true;
      this.legendItems.forEach((el) => {
        if (el.name === valuta) {
          result = false;
        }
      });

      if (result) this.legendItems.push({ name: valuta, color: colorItem });

      element.azionistiModel.forEach((azionista: any) => {
        const id = Utils.truncateId(azionista.idAzionista);
        azionisti.push({
          id: id,
          percentualeDetenuta:
            Math.floor(azionista.percentualeDetenuta * 100) / 100,
        });

        if (addedNodes.has(id)) {
        } else {
          const graphItem = new OrgItemConfig({
            id: id,
            title: valuta,
            label: 'Corp ' + id,
            description: 'Parent ' + id,
            image: `./assets/photos/${valuta.slice(0, 1).toLowerCase()}.png`,
            itemTitleColor: colorItem,
            groupTitle: element.azioniModel[0].isValoreNominale
              ? 'Quotata'
              : undefined,
            groupTitleColor: element.azioniModel[0].isValoreNominale
              ? 'lightgray'
              : undefined,
          });

          this.items = [...this.items, graphItem];
          addedNodes.add(id);
        }
      });

      const companyId = Utils.truncateId(element.idCompany);
      const gItems: OrgItemConfig[] = [];
      azionisti.forEach((azionista: any) => {
        if (addedNodes.has(companyId)) {
        } else {
          const gItem = new OrgItemConfig({
            id: companyId,
            parent: azionista.id,
            title: valuta,
            label: 'Corp ' + companyId,
            description: 'Parent ' + companyId,
            image: `./assets/photos/${valuta.slice(0, 1).toLowerCase()}.png`,
            itemTitleColor: colorItem,
          });
          gItems.push(gItem);
          addedNodes.add(companyId);
        }
      });

      this.items = [...this.items, ...gItems];
    });
  }

  createDiagram(json: any) {
    this.items = [];

    for (let i = 0; i < json.length; i++) {
      const jsonItem = json[i];
      const nodeId = Utils.truncateId(jsonItem.idCompany);

      this.items.push(
        new OrgItemConfig({
          id: nodeId,
          label: 'Corp ' + nodeId,
          description: 'Parent ' + nodeId,
          image: `./assets/photos/c.png`,
          //context: { itself: jsonItem },
        })
      );
    }

    for (let i = 0; i < json.length; i++) {
      const jsonItem = json[i];
      const nodeId = Utils.truncateId(jsonItem.idCompany);

      for (let j = 0; j < jsonItem.azionistiModel.length; j++) {
        const azionista = jsonItem.azionistiModel[j];
        const azionistaId = Utils.truncateId(azionista.idAzionista);
        const itemFound = this.items.find((item: OrgItemConfig) => {
          return item.id === azionistaId;
        });
        if (itemFound) {
          if (!itemFound.parent) {
            itemFound.parent = nodeId;
          } else {
            // già esiste il collegamento e possiamo solo usare i label (albero non grafo)
            this.annotations.push(
              new ConnectorAnnotationConfig({
                annotationType: AnnotationType.Connector,
                fromItem: nodeId,
                toItem: itemFound.id,
                label: '',
                size: new Size(40, 20),
                connectorShapeType: ConnectorShapeType.OneWay,
                color: Colors.Green,
                offset: 0,
                lineWidth: 1,
                lineType: LineType.Solid,
                connectorPlacementType: ConnectorPlacementType.Straight,
                selectItems: false,
              })
            );
          }
        } else {
          this.items.push(
            new OrgItemConfig({
              id: azionistaId,
              label: 'Corp ' + azionistaId,
              description: 'Azionista ' + azionistaId,
              image: `./assets/photos/a.png`,
              itemTitleColor: 'red',
              parent: nodeId,
              //context: { itself: jsonItem },
            })
          );
        }
      }
    }
  }

  onJsonSubmit() {
    this.errorMsg = '';
    try {
      this.calculateGraph(JSON.parse(this.jsonTextArea));
    } catch (error: any) {
      this.errorMsg = 'Formato json non valido';
      console.error(error);
    }
  }

  onJsonReset() {
    this.jsonTextArea = '';
    this.errorMsg = '';
  }

  onMoveNodeBtnClick(nodeClicked: OrgItemConfig, isLeft: boolean) {
    let startSearch = false;
    let parentOfClickedNode: OrgItemConfig | null | undefined = null;
    for (
      let i = isLeft ? this.items.length - 1 : 0;
      isLeft ? i >= 0 : i < this.items.length;
      isLeft ? i-- : i++
    ) {
      console.log(i, this.items[i].id);
      if (startSearch && this.items[i].parent === null) {
        parentOfClickedNode = this.items[i];
        if (parentOfClickedNode) {
          this.cursorItem = parentOfClickedNode.id!.toString();
        }
        console.log(parentOfClickedNode);
        break;
      }
      if (
        this.items[i].id === nodeClicked.id &&
        this.items[i].parent === null
      ) {
        console.log(nodeClicked);
        console.log(this.items[i]);
        startSearch = true;
      }
    }

    if (parentOfClickedNode) {
      this.items = this.items.map((item: OrgItemConfig) => {
        if (parentOfClickedNode && item.id === parentOfClickedNode.id) {
          return { ...nodeClicked };
        }
        if (parentOfClickedNode && item.id === nodeClicked.id) {
          setTimeout(() => {
            this.cursorItem = nodeClicked.id!.toString();
          }, 50);
          return { ...parentOfClickedNode } as OrgItemConfig;
        }
        return item as OrgItemConfig;
      });
    }
  }

  saveTree() {
    localStorage.setItem(this.localStorageKey, JSON.stringify({items: this.items, annotations: this.annotations}));
    this.items && this.items.length
      ? (this.disabledLoad = false)
      : (this.disabledLoad = true);
  }

  loadTree() {
    const storedItem = localStorage.getItem(this.localStorageKey);

    if (storedItem) {
      const {items, annotations} = JSON.parse(storedItem);
      this.items = items.map((storageItem: any) => {
        return new OrgItemConfig({...storageItem});
      });
      this.annotations = annotations.map((storageAnnotation: any) => {
        return new ConnectorAnnotationConfig({...storageAnnotation});
      });
    }
  }

  checkSavedTree(): boolean {
    let storageItem = localStorage.getItem(this.localStorageKey);
    let items;

    if (storageItem) {
      items = JSON.parse(storageItem);
    }
    return storageItem && items.items && items.items.length > 0 ? true : false;
  }

  deleteTree() {
    localStorage.removeItem(this.localStorageKey);
    this.disabledLoad = true;
  }
}
