import { createDepartmentModule } from "../createDepartmentModule";
import { propertyRegisterSection } from "./property-register";

export const propertiesModule = createDepartmentModule({
  id: "properties",
  code: "PROP",
  name: "Properties",
  nameDari: "جایداد ها",
  location: "ENCC HQ — جایداد ها",
  purpose: "Property asset registry and documentation.",
  overview:
    "Properties department — registers and maintains ENCC buildings, land, warehouses, and related assets with location, legal documents, and optional photos.",
  purposes: [
    "Register ENCC-owned properties — one task only",
    "usage_status shows in use, vacant, or rented out (lease in Procurement)",
    "Dynamic property types from General Tables; documents and optional images",
  ],
  sections: [propertyRegisterSection],
});
