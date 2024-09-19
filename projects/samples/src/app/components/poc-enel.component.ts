import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AdviserPlacementType,
  AnnotationType,
  Colors,
  Enabled,
  FamItemConfig,
  GroupByType,
  HighlightPathAnnotationConfig,
  LabelAnnotationConfig,
  OrientationType,
  PageFitMode,
} from 'ngx-basic-primitives';
import { mycolors } from '../mock-data/colors';
import { countryColors } from '../mock-data/legend';
import { companiesCountry } from '../mock-data/mock-countries';
import { diagramAnnotations, diagramItems } from '../mock-data/mock-diagram';
import { companiesGbl } from '../mock-data/mock-gbl';
import { mockNames } from '../mock-data/mock-names';
import { companiesPrevalentBusiness } from '../mock-data/mock-prevalent-business';
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
  orientationType = OrientationType.Top;

  items: FamItemConfig[] = [];
  annotations: (LabelAnnotationConfig | HighlightPathAnnotationConfig)[] = [];
  showLegend: boolean = false;
  legendItems: { name: string; color: string }[] = countryColors.map(
    (country) => {
      return { name: country.name, color: country.background };
    }
  );
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
    this.items = diagramItems.map((item) => {
      return {
        ...item,
        context: {
          ...item.context,
          country: companiesCountry.find((country) => {
            return Utils.truncateId(country.companyId) === item.id;
          })?.value,
          gbl: companiesGbl
            .find((gbl) => {
              return Utils.truncateId(gbl.companyId) === item.id;
            })
            ?.value.toString(),
          prevBusiness: companiesPrevalentBusiness
            .find((prevBusiness) => {
              return Utils.truncateId(prevBusiness.companyId) === item.id;
            })
            ?.value.toString(),
        },
      };
    });

    this.items = this.items.map((item) => {
      const color = countryColors.find(
        (country) => country.name === item.context.country
      );
      console.log(color?.color);
      return {
        ...item,
        context: {
          ...item.context,
          colors: color
            ? { background: color.background, color: color.color }
            : { background: '#b3b3b3', color: 'black' },
        },
      };
    });
    const countries = new Set<string>([]);
    companiesCountry.forEach((company) => countries.add(company.value));
    console.log(countries);
    this.items.forEach((item) => console.log(item.context));
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

  changeGbl(itemClicked: FamItemConfig) {
    console.log(itemClicked);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        description: itemClicked.context.gbl ? itemClicked.context.gbl : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) itemClicked.context.gbl = result;
      console.log(`Dialog result: ${result}`);
    });
  }

  changePrevalentBusiness(itemClicked: FamItemConfig) {
    console.log(itemClicked);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        description: itemClicked.context.prevBusiness
          ? itemClicked.context.prevBusiness
          : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) itemClicked.context.prevBusiness = result;
      console.log(`Dialog result: ${result}`);
    });
  }

  changeColor(itemClicked: FamItemConfig) {
    console.log(itemClicked);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '600px',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        description: itemClicked.context.colors.background
          ? itemClicked.context.colors.background
          : '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) itemClicked.context.colors.background = result;
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

  moveNode(itemConfig: FamItemConfig, isLeft: boolean) {
    /*
    console.log(itemConfig.position);
    if (itemConfig.position !== null && itemConfig.position < 5) {
      itemConfig.position++;
    } else {
      itemConfig.position = 0;
    }
    */

    const child = this.items.find((item) => {
      return item.parents.includes(itemConfig.id!);
    });

    if (child) {
      console.log(itemConfig.relativeItem);
      console.log(child.parents);

      let index;
      if (
        itemConfig.relativeItem !== null &&
        itemConfig.relativeItem !== child.parents[child.parents.length - 1]
      ) {
        index = child?.parents.indexOf(itemConfig.relativeItem);
        if (index >= 0) {
          itemConfig.relativeItem = child.parents[index + 1];
        }
      } else {
        itemConfig.relativeItem = child ? child.parents[0] : null;
      }
    }

    /*
    console.log(itemConfig.placementType);
    if (isLeft) {
      itemConfig.placementType = AdviserPlacementType.Left;
    } else {
      itemConfig.placementType = AdviserPlacementType.Right;
    }
    */
  }

  changePlacement(itemConfig: FamItemConfig) {
    console.log(itemConfig.placementType);
    if (itemConfig.placementType === AdviserPlacementType.Left) {
      itemConfig.placementType = AdviserPlacementType.Right;
    } else {
      itemConfig.placementType = AdviserPlacementType.Left;
    }
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
    itemConfig.primaryParent = itemConfig.parents
      ? itemConfig.parents[0].toString()
      : null;

    this.items = [newItem as unknown as FamItemConfig, ...this.items];
    console.log('ITEMCONFIG2: ', itemConfig);
    console.log('ITEMS: ', this.items);

    //this.items.push(newItem);
  }

  makePrimary(itemConfig: FamItemConfig) {
    itemConfig.relativeItem = '00000408';
    itemConfig.placementType = AdviserPlacementType.Right;
    itemConfig.position = 1;
    /*
    console.log(itemConfig.primaryParent);
    itemConfig.primaryParent = itemConfig.parents[0];
    */
  }

  reverseItems() {
    const reversedItems: FamItemConfig[] = [];
    this.items.forEach((item) => {
      const newparents: string[] = [];
      this.items.forEach((subItem) => {
        if (subItem.parents.includes(item.id!.toString())) {
          newparents.push(subItem.id!.toString());
        }
      });
      reversedItems.push({ ...item, parents: newparents });
    });
    this.items = [...reversedItems];
    if (this.orientationType === OrientationType.Top) {
      this.orientationType = OrientationType.Bottom;
    } else {
      this.orientationType = OrientationType.Top;
    }
  }
}
