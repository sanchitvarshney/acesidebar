// commonAgGridConfig.ts

import { GridOptions } from "@ag-grid-community/core";
export const commonAgGridConfig:GridOptions = {
  rowHeight: 50, // Set a fixed row height globally
  // other common configurations...
  headerHeight:50,
  defaultColDef: {
    cellClass: 'centered-cell flex justify-center items-center'
  }
  // other global configurations...
};


export const OverlayNoRowsTemplate = `
    <div>
      <div class="flex items-center justify-center w-full h-full no-rows-template">
        <img src="/loading-image.png" class="w-[110px]" alt="No Data" />
      </div>
    </div>
    `
