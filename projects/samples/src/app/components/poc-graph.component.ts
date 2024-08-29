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
import { Utils } from '../utils/utils.component';
// @ts-ignore

@Component({
  selector: 'app-poc-graph',
  templateUrl: './poc-graph.component.html',
  styleUrls: ['../sample.css'],
})
export class PocGraphComponent {
  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  items: FamItemConfig[] = [];
  annotations: LabelAnnotationConfig[] = [];
  showLegend: boolean = false;
  legendItems: { name: string; color: string }[] = [];
  jsonTextArea = '';
  errorMsg = '';

  localStorageKey = 'poc-graph';
  disabledLoad = true;

  ngOnInit(): void {
    this.calculateGraph(mockData);
    this.disabledLoad = !this.checkSavedTree();
  }

  calculateGraph(json: any) {
    const parents = new Set<string>([]);
    this.items = [];
    this.annotations = [];

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

        if (parents.has(id)) {
        } else {
          const graphItem = new FamItemConfig({
            id: id,
            parents: [],
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
      const gItem = new FamItemConfig({
        id: companyId,
        parents: azionisti.map((el: any) => el.id),
        title: valuta,
        label: 'Corp ' + companyId,
        description: 'Parent ' + companyId,
        image: `./assets/photos/${valuta.slice(0, 1).toLowerCase()}.png`,
        itemTitleColor: colorItem,
      });

      azionisti.forEach((azionista: any) => {
        const annotationGraphItem = new LabelAnnotationConfig({
          annotationType: AnnotationType.Label,
          fromItem: gItem.id as string,
          toItems: [azionista.id],
          title: azionista.percentualeDetenuta + '% ',
        });

        this.annotations = [...this.annotations, annotationGraphItem];
      });

      this.items = [...this.items, gItem];
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
        return new FamItemConfig({...storageItem});
      });
      this.annotations = annotations.map((storageAnnotation: any) => {
        return new LabelAnnotationConfig({...storageAnnotation});
      });
    }
  }

  deleteTree() {
    localStorage.removeItem(this.localStorageKey);
    this.disabledLoad = true;
  }

  checkSavedTree(): boolean {
    let storageItem = localStorage.getItem(this.localStorageKey);
    let items;

    if (storageItem) {
      items = JSON.parse(storageItem);
    }
    return storageItem && items.items && items.items.length > 0 ? true : false;
  }
}
