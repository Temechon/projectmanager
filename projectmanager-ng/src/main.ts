import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare let Neutralino: any;

if (environment.production) {
  enableProdMode();

  console.log("NEUTRALINO INIT")
  Neutralino.init();

  Neutralino.events.on("windowClose", () => {
    Neutralino.app.exit();
  });

}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
