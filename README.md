
# Welcome to my Sovanta Challenge!

As the project is already created, running cds init is not necessary,
you must however follow a few simple instructions.

I recommend using Visual Studio Code in order to follow this README guide.

Firstly:
Run `npm i` in order to make sure you have all the dependencies needed. Don't forget about running `npm i -g @sap/cds-dk` in case you have never used 'cds' in your machine.

Afterwards: 
Run `cds deploy --to sqlite:db/project-manager.db`
This command will allow you to persist the data in a sqlite DataBase. Without doing this, we would lose all out data every single time the server refreshes.
The starting information in the DataBase consists of 4 Projects defined in the *db/csv/sap.sovanta.manager-Projects.csv* file. This information will be loaded whenever a `cds deploy` command is run. It's relevant to note that all other information will be dropped from the DataBase when the said command is run.

Now we are ready for the next step:
Run `cds watch`
This command will serve the application let you interact with the data. Note that any update to a file, whether it's a schema or a service, will trigger a server refresh.

Now you may access the 'http://localhost:4004' link and see a basic frontend which comes with a few links, should you click on "Projects", you will see the information related to the Projects.

## Testing

While `cds watch` is running, open another terminal and run the testing file which you can find at *./srv/tests/testing.js*. To do so, you may just use `node ./srv/tests/testing.js`.

Besides this type of testing, you may also access to the *./srv/tests/crud.http* file. Through the 'REST Client' VS Code extension, you may GET, POST, PUT and/or DELETE information from the Projects schema.
Simple CURL commands could be an alternative to this.

It is important to note the authorization header which the POST and PUT methods have, the Authrization type is basic and the alfanumeric code is the Base64 translation of pepito:pepitoo. If you change the username/password, you should also change the said code.


## Important Considerations

The Schema you can find in the *./db/schema.cds* contains definitions for Projects, Employees and another entity called Members. 
Members is the intermediate entity which relates Employees with Projects as many employees may work in a single project and an employee may work in various projects (many to many). Besides, an employee may lead various Projects but a Project may only have one Leader (many to one).


The CRUD operations have only been exposed for Projects, as specified in the challenge.


In order to secure the service, I have annotated Projects with certain restrictions. As you can see in the *./db/authorization.cds* file, only admins may CREATE OR UPDATE the Projects entity.
Considering this is a challenge and I only needed Basic authentication, the username, password and admin role can be found in the *package.json* file. Particularly inside the "cds": {"requires": {"auth":{...}},...} json.
It goes without saying that this should never be the way to authenticate users in production. In production, you should use something like JWT, applying encryption at REST and saving the information in the database, not in a simple package.json. 
The usage of such a simple authentication method, as the one I used, is only useful during development.


It is important to note that the test cases written in *./srv/tests/testing.js* are not Unit Test, this decision was made considering that the methods being tested were really simple (just CRUD operations). In a normal application, Unit testing is the way to go.
Also, note that the tests use the very same DataBase that the rest of the application uses. This could prove disastrous if that same DataBase were also being use in production. The best practice would be to use a library like Mocha in order to mock the DataBase and not alter one you are using for something else. I chose against mocking due to the simplicity of this particular application.
