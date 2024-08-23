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

@Component({
  selector: 'app-level-annotation',
  templateUrl: './level-annotation.component.html',
  styleUrls: ['./sample.css'],
})
export class LevelAnnotationComponent {
  PageFitMode = PageFitMode;
  Enabled = Enabled;
  GroupByType = GroupByType;

  items = [
    new OrgItemConfig({
      id: 0,
      parent: null,
      title: 'James Smith',
      description: 'VP, Public Sector',
      image: './assets/photos/a.png',
    }),
    new OrgItemConfig({
      id: 1,
      parent: 0,
      title: 'Ted Lucas',
      description: 'VP, Human Resources',
      image: './assets/photos/b.png',
    }),
    new OrgItemConfig({
      id: 2,
      parent: 0,
      title: 'Fritz Stuger',
      description: 'Business Solutions, US',
      image: './assets/photos/c.png',
    }),
    new OrgItemConfig({
      id: 3,
      parent: 2,
      title: 'Robert Canon',
      description: 'Operation, US',
      image: './assets/photos/r.png',
    }),
  ];

  annotations = [
    new LevelAnnotationConfig({
      annotationType: AnnotationType.Level,
      levels: [0],
      title: 'Level 0',
      titleColor: Colors.RoyalBlue,
      offset: new Thickness(0, 0, 0, -1),
      lineWidth: new Thickness(0, 0, 0, 0),
      opacity: 0,
      borderColor: Colors.Gray,
      fillColor: Colors.Gray,
      lineType: LineType.Dotted,
    }),
    new LevelAnnotationConfig({
      levels: [1],
      title: 'Level 1',
      titleColor: Colors.Green,
      offset: new Thickness(0, 0, 0, -1),
      lineWidth: new Thickness(0, 0, 0, 0),
      opacity: 0.08,
      borderColor: Colors.Gray,
      fillColor: Colors.Gray,
      lineType: LineType.Dotted,
    }),
    new LevelAnnotationConfig({
      levels: [2],
      title: 'Level 2',
      titleColor: Colors.Red,
      offset: new Thickness(0, 0, 0, -1),
      lineWidth: new Thickness(0, 0, 0, 0),
      opacity: 0,
      borderColor: Colors.Gray,
      fillColor: Colors.Gray,
      lineType: LineType.Solid,
    }),
  ];
}
