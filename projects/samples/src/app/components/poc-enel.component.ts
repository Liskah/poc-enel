import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AnnotationType,
  Colors,
  Enabled,
  FamItemConfig,
  GroupByType,
  HighlightPathAnnotationConfig,
  LabelAnnotationConfig,
  PageFitMode,
} from 'ngx-basic-primitives';
import { mycolors } from '../mock-data/colors';
import { diagramAnnotations, diagramItems } from '../mock-data/mock-diagram';
import { mockNames } from '../mock-data/mock-names';
import { Utils } from '../utils/utils.component';
import { DialogComponent } from './dialog.component';
// @ts-ignore

export type Company = { value: string; companyId: string };

@Component({
  selector: 'app-poc-enel',
  templateUrl: './poc-enel.component.html',
  styleUrls: ['../sample.css'],
})
export class PocEnelComponent {
  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  items: FamItemConfig[] = [];
  annotations: (LabelAnnotationConfig | HighlightPathAnnotationConfig)[] = [];
  showLegend: boolean = false;
  legendItems: { name: string; color: string }[] = [
    {
      name: 'ARS',
      color: '#42fe00',
    },
    {
      name: 'AUD',
      color: '#90fe00',
    },
    {
      name: 'BRL',
      color: '#fc0101',
    },
    {
      name: 'CAD',
      color: '#a60301',
    },
    {
      name: 'CLP',
      color: '#070501',
    },
    {
      name: 'COP',
      color: '#640501',
    },
    {
      name: 'CRC',
      color: '#b40501',
    },
    {
      name: 'EUR',
      color: '#a20d01',
    },
    {
      name: 'GTQ',
      color: '#041501',
    },
    {
      name: 'HNL',
      color: '#061801',
    },
    {
      name: 'INR',
      color: '#cd1b01',
    },
    {
      name: 'KRW',
      color: '#d02301',
    },
    {
      name: 'MXN',
      color: '#032c01',
    },
    {
      name: 'PEN',
      color: '#f93401',
    },
    {
      name: 'RON',
      color: '#b13d01',
    },
    {
      name: 'RUB',
      color: '#5f3e01',
    },
    {
      name: 'SAR',
      color: '#c43f01',
    },
    {
      name: 'TRY',
      color: '#9b4501',
    },
    {
      name: 'USD',
      color: '#664901',
    },
    {
      name: 'UYU',
      color: '#314a01',
    },
    {
      name: 'ZAR',
      color: '#0b5a01',
    },
    {
      name: 'ZMW',
      color: '#845b01',
    },
  ];
  jsonTextArea = '';
  errorMsg = '';

  localStorageKey = 'poc-graph';
  disabledLoad = true;

  companyNames: Company[] = [];

  hiddenNodes: { [key: string]: FamItemConfig[] } = {};

