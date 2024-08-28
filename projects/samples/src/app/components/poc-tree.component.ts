import { Component } from '@angular/core';
import {
  Enabled,
  GroupByType,
  OrgItemConfig,
  PageFitMode,
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

  items: OrgItemConfig[] = [];
  showLegend: boolean = false;
  legendItems: { name: string; color: string }[] = [];
  jsonTextArea = '';
  errorMsg = '';

  ngOnInit(): void {
    this.calculateGraph(mockData);
    console.log(this.items);
  }

  calculateGraph(json: any) {
    const parents = new Set<string>([]);
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
          percentualeDetenuta: Math.round(azionista.percentualeDetenuta),
        });

        if (parents.has(id)) {
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
          parents.add(Utils.truncateId(id));
        }
      });

      const companyId = Utils.truncateId(element.idCompany);
      const gItems: OrgItemConfig[] = [];
      azionisti.forEach((azionista: any) => {
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
      });

      this.items = [...this.items, ...gItems];
    });
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

  onRightBtnClick(nodeClicked: OrgItemConfig) {
    let startSearch = false;
    let parentOfClickedNode: OrgItemConfig | null | undefined = null;
    for (let i = 0; i < this.items.length; i++) {
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
          }, 2000);
          return { ...parentOfClickedNode } as OrgItemConfig;
        }
        return item as OrgItemConfig;
      });
    }
  }

  onLeftBtnClick(nodeClicked: OrgItemConfig) {
    let startSearch = false;
    let parentOfClickedNode: OrgItemConfig | null | undefined = null;
    for (let i = this.items.length - 1; i >= 0; i--) {
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
            this.cursorItem = '';
            this.cursorItem = nodeClicked.id!.toString();
          }, 2000);
          return { ...parentOfClickedNode } as OrgItemConfig;
        }
        return item as OrgItemConfig;
      });
    }
  }
}
