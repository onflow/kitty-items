import KittyItemsApp from './app';
import KibblesController from './controllers/kibbles'
const app = new KittyItemsApp(
  [
    new KibblesController()
  ],
  8000,
);
 
app.listen();