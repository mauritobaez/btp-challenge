using { sap.sovanta.manager.Employees, sap.sovanta.manager.Projects} from './schema';


annotate Projects with @restrict: [
    { grant: 'READ', to: 'any'},
    { grant: 'CREATE', to: 'admin'},
    { grant: 'UPDATE', to: 'admin'},
    { grant: 'DELETE', to: 'any'}
];