  colors = mycolors;

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.companyNames = mockNames;
    //this.calculateGraph(mockData);
    this.items = diagramItems;
    this.annotations = diagramAnnotations;
    this.disabledLoad = !this.checkSavedTree();
  }

  calculateGraph(json: any) {
    /*
    const tempSet = new Set<string>([]);
    json.forEach((node: any) => {
      tempSet.add(node.idCompany);
      node.azionistiModel.forEach((azionista: any) => {
        tempSet.add(azionista.idAzionista);
      });
    });
    console.log(JSON.stringify([...tempSet]));
    */

    const parents = new Set<string>([]);
    this.items = [];
    this.annotations = [];

    json.forEach((element: any) => {
      const azionisti: any = [];
      const valuta = element.azioniModel[0].valuta;
      const quotata = element.azioniModel[0].isValoreNominale;
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
          const companyName = this.companyNames.find((company: Company) => {
            return company.companyId === azionista.idAzionista;
          });
          const randomNum = Math.floor(Math.random() * mycolors.length);
          const graphItem = new FamItemConfig({
            id: id,
            parents: [],
            title: companyName ? companyName.value : 'Not Found',
            //label: 'Id: ' + id,
            description: 'Id: ' + id,
            templateName: 'contactTemplate',
            image: null, //`./assets/photos/${valuta.slice(0, 1).toLowerCase()}.png`,
            itemTitleColor: colorItem,
            groupTitle: quotata ? 'Quotata' : '', //valuta,
            groupTitleColor: colorItem,
            context: {
              colors: mycolors[randomNum],
              isQuotata: element.azioniModel[0].isValoreNominale,
            },
          });

          this.items = [...this.items, graphItem];
          parents.add(Utils.truncateId(id));
        }
      });

      const companyChildName = this.companyNames.find((company: Company) => {
        return company.companyId === element.idCompany;
      });

      const randomChildNum = Math.floor(Math.random() * mycolors.length);
      const companyId = Utils.truncateId(element.idCompany);
      const companyLabel = element.commento;
      const gItem = new FamItemConfig({
        id: companyId,
        parents: azionisti.map((el: any) => el.id),
        title: companyChildName ? companyChildName.value : 'Not Found',
        label: companyLabel,
        description: 'Id: ' + companyId,
        templateName: 'contactTemplate',
        image: null, //`./assets/photos/${valuta.slice(0, 1).toLowerCase()}.png`,
        itemTitleColor: colorItem,
        groupTitle: quotata ? 'Quotata' : '', //valuta,
        groupTitleColor: colorItem,
        context: {
          colors: mycolors[randomChildNum],
          isQuotata: element.azioniModel[0].isValoreNominale,
        },
      });

      azionisti.forEach((azionista: any) => {
        const annotationGraphItem = new LabelAnnotationConfig({
          annotationType: AnnotationType.Label,
          fromItem: gItem.id as string,
          toItems: [azionista.id],
          //itemTitleColor: 'red',
          //itemTitleColor: '#FFCC00', //azionista.percentualeDetenuta > 50 ? 'red' : 'black',
          title: azionista.percentualeDetenuta + '%',
        });

        if (azionista.percentualeDetenuta > 30) {
          const connectorGrapItem = new HighlightPathAnnotationConfig({
            annotationType: AnnotationType.HighlightPath,
            items: [azionista.id, gItem.id as string],
            color: Colors.Red,
            lineWidth: 1,
            opacity: 1,
            showArrows: false,
          });

          this.annotations = [...this.annotations, connectorGrapItem];
        }

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
    const allowedItems: string[] = [
      '00000049',
      '00015381',
      '00000068',
      '00000375',
      '00000383',
      '00000118',
      '00000147',
      '00000276',
      '00000195',
      '00000242',
      '00000014',
      '00000016',
      '00000408',
      '00000410',
    ];
    const temp = this.items.filter((item) => {
      return item.id && allowedItems.includes(item.id.toString());
    });
    console.log(temp);

    console.log(this.annotations);

    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify({ items: this.items, annotations: this.annotations })
    );
    this.items && this.items.length
      ? (this.disabledLoad = false)
      : (this.disabledLoad = true);
  }

  loadTree() {
    const storedItem = localStorage.getItem(this.localStorageKey);

    if (storedItem) {
      const { items, annotations } = JSON.parse(storedItem);
      this.items = items.map((storageItem: any) => {
        return new FamItemConfig({ ...storageItem });
      });
      this.annotations = annotations.map((storageAnnotation: any) => {
        return new LabelAnnotationConfig({ ...storageAnnotation });
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

  changeComment(itemClicked: FamItemConfig) {
    console.log(itemClicked);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        description: itemClicked.label ? itemClicked.label : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) itemClicked.label = result;
      console.log(`Dialog result: ${result}`);
    });
  }

  hideShowChildren(itemConfig: FamItemConfig) {
    if (itemConfig.id) {
      if (this.hiddenNodes[itemConfig.id.toString()]) {
        //show
      } else {
        //hide
        this.items = this.items.filter((item) => {
          if (item.parents.includes(itemConfig.id!)) {
            /*this.hiddenNodes[itemConfig.id!.toString()] = [
              item,
              ...this.hiddenNodes[itemConfig.id!.toString()],
            ];*/
            console.log('filtro via: ', item.title);
            return false;
          } else {
            return true;
          }
        });
      }
    }
  }

  /*
  moveLeft(itemConfig: FamItemConfig) {
    let found = false;
    for (let i = 0; i < this.items.length; i++) {
      if (found) {
        if (this.items[i].parents.length === 0) {
          console.log(this.items[i]);
        }
      }
      if (this.items[i].id === itemConfig.id) {
        found = true;
      }
    }
  }
  */

  moveNode(itemConfig: FamItemConfig) {
    console.log(itemConfig.position);
    if (itemConfig.position !== null && itemConfig.position < 5) {
      itemConfig.position++;
    } else {
      itemConfig.position = 0;
    }

    /*
    console.log(itemConfig.placementType);
    if (itemConfig.placementType === AdviserPlacementType.Left) {
      itemConfig.placementType = AdviserPlacementType.Right;
    } else {
      itemConfig.placementType = AdviserPlacementType.Left;
    }
    */
  }

  downLevel(itemConfig: FamItemConfig) {
    console.log(this.items);
    const random = Math.floor(Math.random() * 100);
    const id = random.toString();
    console.log('ITEMCONFIG: ', itemConfig);
    console.log('ITEMCONFIG: ', itemConfig.parents);
    console.log(id);

    const newItem = {
      title: '',
      id: id,
      parents: itemConfig.parents ? itemConfig.parents : [],
      templateName: 'invisibleTemplate',
      hasButtons: 2,
    };
    itemConfig.parents = [id];
    this.items = [newItem as unknown as FamItemConfig, ...this.items];
    console.log('ITEMCONFIG2: ', itemConfig);
    console.log('ITEMS: ', this.items);

    //this.items.push(newItem);
  }
}
