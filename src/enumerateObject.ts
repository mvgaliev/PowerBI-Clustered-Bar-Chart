module powerbi.extensibility.visual {
    import ColorHelper = powerbi.extensibility.utils.color.ColorHelper;
    import IVisualSelectionId = powerbi.visuals.ISelectionId;
    import LegendDataPoint = powerbi.extensibility.utils.chart.legend.LegendDataPoint;

    export class EnumerateObject {
        private static fillDataPointInstancesForLegend(visualData: VisualData, instances: VisualObjectInstance[]) {
            for (let index in visualData.legendData.dataPoints) {
                let dataPoint: LegendDataPoint = visualData.legendData.dataPoints[index];

                instances.push({
                    objectName: "dataPoint",
                    displayName: dataPoint.label,
                    selector: ColorHelper.normalizeSelector(
                        (dataPoint.identity as IVisualSelectionId).getSelector(),
                        false),
                    properties: {
                        fill: { solid: { color: dataPoint.color } }
                    }
                });
            }
        }

        private static fillDataPointInstancesForNoLegend(visualData: VisualData, instances: VisualObjectInstance[]) {
            for (let index in visualData.dataPoints) {
                let dataPoint: VisualDataPoint = visualData.dataPoints[index];

                instances.push({
                    objectName: "dataPoint",
                    displayName: dataPoint.category.toString(),
                    selector: ColorHelper.normalizeSelector(
                        (dataPoint.identity as IVisualSelectionId).getSelector(),
                        false),
                    properties: {
                        fill: { solid: { color: dataPoint.color } }
                    }
                });
            }
        }

        public static setInstances(
            settings: VisualSettings,
            instanceEnumeration: any,
            yIsScalar: boolean,
            visualData: VisualData) {

            let instances: VisualObjectInstance[] = (instanceEnumeration as VisualObjectInstanceEnumerationObject).instances;
            let instance: VisualObjectInstance = instances[0];

            switch (instance.objectName) {
                case "dataPoint": {
                    if (visualData && visualData.legendData && visualData.legendData.dataPoints && visualData.legendData.dataPoints.length) {
                        this.fillDataPointInstancesForLegend(visualData, instances);

                        delete instance.properties["fill"];
                        delete instance.properties["showAllDataPoints"];
                    } else if (visualData && visualData.dataPoints && settings.dataPoint.showAllDataPoints) {
                        this.fillDataPointInstancesForNoLegend(visualData, instances);
                    }

                    break;
                }
                case "categoryLabels": {
                    if (!settings.categoryLabels.showBackground) {
                        delete instance.properties["transparency"];
                        delete instance.properties["backgroundColor"];
                    }

                    if (settings.categoryLabels.labelPosition === LabelPosition.OutsideEnd) {
                        delete instance.properties["overflowText"];
                    }

                    break;
                }
                case "categoryAxis": {
                    if (!settings.categoryAxis.showTitle) {
                        delete instance.properties["titleStyle"];
                        delete instance.properties["axisTitleColor"];
                        delete instance.properties["axisTitle"];
                        delete instance.properties["titleFontSize"];
                        delete instance.properties["titleFontFamily"];
                    }

                    if (yIsScalar) {
                        if (settings.categoryAxis.axisType === "categorical") {
                            delete instance.properties["axisScale"];
                            delete instance.properties["axisStyle"];
                        } else if (settings.categoryAxis.axisType === "continuous") {
                            delete instance.properties["minCategoryWidth"];
                            delete instance.properties["maximumSize"];
                            delete instance.properties["innerPadding"];
                        }
                    } else {
                        delete instance.properties["axisType"];
                        delete instance.properties["axisScale"];
                        delete instance.properties["axisStyle"];
                    }

                    break;
                }
                case "valueAxis": {
                    if (!settings.valueAxis.showTitle) {
                        delete instance.properties["titleStyle"];
                        delete instance.properties["axisTitleColor"];
                        delete instance.properties["axisTitle"];
                        delete instance.properties["titleFontSize"];
                        delete instance.properties["titleFontFamily"];
                    }
                    if (!settings.valueAxis.showGridlines) {
                        delete instance.properties["gridlinesColor"];
                        delete instance.properties["strokeWidth"];
                        delete instance.properties["lineStyle"];
                    }

                    break;
                }
            }
        }
    }
}