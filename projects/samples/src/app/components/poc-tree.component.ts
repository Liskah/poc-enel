import { Component } from '@angular/core';
import {
  AnnotationType,
  Enabled,
  GroupByType,
  LabelAnnotationConfig,
  OrgItemConfig,
  PageFitMode,
} from 'ngx-basic-primitives';

import { mockData } from '../mock-data/mock-data';
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

  items: OrgItemConfig[] = [];
  //annotations: LabelAnnotationConfig[] = [];
  showLegend: boolean = false;
  legendItems: { name: string; color: string }[] = [];
  jsonTextArea = '';
  errorMsg = '';

  ngOnInit(): void {
    this.calculateGraph(mockData);
  }

  calculateGraph(json: any) {
    const parents = new Set<string>([]);
    this.items = [];
    //this.annotations = [];

    json.forEach((element: any) => {
      const azionisti: any = [];
      const valuta = element.azioniModel[0].valuta;
      const colorItem = this.generateHexColorFromString(valuta);

      let result = true;
      this.legendItems.forEach((el) => {
        if (el.name === valuta) {
          result = false;
        }
      });

      if (result) this.legendItems.push({ name: valuta, color: colorItem });

      element.azionistiModel.forEach((azionista: any) => {
        const id = this.truncateId(azionista.idAzionista);
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
          parents.add(this.truncateId(id));
          console.log(graphItem);
        }
      });

      const companyId = this.truncateId(element.idCompany);
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
        console.log(gItem);
        gItems.push(gItem);

        const annotationGraphItem = new LabelAnnotationConfig({
          annotationType: AnnotationType.Label,
          fromItem: gItem.id as string,
          toItems: [azionista.id],
          title: azionista.percentualeDetenuta + '% ',
        });

        //this.annotations = [...this.annotations, annotationGraphItem];
        console.log(annotationGraphItem);
      });

      this.items = [...this.items, ...gItems];
    });

    setTimeout(() => {
      /*this.items = this.items.filter((item: OrgItemConfig) => {
        console.log(item);
        return item.levelOffset && item.levelOffset < 3;
      });*/
      console.log(this.items);
    }, 5000);
  }

  truncateId(id: number | string | null): string {
    if (id && id !== 0) {
      return id.toString().slice(-8);
    }
    return '';
  }

  generateHexColorFromString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash to a hex color
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
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
}
