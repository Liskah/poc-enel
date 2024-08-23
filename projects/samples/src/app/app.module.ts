import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';

import { BasicPrimitivesModule } from 'ngx-basic-primitives';

import { AddingNewItemsToChartAtRuntimeComponent } from './adding-new-items-to-chart-at-runtime.component';
import { AdviserAndAssistantItemTypesComponent } from './adviser-and-assistant-item-types.component';
import { AdviserPartnerItemTypeComponent } from './adviser-partner-item-type.component';
import { AutoSizeComponent } from './auto-size.component';
import { ButtonsPanelComponent } from './buttons-panel.component';
import { ChildrenAndAssistantsLevelOffsetComponent } from './children-and-assistants-level-offset.component';
import { ChildrenPlacementTypeComponent } from './children-placement-type.component';
import { PocFiltersComponent } from './components/poc-filters.component';
import { PocGraphComponent } from './components/poc-graph.component';
import { PocTreeComponent } from './components/poc-tree.component';
import { ConnectorAnnotationComponent } from './connector-annotation.component';
import { CrossBranchAlignmentComponent } from './cross-branch-alignment.component';
import { CursorTemplateComponent } from './cursor-template.component';
import { CustomLayoutWithInvisibleItemsComponent } from './custom-layout-with-invisible-items.component';
import { FamilyChartItemsOrderingComponent } from './family-chart-items-ordering.component';
import { FamilyChartPrimaryParentComponent } from './family-chart-primary-parent.component';
import { FamilyHideGrandParentsConnectionsComponent } from './family-hide-grand-parents-connections.component';
import { FirstFamilyChartComponent } from './first-family-chart.component';
import { FirstOrganizationalChartComponent } from './first-organizational-chart.component';
import { GeneralPartnerItemTypeComponent } from './general-partner-item-type.component';
import { GroupTitleTemplateComponent } from './group-title-template.component';
import { GroupTitleComponent } from './group-title.component';
import { HighlightPathAnnotationComponent } from './highlight-path-annotation.component';
import { HighlightTemplateComponent } from './highlight-template.component';
import { InactiveFamilyItemsComponent } from './inactive-family-items.component';
import { InactiveItemsComponent } from './inactive-items.component';
import { ItemTemplateLabelComponent } from './item-template-label.component';
import { ItemTemplateComponent } from './item-template.component';
import { LabelsAndMatrixInFamilyChartComponent } from './labels-and-matrix-in-family-chart.component';
import { LabelsCascadesInFamilyChartComponent } from './labels-cascades-in-family-chart.component';
import { LabelsComponent } from './labels.component';
import { LevelAnnotationTemplateComponent } from './level-annotation-template.component';
import { LevelAnnotationComponent } from './level-annotation.component';
import { LimitedPartnerItemTypeComponent } from './limited-partner-item-type.component';
import { LoopsInFamilyChartComponent } from './loops-in-family-chart.component';
import { MatrixGroupsInFamilyChartComponent } from './matrix-groups-in-family-chart.component';
import { MatrixLayoutInFamilyChartComponent } from './matrix-layout-in-family-chart.component';
import { MatrixLayoutOfMultipleRootItemsInChartComponent } from './matrix-layout-of-multiple-root-items-in-chart.component';
import { MultipleFamiliesOrderingComponent } from './multiple-families-ordering.component';
import { MultipleRootItemsInChartComponent } from './multiple-root-items-in-chart.component';
import { PageSizeOrganizationalChartComponent } from './page-size-organizational-chart.component';
import { PertChartComponent } from './pert-chart.component';
import { PlaceAdvisersAboveChildrenComponent } from './place-advisers-above-children.component';
import { PlaceAssistantsAboveChildrenComponent } from './place-assistants-above-children.component';
import { SelectingCursorItemComponent } from './selecting-cursor-item.component';
import { SelectingHighlightItemComponent } from './selecting-highlight-item.component';
import { SelectingItemsComponent } from './selecting-items.component';
import { SelectionCheckboxInItemTemplateComponent } from './selection-checkbox-in-item-template.component';
import { SelectionPathModeInFamilyChartComponent } from './selection-path-mode-in-family-chart.component';
import { SelectionPathModeComponent } from './selection-path-mode.component';
import { ShapeAnnotationComponent } from './shape-annotation.component';
import { ShowFrameComponent } from './show-frame.component';
import { SkippedLevelsComponent } from './skipped-levels.component';
import { SubAdviserAndSubAssistantItemTypesComponent } from './sub-adviser-and-sub-assistant-item-types.component';
import { ZoomWithCssScaleTransformComponent } from './zoom-with-css-scale-transform.component';
import { ZoomWithItemTemplateComponent } from './zoom-with-item-template.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstOrganizationalChartComponent,
    FirstFamilyChartComponent,
    AddingNewItemsToChartAtRuntimeComponent,
    PageSizeOrganizationalChartComponent,
    AutoSizeComponent,
    SelectingCursorItemComponent,
    SelectingHighlightItemComponent,
    SelectingItemsComponent,
    ShowFrameComponent,
    ButtonsPanelComponent,
    GroupTitleComponent,
    GroupTitleTemplateComponent,
    LabelsComponent,
    ChildrenPlacementTypeComponent,
    CrossBranchAlignmentComponent,
    ChildrenAndAssistantsLevelOffsetComponent,
    AdviserAndAssistantItemTypesComponent,
    SubAdviserAndSubAssistantItemTypesComponent,
    GeneralPartnerItemTypeComponent,
    LimitedPartnerItemTypeComponent,
    AdviserPartnerItemTypeComponent,
    MultipleRootItemsInChartComponent,
    MatrixLayoutOfMultipleRootItemsInChartComponent,
    SelectionPathModeComponent,
    InactiveItemsComponent,
    CustomLayoutWithInvisibleItemsComponent,
    PlaceAssistantsAboveChildrenComponent,
    PlaceAdvisersAboveChildrenComponent,
    SkippedLevelsComponent,
    InactiveFamilyItemsComponent,
    MatrixLayoutInFamilyChartComponent,
    MatrixGroupsInFamilyChartComponent,
    LabelsCascadesInFamilyChartComponent,
    LabelsAndMatrixInFamilyChartComponent,
    FamilyChartItemsOrderingComponent,
    MultipleFamiliesOrderingComponent,
    FamilyChartPrimaryParentComponent,
    LoopsInFamilyChartComponent,
    SelectionPathModeInFamilyChartComponent,
    ItemTemplateComponent,
    ZoomWithItemTemplateComponent,
    ZoomWithCssScaleTransformComponent,
    ItemTemplateLabelComponent,
    SelectionCheckboxInItemTemplateComponent,
    CursorTemplateComponent,
    HighlightTemplateComponent,
    ConnectorAnnotationComponent,
    ShapeAnnotationComponent,
    LevelAnnotationComponent,
    LevelAnnotationTemplateComponent,
    HighlightPathAnnotationComponent,
    PertChartComponent,
    FamilyHideGrandParentsConnectionsComponent,
    PocGraphComponent,
    PocTreeComponent,
    PocFiltersComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BasicPrimitivesModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatTreeModule,
    MatCardModule,
    MatProgressBarModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
