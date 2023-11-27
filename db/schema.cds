using {Currency, managed, sap} from '@sap/cds/common';
using { sap.sovanta.manager.types } from './types'; 
namespace sap.sovanta.manager;

entity Employees {
    key ID: Integer;
    name: String;
    surname: String;
    experience: types.profession.level;
    salary: Decimal;
    projects: Composition of many Members on projects.employee = $self;
}

entity Projects {
    key ID: Integer;
    title: String;
    description: String;
    beginning: Date;
    members: Composition of many Members on members.project = $self;
    leader: Association to one Employees;
}

entity Members {
    key employee: Association to Employees;
    key project: Association to Projects;
}
