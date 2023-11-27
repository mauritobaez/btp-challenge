using sap.sovanta.manager as my_namespace from '../db/schema';

service ProjectManagerService {
    entity Project as projection on my_namespace.Projects;
    /* "CRUD operations should only be defined for one of the entities"
    entity Employees as projection on my_namespace.Employees;
    entity Members as projection on my_namespace.Members;
    */
}
