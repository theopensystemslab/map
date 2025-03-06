import Map from "ol/Map";
import { Control, ScaleLine } from "ol/control";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import northArrowIcon from "./icons/north-arrow-n.svg";
import trashCanIcon from "./icons/trash-can.svg";
import printIcon from "./icons/printer.svg";
import PrintDialog from "ol-ext/control/PrintDialog";
import { Options } from "ol-ext/control/PrintDialog";
import CanvasScaleLine from "ol-ext/control/CanvasScaleLine";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

export function scaleControl(useScaleBarStyle: boolean) {
  return new ScaleLine({
    units: "metric",
    bar: useScaleBarStyle,
    steps: 4,
    text: useScaleBarStyle,
    minWidth: 140,
  });
}

export function northArrowControl() {
  const image = document.createElement("img");
  image.src = northArrowIcon;
  image.title = "North";

  const element = document.createElement("div");
  element.className = "north-arrow-control ol-unselectable ol-control";
  element.appendChild(image);

  return new Control({ element: element });
}

export function resetControl(listener: any, icon: string) {
  const button = document.createElement("button");
  button.title = "Reset map view";

  if (icon === "unicode") {
    button.innerHTML = "↺";
  } else {
    const image = document.createElement("img");
    image.className = "reset-icon";
    image.src = trashCanIcon;
    button.appendChild(image);
  }

  // this is an internal event listener, so doesn't need to be removed later
  // ref https://lit.dev/docs/components/lifecycle/#disconnectedcallback
  button.addEventListener("click", listener, false);

  const element = document.createElement("div");
  element.className = "reset-control ol-unselectable ol-control";
  element.appendChild(button);

  return new Control({ element: element });
}

PrintDialog.prototype.scales = {
  // @ts-ignore
  100: "1/100",
  200: "1/200",
  500: "1/500",
  1000: "1/1000",
  1250: "1/1250",
  2500: "1/2500",
  5000: "1/5000",
};

// @ts-ignore
PrintDialog.prototype.paperSize = {
  A1: [569, 816],
  A2: [395, 569],
  A3: [272, 395],
  A4: [185, 272],
};

PrintDialog.prototype._labels = {
  en: {
    ...PrintDialog.prototype._labels.en,
    // @ts-ignore
    none: "None",
    small: "Small",
    large: "Large",
    jpegFormat: "Save as JPG",
    pngFormat: "Save as PNG",
    pdfFormat: "Save as PDF",
  },
};

PrintDialog.prototype.formats = [
  {
    title: "pdfFormat",
    imageType: "pdf",
    pdf: true,
  },
  {
    title: "pngFormat",
    imageType: "png",
    quality: 1,
  },
  {
    title: "jpegFormat",
    imageType: "jpg",
    quality: 1,
  },
];

export interface PrintControlOptions extends Options {
  map: Map;
}

export class PrintControl extends PrintDialog {
  mainMap: Map;

  constructor({ map }: PrintControlOptions) {
    super({
      // @ts-expect-error: Types don't allow an SVG override, but library does
      northImage: northArrowIcon,
      saveAs: saveAs,
      // @ts-expect-error: Types don't match library
      jsPDF: jsPDF,
      copy: false,
    });
    this.mainMap = map;
    this.setSize("A4");
    this.setMargin(10);
    this.setOrientation("portrait");
    this.element.className = "ol-print ol-unselectable ol-control";

    this.setupCanvasScaleLine();
    this.setupPrintButton();
  }

  /**
   * Toggle scaleControl when printControl is open
   * Instead, display CanvasScaleLine which can be printed
   */
  private setupCanvasScaleLine() {
    const scaleLineControl = this.mainMap
      ?.getControls()
      .getArray()
      .filter(
        (control: Control) => control instanceof ScaleLine,
      )[0] as ScaleLine;
    if (!scaleLineControl) return;
    // @ts-ignore
    this.on("show", () => this.getMap().removeControl(scaleLineControl));
    // @ts-ignore
    this.on("hide", () => this.getMap().addControl(scaleLineControl));
    this.mainMap.addControl(new CanvasScaleLine({ dpi: 96 }));
  }

  /**
   * Setup custom styling and event listeners of print button displayed on map
   */
  private setupPrintButton() {
    const image = document.createElement("img");
    image.className = "print-icon";
    image.src = printIcon;
    const button = this.element.firstChild as HTMLButtonElement;
    button?.appendChild(image);

    button?.addEventListener("click", () => {
      this.customiseContent();
      this.getMap()?.on("postrender", () => this.syncScaleText());
    });
  }

  /**
   * Display scale (1:XXX) on CanvasScaleLine control
   * This can not natively be done with this element, but it has all the inherited
   * functions from OL ScaleLine to allow us to set this
   */
  private syncScaleText() {
    const scaleLineControl = this.getMap()
      ?.getControls()
      .getArray()
      .filter(
        (control) => control instanceof CanvasScaleLine,
      )[0] as CanvasScaleLine;
    const canvasScaleLine = document.querySelector(
      ".ol-scale-line-inner",
    ) as HTMLDivElement;
    const scale = Math.round(scaleLineControl.getScaleForResolution());
    if (canvasScaleLine) {
      canvasScaleLine.innerHTML = `1 : ${scale}`;
    }
  }

  /**
   * Hide browser dialog
   */
  private customiseContent() {
    const content = this.getContentElement() as HTMLElement;
    content.querySelector(".ol-ext-buttons")?.remove();
  }
}
