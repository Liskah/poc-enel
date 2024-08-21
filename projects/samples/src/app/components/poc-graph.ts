import { Component } from '@angular/core';
import {
  AnnotationType,
  Enabled,
  FamItemConfig,
  GroupByType,
  LabelAnnotationConfig,
  PageFitMode,
} from 'ngx-basic-primitives';

import { mockData } from '../mock-data/mock-data';
// @ts-ignore

@Component({
  selector: 'app-poc-graph',
  templateUrl: './poc-graph.html',
  styleUrls: ['../sample.css'],
})
export class PocGraph {
  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  items: FamItemConfig[] = [];
  json = mockData;
  annotations: LabelAnnotationConfig[] = [];
  showLegend: boolean = false;
  legendItems: { name: string, color: string }[] = [];

  ngOnInit(): void {
    const parents = new Set<string>([]);
    
    this.json.forEach((element: any) => {
      const azionisti: any = [];
      const valuta = element.azioniModel[0].valuta;
      const colorItem = this.generateHexColorFromString(valuta);

      let result = true;
      this.legendItems.forEach((el) => {
        if(el.name === valuta) {
          result = false;
        }
      })

      if(result) this.legendItems.push({name: valuta, color: colorItem})

      element.azionistiModel.forEach((azionista: any) => {
        const id = this.truncateId(azionista.idAzionista);
        azionisti.push(
          {
            id: id, 
            percentualeDetenuta: Math.round(azionista.percentualeDetenuta)
          }
        );

        if (parents.has(id)) {
        } else {
          const graphItem = new FamItemConfig({
            id: id,
            parents: [],
            title: valuta,
            label: 'Corp ' + id,
            description: 'Parent ' + id,
            image: `./assets/photos/${(valuta.slice(0,1)).toLowerCase()}.png`,
            itemTitleColor: colorItem
          });

          this.items = [...this.items, graphItem];
          parents.add(this.truncateId(id));
        }
      });

      const companyId = this.truncateId(element.idCompany);
      const gItem = new FamItemConfig({
        id: companyId,
        parents: azionisti.map((el: any) => el.id),
        title: valuta,
        label: 'Corp ' + companyId,
        description: 'Parent ' + companyId,
        image: `./assets/photos/${(valuta.slice(0,1)).toLowerCase()}.png`,
        itemTitleColor: colorItem
      });

      azionisti.forEach((azionista: any) => {
        const annotationGraphItem = new LabelAnnotationConfig({
          annotationType: AnnotationType.Label,
          fromItem: gItem.id as string,
          toItems: [azionista.id],
          title: azionista.percentualeDetenuta + '% ',
        });
        
        this.annotations = [...this.annotations, annotationGraphItem]
        
      })

      this.items = [...this.items, gItem];

    });
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
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
  }

}
