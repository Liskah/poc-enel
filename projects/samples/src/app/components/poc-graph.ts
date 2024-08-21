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

  ngOnInit(): void {
    const parents: Set<string> = new Set([]);
    this.json.forEach((element: any) => {
      const azionisti: any = [];

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
            title: '-' + id,
            label: 'Corp ' + id,
            description: 'Parent ' + id,
            image: './assets/photos/p.png',
          });

          //console.log('annotationGraphItem: ', annotationGraphItem);

          this.items = [...this.items, graphItem];
          parents.add(this.truncateId(id));
        }
      });

      const companyId = this.truncateId(element.idCompany);
      const gItem = new FamItemConfig({
        id: companyId,
        parents: azionisti.map((el: any) => el.id),
        title: '-' + companyId,
        label: 'Corp ' + companyId,
        description: 'Parent ' + companyId,
        image: './assets/photos/p.png',
      });

      azionisti.forEach((azionista: any) => {
        const annotationGraphItem = new LabelAnnotationConfig({
          annotationType: AnnotationType.Label,
          fromItem: gItem.id as string,
          toItems: [azionista.id],
          title: azionista.percentualeDetenuta + '% ',
        });
        console.log("annotationGraphItem", annotationGraphItem)
        
        this.annotations = [...this.annotations, annotationGraphItem]
        
      })

      //console.log(gItem);
      this.items = [...this.items, gItem];
      
      /*
      parents.forEach((par) => {
        const newItem = new FamItemConfig({
          id: par.toString(),
          parents: [],
          title: '-' + par,
          label: 'Corp ' + par,
          description: 'Parent ' + par,
          image: './assets/photos/p.png',
        });
        this.items = [...this.items, newItem];
      });
      */
      //console.log(azionisti);
      //console.log(element.idCompany);
    });
  }

  truncateId(id: number | string | null): string {
    if (id && id !== 0) {
      return id.toString().slice(-8);
    }
    return '';
  }

}
