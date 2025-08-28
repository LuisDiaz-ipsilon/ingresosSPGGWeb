# Web de ingresos para organizacion municipal

Incluye:
- Pantalla de pago de multas.
- Pantalla de pago de predial.
- Dasboard de ingresos.

<img width="1430" height="803" alt="image" src="https://github.com/user-attachments/assets/ce370ce5-71b9-4327-9647-0d04a4bf39a3" />

<img width="1430" height="803" alt="image" src="https://github.com/user-attachments/assets/deedb487-058b-489e-a168-ca4ddea399dd" />

<img width="1430" height="803" alt="image" src="https://github.com/user-attachments/assets/0634adc8-f5a5-49f8-a94f-c4fa004a987b" />

[Backend](https://github.com/LuisDiaz-ipsilon/IngresosSPGGApi/settings)

Consumibles en desarrollo:

Placas: 
GY306
HY307
IY308
JY309
KY310
LY311
MY312
NY313
OY314
PY315
QY316
RY317
SY318
TY319
UY320
VY321
WY322
XY323
YY324
ZY325
AZ326
BZ327
CZ328
DZ329
EZ330
FZ331
GZ332
HZ333
IZ334
JZ335
KZ336
LZ337
MZ338
NZ339
OZ340

Prediales:
1408	Thomas A. Anderson 1408
1409	Thomas A. Anderson 1409
1410	Thomas A. Anderson 1410
1411	Thomas A. Anderson 1411
1412	Thomas A. Anderson 1412
1413	Thomas A. Anderson 1413
1414	Thomas A. Anderson 1414
1415	Thomas A. Anderson 1415
1416	Thomas A. Anderson 1416
1417	Thomas A. Anderson 1417
1418	Thomas A. Anderson 1418
1419	Thomas A. Anderson 1419
1420	Thomas A. Anderson 1420
1421	Thomas A. Anderson 1421
1422	Thomas A. Anderson 1422
1423	Thomas A. Anderson 1423
1424	Thomas A. Anderson 1424
1425	Thomas A. Anderson 1425
1426	Thomas A. Anderson 1426
1427	Thomas A. Anderson 1427
1428	Thomas A. Anderson 1428
1429	Thomas A. Anderson 1429
1430	Thomas A. Anderson 1430
1431	Thomas A. Anderson 1431
1432	Thomas A. Anderson 1432
1433	Thomas A. Anderson 1433
1434	Thomas A. Anderson 1434
1435	Thomas A. Anderson 1435
1436	Thomas A. Anderson 1436
1437	Thomas A. Anderson 1437
1438	Thomas A. Anderson 1438
1439	Thomas A. Anderson 1439

Si estan quemadas las referencias, levanta un issue en este repositorio, respondo enseguida.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
