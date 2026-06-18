import { createDepartmentModule } from "../createDepartmentModule";
import { branchesSection } from "./properties";

export const propertiesModule = createDepartmentModule({
  id: "properties",
  code: "PROP",
  name: "Properties",
  nameDari: "جایداد ها",
  location: "ENCC HQ — جایداد ها",
  purpose: "Branch offices and property records.",
  overview: "Properties department — manages ENCC branches and property registry.",
  purposes: ["Register and maintain branches", "Branch contact and manager records"],
  sections: [branchesSection],
});
